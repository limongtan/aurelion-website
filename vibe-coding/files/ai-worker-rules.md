# AI Worker Rules: Opus designs, Codex builds

Version 1 · 28 Nov 2026 · Aurelion

**Goal:** get the work done with the least paid quota. The most expensive brain (Claude Opus) only thinks and decides. Cheaper workers do the typing.

## Who does what

| Worker | Does | Never does |
|---|---|---|
| **Claude Opus** | Design choices, the design picture, writing short briefs, reviewing the short report + 1 contact sheet, talking to you, asking for merge OK | Reading or editing big code files, running long checks |
| **Codex, medium effort** | Builds: writes the code from one brief | Design choices |
| **Codex, low effort** | Tests, checks, load times, small fixes | Big builds |
| **Claude Sonnet** (helper) | Urgent builds when Codex is out of quota | Design choices |
| **Claude Haiku** (helper) | Urgent checks when Codex is out of quota: runs the check script, reports PASS/FAIL | Building |

## Call order (who gets the job first)

1. **Opus designs.** Collect all photos and one design picture first. You OK it. Then write ONE brief with all related changes grouped.
2. **Codex builds** at medium effort (checks at low effort).
3. **Codex out of quota, job can wait:** wait for the reset. A scheduled task restarts Codex then. This costs no Claude quota.
4. **Codex out of quota, job is urgent:** a small Claude helper continues from the brief + `progress.md`. Haiku for checks, Sonnet for builds.
5. **Opus reviews** only the short report and one contact sheet, then asks you before merging.

## If the main session isn't Opus

At the start, the session checks which model it runs on. A session can't change its own model; only you can, in the model menu. It can start a helper on a stronger model (Agent tool, `model: "opus"`) for one question.

| Main session is… | It may do itself | It must hand off |
|---|---|---|
| **Opus** | Design, briefs, reviews, talking to you | Builds → Codex medium; checks → Codex low (or a Haiku helper) |
| **Sonnet** | Briefs, reviews, small decisions | Builds → Codex. Big design choices: ask you to switch to Opus, or ask an Opus helper that one question |
| **Haiku** | Status, running check scripts, reading short reports, simple questions | Builds → Codex. Any design or judgment call: stop and say "This needs Opus. Switch the model in the menu, or should I ask an Opus helper?" |

Tip: start design chats on Opus. Use Haiku chats for status and checks.

## Commands

```bash
# Codex build (medium) and check (low). Always close stdin with < /dev/null.
codex exec --sandbox danger-full-access --skip-git-repo-check -C <folder> -c model_reasoning_effort="medium" "Read <rules file> first. <brief>" < /dev/null > build.log 2>&1
codex exec --sandbox danger-full-access --skip-git-repo-check -C <folder> -c model_reasoning_effort="low" "<check brief>" < /dev/null > check.log 2>&1

# Small Claude helper as a separate run (needs the claude CLI logged in once: run claude, type /login)
claude -p --model sonnet "Read jobs/<topic>/brief.md and progress.md, continue the job, write a short report." < /dev/null > out.md
claude -p --model haiku  "Run the check script and report PASS/FAIL in under 10 lines." < /dev/null > check.md
```

Inside a chat, Opus can also start a helper with the Agent tool and `model: "haiku"` or `model: "sonnet"`. Only the short answer comes back, so the chat stays small.

## Every job, so anyone can take over

- One topic = one job = one owner. Write the owner on the shared board before starting.
- Design picture + all photos agreed **before** the build. Small tweaks wait for the next build.
- Keep `jobs/<topic>/progress.md` current (5–10 lines: done, next, files touched, open problems). If a worker stops, the next one reads only the brief + progress.md and continues.
- Reports are short (under 25 lines). On a failure, read only the last ~20 log lines.
- Only one heavy job (headless browser, load test) at a time.

## The reminder (every session must do this)

At the start of every task that builds or checks something, Claude writes one line before starting:

> **Worker plan:** design = Opus · build = Codex medium · checks = Codex low · if Codex is out: wait, or Haiku/Sonnet if urgent.

If Claude is about to edit code itself, it must say why (for example, "a 1-line fix, cheaper than a brief") or ask you first.

## Install on any computer (so every Claude session follows it)

1. Save this file as `~/.claude/WORKER_RULES.md`
   - Windows: `C:\Users\<you>\.claude\WORKER_RULES.md`
   - Mac: `/Users/<you>/.claude/WORKER_RULES.md`
2. Open `~/.claude/CLAUDE.md` (create it if it's missing) and add these two lines:
   ```
   # Must follow in every session
   @WORKER_RULES.md
   ```
   Claude loads `~/.claude/CLAUDE.md` in **every** session on that computer, in every folder. The `@` line pulls in this file.
3. Optional but recommended: a start-of-session reminder. In `~/.claude/settings.json`, add:
   ```json
   "hooks": {
     "SessionStart": [{ "hooks": [{ "type": "command",
       "command": "echo 'Reminder: follow ~/.claude/WORKER_RULES.md. Opus designs, Codex builds (medium), Codex checks (low), out of quota = wait or Haiku/Sonnet if urgent. Write the Worker plan line first.'" }] }]
   }
   ```
4. Install Codex (`npm install -g @openai/codex`) and log in once with `codex login`. Log in to the Claude CLI once: run `claude`, type `/login`.
5. Test: open a new Claude session and ask *"What are your worker rules?"* It should repeat the call order.

### Or paste this prompt into Claude Code and let it install the rules

```
Install my AI worker rules. Save the file I attached as ~/.claude/WORKER_RULES.md.
Add the lines "# Must follow in every session" and "@WORKER_RULES.md" to ~/.claude/CLAUDE.md
(create the file if it's missing; keep anything already there). Add the SessionStart reminder
hook from section "Install" step 3 to ~/.claude/settings.json without removing existing settings.
Then tell me what you changed and how to test it.
```

## Measure it (one week)

- After each job, add one line to `usage_log.csv`: date, topic, worker, model, effort, tokens, minutes. Codex prints tokens used at the end of a run. `claude -p --output-format json` shows usage. Agent helpers report their token count.
- Once a day, note the usage % on the Claude usage page and Codex's `/status`.
- After 7 days, compare with the week before. Keep only what the numbers support.
