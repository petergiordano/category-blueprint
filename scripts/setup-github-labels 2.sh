#!/bin/bash
# Setup required GitHub labels for database-driven workflow
# Usage: ./setup-github-labels.sh

set -e

# Get script directory and source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/issue-utils.sh"

# Check GitHub CLI authentication
check_gh_auth

log_info "=== Setting up GitHub Labels for Database-Driven Workflow ==="

# Function to create label if it doesn't exist
create_label_if_missing() {
    local name="$1"
    local description="$2" 
    local color="$3"
    
    if gh label list --repo "$REPO" | grep -q "^$name"; then
        log_info "Label '$name' already exists"
    else
        log_info "Creating label '$name'..."
        if gh label create "$name" --description "$description" --color "$color" --repo "$REPO"; then
            log_success "Created label '$name'"
        else
            log_error "Failed to create label '$name'"
        fi
    fi
}

# Epic and relationship labels
create_label_if_missing "epic" "Epic issue containing multiple features" "8A2BE2"
create_label_if_missing "epic-item" "Feature that is part of an epic" "DDA0DD"
create_label_if_missing "has-dependencies" "Issue that depends on other issues" "FFA500"  
create_label_if_missing "has-dependents" "Issue that other issues depend on" "32CD32"

# Priority labels
create_label_if_missing "priority-high" "High priority" "FF0000"
create_label_if_missing "priority-medium" "Medium priority" "FFA500" 
create_label_if_missing "priority-low" "Low priority" "008000"

# Status labels (may already exist)
create_label_if_missing "status-todo" "Planned, not started" "4C9AFF"
create_label_if_missing "status-in-progress" "Currently being worked on" "4C9AFF"
create_label_if_missing "status-complete" "Done / finished" "4C9AFF"

# Phase labels (Phase 1-10)
for i in {1..10}; do
    create_label_if_missing "Phase $i" "Phase $i work" "B392F0"
done

log_success "GitHub Labels setup completed!"
echo ""
echo "📋 View all labels: gh label list --repo $REPO"
echo "🔗 GitHub Labels: https://github.com/$REPO/labels"