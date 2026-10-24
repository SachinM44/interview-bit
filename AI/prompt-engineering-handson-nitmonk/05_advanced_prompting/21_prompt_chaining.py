"""
Module 05 | Lesson 21: Prompt Chaining
========================================
Concept: Break complex tasks into a pipeline where output of each step feeds the next.
Why it matters: One mega-prompt is brittle — chains let you validate and control each step.
Run: python 21_prompt_chaining.py
"""
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

ARTICLE = """
OpenAI and Google both announced major LLM updates this week. OpenAI released GPT-5 with
improved reasoning, while Google unveiled Gemini Ultra 2 with native multimodal capabilities.
Meanwhile, Anthropic published safety research on Constitutional AI. The AI investment market
hit $50B in Q2 2025, up 200% YoY. Regulatory pressure is mounting in the EU with the AI Act
entering enforcement phase.
"""

# ── BEFORE — Single mega-prompt trying to do everything ──────────────────────

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=600,
        messages=[{"role": "user", "content":
            f"Read this article, extract key facts, group them by topic, "
            f"write a 3-sentence summary for a CEO, and suggest 3 follow-up questions:\n{ARTICLE}"}]
    )
    print(response.content[0].text)


# ── AFTER — 4-step chain, each step validated before proceeding ──────────────

def step1_extract_facts(article: str) -> list[str]:
    """Step 1: Extract raw facts only — no interpretation."""
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system="Extract factual claims only. One claim per line. No opinions or inference.",
        messages=[{"role": "user", "content": article}]
    )
    facts = [line.strip() for line in response.content[0].text.strip().split("\n") if line.strip()]
    print(f"[Step 1] Extracted {len(facts)} facts")
    return facts

def step2_group_by_topic(facts: list[str]) -> dict[str, list[str]]:
    """Step 2: Group facts by topic — input is already clean facts."""
    import json, re
    facts_text = "\n".join(f"- {f}" for f in facts)
    response = client.messages.create(
        model=MODEL, max_tokens=400,
        system="Group the facts by topic. Return raw JSON: {topic: [facts]}. No markdown.",
        messages=[{"role": "user", "content": facts_text}]
    )
    raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
    grouped = json.loads(raw)
    print(f"[Step 2] Grouped into {len(grouped)} topics: {list(grouped.keys())}")
    return grouped

def step3_write_summary(grouped: dict) -> str:
    """Step 3: Write CEO-level summary from structured topics."""
    import json
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system="Write a 3-sentence executive summary for a CEO. Be direct and specific.",
        messages=[{"role": "user", "content": f"Topics and facts:\n{json.dumps(grouped, indent=2)}"}]
    )
    summary = response.content[0].text.strip()
    print(f"[Step 3] Summary written ({len(summary.split())} words)")
    return summary

def step4_suggest_questions(summary: str, grouped: dict) -> list[str]:
    """Step 4: Generate follow-up questions based on summary + topic gaps."""
    import json
    prompt = f"Summary: {summary}\n\nTopics covered: {list(grouped.keys())}"
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system="Generate 3 sharp follow-up questions a CEO would ask. One per line.",
        messages=[{"role": "user", "content": prompt}]
    )
    questions = [q.strip() for q in response.content[0].text.strip().split("\n") if q.strip()]
    print(f"[Step 4] Generated {len(questions)} questions")
    return questions

def after():
    facts    = step1_extract_facts(ARTICLE)
    grouped  = step2_group_by_topic(facts)
    summary  = step3_write_summary(grouped)
    questions = step4_suggest_questions(summary, grouped)

    print("\n" + "="*50)
    print("SUMMARY:", summary)
    print("\nFOLLOW-UP QUESTIONS:")
    for q in questions:
        print(f"  {q}")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: one prompt doing 4 tasks → errors in step 2 corrupt steps 3 and 4
# AFTER:
#   - Each step has one job and a clear output type (list, dict, str)
#   - You can add validation/logging between steps (see print statements)
#   - Each step can use a different model or max_tokens budget
#   - Failed step is easy to identify and fix without re-running the whole chain
#   - Steps are reusable: step1_extract_facts() can feed different pipelines

if __name__ == "__main__":
    print("BEFORE — Single mega-prompt"); print("="*50); before()
    print("\nAFTER  — 4-step chain"); print("="*50); after()
