#!/bin/bash

EXCLUDE_PATTERNS=("node_modules" "dist" "test" "spec")

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

  # Call TypeScript helper via ts-node
  COMMIT_MESSAGE=$(echo "$DIFF" | ts-node ./git-commit.ts)

  git add "$FILE"
  git commit -m "$COMMIT_MESSAGE"
done <<< "$CHANGES"
