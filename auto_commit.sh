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

  if [[ "$FILE" == *"dto"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"enum"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"interface"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"use-case"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"entity"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"schema"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"repository"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"mapper"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"module"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"controller"* ]]; then
    TYPE="feat"
  elif [[ "$FILE" == *"service"* ]]; then
    TYPE="feat"
  else
    TYPE="chore"
  fi

  DIFF=$(git diff --cached "$FILE")

  COMMIT_MESSAGE="$TYPE: update $FILE

  Status: $STATUS
  Details:
  $DIFF"

  git add "$FILE"

  git commit -m "$COMMIT_MESSAGE"
done <<< "$CHANGES"