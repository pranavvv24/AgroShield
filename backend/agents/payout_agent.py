"""
Payout Agent
Decides the payout amount based on whether a trigger event occurred.

Rule:
  • triggered  → ₹5 000 payout
  • not triggered → ₹0
"""

PAYOUT_AMOUNT = 5000


def decide_payout(triggered: bool) -> dict:
    """
    Return payout decision.

    Returns:
        {
            "triggered": bool,
            "payout_amount": int,
            "message": str,
        }
    """
    if triggered:
        return {
            "triggered": True,
            "payout_amount": PAYOUT_AMOUNT,
            "message": f"Trigger event confirmed – ₹{PAYOUT_AMOUNT} payout approved.",
        }

    return {
        "triggered": False,
        "payout_amount": 0,
        "message": "No adverse conditions detected – no payout.",
    }
