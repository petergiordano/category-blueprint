#!/bin/bash
# Link related GitHub Issues with clear relationship indicators
# Usage: ./link-related-issues.sh "parent-issue-id" "child-issue-id" [relationship-type]

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Parse arguments
PARENT_ISSUE="$1"
CHILD_ISSUE="$2"
RELATIONSHIP_TYPE="${3:-depends-on}"

# Validate arguments
if [[ -z "$PARENT_ISSUE" || -z "$CHILD_ISSUE" ]]; then
    log_error "Usage: $0 \"parent-issue-id\" \"child-issue-id\" [relationship-type]"
    echo ""
    echo "Relationship Types:"
    echo "  depends-on    : Child depends on parent (default)"
    echo "  blocks        : Parent blocks child"
    echo "  related-to    : General relationship"
    echo "  epic          : Child is part of parent epic"
    echo "  subtask       : Child is subtask of parent"
    echo ""
    echo "Examples:"
    echo "  $0 \"FEAT-001\" \"FEAT-002\" \"depends-on\"     # FEAT-002 depends on FEAT-001"
    echo "  $0 \"FEAT-001\" \"BUG-001\" \"blocks\"          # BUG-001 blocks FEAT-001"
    echo "  $0 \"EPIC-001\" \"FEAT-001\" \"epic\"           # FEAT-001 is part of EPIC-001"
    exit 1
fi

# Check GitHub CLI authentication
check_gh_auth

# Function to get GitHub issue number from feature ID
get_github_issue_number() {
    local feature_id="$1"
    
    local issue_number=$(gh issue list --repo "$REPO" --state all --limit 1000 --json number,title \
        --jq ".[] | select(.title | contains(\"[$feature_id]:\")) | .number")
    
    if [[ -z "$issue_number" ]]; then
        log_error "Could not find GitHub issue for feature ID: $feature_id"
        return 1
    fi
    
    echo "$issue_number"
}

# Get GitHub issue numbers
log_info "Looking up GitHub issue numbers..."

PARENT_ISSUE_NUM=$(get_github_issue_number "$PARENT_ISSUE")
CHILD_ISSUE_NUM=$(get_github_issue_number "$CHILD_ISSUE")

if [[ -z "$PARENT_ISSUE_NUM" || -z "$CHILD_ISSUE_NUM" ]]; then
    log_error "Could not find both issues"
    exit 1
fi

log_info "Found issues:"
echo "  $PARENT_ISSUE → GitHub Issue #$PARENT_ISSUE_NUM"
echo "  $CHILD_ISSUE → GitHub Issue #$CHILD_ISSUE_NUM"

# Create relationship comments
case $RELATIONSHIP_TYPE in
    "depends-on")
        PARENT_COMMENT="🔗 **Dependency**: Issue #$CHILD_ISSUE_NUM ([$CHILD_ISSUE]) depends on this issue"
        CHILD_COMMENT="⚠️ **Blocked by**: This issue depends on #$PARENT_ISSUE_NUM ([$PARENT_ISSUE]) - must be completed first"
        ;;
    "blocks")
        PARENT_COMMENT="🚫 **Blocking**: This issue is blocked by #$CHILD_ISSUE_NUM ([$CHILD_ISSUE])"
        CHILD_COMMENT="🔗 **Blocking**: This issue blocks #$PARENT_ISSUE_NUM ([$PARENT_ISSUE])"
        ;;
    "related-to")
        PARENT_COMMENT="🔗 **Related**: See related issue #$CHILD_ISSUE_NUM ([$CHILD_ISSUE])"
        CHILD_COMMENT="🔗 **Related**: See related issue #$PARENT_ISSUE_NUM ([$PARENT_ISSUE])"
        ;;
    "epic")
        PARENT_COMMENT="📋 **Epic includes**: Issue #$CHILD_ISSUE_NUM ([$CHILD_ISSUE]) is part of this epic"
        CHILD_COMMENT="📋 **Epic**: This issue is part of epic #$PARENT_ISSUE_NUM ([$PARENT_ISSUE])"
        ;;
    "subtask")
        PARENT_COMMENT="📝 **Subtask**: Issue #$CHILD_ISSUE_NUM ([$CHILD_ISSUE]) is a subtask of this issue"
        CHILD_COMMENT="📝 **Parent task**: This is a subtask of #$PARENT_ISSUE_NUM ([$PARENT_ISSUE])"
        ;;
    *)
        log_error "Unknown relationship type: $RELATIONSHIP_TYPE"
        exit 1
        ;;
esac

# Display relationship being created
echo ""
log_info "=== Creating Issue Relationship ==="
echo "Relationship: $PARENT_ISSUE ($RELATIONSHIP_TYPE) $CHILD_ISSUE"
echo ""
echo "Parent Issue #$PARENT_ISSUE_NUM will get comment:"
echo "  $PARENT_COMMENT"
echo ""
echo "Child Issue #$CHILD_ISSUE_NUM will get comment:"
echo "  $CHILD_COMMENT"
echo ""

# Confirm relationship creation (only in interactive mode)
if [[ -t 0 ]]; then
    read -p "Create this relationship? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Relationship creation cancelled"
        exit 0
    fi
fi

# Add relationship comments to both issues
log_info "Adding relationship comments..."

# Comment on parent issue
gh issue comment "$PARENT_ISSUE_NUM" --repo "$REPO" --body "$PARENT_COMMENT"
if [[ $? -eq 0 ]]; then
    log_success "Added relationship comment to parent issue #$PARENT_ISSUE_NUM"
else
    log_error "Failed to comment on parent issue"
    exit 1
fi

# Comment on child issue  
gh issue comment "$CHILD_ISSUE_NUM" --repo "$REPO" --body "$CHILD_COMMENT"
if [[ $? -eq 0 ]]; then
    log_success "Added relationship comment to child issue #$CHILD_ISSUE_NUM"
else
    log_error "Failed to comment on child issue"
    exit 1
fi

# Add relationship labels for easier filtering
log_info "Adding relationship labels..."

case $RELATIONSHIP_TYPE in
    "depends-on")
        gh issue edit "$PARENT_ISSUE_NUM" --repo "$REPO" --add-label "has-dependents" 2>/dev/null || true
        gh issue edit "$CHILD_ISSUE_NUM" --repo "$REPO" --add-label "has-dependencies" 2>/dev/null || true
        ;;
    "epic")
        gh issue edit "$PARENT_ISSUE_NUM" --repo "$REPO" --add-label "epic" 2>/dev/null || true
        gh issue edit "$CHILD_ISSUE_NUM" --repo "$REPO" --add-label "epic-item" 2>/dev/null || true
        ;;
    "subtask")
        gh issue edit "$PARENT_ISSUE_NUM" --repo "$REPO" --add-label "has-subtasks" 2>/dev/null || true
        gh issue edit "$CHILD_ISSUE_NUM" --repo "$REPO" --add-label "subtask" 2>/dev/null || true
        ;;
esac

echo ""
log_success "Issue relationship created successfully!"
echo ""
log_info "View the relationship:"
echo "  Parent: https://github.com/$REPO/issues/$PARENT_ISSUE_NUM"
echo "  Child:  https://github.com/$REPO/issues/$CHILD_ISSUE_NUM"
echo ""
log_info "Filter related issues:"
echo "  All epics: gh issue list --repo $REPO --label epic"
echo "  Dependencies: gh issue list --repo $REPO --label has-dependencies"
echo "  Subtasks: gh issue list --repo $REPO --label subtask"