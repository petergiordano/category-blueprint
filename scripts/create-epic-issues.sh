#!/bin/bash
# Create an epic issue with related feature/enhancement/bug issues
# Usage: ./create-epic-issues.sh "Epic Title" "Epic Description" "Phase X" [components...]

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Parse arguments
EPIC_TITLE="$1"
EPIC_DESCRIPTION="$2"
PHASE="${3:-$(detect_current_phase)}"
shift 3 # Remove first 3 args, rest are components

COMPONENT_LIST=("$@")

# Validate arguments
if [[ -z "$EPIC_TITLE" || -z "$EPIC_DESCRIPTION" ]]; then
    log_error "Usage: $0 \"Epic Title\" \"Epic Description\" \"Phase X\" [component1] [component2] ..."
    echo ""
    echo "Example:"
    echo "  $0 \"User Authentication System\" \"Complete user auth with login, signup, and session management\" \"Phase 3\" \"Login Component\" \"Signup Component\" \"Session Management\""
    echo ""
    echo "This will create:"
    echo "  - 1 EPIC issue for the overall epic"
    echo "  - 1 FEAT issue for each component"
    echo "  - Automatic linking between epic and features"
    exit 1
fi

# Check GitHub CLI authentication
check_gh_auth

# Display what will be created
echo ""
log_info "=== Epic Issue Creation Plan ==="
echo "Epic Title: $EPIC_TITLE"
echo "Epic Description: $EPIC_DESCRIPTION"
echo "Phase: $PHASE"
echo "Components to create: ${#COMPONENT_LIST[@]}"

if [[ ${#COMPONENT_LIST[@]} -gt 0 ]]; then
    echo ""
    echo "Feature Issues to create:"
    for i in "${!COMPONENT_LIST[@]}"; do
        local feat_num=$((i + 1))
        printf "  FEAT-%03d: %s\n" "$feat_num" "${COMPONENT_LIST[$i]}"
    done
fi

echo ""

# Confirm creation (only in interactive mode)
if [[ -t 0 ]]; then
    read -p "Create this epic with ${#COMPONENT_LIST[@]} feature issues? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Epic creation cancelled"
        exit 0
    fi
fi

# Create the epic issue first
log_info "Creating epic issue..."

# Generate epic description with component checklist
EPIC_BODY=$(cat << EOF
## Epic Overview
$EPIC_DESCRIPTION

## Components in this Epic
EOF
)

if [[ ${#COMPONENT_LIST[@]} -gt 0 ]]; then
    EPIC_BODY+="\n\n### Feature Components"
    for component in "${COMPONENT_LIST[@]}"; do
        EPIC_BODY+="\n- [ ] $component"
    done
    
    EPIC_BODY+="\n\n*Individual GitHub Issues will be created for each component and linked to this epic*"
fi

EPIC_BODY+="\n\n## Epic Completion Criteria
- [ ] All component features implemented and tested
- [ ] Integration testing completed
- [ ] Documentation updated
- [ ] Epic milestone achieved

## Related Issues
*Component issues will be linked here automatically*

---
*Epic created with automated component generation*"

# Create the epic issue
EPIC_ISSUE_URL=$(gh issue create \
    --repo "$REPO" \
    --title "[EPIC-$(get_next_id "FEAT")]: $EPIC_TITLE" \
    --body "$(echo -e "$EPIC_BODY")" \
    --label "epic,$PHASE,status-todo" \
    --assignee @me)

if [[ $? -ne 0 ]]; then
    log_error "Failed to create epic issue"
    exit 1
fi

log_success "Epic issue created: $EPIC_ISSUE_URL"

# Extract epic issue number
EPIC_ISSUE_NUM=$(echo "$EPIC_ISSUE_URL" | grep -oE '[0-9]+$')
EPIC_FEATURE_ID="EPIC-$(printf "%03d" "$EPIC_ISSUE_NUM")"

# Add epic to project board
log_info "Adding epic to project board..."
if gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$EPIC_ISSUE_URL" 2>/dev/null; then
    log_success "Epic added to project board"
else
    log_warning "Could not add epic to project board (this is optional)"
fi

# Create feature issues for each component
if [[ ${#COMPONENT_LIST[@]} -gt 0 ]]; then
    echo ""
    log_info "Creating component feature issues..."
    
    CREATED_FEATURES=()
    
    for component in "${COMPONENT_LIST[@]}"; do
        log_info "Creating feature for: $component"
        
        # Generate feature description referencing epic
        FEATURE_BODY=$(cat << EOF
## Component Description
$component

## Epic Context
This feature is part of epic: **$EPIC_TITLE** (#$EPIC_ISSUE_NUM)

## Implementation Requirements
- [ ] Component design and specification
- [ ] Core implementation
- [ ] Unit tests
- [ ] Integration with other epic components
- [ ] Documentation

## Epic Integration
- [ ] Integrates with other components in $EPIC_FEATURE_ID
- [ ] Follows epic architecture and standards
- [ ] Contributes to epic completion criteria

---
*Feature created as part of $EPIC_FEATURE_ID*
EOF
)
        
        # Create the feature issue
        FEATURE_ISSUE_URL=$(gh issue create \
            --repo "$REPO" \
            --title "[FEAT-$(get_next_id "FEAT")]: $component" \
            --body "$FEATURE_BODY" \
            --label "enhancement,$PHASE,status-todo,epic-item" \
            --assignee @me)
        
        if [[ $? -eq 0 ]]; then
            FEATURE_ISSUE_NUM=$(echo "$FEATURE_ISSUE_URL" | grep -oE '[0-9]+$')
            FEATURE_ID="FEAT-$(printf "%03d" "$FEATURE_ISSUE_NUM")"
            
            log_success "Created feature: $FEATURE_ID ($component)"
            CREATED_FEATURES+=("$FEATURE_ID|#$FEATURE_ISSUE_NUM")
            
            # Add to project board
            gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$FEATURE_ISSUE_URL" 2>/dev/null || true
        else
            log_error "Failed to create feature issue for: $component"
        fi
    done
    
    # Link all features to the epic
    echo ""
    log_info "Linking features to epic..."
    
    for feature_info in "${CREATED_FEATURES[@]}"; do
        IFS='|' read -r feature_id feature_issue_num <<< "$feature_info"
        
        # Use our relationship linking script
        "$SCRIPT_DIR/link-related-issues.sh" "$EPIC_FEATURE_ID" "$feature_id" "epic" || true
    done
fi

# Final summary
echo ""
log_success "Epic creation completed!"
echo ""
echo "📋 Epic Issue: $EPIC_ISSUE_URL"
echo "🔗 Epic ID: $EPIC_FEATURE_ID"

if [[ ${#CREATED_FEATURES[@]} -gt 0 ]]; then
    echo ""
    echo "🎯 Created Features:"
    for feature_info in "${CREATED_FEATURES[@]}"; do
        IFS='|' read -r feature_id feature_issue_num <<< "$feature_info"
        echo "  $feature_id: https://github.com/$REPO/issues/${feature_issue_num#\#}"
    done
fi

echo ""
echo "📊 View in GitHub Projects: https://github.com/users/$PROJECT_OWNER/projects/$PROJECT_NUMBER"
echo "🏷️  Filter by epic: gh issue list --repo $REPO --label epic-item"
echo ""

log_info "Next steps:"
echo "1. Review epic and feature issues in GitHub Projects"
echo "2. Use individual create-*-issue.sh scripts for additional related issues"
echo "3. Update epic issue as features are completed"
echo "4. Close epic when all features are complete"