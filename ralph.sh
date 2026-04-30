#!/usr/bin/env bash
# Ralph loop runner. Reads PROMPT.md, sends to Claude Code headless,
# repeats until .ralph/STOP exists.
set -u

mkdir -p .ralph
LOG=".ralph/run-$(date +%Y%m%d-%H%M%S).log"

echo "Ralph loop starting. Log: $LOG"
echo "To stop cleanly: touch .ralph/STOP"
echo "To stop now:    Ctrl-C (or kill the tmux session)"
echo

ITER=0
while [ ! -f .ralph/STOP ]; do
  ITER=$((ITER+1))
  {
    echo
    echo "=================================================="
    echo "  iteration $ITER  —  $(date -Is)"
    echo "=================================================="
  } | tee -a "$LOG"

  cat PROMPT.md | claude -p --dangerously-skip-permissions 2>&1 | tee -a "$LOG"

  # Tiny pause so a runaway loop doesn't melt anything.
  sleep 10
done

echo "Stopped after $ITER iteration(s). Reason: $(cat .ralph/STOP)" | tee -a "$LOG"
