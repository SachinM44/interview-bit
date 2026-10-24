import json
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content": "What is the weather in Mumbai right now?"}]
    )
    print(response.content[0].text)


TOOLS = [{
    "name": "get_weather",
    "description": "Returns current weather for a city. Use this whenever the user asks about weather.",
    "input_schema": {
        "type": "object",
        "required": ["city"],
        "properties": {
            "city": {"type": "string", "description": "City name, e.g. 'Mumbai'"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"], "default": "celsius"}
        }
    }
}]

def get_weather(city: str, unit: str = "celsius") -> dict:
    mock_data = {
        "Mumbai": {"temp": 31, "condition": "Humid and partly cloudy", "humidity": 78},
        "London": {"temp": 14, "condition": "Overcast",                "humidity": 85},
    }
    data = mock_data.get(city, {"temp": 22, "condition": "Clear", "humidity": 60})
    symbol = "°C" if unit == "celsius" else "°F"
    temp = data["temp"] if unit == "celsius" else data["temp"] * 9/5 + 32
    return {"city": city, "temperature": f"{temp:.0f}{symbol}",
            "condition": data["condition"], "humidity": f"{data['humidity']}%"}


def run_tool(name: str, inputs: dict) -> str:
    if name == "get_weather":
        return json.dumps(get_weather(**inputs))
    return json.dumps({"error": f"Unknown tool: {name}"})

def after():
    messages = [{"role": "user", "content": "What is the weather in Mumbai right now?"}]

    response = client.messages.create(
        model=MODEL, max_tokens=300,
        tools=TOOLS, messages=messages
    )
    print(f"Stop reason: {response.stop_reason}")  # "tool_use"

    if response.stop_reason == "tool_use":
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"→ Tool called: {block.name}({block.input})")
                result = run_tool(block.name, block.input)
                print(f"← Result: {result}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        messages += [
            {"role": "assistant", "content": response.content},
            {"role": "user",      "content": tool_results}
        ]
        final = client.messages.create(
            model=MODEL, max_tokens=300,
            tools=TOOLS, messages=messages
        )
        print("\nFinal answer:")
        print(final.content[0].text)


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: model guesses or refuses (no live data access)
# AFTER:
#   1. Tool schema tells the model what's available and when to use it
#   2. First call → stop_reason="tool_use" + tool_use block with name + inputs
#   3. Your Python code runs the real function
#   4. tool_result appended to messages
#   5. Second call → model uses real data in its final answer

if __name__ == "__main__":
    print("BEFORE — Hallucinated weather"); print("="*50); before()
    print("\nAFTER  — Real tool call"); print("="*50); after()
