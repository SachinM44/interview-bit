"""
Module 05 | Lesson 22: Task Decomposition
==========================================
Concept: Have the model plan the subtasks itself before executing them.
Why it matters: The model plans better when it reasons about the task before acting.
Run: python 22_task_decomposition.py
"""
import json, re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

REQUEST = """
We're launching a new SaaS product for restaurant inventory management.
Create a complete go-to-market plan: target audience, positioning, pricing,
launch channels, and 30-day action plan.
"""

# ── BEFORE — Ask for everything in one shot ───────────────────────────────────

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=800,
        messages=[{"role": "user", "content": REQUEST}]
    )
    print(response.content[0].text[:500], "...")


# ── AFTER — Step 1: Model decomposes task, Step 2: Execute each subtask ───────

def decompose(request: str) -> list[dict]:
    """Ask the model to plan its own subtasks."""
    response = client.messages.create(
        model=MODEL, max_tokens=400,
        system="You are a project planner. Break complex requests into 4-6 clear subtasks. Return raw JSON array: [{\"id\": 1, \"title\": \"...\", \"instruction\": \"...\", \"depends_on\": []}]",
        messages=[{"role": "user", "content": f"Decompose this task:\n{request}"}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    subtasks = json.loads(raw)
    print(f"Decomposed into {len(subtasks)} subtasks:")
    for t in subtasks:
        deps = f" (after: {t['depends_on']})" if t.get('depends_on') else ""
        print(f"  {t['id']}. {t['title']}{deps}")
    return subtasks

def execute_subtask(subtask: dict, context: dict) -> str:
    """Execute one subtask, passing results from dependencies as context."""
    context_text = ""
    if subtask.get("depends_on"):
        deps = {d: context[d] for d in subtask["depends_on"] if d in context}
        if deps:
            context_text = f"\n\nContext from previous steps:\n{json.dumps(deps, indent=2)}"

    response = client.messages.create(
        model=MODEL, max_tokens=400,
        system="You are a SaaS go-to-market expert. Be specific and actionable.",
        messages=[{"role": "user", "content": subtask["instruction"] + context_text}]
    )
    return response.content[0].text.strip()

def after():
    subtasks = decompose(REQUEST)
    results = {}

    for task in subtasks:
        print(f"\nExecuting: {task['title']}...")
        result = execute_subtask(task, results)
        results[task["id"]] = result
        print(f"  Done ({len(result.split())} words)")

    # Final synthesis
    synthesis_input = json.dumps({t["title"]: results[t["id"]] for t in subtasks}, indent=2)
    final = client.messages.create(
        model=MODEL, max_tokens=400,
        system="Synthesise these sections into a coherent executive summary (4-5 bullet points).",
        messages=[{"role": "user", "content": synthesis_input}]
    )
    print("\n" + "="*50)
    print("EXECUTIVE SUMMARY:")
    print(final.content[0].text)


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: one prompt → shallow coverage, topics bleed into each other
# AFTER:
#   Decompose: model identifies its own subtasks → more comprehensive than your manual list
#   depends_on: subtask 4 gets context from subtask 1 → pricing informed by target audience
#   Execute: each subtask gets full token budget → deeper per-section quality
#   Synthesis: final step creates coherent output from complete parts

if __name__ == "__main__":
    print("BEFORE — Single prompt"); print("="*50); before()
    print("\nAFTER  — Decompose then execute"); print("="*50); after()
