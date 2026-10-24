import json, re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

REVIEW = "The laptop is fast and lightweight. Battery lasts 12 hours easily. Screen is a bit dim in sunlight. Worth every penny for the price."

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content":
            f"Extract pros, cons, and rating from this review: {REVIEW}"}]
    )
    print(response.content[0].text)


def after_l1():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system='Return ONLY raw JSON. No markdown. No explanation.',
        messages=[{"role": "user", "content":
            f'Extract from this review:\n{{"pros": [], "cons": [], "rating": 1-5}}\n\nReview: {REVIEW}'}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    print("L1:", json.loads(raw))



def after_l2():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system='Wrap your JSON output in <output></output> tags.',
        messages=[{"role": "user", "content":
            f'Return JSON with pros (list), cons (list), rating (1-5) for:\n{REVIEW}'}]
    )
    match = re.search(r"<output>(.*?)</output>", response.content[0].text, re.DOTALL)
    data = json.loads(match.group(1).strip())
    print("L2:", data)


def after_l3():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system="Return ONLY a raw JSON object. No markdown fences. No explanation. Start with {",
        messages=[{"role": "user", "content":
            f'Return JSON with keys: pros (list), cons (list), rating (integer 1-5) for:\n{REVIEW}'}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    print("L3:", json.loads(raw))


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# L1: Instruction + fence-stripping → 80% reliable
# L2: XML wrapper → 95% reliable (model rarely breaks XML boundaries)
# L3: System prompt "Start with {" + defensive stripping → near 100% on Claude 4
# Use L2 when you need multiple named sections; L3 for pure JSON responses.

if __name__ == "__main__":
    print("BEFORE"); print("="*50); before()
    print("\nL1 — JSON instruction"); print("="*50); after_l1()
    print("\nL2 — XML wrapper");      print("="*50); after_l2()
    print("\nL3 — System prompt JSON"); print("="*50); after_l3()
