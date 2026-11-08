---
name: system-prompts-intelligence
description: Reverse-engineered production system prompts and agent design patterns from Anthropic (Claude 3.5/3.7), Cursor, DeepSeek, Google Gemini, OpenAI, Perplexity, and xAI. Use to benchmark, inspect, and adopt world-class agentic instruction architecture, tool-calling rigor, and behavioral constraints.
---

# System Prompts Intelligence & Production Agent Architecture

This skill provides direct access to analyzed system prompts from the world's frontier AI labs and coding assistants (Anthropic, Cursor, Google, DeepSeek, OpenAI).

## 1. Key Production Architectural Patterns

### Anthropic Claude 3.5 & 3.7 Sonnet Patterns
- **Tone & Style**: Direct, concise, factual, no sycophancy, no meta-apologies.
- **Tool Protocol**: Emit tool calls decisively; avoid talking about calling tools—just call them.
- **Surgical Edits**: Minimal diffs that preserve whitespace, comments, and project idioms.
- **Anti-Hallucination**: Never confirm completion or tests without inspecting actual output logs.

### Cursor Agent Patterns
- **Rule Hierarchy**: System instructions > User project rules (.cursorrules / AGENTS.md) > Prompt context.
- **File Targeting**: Always read existing files before editing; verify symbol references.
- **Verification Loop**: Run terminal builds and diagnostics before handing control back to the user.

### OpenAI & DeepSeek Patterns
- **Deep Structured Chain-of-Thought**: Explicit phase separation between comprehension, divergence, planning, execution, and verification.
- **Failure Recovery**: When a command or tool fails, diagnose the exact root cause instead of blindly retrying the same call.

## 2. Directory References
Exhaustive leaked prompt sources for all major providers are stored in `references/` for granular study and benchmarking.
