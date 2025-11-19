#!/bin/bash

EXCLUDE_PATTERNS=("node_modules" "dist" "test" "spec")
LOG_FILE="commit-log.log"

RUN_TIME=$(date +"%A %d %B %Y %I:%M:%S %p %Z")

echo "" >> "$LOG_FILE"
echo "Commit log - $RUN_TIME" >> "$LOG_FILE"
echo "-------------------------" >> "$LOG_FILE"

should_exclude() {
  for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    if [[ "$1" == *"$pattern"* ]]; then
      return 0
    fi
  done
  return 1
}

CHANGES=$(git status --porcelain)

while read -r LINE; do
  STATUS=${LINE:0:2}
  FILE=${LINE:3}

  if should_exclude "$FILE"; then
    echo "Skipping excluded file: $FILE"
    continue
  fi

  DIFF=$(git diff --cached "$FILE")

  COMMIT_MESSAGE=$(echo "$DIFF" | ts-node ./git-commit.ts 2> /tmp/ts_node_error.txt)
  TS_ERROR=$(cat /tmp/ts_node_error.txt)

  if [[ -n "$TS_ERROR" || -z "$COMMIT_MESSAGE" ]]; then
    ERROR_TIME=$(date +"%A %d %B %Y %I:%M:%S %p %Z")
    echo "Skipping file due to AI error or empty commit message: $FILE"
    echo "Time: $ERROR_TIME" >> "$LOG_FILE"
    echo "File: $FILE" >> "$LOG_FILE"
    if [[ -n "$TS_ERROR" ]]; then
      echo "Error: $TS_ERROR" >> "$LOG_FILE"
    else
      echo "Error: Empty commit message (possibly API limit or request rejected)" >> "$LOG_FILE"
    fi
    echo "-------------------------" >> "$LOG_FILE"
    continue
  fi

  git add "$FILE"
  git commit -m "$COMMIT_MESSAGE"

done <<< "$CHANGES"

echo "Finished auto-commit. See $LOG_FILE for skipped files."
