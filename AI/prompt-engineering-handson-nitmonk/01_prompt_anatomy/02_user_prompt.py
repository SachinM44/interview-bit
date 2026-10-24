from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

SYSTEM = "You are a senior Python developer. Give direct, accurate answers."

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=300,
        system=SYSTEM,
        messages=[{"role": "user", "content": "How do I handle errors in Python?"}]
    )
    print(response.content[0].text)

def after():
    user_prompt = """
Task: Show me how to handle HTTP timeout errors when calling an external API.

Context:
- I'm using the `requests` library
- The API sometimes takes >10 seconds to respond
- This runs in a FastAPI background task — exceptions must be caught, not raised

Constraints:
- Use try/except (not contextlib.suppress)
- Log the error with the `logging` module
- Return a fallback value of None on timeout

Output format: Runnable Python code snippet with inline comments explaining each step.
"""
    response = client.messages.create(
        model=MODEL, max_tokens=500,
        system=SYSTEM,
        messages=[{"role": "user", "content": user_prompt}]
    )
    print(response.content[0].text)

if __name__ == "__main__":
    print("BEFORE — Vague user prompt"); print("="*50); before()
    print("\nAFTER  — Structured user prompt"); print("="*50); after()
