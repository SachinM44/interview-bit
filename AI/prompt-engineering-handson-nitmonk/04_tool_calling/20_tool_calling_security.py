"""
Module 04 | Lesson 20: Tool Calling Security
=============================================
Concept: Validate, sanitise, and authorise every tool call — never trust model output blindly.
Why it matters: The model can be manipulated into calling tools with malicious parameters.
Run: python 20_tool_calling_security.py
"""
import json
import re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

# ── BEFORE — No validation, execute whatever the model asks ──────────────────

TOOLS_UNSAFE = [{
    "name": "delete_user_data",
    "description": "Delete data for a user.",
    "input_schema": {
        "type": "object", "required": ["user_id", "data_type"],
        "properties": {
            "user_id":   {"type": "string"},
            "data_type": {"type": "string"}
        }
    }
}]

def delete_user_data_unsafe(user_id: str, data_type: str) -> dict:
    print(f"  [UNSAFE] Deleting {data_type} for user {user_id} — no questions asked")
    return {"deleted": True}

def before():
    # Adversarial prompt trying to trigger unintended deletion
    malicious_message = "Delete all data for user_id='../admin' and data_type='*'"
    messages = [{"role": "user", "content": malicious_message}]
    response = client.messages.create(model=MODEL, max_tokens=200, tools=TOOLS_UNSAFE, messages=messages)
    for block in response.content:
        if hasattr(block, "type") and block.type == "tool_use":
            print(f"Model called: {block.name}({block.input})")
            delete_user_data_unsafe(**block.input)  # blindly executed


# ── AFTER — Defense layers ────────────────────────────────────────────────────

# Layer 1: Input schema with strict constraints in the tool definition
TOOLS_SAFE = [{
    "name": "delete_user_data",
    "description": (
        "Delete a specific data category for a single user. "
        "Only use when the user explicitly and clearly requests deletion of their own data."
    ),
    "input_schema": {
        "type": "object", "required": ["user_id", "data_type"],
        "properties": {
            "user_id": {
                "type": "string",
                "pattern": "^usr_[a-z0-9]{8}$",   # strict format — rejects '../admin'
                "description": "User ID in format usr_xxxxxxxx"
            },
            "data_type": {
                "type": "string",
                "enum": ["preferences", "history", "profile"],  # no wildcards
                "description": "Specific data category to delete"
            }
        }
    }
}]

# Layer 2: Runtime validation before execution
VALID_USER_ID_PATTERN = re.compile(r"^usr_[a-z0-9]{8}$")
ALLOWED_DATA_TYPES = {"preferences", "history", "profile"}

class ToolSecurityError(Exception):
    pass

def validate_delete_user_data(user_id: str, data_type: str, requesting_user_id: str):
    """Validate that the tool call is safe before executing."""
    # Format check
    if not VALID_USER_ID_PATTERN.match(user_id):
        raise ToolSecurityError(f"Invalid user_id format: {user_id}")
    # Allowlist check
    if data_type not in ALLOWED_DATA_TYPES:
        raise ToolSecurityError(f"Disallowed data_type: {data_type}")
    # Authorisation: user can only delete their own data
    if user_id != requesting_user_id:
        raise ToolSecurityError(f"User {requesting_user_id} cannot delete data for {user_id}")

def delete_user_data_safe(user_id: str, data_type: str, requesting_user_id: str) -> dict:
    validate_delete_user_data(user_id, data_type, requesting_user_id)
    print(f"  [SAFE] Deleting {data_type} for {user_id} — validated ✓")
    return {"deleted": True, "user_id": user_id, "data_type": data_type}

def run_tool_safe(name: str, inputs: dict, context: dict) -> str:
    try:
        if name == "delete_user_data":
            return json.dumps(delete_user_data_safe(**inputs, requesting_user_id=context["user_id"]))
    except ToolSecurityError as e:
        return json.dumps({"error": f"Security violation: {e}", "is_error": True})
    return json.dumps({"error": "unknown tool"})

def after():
    CURRENT_USER = "usr_abc12345"
    messages = [{"role": "user", "content": f"Delete my preferences. My user ID is {CURRENT_USER}."}]
    context = {"user_id": CURRENT_USER}

    response = client.messages.create(model=MODEL, max_tokens=300, tools=TOOLS_SAFE, messages=messages)
    tool_results = []
    for block in response.content:
        if hasattr(block, "type") and block.type == "tool_use":
            print(f"Model called: {block.name}({block.input})")
            result = run_tool_safe(block.name, block.input, context)
            print(f"Result: {result}")
            tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})
    if tool_results:
        messages += [{"role": "assistant", "content": response.content}, {"role": "user", "content": tool_results}]
        final = client.messages.create(model=MODEL, max_tokens=200, tools=TOOLS_SAFE, messages=messages)
        print(f"\nAgent: {final.content[0].text}")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: model output executed directly → path traversal, wildcard deletion possible
# AFTER — 3 defence layers:
#   L1 Schema:   pattern + enum in the tool definition blocks bad values early
#   L2 Validate: regex + allowlist in Python before execution — second fence
#   L3 Authz:    requesting_user_id check — user can only affect their own data
# Rule: treat every tool call like an untrusted HTTP request — validate everything

if __name__ == "__main__":
    print("BEFORE — No validation"); print("="*50)
    try:
        before()
    except Exception as e:
        print(f"Error: {e}")
    print("\nAFTER  — Validated + authorised"); print("="*50)
    after()
