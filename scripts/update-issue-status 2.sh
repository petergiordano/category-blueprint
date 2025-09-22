#!/bin/bash
# Update the status of an existing GitHub issue
# Usage: ./update-issue-status.sh "ISSUE_NUMBER" "STATUS"

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Parse arguments
ISSUE_NUMBER="$1"
NEW_STATUS="$2"

# Validate arguments
if [[ -z "$ISSUE_NUMBER" || -z "$NEW_STATUS" ]]; then
    log_error "Usage: $0 \"ISSUE_NUMBER\" \"STATUS\""
    echo ""
    echo "Valid statuses:"
    echo "  - status-todo"
    echo "  - status-in-progress"  
    echo "  - status-complete"
    echo ""
    echo "Examples:"
    echo "  $0 \"42\" \"status-in-progress\""
    echo "  $0 \"FEAT-001\" \"status-complete\""
    exit 1
fi

# Validate status
VALID_STATUSES=("status-todo" "status-in-progress" "status-complete")
if [[ ! " ${VALID_STATUSES[@]} " =~ " ${NEW_STATUS} " ]]; then
    log_error "Invalid status: $NEW_STATUS"
    echo "Valid statuses: ${VALID_STATUSES[*]}"
    exit 1
fi

# Check GitHub CLI authentication
check_gh_auth

# Extract issue number if it's in FEAT-001 format
ACTUAL_ISSUE_NUMBER="$ISSUE_NUMBER"
if [[ "$ISSUE_NUMBER" =~ ^(FEAT|ENH|BUG)-[0-9]+$ ]]; then
    log_info "Looking up issue number for ID: $ISSUE_NUMBER"
    # Find the actual GitHub issue number by searching for the title
    ACTUAL_ISSUE_NUMBER=$(gh issue list --repo "$REPO" --state all --limit 1000 --json number,title \
        --jq ".[] | select(.title | contains(\"[$ISSUE_NUMBER]:\")) | .number")
    
    if [[ -z "$ACTUAL_ISSUE_NUMBER" ]]; then
        log_error "Could not find issue with ID: $ISSUE_NUMBER"
        exit 1
    fi
    
    log_info "Found GitHub issue #$ACTUAL_ISSUE_NUMBER for ID: $ISSUE_NUMBER"
fi

# Display what we're about to do
echo ""
log_info "=== Updating Issue Status ==="
echo "Issue: #$ACTUAL_ISSUE_NUMBER"
echo "New Status: $NEW_STATUS"
echo ""

# Confirm update (only in interactive mode)
if [[ -t 0 ]]; then
    read -p "Update issue status? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Status update cancelled"
        exit 0
    fi
fi

# Update the issue status
update_issue_status "$ACTUAL_ISSUE_NUMBER" "$NEW_STATUS"

log_success "Issue status update completed!"