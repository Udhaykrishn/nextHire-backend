#!/bin/bash

EXCLUDE_PATTERNS=("node_modules" "dist" "test" "spec")
LOG_FILE="commit-log.log"

# Initialize log file
echo "Commit log - $(date)" > "$LOG_FILE"
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

  # Generate AI commit message (ts-node output + capture stderr)
  COMMIT_MESSAGE=$(echo "$DIFF" | ts-node ./git-commit.ts 2> /tmp/ts_node_error.txt)
  TS_ERROR=$(cat /tmp/ts_node_error.txt)

  # If AI failed or returned empty message, skip committing
  if [[ -n "$TS_ERROR" || -z "$COMMIT_MESSAGE" ]]; then
    echo "Skipping file due to AI error or empty commit message: $FILE"
    echo "File: $FILE" >> "$LOG_FILE"
    if [[ -n "$TS_ERROR" ]]; then
      echo "Error: $TS_ERROR" >> "$LOG_FILE"
    else
      echo "Error: Empty commit message (possibly API limit or request rejected)" >> "$LOG_FILE"
    fi
    echo "-------------------------" >> "$LOG_FILE"
    continue
  fi

  # Commit the file if AI message is valid
  git add "$FILE"
  git commit -m "$COMMIT_MESSAGE"

done <<< "$CHANGES"

echo "Finished auto-commit. See $LOG_FILE for skipped files."
