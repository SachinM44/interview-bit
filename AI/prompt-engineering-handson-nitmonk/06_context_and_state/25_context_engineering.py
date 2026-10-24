"""
Module 06 | Lesson 25: Context Engineering
============================================
Concept: Deciding what to put in the context window — and in what order.
Why it matters: The model pays more attention to content at the start and end of context.
Run: python 25_context_engineering.py
"""
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

LONG_DOC = """
CloudBase Platform Documentation

Section 1: Introduction
CloudBase is an enterprise SaaS platform for inventory management. Founded in 2019.
Available in 40 countries. SOC 2 Type II certified.

Section 2: Getting Started
To create an account, visit app.cloudbase.io and click "Sign Up".
Enter your business email and choose a plan. Free trial for 14 days.

Section 3: Integrations
CloudBase integrates with Shopify, WooCommerce, Amazon Seller Central, and 50+ platforms.
API documentation available at docs.cloudbase.io.

Section 4: Billing & Pricing
Starter: $49/month (up to 3 users, 1,000 SKUs)
Pro: $149/month (up to 10 users, 10,000 SKUs)
Enterprise: Custom pricing, unlimited users and SKUs.
Annual plans: 20% discount.

Section 5: Support
Email: support@cloudbase.io | Response time: 24h (Starter), 4h (Pro), 1h (Enterprise)
Live chat available for Pro and Enterprise customers.

Section 6: Security
Data encrypted at rest (AES-256) and in transit (TLS 1.3).
GDPR compliant. Data residency options: US, EU, APAC.
"""

# ── BEFORE — Dump all context, question at the end ───────────────────────────

def before(question: str):
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content": f"{LONG_DOC}\n\nQuestion: {question}"}]
    )
    print(response.content[0].text)


# ── AFTER — Context placement: Question → Relevant excerpt → Answer ──────────
# Primacy effect: put critical instructions at the start.
# Recency effect: put the specific question near the end.
# Relevant context: include only what's needed, not the whole doc.

def retrieve_relevant_section(question: str, doc: str) -> str:
    """In production: use embeddings. Here: simple keyword match."""
    question_lower = question.lower()
    sections = doc.strip().split("\n\n")
    scores = {}
    for i, section in enumerate(sections):
        score = sum(1 for word in question_lower.split() if word in section.lower())
        scores[i] = score
    best = max(scores, key=scores.get)
    return sections[best]

def after(question: str):
    relevant = retrieve_relevant_section(question, LONG_DOC)

    # Order: instruction → relevant context → question (instruction + recency)
    prompt = f"""You are a CloudBase support agent. Answer only from the provided documentation.
If the answer is not in the documentation, say "I don't have that information."

<documentation>
{relevant}
</documentation>

Customer question: {question}"""

    response = client.messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )
    print(f"Relevant section used: {relevant[:60]}...")
    print(f"Answer: {response.content[0].text}")


# ── AFTER — Context window budget management ─────────────────────────────────

def after_with_budget(question: str, max_context_chars: int = 500):
    """Trim context to a budget — important for cost and latency control."""
    relevant = retrieve_relevant_section(question, LONG_DOC)

    if len(relevant) > max_context_chars:
        relevant = relevant[:max_context_chars] + "\n[... truncated]"

    prompt = f"Documentation:\n{relevant}\n\nQuestion: {question}\nAnswer concisely."
    response = client.messages.create(
        model=MODEL, max_tokens=150,
        messages=[{"role": "user", "content": prompt}]
    )
    print(f"Context chars used: {len(relevant)}/{max_context_chars}")
    print(f"Answer: {response.content[0].text}")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: dump entire doc → model buries signal in noise, higher cost
# AFTER:
#   - Retrieve only the relevant section (RAG pattern)
#   - Order: instruction first (primacy) → context → question (recency)
#   - Budget cap prevents runaway context costs
# Context engineering = selecting WHAT goes in, WHERE it goes, and HOW MUCH

if __name__ == "__main__":
    Q = "How much does the Pro plan cost annually?"
    print("BEFORE — Full doc dump"); print("="*50); before(Q)
    print("\nAFTER  — Retrieved section"); print("="*50); after(Q)
    print("\nAFTER  — With budget"); print("="*50); after_with_budget(Q)
