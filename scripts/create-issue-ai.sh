#!/bin/bash
# Create any type of issue with AI-powered content generation
# Usage: ./create-issue-ai.sh "FEAT|ENH|BUG" "Title" "Description" "Phase X"

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Parse arguments
ISSUE_TYPE="$1"
TITLE="$2"
DESCRIPTION="$3"
PHASE="${4:-$(detect_current_phase)}"

# Validate arguments
if [[ -z "$ISSUE_TYPE" || -z "$TITLE" || -z "$DESCRIPTION" ]]; then
    log_error "Usage: $0 \"FEAT|ENH|BUG\" \"Title\" \"Description\" [\"Phase X\"]"
    echo ""
    echo "Examples:"
    echo "  $0 \"FEAT\" \"Smart Issue Templates\" \"Add AI-powered issue template generation\" \"Phase 6\""
    echo "  $0 \"ENH\" \"Improve API Performance\" \"Optimize API response times\" \"Phase 6\""
    echo "  $0 \"BUG\" \"Validation Error\" \"Fix empty results in JTBD validation\" \"Phase 6\""
    exit 1
fi

# Validate issue type
if [[ ! "$ISSUE_TYPE" =~ ^(FEAT|ENH|BUG)$ ]]; then
    log_error "Invalid issue type: $ISSUE_TYPE. Must be FEAT, ENH, or BUG"
    exit 1
fi

# Check GitHub CLI authentication
check_gh_auth

# Auto-detect priority based on issue type and keywords
detect_priority() {
    local desc="$1"
    local type="$2"
    
    # High priority indicators
    if [[ "$desc" =~ (critical|urgent|blocking|broken|crash|error|fail) ]] || [[ "$type" == "BUG" ]]; then
        echo "High"
        return
    fi
    
    # Low priority indicators
    if [[ "$desc" =~ (minor|cosmetic|nice.to.have|future|documentation) ]]; then
        echo "Low"
        return
    fi
    
    # Default to medium
    echo "Medium"
}

PRIORITY=$(detect_priority "$DESCRIPTION" "$ISSUE_TYPE")

# Display what we're about to create
echo ""
log_info "=== AI-Powered Issue Creation ==="
echo "Type: $ISSUE_TYPE"
echo "Title: $TITLE"
echo "Description: $DESCRIPTION"
echo "Phase: $PHASE"
echo "Auto-detected Priority: $PRIORITY"
echo ""

# AI Enhancement: Generate enhanced description if possible
enhance_description() {
    local original_desc="$1"
    local issue_type="$2"
    
    # For now, return original description
    # In the future, this could call Claude or other AI services
    # to expand the description with more details
    echo "$original_desc"
}

ENHANCED_DESCRIPTION=$(enhance_description "$DESCRIPTION" "$ISSUE_TYPE")

# Confirm creation (only in interactive mode)
if [[ -t 0 ]]; then
    read -p "Create this $ISSUE_TYPE issue? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Issue creation cancelled"
        exit 0
    fi
fi

# Create the issue
create_issue "$ISSUE_TYPE" "$TITLE" "$ENHANCED_DESCRIPTION" "$PHASE" "$PRIORITY"

log_success "$ISSUE_TYPE issue creation completed!"