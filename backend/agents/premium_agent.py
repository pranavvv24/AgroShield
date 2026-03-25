"""
Premium Agent
Calculates the insurance premium with risk-based adjustments.

Rules:
  • Base premium  = ₹500
  • +20 % for crops            (rice, cotton)
  • +30 % for locations        (drought-prone)
  • −20 % when pool_size > 3   (large-pool discount)
"""

HIGH_RISK_CROPS = {"rice", "cotton"}
DROUGHT_PRONE_LOCATIONS = {"drought_prone"}

BASE_PREMIUM = 500


def calculate_premium(
    crop: str,
    location: str = "",
    pool_size: int = 1,
) -> dict:
    """
    Return a breakdown dict:
        {
            "base": 500,
            "crop_risk":     0 | 100,
            "location_risk": 0 | 150,
            "pool_discount": 0 | -<amount>,
            "final_premium": <float>,
        }
    """
    premium = float(BASE_PREMIUM)
    crop_risk = 0.0
    location_risk = 0.0
    pool_discount = 0.0

    # +20 % for high-risk crops
    if crop.lower() in HIGH_RISK_CROPS:
        crop_risk = premium * 0.20

    # +30 % for drought-prone locations
    loc_key = location.lower().strip().replace(" ", "_").replace("-", "_")
    if loc_key in DROUGHT_PRONE_LOCATIONS:
        location_risk = premium * 0.30

    subtotal = premium + crop_risk + location_risk

    # −20 % for large pools
    if pool_size > 3:
        pool_discount = -(subtotal * 0.20)

    final = round(subtotal + pool_discount, 2)

    return {
        "base": BASE_PREMIUM,
        "crop_risk": round(crop_risk, 2),
        "location_risk": round(location_risk, 2),
        "pool_discount": round(pool_discount, 2),
        "final_premium": final,
    }
