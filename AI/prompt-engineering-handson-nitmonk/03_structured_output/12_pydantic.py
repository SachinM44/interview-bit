import json, re
from typing import Optional
from enum import Enum
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic
from pydantic import BaseModel, Field, field_validator, ValidationError

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

class Location(str, Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"

class JobPosting(BaseModel):
    title: str
    company: str
    location: Location
    salary_min: int = Field(gt=0)
    salary_max: int = Field(gt=0)
    required_skills: list[str]
    nice_to_have: list[str] = []
    deadline: Optional[str] = None

    @field_validator("salary_max")
    @classmethod
    def max_above_min(cls, v, info):
        if "salary_min" in info.data and v < info.data["salary_min"]:
            raise ValueError("salary_max must be >= salary_min")
        return v

JOB_TEXT = """
Senior ML Engineer at DataFlow Inc. Remote. $160k-$200k.
Requirements: 5+ years Python, PyTorch or TensorFlow, MLOps.
Nice to have: Rust, distributed systems experience.
Apply by 2025-09-30.
"""

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system="Return only raw JSON. No markdown.",
        messages=[{"role": "user", "content": f"Extract job fields as JSON:\n{JOB_TEXT}"}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    data = json.loads(raw)

    print(f"Title: {data.get('title')}")
    print(f"Salary: {data.get('salary_range') or data.get('salary')}")  # guessing field name


SCHEMA_HINT = json.dumps(JobPosting.model_json_schema(), indent=2)

def after():
    prompt = f"""Extract a job posting into this exact JSON schema:
<schema>
{SCHEMA_HINT}
</schema>

<job>
{JOB_TEXT.strip()}
</job>

Return raw JSON only."""

    response = client.messages.create(
        model=MODEL, max_tokens=400,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    data = json.loads(raw)

    try:
        job = JobPosting(**data)
        print("Validated JobPosting:")
        print(f"  Title    : {job.title}")
        print(f"  Company  : {job.company}")
        print(f"  Location : {job.location.value}")
        print(f"  Salary   : ${job.salary_min:,} – ${job.salary_max:,}")
        print(f"  Skills   : {', '.join(job.required_skills)}")
        print(f"  Deadline : {job.deadline}")
    except ValidationError as e:
        print("Validation failed — prompt needs adjustment:")
        for err in e.errors():
            print(f"  {err['loc']}: {err['msg']}")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: dict access guesses field names → silent wrong values
# AFTER:
#   - Pydantic model defines exact field names, types, and constraints
#   - model_json_schema() generates the schema hint directly from the class
#   - field_validator catches salary_max < salary_min at parse time
#   - ValidationError gives precise error messages for prompt debugging
#   - Location enum prevents "Work From Home" vs "remote" inconsistency

if __name__ == "__main__":
    print("BEFORE — Dict access, no type safety"); print("="*50); before()
    print("\nAFTER  — Pydantic model"); print("="*50); after()
