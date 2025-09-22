#!/bin/bash
# Create a new feature issue with smart automation
# Usage: ./create-feature-issue.sh "Feature Title" "Description" "Phase X" "Priority"

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
    log_error "Usage: $0 \"Feature Title\" \"Description\" [\"Phase X\"] [Priority]"
    echo ""
    echo "Example:"
    echo "  $0 \"AI-Powered Report Generator\" \"Add automated report generation with AI analysis\" \"Phase 6\" \"High\""
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
log_info "=== Creating Feature Issue ==="
echo "Title: $TITLE"
echo "Description: $DESCRIPTION" 
echo "Phase: $PHASE"
echo "Priority: $PRIORITY"
echo ""

# Confirm creation (only in interactive mode)
if [[ -t 0 ]]; then
    read -p "Create this feature issue? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Issue creation cancelled"
        exit 0
    fi
fi

# Create the issue
create_issue "FEAT" "$TITLE" "$DESCRIPTION" "$PHASE" "$PRIORITY"

log_success "Feature issue creation completed!"