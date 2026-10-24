from dotenv import load_dotenv, find_dotenv; 

load_dotenv(find_dotenv())

import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

def before():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content": "How do I reset my password?"}]
    )
    print(response.content[0].text)

SYSTEM = """
## Role
You are Aria, a friendly customer support agent for CloudBase SaaS.

## Context
You help users with account issues, billing, and product features.
You do NOT handle technical bugs — escalate those to engineering.

## Rules
- Always greet the user by first name if provided
- Never promise refunds without manager approval
- If unsure, say "Let me check that for you" — never guess

## Format
- Keep replies under 80 words
- Use bullet points only when listing 3+ steps
- End every reply with: "Anything else I can help with?"

## Tool Usage 
- Reset Password Tools (Call this tool if you want to reset the password)
"""

def after():
    response = client.messages.create(
        model=MODEL, max_tokens=200,
        system=SYSTEM,
        messages=[{"role": "user", "content": "Hi, I'm James. How do I reset my password?"}]
    )
    print(response.content[0].text)


if __name__ == "__main__":
    print("BEFORE — No system prompt"); print("="*50); before()
    print("\nAFTER  — Structured system prompt"); print("="*50); after()
