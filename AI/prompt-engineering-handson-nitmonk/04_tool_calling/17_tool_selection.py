"""
Module 04 | Lesson 17: Tool Selection
=======================================
Concept: How the model decides which tool to call — and how to guide that decision.
Why it matters: With multiple tools, the model can pick the wrong one without clear descriptions.
Run: python 17_tool_selection.py
"""
import json
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

# ── Tool definitions (well-written) ──────────────────────────────────────────

TOOLS = [
    {
        "name": "search_knowledge_base",
        "description": (
            "Search the internal product documentation and FAQ. "
            "Use this FIRST for any question about product features, pricing, or policies. "
            "Do NOT use for account-specific questions."
        ),
        "input_schema": {
            "type": "object", "required": ["query"],
            "properties": {"query": {"type": "string", "description": "Search query"}}
        }
    },
    {
        "name": "lookup_customer_account",
        "description": (
            "Retrieve a customer's account details including subscription, billing, and usage. "
            "Use ONLY when the question is about THIS specific customer's account. "
            "Requires the customer email address."
        ),
        "input_schema": {
            "type": "object", "required": ["email"],
            "properties": {"email": {"type": "string"}}
        }
    },
    {
        "name": "create_support_ticket",
        "description": (
            "Create a support ticket for issues that cannot be resolved immediately. "
            "Use this ONLY after attempting to resolve the issue with other tools. "
            "Never use for informational questions."
        ),
        "input_schema": {
            "type": "object", "required": ["email", "issue_summary", "priority"],
            "properties": {
                "email":         {"type": "string"},
                "issue_summary": {"type": "string", "description": "One-line description of the issue"},
                "priority":      {"type": "string", "enum": ["low", "medium", "high", "critical"]}
            }
        }
    }
]

# Mock implementations
def search_knowledge_base(query: str) -> dict:
    return {"results": [{"title": "Password Reset Guide", "url": "/docs/reset"}]}

def lookup_customer_account(email: str) -> dict:
    return {"email": email, "plan": "Pro", "status": "active", "billing_date": "2025-09-01"}

def create_support_ticket(email: str, issue_summary: str, priority: str) -> dict:
    return {"ticket_id": "TKT-5521", "status": "created", "priority": priority}

TOOL_MAP = {
    "search_knowledge_base": search_knowledge_base,
    "lookup_customer_account": lookup_customer_account,
    "create_support_ticket": create_support_ticket
}

def run_tool(name: str, inputs: dict) -> str:
    fn = TOOL_MAP.get(name)
    return json.dumps(fn(**inputs) if fn else {"error": "unknown tool"})

def agent_loop(user_query: str, customer_email: str):
    system = f"You are a customer support agent. The current customer's email is: {customer_email}"
    messages = [{"role": "user", "content": user_query}]
    print(f"\nUser: {user_query}")

    while True:
        response = client.messages.create(
            model=MODEL, max_tokens=500,
            system=system, tools=TOOLS, messages=messages
        )
        if response.stop_reason != "tool_use":
            print(f"\nAgent: {response.content[0].text}")
            break

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"  → Selected tool: {block.name}")
                print(f"    Params: {json.dumps(block.input)}")
                result = run_tool(block.name, block.input)
                tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})

        messages += [
            {"role": "assistant", "content": response.content},
            {"role": "user",      "content": tool_results}
        ]


# ── Tool selection rules in descriptions ─────────────────────────────────────
# "Use this FIRST" → priority guidance
# "Do NOT use for X" → exclusion rules
# "Use ONLY after attempting Y" → ordering constraint
# These phrases directly shape which tool the model picks.

if __name__ == "__main__":
    EMAIL = "priya@startup.io"
    agent_loop("How do I reset my password?",           EMAIL)  # → knowledge base
    agent_loop("What plan am I on?",                    EMAIL)  # → account lookup
    agent_loop("My account has been locked for 3 days.",EMAIL)  # → lookup then ticket
