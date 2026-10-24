"""
Module 04 | Lesson 18: Tool Errors & Retries
=============================================
Concept: How to handle tool failures gracefully and let the model recover.
Why it matters: Real tools fail. A crashed tool call shouldn't crash the whole agent.
Run: python 18_tool_errors_and_retries.py
"""
import json
import random
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

# ── Simulated flaky tool ──────────────────────────────────────────────────────

call_count = 0

def flaky_get_stock_price(ticker: str) -> dict:
    global call_count
    call_count += 1
    if call_count == 1:
        raise ConnectionError("API timeout — upstream service unavailable")
    if call_count == 2:
        return {"error": "Invalid ticker symbol", "ticker": ticker}
    return {"ticker": ticker, "price": 189.50, "currency": "USD"}

TOOLS = [{
    "name": "get_stock_price",
    "description": "Returns the current price of a stock ticker.",
    "input_schema": {
        "type": "object", "required": ["ticker"],
        "properties": {"ticker": {"type": "string"}}
    }
}]

# ── BEFORE — No error handling, crash on first failure ────────────────────────

def before():
    global call_count; call_count = 0
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        tools=TOOLS,
        messages=[{"role": "user", "content": "What is the price of AAPL?"}]
    )
    for block in response.content:
        if block.type == "tool_use":
            result = flaky_get_stock_price(**block.input)  # exception propagates up
            print(result)


# ── AFTER — Structured error feedback to model ────────────────────────────────
# When a tool fails, return a structured error as tool_result.
# The model sees the error and can retry, apologise, or try a different approach.

def run_tool_safe(name: str, inputs: dict, attempt: int) -> tuple[str, bool]:
    """Returns (result_json, is_error)."""
    try:
        if name == "get_stock_price":
            result = flaky_get_stock_price(**inputs)
            if "error" in result:
                return json.dumps({"error": result["error"], "retry_suggested": True}), True
            return json.dumps(result), False
    except Exception as e:
        return json.dumps({"error": str(e), "retry_suggested": attempt < 3}), True
    return json.dumps({"error": "unknown tool"}), True

def after():
    global call_count; call_count = 0
    messages = [{"role": "user", "content": "What is the price of AAPL?"}]
    max_attempts = 5

    for attempt in range(1, max_attempts + 1):
        response = client.messages.create(
            model=MODEL, max_tokens=400,
            tools=TOOLS, messages=messages
        )
        if response.stop_reason != "tool_use":
            print(f"\nFinal (attempt {attempt}): {response.content[0].text}")
            break

        tool_results = []
        any_error = False
        for block in response.content:
            if block.type == "tool_use":
                result_json, is_error = run_tool_safe(block.name, block.input, attempt)
                print(f"Attempt {attempt} → {block.name}: {'ERROR' if is_error else 'OK'} — {result_json}")
                any_error = any_error or is_error
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result_json,
                    "is_error": is_error      # signals to Claude this was a failure
                })

        messages += [
            {"role": "assistant", "content": response.content},
            {"role": "user",      "content": tool_results}
        ]

        if not any_error:
            break  # all tools succeeded — let the model give its final answer

    else:
        print("Max retries reached — escalating.")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: exception propagates → agent crashes silently
# AFTER:
#   - try/except wraps every tool call
#   - Errors returned as tool_result with is_error=True → model knows it failed
#   - {"retry_suggested": True} gives the model permission to retry
#   - Attempt counter prevents infinite loops
#   - Model adapts: retries, changes approach, or apologises to the user

if __name__ == "__main__":
    print("BEFORE — No error handling"); print("="*50)
    try:
        before()
    except Exception as e:
        print(f"Crashed: {e}")

    print("\nAFTER  — Graceful error handling + retry"); print("="*50)
    after()
