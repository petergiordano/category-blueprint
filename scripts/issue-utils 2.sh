#!/bin/bash
# Issue creation utilities and shared functions
# Used by all issue creation scripts
# Version 2.0 - With retry logic and error recovery

set -e

REPO="petergiordano/category-blueprint"
PROJECT_NUMBER="1"
PROJECT_OWNER="petergiordano"

# Configuration
MAX_RETRY_ATTEMPTS="${GH_MAX_RETRIES:-3}"
RETRY_DELAY="${GH_RETRY_DELAY:-2}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_retry() {
    echo -e "${YELLOW}[RETRY]${NC} $1"
}

# Retry wrapper for gh commands
gh_with_retry() {
    local attempt=1
    local output=""
    local exit_code=0
    
    while [ $attempt -le $MAX_RETRY_ATTEMPTS ]; do
        if output=$(gh "$@" 2>&1); then
            echo "$output"
            return 0
        else
            exit_code=$?
            if [ $attempt -lt $MAX_RETRY_ATTEMPTS ]; then
                log_retry "Attempt $attempt failed (exit code: $exit_code). Retrying in ${RETRY_DELAY}s..."
                sleep $RETRY_DELAY
                attempt=$((attempt + 1))
            else
                log_error "Command failed after $MAX_RETRY_ATTEMPTS attempts"
                log_error "Last error: $output"
                
                # Provide helpful error messages based on common issues
                if echo "$output" | grep -q "HTTP 401\|HTTP 403\|Unauthorized"; then
                    log_warning "Authentication issue detected. Try: gh auth refresh"
                elif echo "$output" | grep -q "HTTP 404\|Not Found"; then
                    log_warning "Resource not found. Check repository name and permissions"
                elif echo "$output" | grep -q "HTTP 422\|Validation Failed"; then
                    log_warning "GitHub API validation error. Check input parameters"
                elif echo "$output" | grep -q "rate limit\|API rate limit"; then
                    log_warning "GitHub API rate limit hit. Wait a few minutes and try again"
                elif echo "$output" | grep -q "network\|timeout\|connection"; then
                    log_warning "Network issue detected. Check your internet connection"
                fi
                
                return $exit_code
            fi
        fi
    done
}

# Get next available ID for issue type
get_next_id() {
    local issue_type="$1"
    local prefix=""
    
    case $issue_type in
        "FEAT") prefix="FEAT-" ;;
        "ENH") prefix="ENH-" ;;
        "BUG") prefix="BUG-" ;;
        *) 
            log_error "Invalid issue type: $issue_type"
            exit 1
            ;;
    esac
    
    log_info "Fetching existing issues to generate next ID..."
    
    # Get highest existing ID for this type with retry
    local max_id=""
    if issues_json=$(gh_with_retry issue list --repo "$REPO" --state all --limit 1000 --json title); then
        max_id=$(echo "$issues_json" \
            | jq -r ".[] | select(.title | startswith(\"[$prefix\")) | .title" \
            | grep -oE "\[${prefix}[0-9]+\]" \
            | grep -oE "[0-9]+" \
            | sort -n \
            | tail -1)
    else
        log_warning "Could not fetch existing issues. Using fallback ID generation."
        # Fallback: Use timestamp-based ID if we can't fetch issues
        local timestamp_suffix=$(date +%H%M)
        echo "T${timestamp_suffix}"
        return
    fi
    
    if [[ -z "$max_id" ]]; then
        echo "001"
    else
        printf "%03d" $((max_id + 1))
    fi
}

# Detect current phase from project context
detect_current_phase() {
    # Check git branch first
    local current_branch=$(git branch --show-current 2>/dev/null || echo "")
    
    if [[ "$current_branch" =~ feature/phase-([0-9]+) ]]; then
        echo "Phase ${BASH_REMATCH[1]}"
        return
    fi
    
    # Check for phase indicators in recent commits
    local recent_phases=$(git log --oneline -10 | grep -oiE "phase [0-9]+" | head -1)
    if [[ -n "$recent_phases" ]]; then
        echo "$recent_phases"
        return
    fi
    
    # Default to Phase 6 based on current project status
    echo "Phase 6"
}

# Validate inputs
validate_title() {
    local title="$1"
    if [[ -z "$title" ]]; then
        log_error "Title cannot be empty"
        exit 1
    fi
    
    if [[ ${#title} -gt 100 ]]; then
        log_warning "Title is quite long (${#title} characters). Consider shortening."
    fi
}

validate_description() {
    local description="$1"
    if [[ -z "$description" ]]; then
        log_error "Description cannot be empty"
        exit 1
    fi
}

validate_phase() {
    local phase="$1"
    if [[ ! "$phase" =~ ^Phase\ [1-9][0-9]*$ ]]; then
        log_error "Invalid phase format: $phase. Expected format: 'Phase X'"
        exit 1
    fi
}

# Generate issue body from template
generate_issue_body() {
    local issue_type="$1"
    local description="$2"
    local phase="$3"
    local priority="${4:-Medium}"
    
    # Create acceptance criteria based on issue type
    local acceptance_criteria=""
    case $issue_type in
        "FEAT")
            acceptance_criteria="- [ ] Feature design and specification complete
- [ ] Implementation completed according to spec
- [ ] Unit tests written and passing
- [ ] Integration tests completed
- [ ] Documentation updated
- [ ] Code review completed"
            ;;
        "ENH")
            acceptance_criteria="- [ ] Enhancement scope clearly defined
- [ ] Implementation approach validated
- [ ] Changes implemented and tested
- [ ] Backward compatibility verified
- [ ] Performance impact assessed
- [ ] Documentation updated if needed"
            ;;
        "BUG")
            acceptance_criteria="- [ ] Bug reproduced and documented
- [ ] Root cause identified
- [ ] Fix implemented and tested
- [ ] Regression tests added
- [ ] Fix verified in production-like environment
- [ ] Related documentation updated"
            ;;
    esac
    
    cat << EOF
## Description
$description

## Acceptance Criteria
$acceptance_criteria

## Phase
$phase

## Priority
$priority

## Status
⬜ Todo

---
*Created via automated issue creation workflow*
EOF
}

# Create issue with all metadata
create_issue() {
    local issue_type="$1"
    local title="$2" 
    local description="$3"
    local phase="$4"
    local priority="${5:-Medium}"
    
    # Validate inputs
    validate_title "$title"
    validate_description "$description"
    validate_phase "$phase"
    
    # Get next ID and format title
    local next_id=$(get_next_id "$issue_type")
    local formatted_title="[${issue_type}-${next_id}]: $title"
    
    log_info "Creating ${issue_type} issue: $formatted_title"
    
    # Generate issue body
    local issue_body=$(generate_issue_body "$issue_type" "$description" "$phase" "$priority")
    
    # Determine labels based on issue type
    local labels=""
    case $issue_type in
        "FEAT") labels="enhancement,$phase,status-todo" ;;
        "ENH") labels="enhancement,$phase,status-todo" ;;
        "BUG") labels="bug,$phase,status-todo" ;;
    esac
    
    # Create the issue with retry
    local issue_url=""
    if issue_url=$(gh_with_retry issue create \
        --repo "$REPO" \
        --title "$formatted_title" \
        --body "$issue_body" \
        --label "$labels" \
        --assignee @me); then
        
        log_success "Issue created: $issue_url"
        
        # Add to project board (with retry but non-critical)
        log_info "Adding issue to project board..."
        if gh_with_retry project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$issue_url" 2>/dev/null; then
            log_success "Issue added to project board"
        else
            log_warning "Could not add issue to project board (this is optional - you can add manually)"
        fi
        
        # Output for AI agents to capture
        echo ""
        echo "ISSUE_CREATED_URL: $issue_url"
        echo "ISSUE_ID: ${issue_type}-${next_id}"
        echo ""
        
    else
        log_error "Failed to create issue"
        exit 1
    fi
}

# Update issue status
update_issue_status() {
    local issue_number="$1"
    local new_status="$2"
    
    if [[ -z "$issue_number" || -z "$new_status" ]]; then
        log_error "Both issue number and status are required"
        exit 1
    fi
    
    # Remove old status labels and add new one
    local old_labels=("status-todo" "status-in-progress" "status-complete")
    
    for label in "${old_labels[@]}"; do
        gh issue edit "$issue_number" --repo "$REPO" --remove-label "$label" 2>/dev/null || true
    done
    
    gh issue edit "$issue_number" --repo "$REPO" --add-label "$new_status"
    
    if [[ $? -eq 0 ]]; then
        log_success "Issue #$issue_number status updated to: $new_status"
    else
        log_error "Failed to update issue status"
        exit 1
    fi
}

# Check if gh CLI is available and authenticated
check_gh_auth() {
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed or not in PATH"
        echo "Install it from: https://cli.github.com/"
        exit 1
    fi
    
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI is not authenticated"
        echo "Run: gh auth login"
        exit 1
    fi
    
    log_info "GitHub CLI authentication verified"
}