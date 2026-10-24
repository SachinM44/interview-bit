from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

TARGET = "I've been a customer for 5 years and my account was locked for no reason. This is unacceptable."

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=80,
        messages=[{"role": "user", "content":
            f"Tag this complaint with priority and team: {TARGET}"}]
    )
    print(response.content[0].text) 


EXAMPLES = [
    {"role": "user",      "content": "App crashes every time I open the checkout page."},
    {"role": "assistant", "content": "P1 | Engineering | checkout-crash"},

    {"role": "user",      "content": "I was charged twice this month."},
    {"role": "assistant", "content": "P1 | Billing | duplicate-charge"},

    {"role": "user",      "content": "The packaging was a bit dented but product is fine."},
    {"role": "assistant", "content": "P3 | Logistics | packaging-minor"},
]

def after():
    messages = EXAMPLES + [{"role": "user", "content": TARGET}]
    response = client.messages.create(
        model=MODEL, max_tokens=40,
        system="Tag customer complaints with: Priority (P1/P2/P3) | Team | slug.",
        messages=messages
    )
    print(response.content[0].text)


# ── AFTER — Dynamic few-shot (pick examples by similarity) ───────────────────
# In production: retrieve the most similar examples from a store, not hard-coded ones.

EXAMPLE_BANK = {
    "billing":     ("I was overcharged last month.",           "P1 | Billing | overcharge"),
    "technical":   ("Login button is broken on mobile.",       "P1 | Engineering | login-mobile"),
    "shipping":    ("My order hasn't arrived in 3 weeks.",     "P2 | Logistics | late-delivery"),
    "account":     ("My account was locked without warning.",  "P1 | Trust | account-lock"),
}

def select_examples(user_input: str, n: int = 2) -> list[dict]:
    """Naive keyword matcher — replace with embedding similarity in production."""
    keywords = {"bill": "billing", "charge": "billing", "lock": "account",
                "login": "technical", "crash": "technical", "ship": "shipping", "arriv": "shipping"}
    matched = set()
    for word, category in keywords.items():
        if word in user_input.lower() and category not in matched:
            matched.add(category)
    selected = list(matched)[:n] or list(EXAMPLE_BANK.keys())[:n]
    shots = []
    for cat in selected:
        inp, out = EXAMPLE_BANK[cat]
        shots += [{"role": "user", "content": inp}, {"role": "assistant", "content": out}]
    return shots

def after_dynamic():
    messages = select_examples(TARGET) + [{"role": "user", "content": TARGET}]
    response = client.messages.create(
        model=MODEL, max_tokens=40,
        system="Tag customer complaints with: Priority (P1/P2/P3) | Team | slug.",
        messages=messages
    )
    print(response.content[0].text)


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# Static few-shot: 3 pairs in messages[] teach format the model can't learn from text alone
# Dynamic few-shot: select the most relevant examples per input → better accuracy, fewer tokens
# Rule: use few-shot when zero-shot gives inconsistent format or wrong tone despite clear instructions

if __name__ == "__main__":
    print("BEFORE"); print("="*50); before()
    print("\nAFTER — Static few-shot"); print("="*50); after()
    print("\nAFTER — Dynamic few-shot"); print("="*50); after_dynamic()
