from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

QUERY = "My subscription was cancelled but I'm still being charged. Fix this immediately."

NEGATIVE_SYSTEM = """
Customer support agent rules:
- Don't be rude or dismissive
- Don't promise refunds
- Don't mention competitors
- Don't give long answers
- Don't use jargon
"""

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system=NEGATIVE_SYSTEM,
        messages=[{"role": "user", "content": QUERY}]
    )
    print(response.content[0].text)


POSITIVE_SYSTEM = """
You are a calm, professional customer support agent for CloudBase.

Tone  : Empathetic and solution-focused — acknowledge frustration, then act
Length: 3-4 sentences maximum
Scope : Account and billing issues only

When a customer reports a billing error:
1. Acknowledge the issue with empathy
2. Confirm you will investigate
3. Give a specific next step (e.g., "I'll escalate this to billing within 2 hours")
"""

def after():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system=POSITIVE_SYSTEM,
        messages=[{"role": "user", "content": QUERY}]
    )
    print(response.content[0].text)

HYBRID_SYSTEM = POSITIVE_SYSTEM + """

Hard limits (never cross):
- Never promise a refund amount without manager approval
- Never share another customer's account details
"""

def after_hybrid():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system=HYBRID_SYSTEM,
        messages=[{"role": "user", "content": QUERY}]
    )
    print(response.content[0].text)


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# Negative: "Don't be rude" → model still decides what "not rude" looks like
# Positive: "Empathetic and solution-focused" → explicit target behaviour
# Hybrid  : Positive instructions for general behaviour + negatives only for hard limits
#
# Rule: flip every "don't X" to "do Y instead". Reserve negatives for true zero-tolerance lines.

if __name__ == "__main__":
    print("BEFORE — Negative instructions"); print("="*50); before()
    print("\nAFTER  — Positive instructions"); print("="*50); after()
    print("\nAFTER  — Hybrid approach"); print("="*50); after_hybrid()
