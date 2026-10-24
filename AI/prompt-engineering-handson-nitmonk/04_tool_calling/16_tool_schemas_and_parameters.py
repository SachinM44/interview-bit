import json
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

# ── BEFORE — Vague schema ─────────────────────────────────────────────────────
# Model has to guess what parameters mean → unpredictable values.

VAGUE_TOOL = [{
    "name": "search_orders",
    "description": "Search orders.",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string"},
            "filter": {"type": "string"},
            "limit": {"type": "number"}
        }
    }
}]

# ── AFTER — Precise schema ────────────────────────────────────────────────────
# Every parameter has: description, constraints, examples, defaults.

PRECISE_TOOL = [{
    "name": "search_orders",
    "description": (
        "Search customer orders by email, order ID, or date range. "
        "Returns a list of matching orders sorted by date descending. "
        "Use this whenever a user asks about their order status, history, or a specific order."
    ),
    "input_schema": {
        "type": "object",
        "required": ["account_email"],
        "properties": {
            "account_email": {
                "type": "string",
                "description": "Customer's email address (lowercase). Used to scope the search to one account.",
                "examples": ["user@example.com"]
            },
            "order_id": {
                "type": "string",
                "description": "Specific order ID to look up, e.g. 'ORD-12345'. Optional — omit to list all orders.",
                "pattern": "^ORD-\\d+$"
            },
            "status_filter": {
                "type": "string",
                "enum": ["all", "pending", "shipped", "delivered", "cancelled", "refunded"],
                "default": "all",
                "description": "Filter results by order status. Use 'all' to return every order."
            },
            "date_from": {
                "type": "string",
                "description": "Start of date range in ISO 8601 format (YYYY-MM-DD). Optional.",
                "examples": ["2025-01-01"]
            },
            "date_to": {
                "type": "string",
                "description": "End of date range in ISO 8601 format (YYYY-MM-DD). Optional. Defaults to today.",
                "examples": ["2025-12-31"]
            },
            "limit": {
                "type": "integer",
                "minimum": 1,
                "maximum": 50,
                "default": 10,
                "description": "Max number of orders to return (1-50)."
            }
        }
    }
}]

def mock_search_orders(**kwargs) -> dict:
    return {"orders": [{"id": "ORD-99001", "status": "shipped", "total": "$149.99"}], "params_received": kwargs}

def call_with_schema(tools: list, query: str, label: str):
    messages = [{"role": "user", "content": query}]
    response = client.messages.create(model=MODEL, max_tokens=300, tools=tools, messages=messages)
    print(f"\n{label}")
    print("="*50)
    for block in response.content:
        if hasattr(block, "type") and block.type == "tool_use":
            print(f"Tool: {block.name}")
            print(f"Params: {json.dumps(block.input, indent=2)}")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# Vague:
#   - "query" and "filter" are undefined → model guesses formats
#   - No required fields → model may omit the email entirely
# Precise:
#   - description explains WHEN to call the tool ("whenever a user asks about order status")
#   - required: ["account_email"] ensures account scoping — security + correctness
#   - enum for status_filter → no free-text values that your backend can't handle
#   - pattern for order_id → validates format before the call hits your DB
#   - minimum/maximum on limit → prevents abuse (limit=9999)
#   - examples in description → model mimics the format

if __name__ == "__main__":
    query = "Can you check the shipped orders for john@acme.com from last month?"
    call_with_schema(VAGUE_TOOL,   query, "BEFORE — Vague schema")
    call_with_schema(PRECISE_TOOL, query, "AFTER  — Precise schema")
