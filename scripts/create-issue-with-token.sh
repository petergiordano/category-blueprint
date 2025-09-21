#!/bin/bash
# Create GitHub issue with token authentication
# Usage: GH_TOKEN='your_token' ./scripts/create-issue-with-token.sh "TYPE" "Title" "Body" "Phase" "Priority"

set -e

# Check for token
if [ -z "$GH_TOKEN" ]; then
    echo "❌ Error: GH_TOKEN environment variable not set"
    echo "Usage: GH_TOKEN='ghp_...' $0 TYPE TITLE BODY PHASE PRIORITY"
    exit 1
fi

TYPE=${1:-"FEAT"}
TITLE=${2:-"New Issue"}
BODY=${3:-"Issue description"}
PHASE=${4:-"Phase 6"}
PRIORITY=${5:-"Medium"}

# Map priority to label
case "$PRIORITY" in
    "High"|"high") PRIORITY_LABEL="priority-high" ;;
    "Low"|"low") PRIORITY_LABEL="priority-low" ;;
    *) PRIORITY_LABEL="priority-medium" ;;
esac

# Determine issue type label
case "$TYPE" in
    "BUG") TYPE_LABEL="bug" ;;
    *) TYPE_LABEL="enhancement" ;;
esac

echo "Creating issue with token authentication..."

# Create issue using token
ISSUE_URL=$(GH_TOKEN="$GH_TOKEN" gh issue create \
    --repo petergiordano/category-blueprint \
    --title "$TITLE" \
    --body "$BODY" \
    --label "$TYPE_LABEL" \
    --label "$PRIORITY_LABEL" \
    --label "$PHASE" \
    --label "status-todo" 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Issue created successfully: $ISSUE_URL"
else
    echo "❌ Failed to create issue"
    echo "Error: $ISSUE_URL"
    exit 1
fi