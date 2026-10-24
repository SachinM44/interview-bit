import json
import re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

SYSTEM = """Classify customer support tickets.
Return exactly this JSON:
{"category": "billing|technical|account|general", "priority": "P1|P2|P3", "sentiment": "positive|negative|neutral"}"""

def classify(ticket: str) -> dict:
    response = client.messages.create(
        model=MODEL, max_tokens=80, system=SYSTEM,
        messages=[{"role": "user", "content": ticket}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    return json.loads(raw)

VALID_CATEGORIES  = {"billing", "technical", "account", "general"}
VALID_PRIORITIES  = {"P1", "P2", "P3"}
VALID_SENTIMENTS  = {"positive", "negative", "neutral"}

TEST_CASES = [
    {
        "input": "My account was charged twice this month. This is urgent!",
        "expected": {"category": "billing", "priority": "P1", "sentiment": "negative"}
    },
    {
        "input": "How do I export my data to CSV?",
        "expected": {"category": "technical", "priority": "P3", "sentiment": "neutral"}
    },
    {
        "input": "I forgot my password. Can you help?",
        "expected": {"category": "account", "priority": "P2", "sentiment": "neutral"}
    },
    {
        "input": "Love the new dashboard update! Really intuitive.",
        "expected": {"category": "general", "priority": "P3", "sentiment": "positive"}
    },
]

def run_assertion_tests() -> dict:
    passed = 0
    results = []
    for tc in TEST_CASES:
        try:
            output = classify(tc["input"])
            errors = []

            # Schema checks
            if output.get("category") not in VALID_CATEGORIES:
                errors.append(f"Invalid category: {output.get('category')}")
            if output.get("priority") not in VALID_PRIORITIES:
                errors.append(f"Invalid priority: {output.get('priority')}")
            if output.get("sentiment") not in VALID_SENTIMENTS:
                errors.append(f"Invalid sentiment: {output.get('sentiment')}")

            # Value checks against expected
            for field, expected_val in tc["expected"].items():
                if output.get(field) != expected_val:
                    errors.append(f"{field}: expected '{expected_val}', got '{output.get(field)}'")

            status = "PASS" if not errors else "FAIL"
            if status == "PASS":
                passed += 1

            results.append({"input": tc["input"][:50], "status": status, "errors": errors, "output": output})
        except Exception as e:
            results.append({"input": tc["input"][:50], "status": "ERROR", "errors": [str(e)]})

    return {"passed": passed, "total": len(TEST_CASES), "results": results}


JUDGE_SYSTEM = """Score a support ticket classification on 1-5.
5 = Perfect (correct category, priority, sentiment)
4 = Good (one minor issue)
3 = Acceptable (partially right)
2 = Poor (major error)
1 = Wrong

Return JSON: {"score": 1-5, "reason": "<one sentence>", "pass": true/false (score>=4)}"""

def llm_judge(ticket: str, classification: dict) -> dict:
    prompt = f"Ticket: {ticket}\nClassification: {json.dumps(classification)}"
    response = client.messages.create(
        model=MODEL, max_tokens=120,
        system=JUDGE_SYSTEM,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    return json.loads(raw)


if __name__ == "__main__":
    print("LEVEL 1: Assertion Tests"); print("="*50)
    report = run_assertion_tests()
    print(f"Result: {report['passed']}/{report['total']} passed\n")
    for r in report["results"]:
        status = r["status"]
        print(f"[{status}] {r['input']}")
        if r.get("errors"):
            for err in r["errors"]:
                print(f"       ✗ {err}")
        elif r.get("output"):
            print(f"       ✓ {r['output']}")

    print("\nLEVEL 2: LLM-as-Judge"); print("="*50)
    judge_scores = []
    for tc in TEST_CASES[:2]:   # limit to 2 to save tokens
        output = classify(tc["input"])
        verdict = llm_judge(tc["input"], output)
        judge_scores.append(verdict["score"])
        status = "PASS" if verdict["pass"] else "FAIL"
        print(f"[{status}] Score {verdict['score']}/5 — {verdict['reason']}")

    avg = sum(judge_scores) / len(judge_scores) if judge_scores else 0
    print(f"\nAverage judge score: {avg:.1f}/5")
    print(f"Eval result: {'✓ PASS' if avg >= 4 else '✗ FAIL — prompt needs improvement'}")
