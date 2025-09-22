#!/bin/bash
# Create a new enhancement issue with smart automation
# Usage: ./create-enhancement-issue.sh "Enhancement Title" "Description" "Phase X" "Priority"

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Parse arguments
TITLE="$1"
DESCRIPTION="$2"
PHASE="${3:-$(detect_current_phase)}"
PRIORITY="${4:-Medium}"

# Validate arguments
if [[ -z "$TITLE" ]]; then
    log_error "Usage: $0 \"Enhancement Title\" \"Description\" [\"Phase X\"] [Priority]"
    echo ""
    echo "Example:"
    echo "  $0 \"Improve AI Response Speed\" \"Optimize AI API calls to reduce response latency\" \"Phase 6\" \"Medium\""
    exit 1
fi

if [[ -z "$DESCRIPTION" ]]; then
    log_error "Description is required"
    exit 1
fi

# Check GitHub CLI authentication
check_gh_auth

# Display what we're about to create
echo ""
log_info "=== Creating Enhancement Issue ==="
echo "Title: $TITLE"
echo "Description: $DESCRIPTION"
echo "Phase: $PHASE"
echo "Priority: $PRIORITY"
echo ""

# Confirm creation (only in interactive mode)
if [[ -t 0 ]]; then
    read -p "Create this enhancement issue? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Issue creation cancelled"
        exit 0
    fi
fi

# Create the issue
create_issue "ENH" "$TITLE" "$DESCRIPTION" "$PHASE" "$PRIORITY"

log_success "Enhancement issue creation completed!"