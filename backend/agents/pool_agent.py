"""
Pool Formation Agent
Groups farmers ensuring diversity of locations and crops within each pool.
"""


def form_pools(farmers: list[dict], max_pool_size: int = 5) -> list[dict]:
    """
    Build pools where each pool maximises crop and location diversity.

    Algorithm:
      1. Bucket farmers by (crop, location) so identical pairs are together.
      2. Round-robin across buckets to fill each pool, guaranteeing that
         consecutive picks come from different crop/location combos.

    Returns a list of pool dicts:
        {
            "pool_id": str,
            "members": [farmer_id, ...],
            "crops": [unique_crops],
            "locations": [unique_locations],
            "crop_diversity": int,
            "location_diversity": int,
        }
    """
    if not farmers:
        return []

    # --- bucket by (crop, location) ---
    buckets: dict[tuple[str, str], list[dict]] = {}
    for f in farmers:
        key = (f.get("crop", "unknown").lower(), f.get("location", "unknown").lower())
        buckets.setdefault(key, []).append(f)

    # --- flatten via round-robin across buckets ---
    ordered: list[dict] = []
    bucket_lists = list(buckets.values())
    while bucket_lists:
        next_round = []
        for bl in bucket_lists:
            ordered.append(bl.pop(0))
            if bl:
                next_round.append(bl)
        bucket_lists = next_round

    # --- slice into pools ---
    pools: list[dict] = []
    for i in range(0, len(ordered), max_pool_size):
        chunk = ordered[i : i + max_pool_size]
        pool_id = f"pool-{len(pools) + 1}"
        crops = list({f["crop"].lower() for f in chunk})
        locations = list({f.get("location", "unknown").lower() for f in chunk})
        pools.append(
            {
                "pool_id": pool_id,
                "members": [f["id"] for f in chunk],
                "crops": crops,
                "locations": locations,
                "crop_diversity": len(crops),
                "location_diversity": len(locations),
            }
        )

    return pools
