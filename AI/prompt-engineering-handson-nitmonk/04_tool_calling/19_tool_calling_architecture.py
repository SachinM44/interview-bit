"""
Module 04 | Lesson 19: Tool Calling Architecture
==================================================
Concept: Patterns for building multi-tool agent systems that scale.
Why it matters: Ad-hoc tool setups become unmaintainable past 5 tools — architecture matters.
Run: python 19_tool_calling_architecture.py
"""
import json
from dataclasses import dataclass, field
from typing import Callable
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"


# ── Pattern: ToolKit — grouped tools with shared context ─────────────────────

@dataclass
class ToolKit:
    """Groups related tools. Each toolkit owns its tools and their implementations."""
    name: str
    tools: list[dict] = field(default_factory=list)
    _handlers: dict[str, Callable] = field(default_factory=dict)

    def register(self, name: str, description: str, schema: dict):
        def decorator(fn: Callable):
            self.tools.append({"name": name, "description": description, "input_schema": schema})
            self._handlers[name] = fn
            return fn
        return decorator

    def run(self, name: str, inputs: dict) -> str:
        fn = self._handlers.get(name)
        if not fn:
            return json.dumps({"error": f"Tool '{name}' not in toolkit '{self.name}'"})
        try:
            return json.dumps(fn(**inputs))
        except Exception as e:
            return json.dumps({"error": str(e)})


# ── Define two separate toolkits ──────────────────────────────────────────────

crm = ToolKit("CRM")
billing = ToolKit("Billing")

@crm.register(
    "get_customer",
    "Retrieve a customer's profile by email.",
    {"type": "object", "required": ["email"],
     "properties": {"email": {"type": "string"}}}
)
def get_customer(email: str) -> dict:
    return {"email": email, "name": "Priya Sharma", "tier": "enterprise", "joined": "2023-04"}

@crm.register(
    "update_customer_tier",
    "Update a customer's subscription tier.",
    {"type": "object", "required": ["email", "new_tier"],
     "properties": {"email": {"type": "string"}, "new_tier": {"type": "string", "enum": ["starter", "pro", "enterprise"]}}}
)
def update_customer_tier(email: str, new_tier: str) -> dict:
    return {"success": True, "email": email, "new_tier": new_tier}

@billing.register(
    "get_invoices",
    "List recent invoices for a customer.",
    {"type": "object", "required": ["email"],
     "properties": {"email": {"type": "string"}, "limit": {"type": "integer", "default": 5}}}
)
def get_invoices(email: str, limit: int = 5) -> dict:
    return {"invoices": [{"id": "INV-001", "amount": "$499", "status": "paid", "date": "2025-07-01"}]}

@billing.register(
    "issue_credit",
    "Issue a credit to a customer's account.",
    {"type": "object", "required": ["email", "amount_usd"],
     "properties": {"email": {"type": "string"}, "amount_usd": {"type": "number", "minimum": 1}}}
)
def issue_credit(email: str, amount_usd: float) -> dict:
    return {"success": True, "credit": f"${amount_usd:.2f}", "applied_to": email}


# ── Agent that combines all toolkits ─────────────────────────────────────────

class Agent:
    def __init__(self, system: str, *toolkits: ToolKit):
        self.system = system
        self.toolkits = {tk.name: tk for tk in toolkits}
        self.all_tools = [tool for tk in toolkits for tool in tk.tools]

    def run_tool(self, name: str, inputs: dict) -> str:
        for tk in self.toolkits.values():
            if name in tk._handlers:
                return tk.run(name, inputs)
        return json.dumps({"error": f"No toolkit owns tool '{name}'"})

    def chat(self, user_message: str):
        messages = [{"role": "user", "content": user_message}]
        print(f"User: {user_message}")

        while True:
            response = client.messages.create(
                model=MODEL, max_tokens=600,
                system=self.system, tools=self.all_tools, messages=messages
            )
            if response.stop_reason != "tool_use":
                print(f"Agent: {response.content[0].text}")
                break

            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = self.run_tool(block.name, block.input)
                    print(f"  → {block.name}({block.input}) = {result}")
                    tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})

            messages += [
                {"role": "assistant", "content": response.content},
                {"role": "user",      "content": tool_results}
            ]


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# Without architecture: one giant file, one router function, tools tangled together
# With ToolKit pattern:
#   - CRM tools live in the CRM toolkit, billing tools in Billing — easy to find
#   - Each toolkit can be tested independently
#   - Agent takes *toolkits — add a new domain by passing in a new ToolKit
#   - Dispatch is automatic — no manual if/elif needed

if __name__ == "__main__":
    agent = Agent(
        "You are a CRM assistant that can look up customers, update their tiers, and handle billing.",
        crm, billing
    )
    agent.chat("Look up priya@startup.io, check her invoices, and issue her a $50 credit.")
