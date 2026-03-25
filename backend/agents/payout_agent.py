"""
Payout Agent
Decides the payout amount based on whether a trigger event occurred.

Rule:
  • triggered  → ₹5 000 payout and status="Paid"
  • not triggered → ₹0 and status="No Payout"
"""

PAYOUT_AMOUNT = 5000


def decide_payout(triggered: bool) -> dict:
    """
    Return payout decision.

    Returns:
        {
            "triggered": bool,
            "payout_amount": int,
            "status": str,
            "message": str,
        }
    """
    if triggered:
        return {
            "triggered": True,
            "payout_amount": PAYOUT_AMOUNT,
            "status": "Paid",
            "message": f"Trigger event confirmed - payout of {PAYOUT_AMOUNT} approved.",
        }

    return {
        "triggered": False,
        "payout_amount": 0,
        "status": "No Payout",
        "message": "No adverse conditions detected - no payout.",
    }
