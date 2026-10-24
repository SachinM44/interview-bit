"""
Module 06 | Lesson 26: Conversation as State
=============================================
Concept: The messages[] array IS your application state — manage it deliberately.
Why it matters: Unmanaged conversation history grows unbounded and degrades quality.
Run: python 26_conversation_as_state.py
"""
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"
MAX_HISTORY_TURNS = 6   # keep last N user+assistant pairs


# ── BEFORE — Append forever, never clean up ───────────────────────────────────

class NaiveChatbot:
    def __init__(self):
        self.messages = []

    def chat(self, user_input: str) -> str:
        self.messages.append({"role": "user", "content": user_input})
        response = client.messages.create(
            model=MODEL, max_tokens=200,
            messages=self.messages
        )
        reply = response.content[0].text
        self.messages.append({"role": "assistant", "content": reply})
        # Problem: messages grows forever → more expensive, slower, hits context limit
        print(f"  [Naive] History length: {len(self.messages)} messages")
        return reply


# ── AFTER — Sliding window with summary ───────────────────────────────────────

class ManagedChatbot:
    def __init__(self, system: str, max_turns: int = MAX_HISTORY_TURNS):
        self.system = system
        self.max_turns = max_turns
        self.messages = []
        self.summary = ""       # compressed memory of older turns

    def _trim(self):
        """Keep only the last max_turns pairs. Summarise dropped turns."""
        max_messages = self.max_turns * 2  # each turn = user + assistant
        if len(self.messages) > max_messages:
            to_drop = self.messages[:-max_messages]
            self.messages = self.messages[-max_messages:]
            self._summarise_dropped(to_drop)

    def _summarise_dropped(self, dropped: list[dict]):
        """Compress old turns into a summary injected into system prompt."""
        history_text = "\n".join(
            f"{m['role'].upper()}: {m['content'][:100]}" for m in dropped
        )
        response = client.messages.create(
            model=MODEL, max_tokens=150,
            messages=[{"role": "user", "content":
                f"Summarise this conversation in 2 sentences for context:\n{history_text}"}]
        )
        self.summary = response.content[0].text.strip()
        print(f"  [Managed] Summarised {len(dropped)} dropped messages")

    def _build_system(self) -> str:
        if self.summary:
            return f"{self.system}\n\nEarlier conversation summary: {self.summary}"
        return self.system

    def chat(self, user_input: str) -> str:
        self.messages.append({"role": "user", "content": user_input})
        response = client.messages.create(
            model=MODEL, max_tokens=200,
            system=self._build_system(),
            messages=self.messages
        )
        reply = response.content[0].text
        self.messages.append({"role": "assistant", "content": reply})
        self._trim()
        print(f"  [Managed] Active messages: {len(self.messages)} | Summary: {'yes' if self.summary else 'no'}")
        return reply


# ── AFTER — Injecting structured state ────────────────────────────────────────
# Instead of relying on conversation history to remember facts,
# extract and store them explicitly, inject as structured state.

class StatefulChatbot:
    def __init__(self):
        self.state = {}         # extracted facts: {name, issue, tier, ...}
        self.messages = []

    def _extract_state(self, user_input: str):
        """Extract key facts from the user's message to track them explicitly."""
        import json, re
        response = client.messages.create(
            model=MODEL, max_tokens=100,
            system='Extract any of: name, product, issue, account_tier from the message. Return JSON only with found keys. {} if nothing found.',
            messages=[{"role": "user", "content": user_input}]
        )
        raw = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content[0].text.strip())
        try:
            extracted = json.loads(raw)
            self.state.update({k: v for k, v in extracted.items() if v})
        except Exception:
            pass

    def chat(self, user_input: str) -> str:
        self._extract_state(user_input)
        state_text = " | ".join(f"{k}: {v}" for k, v in self.state.items()) if self.state else "none"
        self.messages.append({"role": "user", "content": user_input})

        response = client.messages.create(
            model=MODEL, max_tokens=200,
            system=f"You are a support agent. Known facts about this customer: {state_text}",
            messages=self.messages[-6:]   # always trim to last 3 turns
        )
        reply = response.content[0].text
        self.messages.append({"role": "assistant", "content": reply})
        print(f"  [Stateful] State: {self.state}")
        return reply


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# Naive: messages[] grows forever → context overflow, cost explodes
# Managed: sliding window + summary → bounded cost, retains gist of older context
# Stateful: extract facts → inject as structured state → never lose key facts even after trim

if __name__ == "__main__":
    TURNS = [
        "Hi, I'm Priya. I'm on the Enterprise plan.",
        "My SSO integration broke after yesterday's update.",
        "I've already tried clearing cache and reinstalling the plugin.",
        "Can you escalate this? It's affecting 200 users.",
    ]

    print("NAIVE CHATBOT"); print("="*50)
    naive = NaiveChatbot()
    for turn in TURNS:
        reply = naive.chat(turn)
        print(f"  User: {turn}\n  Bot: {reply[:80]}...\n")

    print("\nMANAGED CHATBOT (sliding window + summary)"); print("="*50)
    managed = ManagedChatbot("You are a CloudBase support agent.", max_turns=2)
    for turn in TURNS:
        reply = managed.chat(turn)
        print(f"  User: {turn}\n  Bot: {reply[:80]}...\n")
