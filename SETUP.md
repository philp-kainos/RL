# Ralph loop — Next.js in a Codespace

A starter kit for letting a coding agent grind through a backlog while you sleep.

## What's in this pack

| File | Purpose |
|---|---|
| `PROMPT.md` | The instruction sent to the agent every iteration. |
| `AGENT.md` | Standing rules the agent reads (stack, conventions, off-limits). |
| `specs/plan.md` | The backlog. Tick boxes get crossed off as work lands. |
| `ralph.sh` | The bash `while` loop. |
| `.devcontainer/devcontainer.json` | Boots the Codespace with Node 20, pnpm, and Claude Code pre-installed. |

## One-time setup

1. **Create a new GitHub repo** (private is fine).
2. **Drop these files into the repo root**, keeping the folder structure (`specs/plan.md`, `.devcontainer/devcontainer.json`).
3. **Scaffold Next.js into the same repo** (locally or in the Codespace):
   ```bash
   pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*"
   ```
   When it asks about overwriting existing files, say no for `PROMPT.md`/`AGENT.md`/`specs`/`ralph.sh`.
4. **Add Vitest + testing-library**:
   ```bash
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
   ```
   Then add a minimal `vitest.config.ts` and a `"test": "vitest"` script in `package.json`.
5. **Add `typecheck` script** to `package.json`: `"typecheck": "tsc --noEmit"`.
6. **Commit and push** to GitHub.

## Running the loop in a Codespace

1. On the GitHub repo page: **Code → Codespaces → Create codespace on main**.
2. Wait for the devcontainer to build (~2 min). Claude Code installs automatically.
3. In the Codespace terminal:
   ```bash
   claude login                 # one-time auth (browser flow)
   git checkout -b ralph/run-1  # work on a branch, never main
   chmod +x ralph.sh
   tmux new -s ralph
   ./ralph.sh
   ```
4. Detach from tmux: `Ctrl-b` then `d`. Close your laptop.
5. Reattach later: `tmux attach -t ralph`.

## Controlling the loop

| Want to... | Do this |
|---|---|
| Stop cleanly after current iteration | `touch .ralph/STOP` (in another terminal or via web editor) |
| Stop right now | `tmux kill-session -t ralph` |
| See progress | `git log --oneline ralph/run-1` or tail `.ralph/run-*.log` |
| Resume | delete `.ralph/STOP`, re-run `./ralph.sh` |

## Before you sleep — checklist

- [ ] Watched the first 3 iterations live and the agent is doing the right *shape* of work.
- [ ] You're on a branch, not `main`.
- [ ] `main` has a branch protection rule (no direct pushes, no force-push).
- [ ] Anthropic billing has a spend cap set.
- [ ] Backlog items in `specs/plan.md` are small (one commit each).
- [ ] Tests, lint, and typecheck all pass on the starting commit.

## When you wake up

1. `tmux attach -t ralph` — see where it got to.
2. `git log --oneline ralph/run-1` — scan commits.
3. Open a draft PR into `main`. Read the diff at human pace.
4. Cherry-pick / squash the good commits. Reset the rest.

## When it goes wrong (it will)

Common failure modes and fixes:

- **Agent loops on the same item forever** → the item is too big or ambiguous. Split it in `specs/plan.md`, reset the branch.
- **Tests pass but the feature is wrong** → tests aren't tight enough. Add a failing test for the real behaviour and let the loop fix it.
- **Agent invents new dependencies** → tighten `AGENT.md` ("no new deps unless the item names one").
- **Drive-by refactors creep in** → reinforce in `PROMPT.md` ("touch only files needed for THIS item").
- **Burned through API budget** → lower the cap, shorten `PROMPT.md`, smaller backlog items.

## Tweaking

- Want faster feedback? Drop `pnpm lint` from the `PROMPT.md` gate and run it only at PR time.
- Want stricter? Add `pnpm build` to the gate so SSR errors surface before commit.
- Want parallel grinding? Open two Codespaces, two branches, two slices of the backlog. They can't collide.
