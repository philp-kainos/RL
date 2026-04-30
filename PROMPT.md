Read specs/plan.md. Pick the FIRST unchecked item.

Implement just that item on the current branch:
- Follow the rules in AGENT.md.
- Add or update tests for the change.
- Run: pnpm lint && pnpm typecheck && pnpm test -- --run
- If anything fails, fix until all three pass. Do not move on with red.

When green:
- Tick the item in specs/plan.md (change "- [ ]" to "- [x]").
- git add -A
- git commit -m "<area>: <one-line summary>"
- git push

If specs/plan.md has no unchecked items, write "DONE" to .ralph/STOP and exit.

Constraints:
- Touch only files needed for THIS item. No drive-by refactors.
- No new dependencies unless the item explicitly calls for one.
- If the item is ambiguous, pick the smallest reasonable interpretation and note assumptions in the commit body.
- If you cannot complete the item in this iteration, leave it unchecked, commit any partial progress on a WIP branch, and exit. Do not loop on the same item forever.
