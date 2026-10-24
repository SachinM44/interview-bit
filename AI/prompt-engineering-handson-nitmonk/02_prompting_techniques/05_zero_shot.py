from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

INPUT = "The noise-cancelling headphones work great but the ear cushions wore out after 6 months."

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=100,
        messages=[{"role": "user", "content": f"Analyse this review: {INPUT}"}]
    )
    print(response.content[0].text)

def after():
    response = client.messages.create(
        model=MODEL, max_tokens=80,
        system="""Classify product reviews. Return exactly this format:
Sentiment : <Positive|Negative|Mixed>
Score     : <1-5>
Aspect    : <what the review is mainly about, max 4 words>""",
        messages=[{"role": "user", "content": INPUT}]
    )
    print(response.content[0].text)


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# • Replaced "analyse" (ambiguous) with specific sub-task: classify + score + aspect
# • Controlled vocabulary for Sentiment stops drift ("positive" vs "Positive" vs "good")
# • Output schema in the system prompt → model knows exactly what to return
# • No examples needed when the task + format is crystal clear

if __name__ == "__main__":
    print("BEFORE"); print("="*50); before()
    print("\nAFTER"); print("="*50); after()
