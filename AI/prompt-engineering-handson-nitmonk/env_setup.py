"""
Shared env loader — imported by all lesson files.
Place your ANTHROPIC_API_KEY in the .env file in this directory.
"""
from pathlib import Path
from dotenv import load_dotenv
import os

# Load .env from the project root (works regardless of which subfolder you run from)
_root = Path(__file__).parent
load_dotenv(_root / ".env")

if not os.environ.get("ANTHROPIC_API_KEY"):
    raise EnvironmentError(
        "ANTHROPIC_API_KEY not set.\n"
        f"Edit {_root / '.env'} and replace 'your-api-key-here' with your real key."
    )
