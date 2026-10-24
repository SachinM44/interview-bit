import re
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

PROBLEM = """
A SaaS company has:
- 500 customers at $99/month (monthly plan)
- 200 customers at $79/month (annual plan, billed monthly)
- 15% monthly churn on monthly plan, 5% annual churn on annual plan
- CAC of $250 per customer

What is the net new MRR if they acquire 80 new monthly customers next month?
"""

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=150,
        messages=[{"role": "user", "content": f"Answer: {PROBLEM}"}]
    )
    print(response.content[0].text)

# chain of thought
def after_cot():
    response = client.messages.create(
        model=MODEL, max_tokens=600,
        messages=[{"role": "user", "content": PROBLEM + "\nThink step by step, then give the final answer."}]
    )
    print(response.content[0].text)

# scratchpad (reasoing / planning etc.)
def after_scratchpad():
    response = client.messages.create(
        model=MODEL, max_tokens=800,
        system="Reason inside <thinking> tags. Put only the final answer in <answer> tags.",
        messages=[{"role": "user", "content": PROBLEM}]
    )
    raw = response.content[0].text
    thinking = re.search(r"<thinking>(.*?)</thinking>", raw, re.DOTALL)
    answer   = re.search(r"<answer>(.*?)</answer>",   raw, re.DOTALL)

    print("Reasoning (internal):")
    print(thinking.group(1).strip() if thinking else raw)
    print("\nFinal answer (shown to user):")
    print(answer.group(1).strip() if answer else "")


# react reason + action 
def after_react():
    react_system = """
Solve problems using the ReAct pattern:
Thought: <what you know and what you need to figure out next>
Action: <calculation or lookup to perform>
Observation: <result of that action>
... repeat until confident ...
Answer: <final answer>
"""
    response = client.messages.create(
        model=MODEL, max_tokens=800,
        system=react_system,
        messages=[{"role": "user", "content": PROBLEM}]
    )
    print(response.content[0].text)


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# Direct Q&A  : model guesses → wrong answer on multi-step math
# CoT         : model shows work → catches arithmetic mistakes
# Scratchpad  : reasoning hidden from users → clean UX, full accuracy
# ReAct       : interleaved reasoning + action → ideal for tool-using agents
#
# When to use each:
#   CoT        → one-shot complex reasoning (math, logic, comparison)
#   Scratchpad → production: clean output required, reasoning is internal
#   ReAct      → agentic workflows where the model must decide what to do next

if __name__ == "__main__":
    print("BEFORE — Direct answer (likely wrong)"); print("="*50); before()
    print("\nAFTER  — Chain-of-Thought"); print("="*50); after_cot()
    print("\nAFTER  — Scratchpad"); print("="*50); after_scratchpad()
    print("\nAFTER  — ReAct"); print("="*50); after_react()
