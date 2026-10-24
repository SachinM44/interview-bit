"""
Module 05 | Lesson 23: Prompt Templates & Dynamic Prompts
==========================================================
Concept: Separate prompt structure from content using templates — build prompt libraries.
Why it matters: Reusable, testable prompts that your whole team can update without touching code.
Run: python 23_prompt_templates.py

Install: pip install jinja2
"""
from jinja2 import Environment
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"


# ── BEFORE — Inline string assembly ──────────────────────────────────────────

def before(customer_name, product, issue, tier):
    if tier == "enterprise":
        sla = "We will respond within 4 business hours."
    else:
        sla = "We will respond within 2 business days."
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content":
            f"Write a support email to {customer_name} about their {product} with issue '{issue}'. {sla}"}]
    )
    print(response.content[0].text)


# ── AFTER — Jinja2 prompt template ───────────────────────────────────────────

SUPPORT_EMAIL_TEMPLATE = """
Write a customer support email with these details:

<customer>
Name  : {{ customer_name }}
Tier  : {{ tier }}
</customer>

<issue>
Product: {{ product }}
Problem: {{ issue }}
</issue>

<rules>
- Tone: {{ "formal and priority-focused" if tier == "enterprise" else "friendly and helpful" }}
- SLA : {{ "4 business hours" if tier == "enterprise" else "2 business days" }}
{% if compensation %}
- Offer: {{ compensation }}
{% endif %}
- Length: 3-4 sentences + professional sign-off
</rules>

Sign off as: {{ agent_name }}, {{ department }} Team
"""

env = Environment()

def build_support_email_prompt(
    customer_name: str,
    product: str,
    issue: str,
    tier: str = "standard",
    compensation: str = None,
    agent_name: str = "Support",
    department: str = "Customer Success"
) -> str:
    return env.from_string(SUPPORT_EMAIL_TEMPLATE).render(
        customer_name=customer_name, product=product, issue=issue,
        tier=tier, compensation=compensation,
        agent_name=agent_name, department=department
    ).strip()

def after():
    prompt = build_support_email_prompt(
        customer_name="Rajesh Kumar",
        product="CloudBase Enterprise",
        issue="SSO integration failing after last night's update",
        tier="enterprise",
        compensation="one month credit",
        agent_name="Anika",
        department="Enterprise Success"
    )
    print("Rendered prompt:")
    print(prompt)
    print("\n" + "="*50 + "\nEmail output:\n")
    response = client.messages.create(
        model=MODEL, max_tokens=250,
        messages=[{"role": "user", "content": prompt}]
    )
    print(response.content[0].text)


# ── Prompt Library pattern ────────────────────────────────────────────────────
# Store all templates in one place — version controlled, team-editable.

PROMPT_LIBRARY = {
    "support_email":   SUPPORT_EMAIL_TEMPLATE,
    "feature_request": """
Acknowledge this feature request from {{ customer_name }} for {{ product }}.
Feature: {{ feature_description }}
Status : {{ "on our roadmap" if on_roadmap else "under review" }}
Keep it under 50 words.
""",
    "escalation_note": """
Write an internal escalation note for the engineering team.
Customer: {{ customer_name }} ({{ tier }})
Issue   : {{ issue }}
Impact  : {{ impact }}
Urgency : {{ urgency }}
Format as: Summary / Steps to reproduce / Business impact / Requested action
"""
}

def render_prompt(template_name: str, **kwargs) -> str:
    template = PROMPT_LIBRARY.get(template_name)
    if not template:
        raise ValueError(f"Unknown template: {template_name}")
    return env.from_string(template).render(**kwargs).strip()


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: if/else blocks scattered through code → logic buried, not reusable
# AFTER:
#   - Jinja2 template holds all logic in one readable place
#   - if/else, loops, and variables are in the template — not in Python
#   - PROMPT_LIBRARY: all prompts in one dict → team edits one file
#   - render_prompt() is the only API the rest of the codebase needs
#   - Testing: render_prompt("support_email", ...) without any API call

if __name__ == "__main__":
    print("BEFORE — Inline prompt assembly"); print("="*50)
    before("Amit", "CloudBase Pro", "billing page not loading", "enterprise")
    print("\nAFTER  — Jinja2 template"); print("="*50)
    after()
    print("\nPrompt library demo:")
    print(render_prompt("feature_request", customer_name="Sara", product="DataSync", feature_description="CSV export", on_roadmap=True))
