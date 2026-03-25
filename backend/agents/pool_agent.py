"""
Pool Formation Agent
Groups farmers ensuring diversity of locations and crops within each pool.
"""

def _norm(value: object) -> str:
    if value is None:
        return "unknown"
    s = str(value).strip().lower()
    return s if s else "unknown"


def form_pools(
    farmers: list[dict],
    *,
    min_pool_size: int = 3,
    max_pool_size: int = 5,
) -> list[dict]:
    """
    Build pools according to rules:
      - Max size = max_pool_size (3–5)
      - Members in same pool must have distinct crops
      - Members in same pool must have distinct locations
    """
    if not farmers:
        return []

    # Clamp to requested "3–5" envelope while still allowing explicit overrides.
    min_pool_size = int(min_pool_size)
    max_pool_size = int(max_pool_size)
    if max_pool_size < 1:
        max_pool_size = 1
    if min_pool_size < 1:
        min_pool_size = 1
    if min_pool_size > max_pool_size:
        min_pool_size = max_pool_size

    # Place harder-to-fit farmers first (those with common crop/location).
    crop_counts: dict[str, int] = {}
    loc_counts: dict[str, int] = {}
    normalized: list[tuple[dict, str, str]] = []
    for f in farmers:
        crop = _norm(f.get("crop"))
        location = _norm(f.get("location"))
        normalized.append((f, crop, location))
        crop_counts[crop] = crop_counts.get(crop, 0) + 1
        loc_counts[location] = loc_counts.get(location, 0) + 1

    normalized.sort(
        key=lambda t: (-(crop_counts[t[1]] + loc_counts[t[2]]), t[1], t[2])
    )

    pools_data: list[dict] = []

    for f, crop, location in normalized:
        # Choose the smallest compatible pool to keep pools balanced.
        best_pool = None
        best_size = None

        for p in pools_data:
            if len(p["members"]) >= max_pool_size:
                continue
            if crop in p["crops"] or location in p["locations"]:
                continue
            size = len(p["members"])
            if best_pool is None or size < best_size:
                best_pool = p
                best_size = size

        if best_pool is not None:
            best_pool["members"].append(f)
            best_pool["crops"].add(crop)
            best_pool["locations"].add(location)
        else:
            pools_data.append({
                "members": [f],
                "crops": {crop},
                "locations": {location}
            })

    # Rebalance: if there are tiny pools (< min_pool_size), try to move members from
    # larger pools into them without breaking diversity constraints.
    if min_pool_size > 1 and len(pools_data) > 1:
        changed = True
        while changed:
            changed = False
            # Work smallest pools first.
            pools_data.sort(key=lambda p: len(p["members"]))
            for small in pools_data:
                if len(small["members"]) >= min_pool_size:
                    continue
                # Try to move one farmer at a time from a donor pool.
                for donor in reversed(pools_data):
                    if donor is small:
                        continue
                    if len(donor["members"]) <= min_pool_size:
                        continue
                    moved = False
                    for idx, candidate in enumerate(list(donor["members"])):
                        ccrop = _norm(candidate.get("crop"))
                        cloc = _norm(candidate.get("location"))
                        if ccrop in small["crops"] or cloc in small["locations"]:
                            continue
                        # Ensure donor still respects its own uniqueness after removal.
                        donor_members = donor["members"][:idx] + donor["members"][idx + 1 :]
                        donor_crops = {_norm(x.get("crop")) for x in donor_members}
                        donor_locs = {_norm(x.get("location")) for x in donor_members}
                        if len(donor_crops) != len(donor_members) or len(donor_locs) != len(donor_members):
                            continue

                        # Apply move.
                        donor["members"] = donor_members
                        donor["crops"] = donor_crops
                        donor["locations"] = donor_locs

                        small["members"].append(candidate)
                        small["crops"].add(ccrop)
                        small["locations"].add(cloc)
                        changed = True
                        moved = True
                        break
                    if moved:
                        break
                if changed:
                    # Resort after any successful move.
                    break

        # Drop any empty pools (shouldn't happen, but keep output clean).
        pools_data = [p for p in pools_data if p["members"]]

    pools: list[dict] = []
    for i, p in enumerate(pools_data, start=1):
        pool_id = f"pool-{i}"
        members = p["members"]
        pools.append(
            {
                "pool_id": pool_id,
                "members": [f["id"] for f in members],
                "crops": list(p["crops"]),
                "locations": list(p["locations"]),
                "crop_diversity": len(p["crops"]),
                "location_diversity": len(p["locations"]),
            }
        )

    return pools
