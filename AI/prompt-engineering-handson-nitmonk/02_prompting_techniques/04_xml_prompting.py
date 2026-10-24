import re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

DOCUMENT = """
Q3 revenue was $4.2M, up 18% YoY. Churn increased to 3.1%.
New enterprise deals: Acme Corp ($120k ARR), BetaCo ($85k ARR).
Engineering headcount grew from 12 to 17. Server costs up 40% due to AI features.
"""

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        messages=[{"role": "user", "content":
            f"Summarise this business report and list action items: {DOCUMENT}"
        }]
    )
    print(response.content[0].text)


def after():
    prompt = f"""
Analyse the following business report.

<document>
{DOCUMENT.strip()}
</document>

Provide your response in this exact structure:
<summary>
A 2-sentence executive summary.
</summary>
<actions>
Bullet list of 3 specific actions the business should take.
</actions>
"""
    response = client.messages.create(
        model=MODEL, max_tokens=400,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = response.content[0].text

    # Parse each section reliably with regex
    summary = re.search(r"<summary>(.*?)</summary>", raw, re.DOTALL)
    actions  = re.search(r"<actions>(.*?)</actions>",  raw, re.DOTALL)

    print("=== SUMMARY ===")
    print(summary.group(1).strip() if summary else "Not found")
    print("\n=== ACTIONS ===")
    print(actions.group(1).strip() if actions else "Not found")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# <document>  → clearly separates data from instructions; model won't treat data as a command
# <summary>   → deterministic extraction with regex — no guessing where content starts
# <actions>   → multiple independent sections parsed independently
# XML beats markdown headers here because the model never accidentally generates </summary>
#   in the middle of its answer the way it might emit a stray --- or ##

if __name__ == "__main__":
    print("BEFORE — Plain text mixing"); print("="*50); before()
    print("\nAFTER  — XML tags for structure"); print("="*50); after()
