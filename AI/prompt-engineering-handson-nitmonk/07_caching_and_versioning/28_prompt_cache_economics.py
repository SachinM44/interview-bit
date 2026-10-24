"""
Module 07 | Lesson 28: Prompt Cache Economics
===============================================
Concept: Calculate and optimise the cost/benefit of prompt caching.
Why it matters: Caching saves money only in specific conditions — model it before shipping.
Run: python 28_prompt_cache_economics.py
"""

# ── Pricing (claude-sonnet-4-6, as of mid-2025 — verify at anthropic.com/pricing) ──
# Input tokens (no cache)    : $3.00 / 1M tokens
# Cache write (first time)   : $3.75 / 1M tokens  (25% premium)
# Cache read (subsequent)    : $0.30 / 1M tokens   (90% discount)
# Output tokens              : $15.00 / 1M tokens

INPUT_PRICE_PER_M   = 3.00
CACHE_WRITE_PER_M   = 3.75
CACHE_READ_PER_M    = 0.30
OUTPUT_PRICE_PER_M  = 15.00


def cost(tokens: int, price_per_million: float) -> float:
    return (tokens / 1_000_000) * price_per_million


# ── Scenario: Customer support chatbot ────────────────────────────────────────

def analyse_caching_scenario(
    stable_tokens: int,        # tokens in system prompt / knowledge base
    variable_tokens: int,      # tokens per user question
    output_tokens: int,        # tokens per response
    calls_per_day: int,
    cache_ttl_minutes: int = 5  # cache expires after 5 minutes of inactivity
):
    print(f"\nScenario: {calls_per_day} calls/day")
    print(f"  Stable content : {stable_tokens:,} tokens (cached)")
    print(f"  Per-call input : {variable_tokens:,} tokens (not cached)")
    print(f"  Per-call output: {output_tokens:,} tokens")

    # Without caching
    cost_per_call_no_cache = (
        cost(stable_tokens + variable_tokens, INPUT_PRICE_PER_M) +
        cost(output_tokens, OUTPUT_PRICE_PER_M)
    )
    daily_cost_no_cache = cost_per_call_no_cache * calls_per_day

    # With caching
    # First call of each cache window pays write price for stable content
    # Subsequent calls pay read price
    # Approximation: 1 write per 5-minute window
    calls_per_window = max(1, calls_per_day // (24 * 60 // cache_ttl_minutes))
    write_calls = calls_per_day // calls_per_window
    read_calls  = calls_per_day - write_calls

    cost_write_call = (
        cost(stable_tokens, CACHE_WRITE_PER_M) +
        cost(variable_tokens, INPUT_PRICE_PER_M) +
        cost(output_tokens, OUTPUT_PRICE_PER_M)
    )
    cost_read_call = (
        cost(stable_tokens, CACHE_READ_PER_M) +
        cost(variable_tokens, INPUT_PRICE_PER_M) +
        cost(output_tokens, OUTPUT_PRICE_PER_M)
    )
    daily_cost_with_cache = (write_calls * cost_write_call) + (read_calls * cost_read_call)

    savings = daily_cost_no_cache - daily_cost_with_cache
    savings_pct = (savings / daily_cost_no_cache * 100) if daily_cost_no_cache > 0 else 0

    print(f"\n  Daily cost (no cache)  : ${daily_cost_no_cache:.4f}")
    print(f"  Daily cost (with cache): ${daily_cost_with_cache:.4f}")
    print(f"  Daily savings          : ${savings:.4f} ({savings_pct:.1f}%)")
    print(f"  Monthly savings        : ${savings * 30:.2f}")

    breakeven = write_calls / calls_per_day * 100
    print(f"  Cache hit rate needed to save money: >{breakeven:.0f}% (actual: {(read_calls/calls_per_day*100):.0f}%)")
    return savings


# ── Rule of thumb calculator ──────────────────────────────────────────────────

def is_caching_worth_it(stable_tokens: int, calls_before_cache_expires: int) -> bool:
    """
    Caching is worthwhile when:
    cost_of_N_cached_reads < cost_of_N_uncached_reads - write_premium
    """
    write_premium = cost(stable_tokens, CACHE_WRITE_PER_M - INPUT_PRICE_PER_M)
    savings_per_read = cost(stable_tokens, INPUT_PRICE_PER_M - CACHE_READ_PER_M)
    reads_to_break_even = write_premium / savings_per_read if savings_per_read > 0 else float("inf")
    print(f"\nBreak-even: need >{reads_to_break_even:.1f} cache reads per write")
    print(f"Actual reads per write: {calls_before_cache_expires}")
    return calls_before_cache_expires > reads_to_break_even


if __name__ == "__main__":
    print("PROMPT CACHE ECONOMICS ANALYSIS")
    print("=" * 60)

    # Scenario 1: Low traffic (50 calls/day) — caching may not help
    analyse_caching_scenario(
        stable_tokens=2000, variable_tokens=200, output_tokens=300, calls_per_day=50
    )

    # Scenario 2: Medium traffic (500 calls/day) — caching pays off
    analyse_caching_scenario(
        stable_tokens=5000, variable_tokens=300, output_tokens=400, calls_per_day=500
    )

    # Scenario 3: High traffic (5000 calls/day) — caching essential
    analyse_caching_scenario(
        stable_tokens=10000, variable_tokens=500, output_tokens=500, calls_per_day=5000
    )

    print("\n" + "="*60)
    print("BREAK-EVEN ANALYSIS")
    worth_it = is_caching_worth_it(stable_tokens=5000, calls_before_cache_expires=20)
    print(f"Caching worth it? {'YES ✓' if worth_it else 'NO ✗'}")
