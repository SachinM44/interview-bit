"""
Module 07 | Lesson 29: Prompt Versioning
==========================================
Concept: Track, compare, and roll back prompt changes like code.
Why it matters: Prompt changes break things silently — version control catches regressions.
Run: python 29_prompt_versioning.py
"""
import json
import hashlib
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv, find_dotenv; load_dotenv(find_dotenv())  # loads .env from project root
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"

# ── BEFORE — Prompt edited in-place, no history ───────────────────────────────
# Common pattern: one string variable, overwritten when you "improve" the prompt.
# Problem: you can't go back, can't compare, don't know when it changed or why.

SYSTEM_PROMPT = "You are a support agent. Help customers."  # edited many times, no history


# ── AFTER — Simple file-based prompt registry ─────────────────────────────────

PROMPTS_DIR = Path("prompts")

class PromptRegistry:
    """Lightweight prompt versioning — no extra dependencies needed."""

    def __init__(self, registry_path: Path = PROMPTS_DIR):
        self.path = registry_path
        self.path.mkdir(exist_ok=True)
        self.index_file = self.path / "index.json"
        self.index = self._load_index()

    def _load_index(self) -> dict:
        if self.index_file.exists():
            return json.loads(self.index_file.read_text())
        return {}

    def _save_index(self):
        self.index_file.write_text(json.dumps(self.index, indent=2))

    def save(self, name: str, system: str, notes: str = "") -> str:
        """Save a prompt version. Returns the version hash."""
        version = hashlib.sha256(system.encode()).hexdigest()[:8]
        timestamp = datetime.now().isoformat()

        # Write the prompt file
        prompt_file = self.path / f"{name}_{version}.json"
        prompt_file.write_text(json.dumps({
            "name": name, "version": version, "timestamp": timestamp,
            "notes": notes, "system": system
        }, indent=2))

        # Update index
        if name not in self.index:
            self.index[name] = []
        self.index[name].append({"version": version, "timestamp": timestamp, "notes": notes})
        self._save_index()
        print(f"  Saved {name} @ {version} ({timestamp[:10]}): {notes}")
        return version

    def load(self, name: str, version: str = "latest") -> dict:
        """Load a specific version (or latest)."""
        if name not in self.index or not self.index[name]:
            raise KeyError(f"No versions found for '{name}'")
        if version == "latest":
            version = self.index[name][-1]["version"]
        file = self.path / f"{name}_{version}.json"
        if not file.exists():
            raise FileNotFoundError(f"Version {version} of '{name}' not found")
        return json.loads(file.read_text())

    def history(self, name: str):
        """Print version history for a prompt."""
        versions = self.index.get(name, [])
        print(f"\nHistory for '{name}' ({len(versions)} versions):")
        for v in versions:
            print(f"  {v['version']} | {v['timestamp'][:16]} | {v['notes']}")

    def compare(self, name: str, v1: str, v2: str):
        """Compare two versions side by side."""
        p1 = self.load(name, v1)
        p2 = self.load(name, v2)
        print(f"\nComparing {v1} vs {v2}:")
        print(f"  v{v1}: {p1['system'][:100]}")
        print(f"  v{v2}: {p2['system'][:100]}")


def demo():
    registry = PromptRegistry()

    # Save prompt versions over time
    v1 = registry.save("support_agent",
        "You are a support agent. Help customers.",
        notes="initial version")

    v2 = registry.save("support_agent",
        "You are Aria, a friendly customer support agent for CloudBase. "
        "Be concise (under 80 words). Only help with billing and account issues.",
        notes="added persona, scope, word limit")

    v3 = registry.save("support_agent",
        "You are Aria, a friendly customer support agent for CloudBase. "
        "Be concise (under 80 words). Only help with billing and account issues. "
        "Always end with: 'Is there anything else I can help with?'",
        notes="added closing CTA based on A/B test results")

    # View history
    registry.history("support_agent")

    # Compare two versions
    registry.compare("support_agent", v1, v3)

    # Load and use a specific version
    latest = registry.load("support_agent")
    print(f"\nUsing version: {latest['version']} ({latest['notes']})")

    response = client.messages.create(
        model=MODEL, max_tokens=150,
        system=latest["system"],
        messages=[{"role": "user", "content": "Hi, I need help with my invoice."}]
    )
    print("Response:", response.content[0].text)

    # Load a previous version (for rollback)
    old = registry.load("support_agent", v1)
    print(f"\nRolled back to: {old['version']} — {old['notes']}")


# ── WHAT CHANGED ─────────────────────────────────────────────────────────────
# BEFORE: one variable, edited in-place → no history, no rollback, no comparison
# AFTER:
#   - Each save() creates an immutable versioned file
#   - SHA-256 hash detects if you're saving the same prompt twice
#   - history() shows what changed and when
#   - compare() shows the diff between any two versions
#   - load("latest") is the default; load(version=v1) enables rollback
# In production: store prompts in a DB or S3 with version metadata

if __name__ == "__main__":
    demo()
