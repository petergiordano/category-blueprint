#!/bin/bash
# Sync PRD status from GitHub Projects database
# Usage: ./sync-prd-from-github.sh [prd-file]

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Parse arguments
PRD_FILE="${1:-docs/specifications/PRD.md}"

# Check GitHub CLI authentication
check_gh_auth

log_info "=== Syncing PRD from GitHub Projects Database ==="
echo "PRD File: $PRD_FILE"
echo "Repository: $REPO"
echo "Project: #$PROJECT_NUMBER"
echo ""

# Get all issues with their current status
log_info "Fetching issues from GitHub..."
ISSUES_JSON=$(gh issue list --repo "$REPO" --state all --limit 1000 --json number,title,state,labels,url)

# Extract feature IDs and statuses
log_info "Parsing issue data..."

# Function to extract feature ID from title
extract_feature_id() {
    local title="$1"
    if [[ "$title" =~ \[([A-Z]+-[0-9]+)\]: ]]; then
        echo "${BASH_REMATCH[1]}"
    fi
}

# Function to determine status from GitHub issue state and labels
determine_status() {
    local state="$1"
    local labels="$2"
    
    if [[ "$state" == "closed" ]]; then
        echo "✅ COMPLETE"
    elif [[ "$labels" =~ status-in-progress ]]; then
        echo "🚧 IN PROGRESS"
    elif [[ "$labels" =~ status-todo ]]; then
        echo "📝 PLANNED"
    else
        echo "📝 PLANNED"
    fi
}

# Parse issues and build status updates
FEATURE_UPDATES=()
ENHANCEMENT_UPDATES=()
BUG_UPDATES=()

while IFS= read -r issue_line; do
    number=$(echo "$issue_line" | jq -r '.number')
    title=$(echo "$issue_line" | jq -r '.title')
    state=$(echo "$issue_line" | jq -r '.state')
    labels=$(echo "$issue_line" | jq -r '.labels[].name' | tr '\n' ' ')
    url=$(echo "$issue_line" | jq -r '.url')
    
    feature_id=$(extract_feature_id "$title")
    if [[ -n "$feature_id" ]]; then
        status=$(determine_status "$state" "$labels")
        
        if [[ "$feature_id" =~ ^FEAT- ]]; then
            FEATURE_UPDATES+=("$feature_id|$status|#$number|$url")
        elif [[ "$feature_id" =~ ^ENH- ]]; then
            ENHANCEMENT_UPDATES+=("$feature_id|$status|#$number|$url")
        elif [[ "$feature_id" =~ ^BUG- ]]; then
            BUG_UPDATES+=("$feature_id|$status|#$number|$url")
        fi
    fi
done <<< $(echo "$ISSUES_JSON" | jq -c '.[]')

# Function to update PRD section
update_prd_status() {
    local feature_id="$1"
    local status="$2"
    local issue_num="$3"
    local issue_url="$4"
    
    # Update status in PRD if it exists
    if grep -q "$feature_id" "$PRD_FILE" 2>/dev/null; then
        log_info "Updating $feature_id status: $status ($issue_num)"
        # This would need more sophisticated sed/awk to update the right line
        # For now, just log what would be updated
        echo "  $feature_id → $status (Issue $issue_num)"
    fi
}

# Display updates that would be made
echo ""
log_info "Found GitHub Issues to sync:"

if [[ ${#FEATURE_UPDATES[@]} -gt 0 ]]; then
    echo ""
    echo "📋 Core Features (FEAT-XXX):"
    for update in "${FEATURE_UPDATES[@]}"; do
        IFS='|' read -r id status issue_num url <<< "$update"
        echo "  $id: $status ($issue_num)"
    done
fi

if [[ ${#ENHANCEMENT_UPDATES[@]} -gt 0 ]]; then
    echo ""
    echo "⚡ Enhancements (ENH-XXX):"
    for update in "${ENHANCEMENT_UPDATES[@]}"; do
        IFS='|' read -r id status issue_num url <<< "$update"
        echo "  $id: $status ($issue_num)"
    done
fi

if [[ ${#BUG_UPDATES[@]} -gt 0 ]]; then
    echo ""
    echo "🐛 Bug Fixes (BUG-XXX):"
    for update in "${BUG_UPDATES[@]}"; do
        IFS='|' read -r id status issue_num url <<< "$update"
        echo "  $id: $status ($issue_num)"
    done
fi

echo ""
log_success "GitHub Projects sync analysis complete!"
echo ""
log_info "Next steps:"
echo "1. Use GitHub Projects web interface for real-time status: https://github.com/users/$PROJECT_OWNER/projects/$PROJECT_NUMBER"
echo "2. PRD should reference GitHub Issues, not duplicate status"
echo "3. Use 'gh issue list' for programmatic status queries"
echo "4. Update PRD only for high-level planning, not task tracking"

# Generate PRD snippet showing proper GitHub integration
echo ""
log_info "=== Recommended PRD Integration Pattern ==="
cat << 'EOF'

## Project Status (Live from GitHub)

**📊 Status Dashboard**: [GitHub Projects Board](https://github.com/users/petergiordano/projects/1)

### Core Features
| Feature ID | GitHub Issues | Status |
|------------|---------------|--------|
| FEAT-001 | [View Issues](https://github.com/petergiordano/category-blueprint/issues?q=is%3Aissue+FEAT-001) | *Live from GitHub* |
| FEAT-002 | [View Issues](https://github.com/petergiordano/category-blueprint/issues?q=is%3Aissue+FEAT-002) | *Live from GitHub* |

### Quick Status Check
```bash
# Get current status for any feature
gh issue list --repo petergiordano/category-blueprint --search "FEAT-001"

# Create new feature with automation
./scripts/create-feature-issue.sh "Feature Title" "Description" "Phase 6" "High"
```

**Key Principle**: GitHub Projects is the database. PRD provides context and links to the database.

EOF