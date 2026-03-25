"""
Weather Oracle Agent
Uses the Open-Meteo API to fetch recent rainfall and determine
whether a drought trigger event has occurred.

Trigger rule:  total rainfall over the last 7 days < 50 mm → triggered
"""

from datetime import datetime, timedelta
import requests as http_requests


def check_rainfall(lat: float, lon: float) -> dict:
    """
    Fetch the last 7 days of daily precipitation from Open-Meteo
    and decide whether a trigger event has occurred.

    Returns:
        {
            "latitude": float,
            "longitude": float,
            "period_days": 7,
            "total_rainfall_mm": float,
            "daily_rainfall": [float, ...],
            "triggered": bool,
            "trigger_reason": str,
        }
    """
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=6)  # 7 days inclusive

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&daily=precipitation_sum"
        f"&start_date={start_date}&end_date={end_date}"
        f"&timezone=auto"
    )

    resp = http_requests.get(url, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    daily = data.get("daily", {})
    precip_values = daily.get("precipitation_sum", [])

    # Treat None entries as 0
    daily_rainfall = [v if v is not None else 0.0 for v in precip_values]
    total = round(sum(daily_rainfall), 2)

    triggered = total < 50
    reason = (
        f"Drought: only {total} mm rain in 7 days (< 50 mm threshold)"
        if triggered
        else f"Adequate rainfall: {total} mm in 7 days"
    )

    return {
        "latitude": lat,
        "longitude": lon,
        "period_days": 7,
        "total_rainfall_mm": total,
        "daily_rainfall": daily_rainfall,
        "triggered": triggered,
        "trigger_reason": reason,
    }
