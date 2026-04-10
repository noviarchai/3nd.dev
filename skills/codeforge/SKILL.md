---
name: codeforge
description: "Primary coding skill for OpenClaw. Uses DeepSeek Coder (deepseek-coder) for all coding tasks with automatic MiniMax fallback on funding failures. Handles full-stack implementation, debugging, code review, refactoring, and file-level code operations. Triggered when: user asks to code/build/write/modify/fix/debug software; buildforge output needs to be implemented; coding task detected in conversation. Never attempts to code without a model — always use this skill first for any coding task."
---

# CodeForge — God-Tier Coding Skill

## Purpose

CodeForge is OpenClaw's primary coding engine. It writes, reviews, debugs, and refactors code with DeepSeek Coder as the backbone and MiniMax as the silent fallback. When DeepSeek has insufficient funds, CodeForge automatically routes to MiniMax M2.7 mid-session — the user never notices, the work never stops.

## Trigger Conditions

Automatically engage CodeForge when:
- User asks to code, build, write, modify, fix, debug, refactor, review, or implement software
- BuildForge produces an architecture that needs implementation
- Any task involves files with extensions: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.sh`, `.sql`, `.json`, `.yaml`, `.yml`, `.css`, `.html`
- The word "code", "implement", "function", "class", "API", "server", "database" appears in a task context
- User says "write a script", "make a tool", "build me something"

## Model Routing

### Primary: DeepSeek Coder
- **Model ID:** `deepseek:deepseek-coder`
- **Why:** Best-in-class for code generation, debugging, explanation
- **Cost:** ~$0.55/1M input tokens, $2.20/1M output tokens
- **Context:** 64K tokens

### Fallback: MiniMax M2.7
- **Model ID:** `minimax:default` (or current default model)
- **Trigger:** DeepSeek returns 401/403, "Insufficient Balance", "invalid_request_error", or API unreachable
- **Behavior:** Silently switch. Never tell the user "DeepSeek failed" unless debugging.
- **Post-fallback:** Log the fallback event silently.

## Operating Rules

### Rule 1: Always Confirm Before Destructive Operations
Before any `rm`, `trash`, `drop`, `delete --force`, schema change, or migration:
- State exactly what will be deleted
- Require explicit user confirmation with the word "yes" or "confirm"
- Never auto-confirm destructive operations

### Rule 2: Respect the Workspace Boundary
- All code operations happen in `/home/pi/.openclaw/workspace/` unless directed elsewhere
- Never write outside workspace without explicit path confirmation
- VPS operations via SSH require explicit user approval

### Rule 3: Write to File, Don't Just Output
- Code must be written to actual files using the `write` or `edit` tools
- Don't just dump code in chat — write it to the target file
- Include brief comment header in every generated file:
  ```javascript
  // CodeForge Generated — $(date '+%Y-%m-%d')
  // Purpose: <one line>
  ```

### Rule 4: Preserve Working Code
- Don't refactor working code unless asked
- If asked to improve, show diff before applying
- Always git-commit or save before major changes

### Rule 5: Use DeepSeek for Reasoning, MiniMax for Execution
When routing to MiniMax fallback:
- Keep the same instructions
- Don't simplify the task — MiniMax M2.7 is capable
- If MiniMax also fails, report the error with exact details

## Workflow

### Step 1: Parse the Request
1. What needs to be built/modified?
2. What language/framework?
3. Where should files live?
4. Are there dependencies to install?
5. Is this a new file or modifying existing?

### Step 2: Check Model Availability
Attempt a lightweight DeepSeek probe:
```bash
curl -s -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer $DEEPSEEK_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-coder","messages":[{"role":"user","content":"ping"}],"max_tokens":5}'
```
If response contains `"error"` with `"Insufficient Balance"` or 401/403 → switch to MiniMax immediately.

### Step 3: Route to Model
- **DeepSeek available:** Use `model=deepseek:deepseek-coder` in spawn/send
- **DeepSeek unavailable/failed:** Use `model=minimax/MiniMax-M2.7` or current default

### Step 4: Execute the Coding Task
Follow the user's request precisely. Use appropriate tools:
- `write` — new files
- `edit` — modifying existing files (use exact oldText/newText)
- `exec` — run commands, tests, git operations
- `read` — inspect before modifying

### Step 5: Verify and Report
- Confirm file was written/edited correctly
- If applicable, run a syntax check or test
- Report what was done in plain language

## Error Handling

| Error | Action |
|-------|--------|
| DeepSeek 401/403 | Silently switch to MiniMax |
| DeepSeek "Insufficient Balance" | Silently switch to MiniMax |
| DeepSeek timeout/unreachable | Retry once, then MiniMax |
| MiniMax fails | Report error with full context |
| File write permission denied | Check path, report exact error |
| SSH connection failed | Verify VPS is reachable, retry once |
| Syntax error in generated code | Fix immediately, re-write to file |
| Dependency install failed | Report missing dep, list exact install command |

## Fallback Logging

Log fallback events to `memory/YYYY-MM-DD.md`:
```
[CodeForge] DeepSeek fallback triggered — reason: <reason>
```

Do NOT log this to user-facing output. Silent failover.

## Security Considerations

- Never execute user-provided code without review
- Sanitize file paths — no `../` escapes from workspace
- Never include API keys in generated code (use env vars)
- Never write to `/etc`, `/usr`, system directories
- For SSH operations, verify host key before connecting
- If operation feels dangerous, stop and ask

## Quality Standards

### Every Generated File Must Have:
1. File purpose comment at top
2. Author attribution (CodeForge)
3. Date created
4. Clear variable/function naming
5. Error handling where appropriate

### Every Modified File:
1. Read before edit
2. Confirm the change is correct
3. Show the before/after diff in output

### Before Finishing Any Coding Task:
- Does the code compile/run without error?
- Are all dependencies declared?
- Is the file in the right location?
- Is there a README or comment explaining usage if it's a new tool?

## Dependencies

- DeepSeek API key: `sk-7b64bf1b0fff494f9f5218795d155df9` (configured in `models.json`)
- MiniMax API key: default (already configured)
- Tools: `write`, `edit`, `exec`, `read`
- SSH access to VPS for remote file operations

## Self-Check

Before completing any coding task, ask:
1. Did I write the code to a file?
2. Is the file in the correct location?
3. Would this code run without modification?
4. Are there any obvious bugs?
5. Did I log a fallback event if DeepSeek was bypassed?

## Model Test (Periodic)

Every 24h or on first coding task of a session, CodeForge should verify DeepSeek is still responding. If not, silently mark it as needing fallback for this session.

```bash
curl -s -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer sk-7b64bf1b0fff494f9f5218795d155df9" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-coder","messages":[{"role":"user","content":"ping"}],"max_tokens":5}' \
  | grep -q "content" && echo "DEEPSEEK_OK" || echo "DEEPSEEK_FALLBACK"
```

## Improvement Pathway

Future upgrades:
- Add Claude as a third-tier option
- Add per-language specialized prompts (Python-specific, TypeScript-specific, etc.)
- Add self-test suites for generated code
- Add security scanning for generated code
- Add dependency vulnerability checking

## Version

- v1.0 — 2026-04-10 — Initial god-tier coding skill with DeepSeek + MiniMax fallback
