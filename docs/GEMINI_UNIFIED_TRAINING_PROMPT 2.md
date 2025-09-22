# Unified Gemini CLI Training Prompt - Enhanced Resilient Workflow v2.0

## 🎯 Executive Summary

You are Gemini CLI, an AI agent responsible for validating and analyzing a **simplified, resilient database-driven development workflow** that uses GitHub Issues & Projects as the primary data source. This system has been enhanced with resilience features including automatic retry logic, validation scripts, and multiple fallback options.

**Your Mission**: Learn this entire enhanced workflow and update your configuration file at `.gemini/GEMINI.md` to reflect the current system with all resilience features.

---

## 📚 Complete System Documentation to Study

### 1. Primary System Documentation (Read in Order)
1. **`/Users/petergiordano/Documents/GitHub/category-blueprint/README.md`**
   - Project overview with new resilience features section
   - Production application context

2. **`/Users/petergiordano/Documents/GitHub/category-blueprint/CLAUDE.md`**
   - Claude Code protocol v3.0 with enhanced resilience features
   - Includes validation script, retry logic, fallback options
   - Three-way collaboration protocol

3. **`/Users/petergiordano/Documents/GitHub/category-blueprint/docs/DATABASE_DRIVEN_WORKFLOW.md`**
   - Simplified workflow rules (no complex relationships)
   - Database-first principles
   - Individual issue tracking focus

4. **`/Users/petergiordano/Documents/GitHub/category-blueprint/docs/GITHUB_CLI_ISSUE_TRACKING_SETUP.md`**
   - Enhanced v2.0 with resilience features
   - Validation script documentation
   - Fallback options and error recovery

### 2. Your Configuration File
- **`/Users/petergiordano/Documents/GitHub/category-blueprint/.gemini/GEMINI.md`**
  - Your current protocol (needs updating with resilience features)
  - Update this after learning the system

### 3. Technical Implementation Files

#### GitHub Integration (Enhanced)
- **`.github/ISSUE_TEMPLATE/feature_form.yml`** 🆕 - Structured feature request form
- **`.github/ISSUE_TEMPLATE/bug_form.yml`** 🆕 - Structured bug report form  
- **`.github/ISSUE_TEMPLATE/enhancement_form.yml`** 🆕 - Structured enhancement form
- **`.github/ISSUE_TEMPLATE/config.yml`** - Updated with contact links
- **`.github/workflows/auto-label.yml`** 🆕 - GitHub Actions for auto-labeling

#### VS Code Integration
- **`.vscode/tasks.json`** - Task definitions for issue management

---

## 🛡️ New Resilience Features You Must Learn

### 1. Validation Script (`scripts/validate-workflow.sh`) 🆕
- **Purpose**: Diagnose setup issues before using other scripts
- **Checks**: GitHub CLI, auth, repo access, labels, dependencies
- **Usage**: Run before any workflow operations
- **Output**: Clear pass/fail with fix instructions

### 2. Retry Logic in `issue-utils.sh` 🆕
```bash
gh_with_retry() {
    # Retries failed GitHub API calls up to 3 times
    # Provides helpful error messages for common issues
    # Configurable via GH_MAX_RETRIES and GH_RETRY_DELAY
}
```

### 3. GitHub Issue Forms (Fallback Option) 🆕
- **Location**: `.github/ISSUE_TEMPLATE/` directory
- **Purpose**: Web UI alternative when scripts fail
- **Forms**: feature_form.yml, bug_form.yml, enhancement_form.yml
- **Benefits**: Structured input, validation, no CLI needed

### 4. GitHub Actions Auto-Labeling 🆕
- **File**: `.github/workflows/auto-label.yml`
- **Features**:
  - Auto-labels based on title prefixes ([FEAT-], [BUG-], [ENH-])
  - Comment commands: `/status done`, `/priority high`
  - Automatic status-todo on new issues

### 5. Error Recovery Features 🆕
- **Network failures**: Automatic retry with delay
- **Auth issues**: Suggests `gh auth refresh`
- **Rate limits**: Wait guidance provided
- **ID conflicts**: Fallback to timestamp-based IDs

---

## 🔧 Enhanced Automation Scripts

### Core Scripts (All Enhanced with Retry Logic)
Located in `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/`:

```bash
# 🆕 Validation and Diagnostics
./scripts/validate-workflow.sh  # Check all dependencies

# Issue Creation (with retry logic)
./scripts/create-feature-issue.sh "Title" "Description" "Phase 6" "High"
./scripts/create-enhancement-issue.sh "Title" "Description" "Phase 6" "Medium"
./scripts/create-bug-issue.sh "Bug" "Description" "Phase 6" "High"
./scripts/create-issue-ai.sh "FEAT" "Title" "Description" "Phase 6"

# Status Management (with retry logic)
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"

# Setup
./scripts/setup-github-labels.sh  # One-time label creation
```

### Configuration Options 🆕
```bash
# Environment variables for retry behavior
export GH_MAX_RETRIES=5      # Increase retry attempts (default: 3)
export GH_RETRY_DELAY=3      # Delay between retries in seconds (default: 2)
```

---

## 🏷️ Simplified Label System (No Complex Relationships)

### What's Been Removed ❌
- **REMOVED**: epic, epic-item labels
- **REMOVED**: has-dependencies, has-dependents labels
- **REMOVED**: Complex relationship tracking
- **REMOVED**: Epic management scripts

### Current Simple Labels ✅
- **Status**: `status-todo`, `status-in-progress`, `status-complete`
- **Priority**: `priority-high`, `priority-medium`, `priority-low`
- **Phase**: `Phase 1` through `Phase 10`
- **Type**: `enhancement`, `bug`

---

## 🔄 Your Validation Responsibilities

### Primary Focus Areas
1. **Implementation Validation**: Code matches issue requirements
2. **Status Accuracy**: GitHub Issue status reflects reality
3. **Quality Assurance**: Code follows project standards
4. **Individual Issue Focus**: Each issue is self-contained

### New Validation Checks 🆕
1. **Script Resilience**: Verify retry logic is working
2. **Fallback Options**: Confirm Issue Forms are accessible
3. **Auto-labeling**: Check GitHub Actions are applying labels
4. **Error Recovery**: Validate helpful error messages

### Validation Commands
```bash
# Run validation script
./scripts/validate-workflow.sh

# Check issue status accuracy
gh issue list --repo petergiordano/category-blueprint --label status-in-progress

# Verify auto-labeling worked
gh issue view <NUMBER> --repo petergiordano/category-blueprint --json labels
```

---

## 📝 Update Your GEMINI.md File

After studying this system, update `.gemini/GEMINI.md` to include:

1. **Version Update**: Change to v4.0 - Enhanced Resilient Protocol
2. **New Sections**:
   - Resilience Features overview
   - Validation script usage
   - Fallback options documentation
   - Error recovery procedures
3. **Updated Validation Process**:
   - Include validation script in pre-checks
   - Document retry logic behavior
   - Note GitHub Actions integration
4. **Enhanced Handoff Template**:
   - Add "Validation Script Status" field
   - Include "Resilience Features Used" section

---

## 🚀 Quick Start Validation Sequence

1. **Run validation script**: `./scripts/validate-workflow.sh`
2. **Check recent issues**: `gh issue list --repo petergiordano/category-blueprint --limit 10`
3. **Verify labels exist**: `gh label list --repo petergiordano/category-blueprint`
4. **Test retry logic**: Create a test issue and observe retry behavior
5. **Confirm GitHub Actions**: Check for auto-applied labels on recent issues

---

## 🎯 Success Criteria

You have successfully learned the system when you can:
- ✅ Run the validation script and understand all checks
- ✅ Explain the retry logic mechanism and configuration
- ✅ Describe all three fallback options (Forms, Comments, Manual)
- ✅ Validate issues using the enhanced workflow
- ✅ Update your GEMINI.md with all resilience features

---

**Action Required**: Study all referenced files, understand the enhanced resilient workflow, then update your `.gemini/GEMINI.md` configuration to reflect this complete system including all resilience features.