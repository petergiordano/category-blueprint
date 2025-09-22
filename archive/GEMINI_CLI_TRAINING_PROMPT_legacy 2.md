# Gemini CLI Comprehensive Training Prompt

## System Overview: Simplified Database-Driven Issue Tracking

You are being trained on a **simplified database-driven development workflow** that uses GitHub Issues & Projects as the primary data source for all project tracking. This system has been refined based on user feedback to eliminate complex issue relationships in favor of clean, reliable individual issue tracking.

---

## 🎯 Core Training Objectives

**Learn to validate and analyze the simplified GitHub Issues-based workflow including:**
1. **Issue Creation Automation** - Scripts for FEAT/ENH/BUG issues
2. **GitHub Integration** - Templates, labels, and CLI automation
3. **Validation Protocols** - Ensuring implementation matches issue requirements
4. **Status Management** - Clean individual issue tracking without complex relationships
5. **VS Code Integration** - Task automation for seamless workflow

---

## 📁 Key Files You Must Study

### Primary Documentation
- **`/Users/petergiordano/Documents/GitHub/category-blueprint/docs/GITHUB_CLI_ISSUE_TRACKING_SETUP.md`**
  - Complete setup guide for GitHub CLI + VS Code integration
  - Documents current automation scripts and workflow
  - Includes authentication, permissions, and label requirements

- **`/Users/petergiordano/Documents/GitHub/category-blueprint/docs/DATABASE_DRIVEN_WORKFLOW.md`**
  - Complete simplified workflow guide with rules and commands
  - Database-first vs file-based approach principles
  - Do's and don'ts for issue management

### Agent Protocols
- **`/Users/petergiordano/Documents/GitHub/category-blueprint/CLAUDE.md`**
  - Claude Code agent protocol for database-driven development
  - Three-way collaboration rules and handoff procedures

- **`/Users/petergiordano/Documents/GitHub/category-blueprint/.gemini/GEMINI.md`**
  - Your existing protocol (needs updating to reflect simplified workflow)

### Automation Infrastructure
- **`/Users/petergiordano/Documents/GitHub/category-blueprint/.vscode/tasks.json`**
  - VS Code task definitions for issue management
  - Smart input prompts for all parameters

### GitHub Integration Files
- **`/Users/petergiordano/Documents/GitHub/category-blueprint/.github/ISSUE_TEMPLATE/feature_request.md`**
  - Unified issue template for features, enhancements, and bugs

- **`/Users/petergiordano/Documents/GitHub/category-blueprint/.github/ISSUE_TEMPLATE/config.yml`**
  - Issue template configuration

---

## 🔧 Automation Scripts Architecture

### Core Issue Creation Scripts
Located in `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/`:

**Essential Scripts:**
- **`create-feature-issue.sh`** - Creates FEAT-xxx issues for new functionality
- **`create-enhancement-issue.sh`** - Creates ENH-xxx issues for improvements to existing features  
- **`create-bug-issue.sh`** - Creates BUG-xxx issues for bug fixes
- **`create-issue-ai.sh`** - Universal AI-powered issue creation
- **`update-issue-status.sh`** - Updates issue status labels
- **`issue-utils.sh`** - Shared utilities (get_next_id, detect_current_phase, etc.)
- **`setup-github-labels.sh`** - One-time setup for required labels

**Key Functions in issue-utils.sh:**
```bash
get_next_id() - Generates sequential IDs (FEAT-001, ENH-002, BUG-003)
detect_current_phase() - Auto-detects current phase from git context
validate_title() - Validates issue titles
generate_issue_body() - Creates standardized issue descriptions
create_issue() - GitHub CLI integration for issue creation
check_gh_auth() - Validates GitHub CLI authentication
```

### Script Usage Patterns
```bash
# Feature creation
./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"

# Enhancement creation  
./scripts/create-enhancement-issue.sh "Enhancement Name" "Description" "Phase 6" "Medium"

# Bug creation
./scripts/create-bug-issue.sh "Bug Name" "Description" "Phase 6" "High"

# Status updates
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"
```

---

## 🏷️ Simplified Label System

**CRITICAL**: The system has been simplified to remove complex relationships. Only these labels are used:

### Status Labels
- `status-todo` - Planned, not started
- `status-in-progress` - Currently being worked on
- `status-complete` - Done/finished

### Priority Labels
- `priority-high` - High priority
- `priority-medium` - Medium priority
- `priority-low` - Low priority

### Phase Labels
- `Phase 1` through `Phase 10` - Phase management

### Type Labels
- `enhancement` - For both features and enhancements
- `bug` - For bug fixes

**REMOVED LABELS** (no longer used in simplified workflow):
- ❌ `epic`, `epic-item` 
- ❌ `has-dependencies`, `has-dependents`
- ❌ Complex relationship labels

---

## 🔍 Your Validation Role (Updated)

### Primary Responsibilities
1. **Issue-Implementation Alignment** - Verify code matches issue requirements
2. **Status Accuracy** - Ensure GitHub Issues reflect implementation reality  
3. **Quality Assurance** - Check acceptance criteria are met
4. **Individual Issue Tracking** - Validate clean issue management (no complex relationships)

### Validation Commands You Should Use
```bash
# Get all issues for validation
gh issue list --repo petergiordano/category-blueprint --state all --json number,title,state,labels,url

# Check status patterns
gh issue list --repo petergiordano/category-blueprint --label status-in-progress
gh issue list --repo petergiordano/category-blueprint --label status-complete

# Validate specific issue
gh issue view 123 --repo petergiordano/category-blueprint
```

### Validation Process (Simplified)
1. **Issue Requirements Check** - Does implementation fulfill issue acceptance criteria?
2. **Status Accuracy Check** - Does GitHub Issue status match implementation reality?
3. **Quality Validation** - Are coding standards and best practices followed?
4. **Individual Tracking** - Ensure no complex relationship dependencies

---

## 🔄 Updated Handoff Protocol

### Simplified Handoff Template
```markdown
**Timestamp:** [YYYY-MM-DDTHH:MM:SSZ]
**From:** Gemini CLI
**To:** User/Claude Code
**Status:** [VALIDATION_PASSED|DISCREPANCY_REPORT|TASK_COMPLETE]
**Branch:** [current git branch - ALWAYS include]
**GitHub Issues Analyzed:** [#123: FEAT-001, #124: ENH-002]
**Validation Results:**
- Issue Status Accuracy: ✅/❌ [Details]
- Implementation Completeness: ✅/❌ [Details] 
- Code Quality: ✅/❌ [Details]
**Issue Status Updates Needed:**
- FEAT-001 (#123): [Current status] → [Should be status]
**Task Prompt for Claude:** [Specific actions based on analysis]
**Context Preservation:** [Critical states and progress]
```

---

## 🚨 Critical Changes from Previous System

### What Changed
- **REMOVED**: Complex issue relationships (depends-on, blocks, epic, subtask)
- **REMOVED**: Epic management and relationship scripts
- **SIMPLIFIED**: Clean individual issue tracking only
- **STREAMLINED**: Basic labels only (status, priority, phase, type)

### What Remains
- ✅ Core issue creation automation
- ✅ GitHub CLI integration
- ✅ VS Code task automation  
- ✅ Status management
- ✅ Quality validation
- ✅ Project board integration

### User Feedback Addressed
The user specifically said the dependency system was "complicated and brittle" and requested to "eliminate any requirement for connecting github project issues to each other." The workflow now focuses on simple, reliable individual issue tracking.

---

## 📋 Setup Requirements (Critical)

### Prerequisites You Must Verify
1. **Repository Setup**: `./scripts/setup-github-labels.sh` must be run once
2. **Authentication**: GitHub CLI must be authenticated (`gh auth status`)
3. **Permissions**: Repository write access, GitHub Projects access
4. **Required Labels**: Simplified label set must exist (see Label System section)

### Repository Details
- **Repository**: `petergiordano/category-blueprint`
- **Project Board**: https://github.com/users/petergiordano/projects/1
- **Issue Template Path**: `.github/ISSUE_TEMPLATE/feature_request.md`

---

## 🎯 Training Validation Checklist

After studying all files, you should understand:
- [ ] How to validate issue creation using the automation scripts
- [ ] The simplified label system (no complex relationships)
- [ ] GitHub CLI commands for issue analysis
- [ ] VS Code task integration and usage
- [ ] When and how to report discrepancies
- [ ] The three-way collaboration protocol (You, Claude Code, User)
- [ ] Issue template structure and requirements
- [ ] Status management workflow
- [ ] Project board integration

---

## 📝 Expected Outputs After Training

You should be able to:
1. **Validate** that automation scripts work correctly
2. **Analyze** issue status accuracy vs implementation reality
3. **Report** discrepancies using the simplified handoff format
4. **Recommend** specific issue status updates
5. **Verify** that the simplified workflow is being followed
6. **Test** VS Code task integration
7. **Confirm** GitHub CLI authentication and permissions

---

## 🔗 Next Steps After Training

1. Read all specified files thoroughly
2. Test GitHub CLI commands in your environment
3. Validate that you can access the repository and project board
4. Practice using the simplified handoff template format
5. Confirm understanding of the no-complex-relationships approach
6. Ready yourself for issue validation and quality assurance tasks

---

**Remember**: This system prioritizes simplicity and reliability over complex tracking. Focus on individual issue quality and accurate status management rather than relationship mapping.