import json
from datetime import datetime, timedelta
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"


def bad_router(name: str, inputs: dict) -> str:
    if name == "get_date":
        return json.dumps({"date": datetime.now().strftime("%Y-%m-%d")})
    elif name == "add_days":
        d = datetime.now() + timedelta(days=inputs["days"])
        return json.dumps({"date": d.strftime("%Y-%m-%d")})
    else:
        return json.dumps({"error": "unknown tool"})


TOOL_REGISTRY: dict[str, callable] = {}
TOOL_SCHEMAS: list[dict] = []

def tool(name: str, description: str, schema: dict):
    """Decorator that registers a function as a callable tool."""
    def decorator(fn):
        TOOL_REGISTRY[name] = fn
        TOOL_SCHEMAS.append({
            "name": name,
            "description": description,
            "input_schema": schema
        })
        return fn
    return decorator

@tool(
    name="get_current_date",
    description="Returns today's date.",
    schema={"type": "object", "properties": {}}
)
def get_current_date() -> dict:
    return {"date": datetime.now().strftime("%Y-%m-%d"), "weekday": datetime.now().strftime("%A")}

@tool(
    name="add_days_to_date",
    description="Returns the date N days from today.",
    schema={
        "type": "object",
        "required": ["days"],
        "properties": {"days": {"type": "integer", "description": "Number of days to add (can be negative)"}}
    }
)
def add_days_to_date(days: int) -> dict:
    result = datetime.now() + timedelta(days=days)
    return {"date": result.strftime("%Y-%m-%d"), "weekday": result.strftime("%A")}

@tool(
    name="format_date",
    description="Formats a YYYY-MM-DD date into a human-readable string.",
    schema={
        "type": "object",
        "required": ["date"],
        "properties": {
            "date":   {"type": "string", "description": "Date in YYYY-MM-DD format"},
            "format": {"type": "string", "description": "Output format: 'long' or 'short'", "default": "long"}
        }
    }
)
def format_date(date: str, format: str = "long") -> dict:
    d = datetime.strptime(date, "%Y-%m-%d")
    out = d.strftime("%B %d, %Y") if format == "long" else d.strftime("%d/%m/%y")
    return {"formatted": out}


def run_tool(name: str, inputs: dict) -> str:
    fn = TOOL_REGISTRY.get(name)
    if not fn:
        return json.dumps({"error": f"No tool named '{name}'"})
    return json.dumps(fn(**inputs))


def agent_loop(user_message: str):
    """Generic loop that works with any registered tools."""
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model=MODEL, max_tokens=500,
            tools=TOOL_SCHEMAS, messages=messages
        )
        if response.stop_reason != "tool_use":
            print("\nFinal answer:", response.content[0].text)
            break

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"→ {block.name}({block.input})")
                result = run_tool(block.name, block.input)
                print(f"← {result}")
                tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})

        messages += [
            {"role": "assistant", "content": response.content},
            {"role": "user",      "content": tool_results}
        ]


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: one big if/elif — adding tool #3 means editing the router
# AFTER:
#   - @tool decorator registers both the schema and the function in one place
#   - TOOL_SCHEMAS auto-built → pass directly to the API
#   - agent_loop() is generic — never changes as you add tools
#   - Testing: call TOOL_REGISTRY["get_current_date"]() directly — no API needed

if __name__ == "__main__":
    print(f"Registered tools: {list(TOOL_REGISTRY.keys())}\n")
    agent_loop("What day of the week will it be in 45 days? Format it as a long date.")
