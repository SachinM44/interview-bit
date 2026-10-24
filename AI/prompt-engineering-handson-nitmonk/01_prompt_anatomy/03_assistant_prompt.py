from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

TASK = "Analyse the risks of deploying AI in healthcare."

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        messages=[{"role": "user", "content": TASK}]
    )
    print(response.content[0].text)

def after_force_json():
    response = client.messages.create(
        model=MODEL, max_tokens=400,
        system='Return ONLY a raw JSON object. Start with { and end with }. No markdown, no explanation.',
        messages=[{"role": "user", "content":
            'List the top 3 risks of deploying AI in healthcare. '
            'Format: {"risks": [{"name": "...", "description": "..."}]}'
        }]
    )
    print("Forced JSON output:")
    print(response.content[0].text)


def after_skip_preamble():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system="Start your response directly with the content. No introduction, no preamble, no 'Certainly!'",
        messages=[{"role": "user", "content":
            f"{TASK}\n\nFormat: numbered list starting with '1.'"}]
    )
    print(response.content[0].text)


def after_frame_tone():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system=(
            "You are a regulatory compliance expert. "
            "Always frame your analysis from a regulatory and legal risk perspective. "
            "Begin every response with the regulatory framing — no general overview first."
        ),
        messages=[{"role": "user", "content": TASK}]
    )
    print(response.content[0].text)


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: model decides its own format → inconsistent across runs
# Technique 1: system prompt instructs "Return ONLY raw JSON starting with {"
#              → equivalent to prefill, works on all Claude 4 models
# Technique 2: "Start directly with..." eliminates preamble without prefill
# Technique 3: role framing in system prompt locks the analytical lens
#
# Claude 4 note: assistant prefill (ending messages[] with an assistant turn)
#   is not supported. Use system prompt instructions to achieve the same control.


if __name__ == "__main__":
    print("BEFORE — No output steering"); print("="*50); before()
    print("\nAFTER  — Force JSON via system prompt"); print("="*50); after_force_json()
    print("\nAFTER  — Skip preamble"); print("="*50); after_skip_preamble()
    print("\nAFTER  — Lock analytical frame"); print("="*50); after_frame_tone()
