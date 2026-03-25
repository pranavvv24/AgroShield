"""
AgroShield - Flask Backend
Parametric crop-insurance API with in-memory storage and
four dedicated agents: Pool, Premium, Weather-Oracle, Payout.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

from agents.pool_agent import form_pools
from agents.premium_agent import calculate_premium
from agents.weather_agent import check_rainfall
from agents.payout_agent import decide_payout

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# In-memory data stores
# ---------------------------------------------------------------------------
farmers: dict[str, dict] = {}
pools: list[dict] = []

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    return jsonify({"message": "AgroShield API is running 🚀"})


# ---- Farmer Registration (uses Premium Agent) ----------------------------

@app.route("/create-farmer", methods=["POST"])
def create_farmer():
    """Register a new farmer; premium is calculated by the Premium Agent."""
    data = request.get_json(force=True)

    required = ["name", "crop", "area", "latitude", "longitude", "location"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    farmer_id = str(uuid.uuid4())[:8]

    # --- Premium Agent ---
    premium_info = calculate_premium(
        crop=data["crop"],
        location=data.get("location", ""),
        pool_size=1,  # no pool yet
    )

    farmer = {
        "id": farmer_id,
        "name": data["name"],
        "crop": data["crop"],
        "area": float(data["area"]),
        "latitude": float(data["latitude"]),
        "longitude": float(data["longitude"]),
        "location": data.get("location", ""),
        "premium": premium_info["final_premium"],
        "premium_breakdown": premium_info,
        "payout": 0,
        "status": "active",
        "pool_id": None,
        "created_at": datetime.utcnow().isoformat(),
    }
    farmers[farmer_id] = farmer

    # --- Pool Formation Agent ---
    # Auto-assign to pools and balance
    all_farmers = list(farmers.values())
    new_pools = form_pools(all_farmers)
    
    pools.clear()
    pools.extend(new_pools)
    
    # Recalculate premiums based on new pools
    for pool in pools:
        pool_size = len(pool["members"])
        for fid in pool["members"]:
            f = farmers[fid]
            updated_premium = calculate_premium(
                crop=f["crop"],
                location=f.get("location", ""),
                pool_size=pool_size,
            )
            f["premium"] = updated_premium["final_premium"]
            f["premium_breakdown"] = updated_premium
            f["pool_id"] = pool["pool_id"]

    return jsonify({"message": "Farmer registered successfully", "farmer": farmers[farmer_id]}), 201


# ---- Pool Formation (uses Pool Agent + recalculates premiums) -------------

@app.route("/form-pool", methods=["POST"])
def form_pool():
    """
    Create a pool from given farmer IDs (or all farmers if none specified).
    Uses the Pool Formation Agent and recalculates premiums via Premium Agent.
    """
    data = request.get_json(force=True)
    farmer_ids = data.get("farmer_ids", [])

    # Default: pool all farmers
    if not farmer_ids:
        selected = list(farmers.values())
    else:
        selected = [farmers[fid] for fid in farmer_ids if fid in farmers]

    if len(selected) < 2:
        return jsonify({"error": "Need at least 2 farmers to form a pool"}), 400

    # --- Pool Formation Agent ---
    new_pools = form_pools(selected)

    # Recalculate premiums for every pooled farmer (Premium Agent)
    for pool in new_pools:
        pool_size = len(pool["members"])
        for fid in pool["members"]:
            f = farmers[fid]
            premium_info = calculate_premium(
                crop=f["crop"],
                location=f.get("location", ""),
                pool_size=pool_size,
            )
            f["premium"] = premium_info["final_premium"]
            f["premium_breakdown"] = premium_info
            f["pool_id"] = pool["pool_id"]

    pools.extend(new_pools)

    return jsonify({"message": f"{len(new_pools)} pool(s) formed", "pools": new_pools}), 201


# ---- Weather Check (uses Weather Oracle Agent) ----------------------------

@app.route("/weather", methods=["GET"])
def weather():
    """
    Get 7-day rainfall and trigger status for a location.
    Query params: lat, lon
    """
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Provide 'lat' and 'lon' query parameters"}), 400

    try:
        # --- Weather Oracle Agent ---
        result = check_rainfall(float(lat), float(lon))
        return jsonify({"weather": result})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 502


# ---- Payout (uses Weather Oracle + Payout Agent) -------------------------

@app.route("/payout", methods=["POST"])
def payout():
    """
    Check weather for a farmer's location, then decide payout.
    Uses Weather Oracle Agent → Payout Agent pipeline.
    """
    data = request.get_json(force=True)
    farmer_id = data.get("farmer_id")

    if not farmer_id or farmer_id not in farmers:
        return jsonify({"error": "Invalid or missing farmer_id"}), 400

    farmer = farmers[farmer_id]

    # --- Weather Oracle Agent ---
    try:
        weather_result = check_rainfall(farmer["latitude"], farmer["longitude"])
    except Exception as exc:
        return jsonify({"error": f"Weather fetch failed: {exc}"}), 502

    # --- Payout Agent ---
    payout_decision = decide_payout(weather_result["triggered"])

    farmer["payout"] += payout_decision["payout_amount"]
    if payout_decision["payout_amount"] > 0:
        farmer["status"] = "payout_issued"

    return jsonify({
        "farmer_id": farmer_id,
        "weather": weather_result,
        "payout": payout_decision,
        "farmer": farmer,
    })


# ---- Dashboard -----------------------------------------------------------

@app.route("/dashboard", methods=["GET"])
def dashboard():
    """Return all registered farmers, pools, and aggregate stats including weather status."""
    farmer_list = list(farmers.values())
    total_premium = sum(f["premium"] for f in farmer_list)
    total_payout = sum(f["payout"] for f in farmer_list)

    # Enhance farmer list with weather status
    # We group by (lat, lon) to minimise redundant API calls to Open-Meteo
    unique_locations = {}
    enhanced_farmers = []
    
    for f in farmer_list:
        loc_key = (f["latitude"], f["longitude"])
        if loc_key not in unique_locations:
            try:
                unique_locations[loc_key] = check_rainfall(f["latitude"], f["longitude"])
            except Exception as e:
                unique_locations[loc_key] = {"error": str(e)}
        
        # Clone dictionary so we don't store weather state permanently in `farmers`
        f_enh = dict(f)
        f_enh["weather"] = unique_locations[loc_key]
        enhanced_farmers.append(f_enh)

    return jsonify({
        "total_farmers": len(farmer_list),
        "total_premium": round(total_premium, 2),
        "total_payout": round(total_payout, 2),
        "farmers": enhanced_farmers,
        "pools": pools,
    })


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
