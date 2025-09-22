#!/bin/bash
# Create GitHub issue using REST API (no gh CLI required)
# Usage: GH_TOKEN='your_token' ./scripts/create-issue-api.sh "Title" "Body" "Phase 6" "High"

set -e

# Check for token
if [ -z "$GH_TOKEN" ]; then
    echo "❌ Error: GH_TOKEN environment variable not set"
    echo "Usage: GH_TOKEN='ghp_...' $0 TITLE BODY PHASE PRIORITY"
    exit 1
fi

TITLE=${1:-"New Issue"}
BODY=${2:-"Issue description"}
PHASE=${3:-"Phase 6"}
PRIORITY=${4:-"Medium"}

# Map priority to label
case "$PRIORITY" in
    "High"|"high") PRIORITY_LABEL="priority-high" ;;
    "Low"|"low") PRIORITY_LABEL="priority-low" ;;
    *) PRIORITY_LABEL="priority-medium" ;;
esac

# Create JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "title": "$TITLE",
  "body": "$BODY",
  "labels": ["enhancement", "$PRIORITY_LABEL", "$PHASE", "status-todo"]
}
EOF
)

echo "Creating issue via GitHub API..."

# Make API call
RESPONSE=$(curl -s -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/petergiordano/category-blueprint/issues \
  -d "$JSON_PAYLOAD")

# Extract issue number and URL
ISSUE_NUMBER=$(echo "$RESPONSE" | grep -o '"number":[0-9]*' | sed 's/"number"://')
ISSUE_URL=$(echo "$RESPONSE" | grep -o '"html_url":"[^"]*' | sed 's/"html_url":"//' | sed 's/"$//')

if [ -n "$ISSUE_URL" ]; then
    echo "✅ Issue #$ISSUE_NUMBER created successfully: $ISSUE_URL"
else
    echo "❌ Failed to create issue"
    echo "Response: $RESPONSE"
    exit 1
fi