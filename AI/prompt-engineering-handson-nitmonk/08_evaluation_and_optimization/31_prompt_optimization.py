import json
import re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

# ── The eval harness (reuse from lesson 30) ───────────────────────────────────

def run_prompt(system: str, user_input: str) -> str:
    response = client.messages.create(
        model=MODEL, max_tokens=100, system=system,
        messages=[{"role": "user", "content": user_input}]
    )
    return response.content[0].text.strip()

EVAL_CASES = [
    {"input": "Charged twice this month.",    "must_contain": ["billing", "P1"]},
    {"input": "How do I reset my password?",  "must_contain": ["account"]},
    {"input": "App crashes on login.",         "must_contain": ["technical", "P1"]},
    {"input": "Great product, love it!",       "must_contain": ["positive"]},
]

def score_prompt(system: str) -> tuple[float, list[str]]:
    """Returns (score 0-1, list of failures)."""
    passed = 0
    failures = []
    for case in EVAL_CASES:
        output = run_prompt(system, case["input"]).lower()
        case_pass = all(kw in output for kw in case["must_contain"])
        if case_pass:
            passed += 1
        else:
            missing = [kw for kw in case["must_contain"] if kw not in output]
            failures.append(f"'{case['input'][:40]}' — missing: {missing}")
    return passed / len(EVAL_CASES), failures


# ── BEFORE — Manual trial-and-error ──────────────────────────────────────────

def before():
    v1 = "Classify customer tickets."
    v2 = "You are a support classifier. Return category and priority."
    v3 = "Classify tickets into: billing, technical, account, general. Priority: P1 (urgent), P2, P3."

    for name, system in [("v1", v1), ("v2", v2), ("v3", v3)]:
        score, _ = score_prompt(system)
        print(f"{name}: {score:.0%}")


# ── AFTER — Automated optimization loop ───────────────────────────────────────

def optimize_prompt(initial_system: str, max_iterations: int = 3) -> str:
    """Ask the model to rewrite a failing prompt based on test failures."""
    current = initial_system
    best_score = 0.0
    best_prompt = current

    print(f"Starting prompt: {current[:80]}...")

    for i in range(max_iterations):
        score, failures = score_prompt(current)
        print(f"\nIteration {i+1}: score={score:.0%}")

        if score > best_score:
            best_score = score
            best_prompt = current

        if score == 1.0:
            print("Perfect score — stopping.")
            break

        if not failures:
            break

        failure_text = "\n".join(f"- {f}" for f in failures)
        rewrite_prompt = f"""You are a prompt engineer. Improve this system prompt based on the failing test cases.

Current prompt:
{current}

Failing test cases (these inputs produced wrong output):
{failure_text}

The prompt must classify tickets with: category (billing|technical|account|general), priority (P1|P2|P3), sentiment (positive|negative|neutral).

Write an improved system prompt. Return ONLY the new system prompt text — no explanation."""

        response = client.messages.create(
            model=MODEL, max_tokens=300,
            messages=[{"role": "user", "content": rewrite_prompt}]
        )
        current = response.content[0].text.strip()
        print(f"Rewritten to: {current[:100]}...")

    print(f"\nBest score: {best_score:.0%}")
    print(f"Best prompt: {best_prompt}")
    return best_prompt


if __name__ == "__main__":
    print("BEFORE — Manual trial-and-error"); print("="*50)
    before()

    print("\nAFTER  — Automated optimization"); print("="*50)
    initial = "Classify support tickets."
    optimized = optimize_prompt(initial, max_iterations=3)

    print("\nFinal eval on optimized prompt:")
    final_score, final_failures = score_prompt(optimized)
    print(f"Score: {final_score:.0%}")
    if final_failures:
        print("Remaining failures:")
        for f in final_failures:
            print(f"  {f}")
