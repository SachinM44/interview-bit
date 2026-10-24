import json, re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

JOB_POSTING = """
Senior ML Engineer at DataFlow Inc. Remote. $160k-$200k.
Requirements: 5+ years Python, experience with PyTorch or TensorFlow,
MLOps experience preferred. Must have strong communication skills.
Apply by Sept 30, 2025.
"""

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content": f"Extract job details as JSON:\n{JOB_POSTING}"}]
    )
    print(response.content[0].text)


SCHEMA = {
    "type": "object",
    "required": ["title", "company", "location", "salary_min", "salary_max",
                 "required_skills", "nice_to_have", "deadline"],
    "properties": {
        "title":          {"type": "string"},
        "company":        {"type": "string"},
        "location":       {"type": "string", "enum": ["remote", "hybrid", "onsite"]},
        "salary_min":     {"type": "integer", "description": "minimum salary in USD"},
        "salary_max":     {"type": "integer", "description": "maximum salary in USD"},
        "required_skills":{"type": "array", "items": {"type": "string"}},
        "nice_to_have":   {"type": "array", "items": {"type": "string"}},
        "deadline":       {"type": "string", "description": "ISO 8601 date, e.g. 2025-09-30"}
    }
}

def after():
    prompt = f"""Extract structured data from this job posting.

Return ONLY a JSON object matching this schema exactly:
<schema>
{json.dumps(SCHEMA, indent=2)}
</schema>

<job_posting>
{JOB_POSTING.strip()}
</job_posting>

Return raw JSON only. No markdown. No explanation."""

    response = client.messages.create(
        model=MODEL, max_tokens=400,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    data = json.loads(raw)

    # Validate required fields are present
    missing = [f for f in SCHEMA["required"] if f not in data]
    if missing:
        print(f"WARNING: Missing fields: {missing}")
    else:
        print("All required fields present ✓")
    print(json.dumps(data, indent=2))


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: model invents field names ("pay_range" vs "salary_min/max") → parser breaks
# AFTER:
#   - Schema embedded in prompt → model uses exact field names and types
#   - enum for location → prevents "Work from home" vs "remote" inconsistency
#   - required[] list → model fills every field even when source is ambiguous
#   - Post-call validation checks for missing fields → catch problems before they propagate

if __name__ == "__main__":
    print("BEFORE"); print("="*50); before()
    print("\nAFTER — Schema-driven extraction"); print("="*50); after()
