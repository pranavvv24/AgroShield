import requests
import json

BASE_URL = "http://localhost:5000"

def test_api():
    print("1. Creating Farmer 1 (Ravi, cotton, arid)...")
    res1 = requests.post(
        f"{BASE_URL}/create-farmer",
        json={"name": "Ravi", "crop": "cotton", "area": 2, "latitude": 28.6, "longitude": 77.2, "location": "arid"}
    )
    print("Response:", res1.json())
    farmer1_id = res1.json().get("farmer", {}).get("id")

    print("\n2. Creating Farmer 2 (Sita, wheat, flood_prone)...")
    res2 = requests.post(
        f"{BASE_URL}/create-farmer",
        json={"name": "Sita", "crop": "wheat", "area": 3, "latitude": 25.0, "longitude": 80.0, "location": "flood_prone"}
    )
    print("Response:", res2.json())
    farmer2_id = res2.json().get("farmer", {}).get("id")

    print("\n3. Forming Pool...")
    res3 = requests.post(
        f"{BASE_URL}/form-pool",
        json={"farmer_ids": [farmer1_id, farmer2_id]}
    )
    print("Response:", res3.json())

    print("\n4. Checking Weather for Farmer 1...")
    res4 = requests.get(f"{BASE_URL}/weather", params={"lat": 28.6, "lon": 77.2})
    print("Response:", res4.json())

    print("\n5. Payout for Farmer 1...")
    res5 = requests.post(f"{BASE_URL}/payout", json={"farmer_id": farmer1_id})
    print("Response:", res5.json())

    print("\n6. Dashboard...")
    res6 = requests.get(f"{BASE_URL}/dashboard")
    print("Response:", res6.json())

if __name__ == "__main__":
    test_api()
