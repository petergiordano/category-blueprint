#!/bin/bash
# Bulk create GitHub Issues from PRD component definitions
# Usage: ./create-prd-issues.sh [prd-file] [phase]

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Parse arguments
PRD_FILE="${1:-docs/specifications/PRD.md}"
PHASE="${2:-$(detect_current_phase)}"

# Check if PRD file exists
if [[ ! -f "$PRD_FILE" ]]; then
    log_error "PRD file not found: $PRD_FILE"
    echo ""
    echo "Available PRD files:"
    find docs/specifications -name "*PRD*.md" -type f 2>/dev/null || echo "No PRD files found"
    exit 1
fi

# Check GitHub CLI authentication
check_gh_auth

log_info "=== PRD to GitHub Issues Generator ==="
echo "PRD File: $PRD_FILE"
echo "Phase: $PHASE"
echo "Repository: $REPO"
echo "Project: #$PROJECT_NUMBER"
echo ""

# Function to extract component definitions from PRD
parse_prd_components() {
    local prd_file="$1"
    
    # Look for component patterns in PRD
    # This is a basic parser - adjust regex patterns based on your PRD format
    
    log_info "Parsing PRD components..."
    
    # Extract sections that look like component definitions
    # Pattern: ### [Number].[Number] [Component Name] [STATUS]
    local component_sections=$(grep -n "^### [0-9]" "$prd_file" || true)
    
    if [[ -z "$component_sections" ]]; then
        log_warning "No component sections found in PRD"
        echo "Looking for patterns like: ### 3.1. Component 1: [Component Name] [STATUS]"
        return 1
    fi
    
    echo "Found component sections:"
    echo "$component_sections"
    return 0
}

# Function to create issue from component definition
create_component_issue() {
    local component_name="$1"
    local component_desc="$2"
    local issue_type="${3:-FEAT}"
    local priority="${4:-Medium}"
    
    # Generate next ID
    local next_id=$(get_next_id "$issue_type")
    
    # Create comprehensive issue description
    local issue_body=$(cat << EOF
## Component Description
$component_desc

## Implementation Approach
This component should follow the AI-powered development workflow:

1. **Feature Spec Generation**: AI generates \`feat_spec-$(echo "$component_name" | tr ' ' '-' | tr '[:upper:]' '[:lower:]').md\`
2. **Implementation**: AI creates branch and implements component
3. **Testing**: Unit and integration tests included
4. **Documentation**: Implementation log created in \`docs/implementation-logs/\`

## Acceptance Criteria
- [ ] Component meets PRD requirements
- [ ] Feature spec created and validated
- [ ] Implementation completed with tests
- [ ] Integration with other components verified
- [ ] Documentation updated

## PRD Reference
See: $PRD_FILE

## Implementation Notes
- Follow dev-cycle.md workflow
- Create feature spec before implementation
- Use branch name: \`feature/${issue_type}-${next_id}-$(echo "$component_name" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')\`
- Link implementation log to this issue

---
*Generated from PRD component definition*
EOF
)
    
    # Create the issue using existing automation
    create_issue "$issue_type" "$component_name" "$issue_body" "$PHASE" "$priority"
}

# Main execution
log_info "Parsing PRD file..."

# Check if this is a template or actual PRD
if grep -q "\[CUSTOMIZE:" "$PRD_FILE"; then
    log_warning "PRD appears to be a template with [CUSTOMIZE:] placeholders"
    echo ""
    echo "Please customize your PRD first, or specify a different PRD file:"
    find docs/specifications -name "*PRD*.md" -type f | grep -v template
    echo ""
    exit 1
fi

# Parse components (basic implementation - can be enhanced)
parse_prd_components "$PRD_FILE"

echo ""
log_warning "This is a basic PRD parser. For best results:"
echo "1. Use the GitHub Issues web interface for detailed planning"
echo "2. Use individual create-*-issue.sh scripts for specific issues"
echo "3. Consider using the automated sync: ./scripts/sync-prd-from-github.sh"

echo ""
log_info "Example: Create a specific component issue manually:"
echo "./scripts/create-feature-issue.sh \"Component Name\" \"Description from PRD\" \"$PHASE\" \"High\""

echo ""
log_success "PRD analysis complete. Use individual issue creation scripts for precise control."