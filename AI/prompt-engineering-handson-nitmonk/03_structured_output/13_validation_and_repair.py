import json, re
from pydantic import BaseModel, ValidationError
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

class ProductReview(BaseModel):
    product_name: str
    sentiment: str      # "positive" | "negative" | "mixed"
    score: int          # 1-5
    key_points: list[str]

REVIEW = "The BlastX Pro headphones sound amazing and the ANC is top-notch. Comfort drops after 2 hours though. Battery life of 30 hours is industry-leading."


def extract_and_validate(text: str) -> ProductReview | None:
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip())
    try:
        data = json.loads(raw)
        return ProductReview(**data)
    except (json.JSONDecodeError, ValidationError) as e:
        return None, str(e)

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system="Return only raw JSON. No markdown.",
        messages=[{"role": "user", "content":
            f"Extract review data as JSON with: product_name, sentiment, score (1-5), key_points (list).\n\nReview: {REVIEW}"}]
    )
    raw = response.content[0].text.strip()
    result = json.loads(raw)   # crashes if model adds fences or uses wrong field names
    print(result)

def call_model(messages: list) -> str:
    response = client.messages.create(
        model=MODEL, max_tokens=400,
        system="Return ONLY raw JSON. No markdown fences. No explanation.",
        messages=messages
    )
    return response.content[0].text.strip()

def after(max_retries: int = 3):
    SCHEMA = {
        "product_name": "string",
        "sentiment": "positive | negative | mixed",
        "score": "integer 1-5",
        "key_points": ["list of strings"]
    }

    messages = [{"role": "user", "content":
        f"Extract review data matching this schema:\n{json.dumps(SCHEMA)}\n\nReview: {REVIEW}"}]

    for attempt in range(1, max_retries + 1):
        raw = call_model(messages)
        print(f"Attempt {attempt} raw output: {raw[:80]}...")

        # Try to parse and validate
        clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip())
        try:
            data = json.loads(clean)
            review = ProductReview(**data)
            print(f"\nSuccess on attempt {attempt}!")
            print(f"  Product  : {review.product_name}")
            print(f"  Sentiment: {review.sentiment}")
            print(f"  Score    : {review.score}/5")
            print(f"  Points   : {review.key_points}")
            return review
        except (json.JSONDecodeError, ValidationError) as e:
            error_msg = str(e)
            print(f"  Parse error: {error_msg}")

            if attempt < max_retries:
                # Send the error back so the model can self-repair
                messages.append({"role": "assistant", "content": raw})
                messages.append({"role": "user", "content":
                    f"Your output failed validation:\n{error_msg}\n\n"
                    f"Fix the JSON and return it again. Raw JSON only, no markdown."
                })

    print("All retries exhausted.")
    return None


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: one attempt → exception on any format deviation
# AFTER:
#   1. Try to parse + validate
#   2. On failure: append the raw output + error to messages[]
#   3. Ask model to fix its own mistake
#   4. Repeat up to max_retries
#
# Why it works: the model sees its own bad output AND the error message →
#   it usually knows exactly what to fix
# In production: log retry counts — if >1 retry is common, fix the prompt instead

if __name__ == "__main__":
    print("BEFORE — Single attempt"); print("="*50)
    try:
        before()
    except Exception as e:
        print(f"Crashed: {e}")

    print("\nAFTER  — Validate & Repair loop"); print("="*50)
    after()
