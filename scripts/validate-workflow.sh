#!/bin/bash
# Validate GitHub workflow setup and dependencies
# Run this to diagnose any setup issues before using other scripts

# Don't exit on error immediately - we want to show all issues
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO="petergiordano/category-blueprint"
REQUIRED_LABELS=(
    "status-todo"
    "status-in-progress"
    "status-complete"
    "priority-high"
    "priority-medium"
    "priority-low"
    "enhancement"
    "bug"
)

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
WARNINGS=0

# Functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    echo -e "  ${YELLOW}Fix:${NC} $2"
    ((TOTAL_CHECKS++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
}

# Start validation
echo -e "${BLUE}GitHub Workflow Setup Validator${NC}"
echo -e "${BLUE}Repository: $REPO${NC}"
echo ""

# Check 1: GitHub CLI Installation
print_header "1. GitHub CLI Installation"
if command -v gh &> /dev/null; then
    GH_VERSION=$(gh --version | head -n1)
    check_pass "GitHub CLI installed: $GH_VERSION"
else
    check_fail "GitHub CLI not found" "Install with: brew install gh (macOS) or see https://cli.github.com/manual/installation"
    echo ""
    echo -e "${RED}Cannot continue without GitHub CLI. Please install it first.${NC}"
    exit 1
fi

# Check 2: GitHub CLI Authentication
print_header "2. GitHub Authentication"
AUTH_OK=false
if gh auth status &> /dev/null; then
    # Try a more reliable way to check authentication
    if gh api user &>/dev/null; then
        check_pass "Authenticated to github.com"
        AUTH_OK=true
    else
        check_fail "Not properly authenticated to github.com" "Run: gh auth login"
    fi
else
    check_fail "GitHub CLI not authenticated" "Run: gh auth login"
fi

# Only continue with repository checks if authenticated
if [[ "$AUTH_OK" != "true" ]]; then
    echo ""
    echo -e "${RED}Cannot continue without authentication. Please fix the issue above.${NC}"
    exit 1
fi

# Check 3: Repository Access
print_header "3. Repository Access"
if gh repo view "$REPO" &> /dev/null; then
    check_pass "Repository accessible: $REPO"
    
    # Check write permissions
    if gh issue list --repo "$REPO" --limit 1 &> /dev/null; then
        check_pass "Read access to issues confirmed"
    else
        check_fail "Cannot read issues" "Check repository permissions"
    fi
else
    check_fail "Cannot access repository: $REPO" "Verify repository exists and you have access"
    exit 1
fi

# Check 4: Required Labels
print_header "4. GitHub Labels"
echo "Checking for required labels..."

MISSING_LABELS=()
EXISTING_LABELS=$(gh label list --repo "$REPO" --limit 1000 --json name -q '.[].name' 2>/dev/null || echo "")

for label in "${REQUIRED_LABELS[@]}"; do
    if echo "$EXISTING_LABELS" | grep -q "^${label}$"; then
        check_pass "Label exists: $label"
    else
        MISSING_LABELS+=("$label")
        check_fail "Label missing: $label" "Run: ./scripts/setup-github-labels.sh"
    fi
done

# Check 5: Project Board Access
print_header "5. GitHub Projects"
if gh project list --owner petergiordano --limit 10 &> /dev/null; then
    check_pass "GitHub Projects API accessible"
    
    # Try to find project #1
    PROJECT_INFO=$(gh project view 1 --owner petergiordano --format json 2>/dev/null || echo "{}")
    if [[ "$PROJECT_INFO" != "{}" ]]; then
        PROJECT_TITLE=$(echo "$PROJECT_INFO" | grep -o '"title":"[^"]*' | cut -d'"' -f4 || echo "Unknown")
        check_pass "Project #1 found: $PROJECT_TITLE"
    else
        check_warn "Could not verify Project #1 - may need manual verification"
    fi
else
    check_warn "GitHub Projects access limited - some features may not work"
fi

# Check 6: Script Dependencies
print_header "6. Script Dependencies"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "$SCRIPT_DIR/issue-utils.sh" ]]; then
    check_pass "issue-utils.sh found"
else
    check_fail "issue-utils.sh missing" "Ensure all scripts are present in $SCRIPT_DIR"
fi

# Check for other required scripts
REQUIRED_SCRIPTS=(
    "create-feature-issue.sh"
    "create-enhancement-issue.sh"
    "create-bug-issue.sh"
    "update-issue-status.sh"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [[ -f "$SCRIPT_DIR/$script" ]]; then
        if [[ -x "$SCRIPT_DIR/$script" ]]; then
            check_pass "$script is executable"
        else
            check_fail "$script not executable" "Run: chmod +x $SCRIPT_DIR/$script"
        fi
    else
        check_fail "$script missing" "Script not found in $SCRIPT_DIR"
    fi
done

# Check 7: Environment Validation
print_header "7. Environment Check"

# Check if we're in a git repository
if git rev-parse --git-dir > /dev/null 2>&1; then
    CURRENT_BRANCH=$(git branch --show-current)
    check_pass "In git repository, branch: $CURRENT_BRANCH"
else
    check_warn "Not in a git repository - some features may not work"
fi

# Check VS Code tasks.json if in the right repo
if [[ -f ".vscode/tasks.json" ]]; then
    check_pass "VS Code tasks configuration found"
else
    check_warn "VS Code tasks.json not found - VS Code integration unavailable"
fi

# Summary
print_header "Validation Summary"
echo -e "Checks passed: ${GREEN}$PASSED_CHECKS/$TOTAL_CHECKS${NC}"

if [[ $WARNINGS -gt 0 ]]; then
    echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
fi

if [[ ${#MISSING_LABELS[@]} -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}Missing labels detected. To fix, run:${NC}"
    echo -e "${BLUE}./scripts/setup-github-labels.sh${NC}"
fi

if [[ $PASSED_CHECKS -eq $TOTAL_CHECKS ]]; then
    echo ""
    echo -e "${GREEN}✅ All checks passed! Your workflow is ready to use.${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi