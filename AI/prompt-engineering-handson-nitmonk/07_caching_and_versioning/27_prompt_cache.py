"""
Module 07 | Lesson 27: Prompt Caching
=======================================
Concept: Mark large, stable prompt sections so the API caches and reuses them.
Why it matters: Cached tokens cost 90% less and are returned 85% faster.
Run: python 27_prompt_cache.py

Note: Prompt caching is a paid feature. Cached reads are ~10x cheaper than uncached.
"""
import time
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

# Large stable document (simulating a long system prompt or knowledge base)
LARGE_KNOWLEDGE_BASE = """
CloudBase Complete Product Documentation v3.2

[Account Management]
Creating an account: Visit app.cloudbase.io. Click Sign Up. Enter business email.
Choose plan: Starter ($49/mo), Pro ($149/mo), Enterprise (custom).
Free trial: 14 days, no credit card required.
SSO: Supported via SAML 2.0 and OAuth 2.0 for Pro and Enterprise.
MFA: Required for Enterprise, optional for other tiers.

[Billing]
Invoices generated on the 1st of each month.
Payment methods: Credit card, ACH, wire transfer (Enterprise only).
Annual billing: 20% discount applied automatically.
Refund policy: Prorated refund within 30 days of upgrade.
Failed payment: 3 retries over 7 days before account suspension.

[Integrations]
E-commerce: Shopify, WooCommerce, Magento, BigCommerce, Amazon Seller Central.
Accounting: QuickBooks, Xero, FreshBooks.
Shipping: ShipStation, EasyPost, FedEx, UPS, DHL.
API: REST API with webhooks. Rate limit: 1000 req/min (Pro), 5000 req/min (Enterprise).
SDK: Python, Node.js, Ruby, PHP available at github.com/cloudbase.

[Support]
Channels: Email (all tiers), Live chat (Pro+), Phone (Enterprise).
Response SLA: 24h (Starter), 4h (Pro), 1h (Enterprise).
Escalation: enterprise-support@cloudbase.io for P0 issues.
Status page: status.cloudbase.io

[Security]
Encryption: AES-256 at rest, TLS 1.3 in transit.
Compliance: SOC 2 Type II, GDPR, HIPAA (Enterprise add-on).
Data residency: US (default), EU, APAC.
Penetration testing: Annual third-party audit.
""" * 3   # repeat to make it large enough to cache


# ── BEFORE — No caching: same large context re-processed every call ───────────

def before(question: str):
    start = time.time()
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system=f"You are a CloudBase support agent.\n\n{LARGE_KNOWLEDGE_BASE}",
        messages=[{"role": "user", "content": question}]
    )
    elapsed = time.time() - start
    print(f"No cache | Time: {elapsed:.2f}s | Input tokens: {response.usage.input_tokens}")
    print(response.content[0].text[:150])


# ── AFTER — Cache the stable knowledge base ───────────────────────────────────
# Add cache_control to the content block you want cached.
# The first call WRITES the cache; subsequent calls READ from it (much faster).

def after(question: str):
    start = time.time()
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system=[
            {"type": "text", "text": "You are a CloudBase support agent.\n\n"},
            {
                "type": "text",
                "text": LARGE_KNOWLEDGE_BASE,
                "cache_control": {"type": "ephemeral"}   # mark this block for caching
            }
        ],
        messages=[{"role": "user", "content": question}]
    )
    elapsed = time.time() - start
    cache_read  = getattr(response.usage, "cache_read_input_tokens", 0)
    cache_write = getattr(response.usage, "cache_creation_input_tokens", 0)
    print(f"With cache | Time: {elapsed:.2f}s | "
          f"Input: {response.usage.input_tokens} | "
          f"Cache write: {cache_write} | Cache read: {cache_read}")
    print(response.content[0].text[:150])


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: Every call re-encodes the full knowledge base → slow, expensive
# AFTER:
#   - First call: cache_creation_input_tokens > 0 (write cost, slightly higher)
#   - Subsequent calls: cache_read_input_tokens > 0 (10x cheaper, 85% faster)
#   - Only the user question changes → only new tokens incur full price
#
# What to cache:
#   ✓ System prompt (changes rarely)
#   ✓ Knowledge base / documentation
#   ✓ Few-shot examples (stable)
#   ✗ User messages (change every call)
# Minimum cacheable block: ~1024 tokens

if __name__ == "__main__":
    QUESTIONS = [
        "What is the refund policy?",
        "How do I set up SSO?",
        "What is the API rate limit for Pro?"
    ]
    print("WITHOUT CACHE"); print("="*50)
    for q in QUESTIONS[:2]:
        before(q)

    print("\nWITH CACHE (first call writes, second reads)"); print("="*50)
    for q in QUESTIONS:
        after(q)
