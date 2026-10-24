# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A complete prompt engineering course delivered as 39 standalone Python files across 10 modules. Each file shows a **BEFORE** (naive) and **AFTER** (engineered) side by side with inline annotations. Ends with a production-grade capstone agent that combines all concepts.

## Setup

```bash
pip install anthropic pydantic jinja2
export ANTHROPIC_API_KEY="your-key-here"
```

Run any lesson directly:
```bash
python 01_prompt_anatomy/01_system_prompt.py
python 10_capstone/39_enterprise_support_agent.py
```

## Course Map

| Module | Folder | Topics |
|--------|--------|--------|
| 01 | `01_prompt_anatomy/` | System Prompt, User Prompt, Assistant Prompt (Prefilling) |
| 02 | `02_prompting_techniques/` | XML Prompting, Zero-Shot, Few-Shot, Positive vs Negative, Delimiters, Reasoning Strategies |
| 03 | `03_structured_output/` | Structured Output, JSON Schema, Pydantic, Validation & Repair |
| 04 | `04_tool_calling/` | Tool Calling, Function Calling, Schemas & Parameters, Tool Selection, Errors & Retries, Architecture, Security |
| 05 | `05_advanced_prompting/` | Prompt Chaining, Task Decomposition, Prompt Templates, Instruction Hierarchy |
| 06 | `06_context_and_state/` | Context Engineering, Conversation as State |
| 07 | `07_caching_and_versioning/` | Prompt Cache, Cache Economics, Prompt Versioning |
| 08 | `08_evaluation_and_optimization/` | Prompt Evaluation, Prompt Optimization |
| 09 | `09_security/` | Injection, Jailbreaks, Guardrails, Direct vs Indirect Injection, Data Exfiltration, Injection ≠ Jailbreak, Defense-in-Depth |
| 10 | `10_capstone/` | Enterprise Support Agent (all concepts combined) |

## Code Conventions

- SDK: `anthropic` only
- Model: `claude-sonnet-4-6` in all files
- API key: `os.environ["ANTHROPIC_API_KEY"]` — never hardcoded
- Every file runs standalone with `python <path/file.py>`
- Dependencies beyond stdlib: `anthropic`, `pydantic`, `jinja2`

## AI Agent

Open Claude Code inside this folder. The `prompt-engineer` agent (`.claude/agents/prompt-engineer.md`) is scoped to this project.

Use it to:
- **Generate / fix a lesson**: "Generate lesson 08 tool use"
- **Explain a concept**: "Explain indirect injection from lesson 35"
- **Improve a prompt**: "Here's my prompt — make it better: [paste]"
- **Add an example**: "Add a new example to lesson 06"
- **Get a quiz**: "5 practice questions for module 04"
- **Compare topics**: "What's the difference between lesson 32 and 33?"
