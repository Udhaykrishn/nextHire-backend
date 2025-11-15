#!/bin/bash

# Define directories or file types to exclude
EXCLUDE_PATTERNS=("filter" "middleware" "node_modules" "dist" "test" "spec")

# Function to check if a file should be excluded
should_exclude() {
  for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    if [[ "$1" == *"$pattern"* ]]; then
      return 0
    fi
  done
  return 1
}

# Get all changes (modified, added, deleted)
CHANGES=$(git status --porcelain)

# Loop through each change
while read -r LINE; do
  # Extract status and file path
  STATUS=${LINE:0:2}
  FILE=${LINE:3}

  # Skip excluded files
  if should_exclude "$FILE"; then
    echo "Skipping excluded file: $FILE"
    continue
  fi

  # Determine the type of change (feat, fix, chore, etc.)
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

  # Get the diff of the file to include in the commit message
  DIFF=$(git diff --cached "$FILE")

  # Create a commit message with details
  COMMIT_MESSAGE="$TYPE: update $FILE

  Status: $STATUS
  Details:
  $DIFF"

  # Add file to staging area
  git add "$FILE"

  # Commit with the generated message
  git commit -m "$COMMIT_MESSAGE"
done <<< "$CHANGES"