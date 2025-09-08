# CLAUDE.md - Simplified Database-Driven Development Protocol

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Version**: 3.0 - Simplified Database-Driven Protocol  
**Focus**: GitHub Issues & Projects as primary data source  
**Philosophy**: Simple individual issue tracking, no complex relationships

---

## Project Overview

This is the **Interactive GTM Blueprint** project - a production web application that helps B2B SaaS companies develop their go-to-market strategies through guided AI-powered analysis and positioning tools.

**Production URL**: https://category-blueprint.vercel.app/  
**Repository**: `petergiordano/category-blueprint`  
**GitHub Projects Board**: https://github.com/users/petergiordano/projects/1

---

## Core Development Principles

### 1. Simplified Database-First Approach
- **GitHub Issues**: Primary data source for all features, bugs, enhancements
- **GitHub Projects**: Live status tracking and workflow management
- **Simple Individual Tracking**: No complex issue relationships or dependencies
- **File-based docs**: Reference only, never duplicate GitHub Issues data

### 2. Clean Issue Management
- **No Complex Relationships**: User feedback eliminated "complicated and brittle" dependency system
- **Simple Labels Only**: status-todo/in-progress/complete, priority-high/medium/low, Phase 1-10
- **Individual Issue Focus**: Each issue stands alone with clear acceptance criteria
- **Direct Implementation**: Issue requirements → implementation → status update

### 3. Three-Way Collaboration Protocol
- **Claude Code** (you): Creates issues, implements features, updates status
- **Gemini CLI**: Validates implementations, analyzes issue accuracy
- **User**: Prioritizes work through GitHub Projects board, provides feedback

---

## GitHub Issues Management (Simplified)

### Issue Creation Commands (With Enhanced Resilience)

**🆕 Before starting, validate your setup:**
```bash
./scripts/validate-workflow.sh  # Check all dependencies and configuration
```

**Primary Method - CLI Scripts (with retry logic):**
```bash
# Feature issues
./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"

# Enhancements  
./scripts/create-enhancement-issue.sh "Enhancement Name" "Description" "Phase 6" "Medium"

# Bug fixes
./scripts/create-bug-issue.sh "Bug Name" "Description" "Phase 6" "High"

# Universal AI-powered creation
./scripts/create-issue-ai.sh "FEAT" "Title" "Description" "Phase 6"

# Status updates
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"
```

**🆕 Fallback Method - GitHub UI Forms:**
If scripts fail, use GitHub's web interface:
1. Go to Issues → New Issue
2. Choose: Feature Request / Bug Report / Enhancement Request
3. Fill out the structured form
4. Submit (labels will be auto-applied)

**🆕 Quick Status Updates via Comments:**
```
/status in-progress    # Changes status to in-progress
/status done          # Changes status to complete
/priority high        # Changes priority to high
```

### Core Automation Scripts (Enhanced v2.0)
Located in `scripts/` directory:
- **`validate-workflow.sh`** 🆕 - Validates setup and diagnoses issues
- **`create-feature-issue.sh`** - Creates FEAT-xxx issues (with retry logic)
- **`create-enhancement-issue.sh`** - Creates ENH-xxx issues (with retry logic)
- **`create-bug-issue.sh`** - Creates BUG-xxx issues (with retry logic)
- **`update-issue-status.sh`** - Updates issue status labels (with retry logic)
- **`issue-utils.sh`** - Enhanced utilities with retry wrapper and error recovery
- **`setup-github-labels.sh`** - One-time setup for required labels

### 🆕 Resilience Features

**1. Automatic Retry Logic**
- All gh CLI commands retry up to 3 times on failure
- Configurable via environment variables:
  ```bash
  export GH_MAX_RETRIES=5      # Increase retry attempts
  export GH_RETRY_DELAY=3      # Delay between retries (seconds)
  ```

**2. Validation Script**
- Run `./scripts/validate-workflow.sh` to check:
  - GitHub CLI installation and version
  - Authentication status
  - Repository access permissions
  - Required label existence
  - Script dependencies

**3. Fallback Options**
- **GitHub Issue Forms**: Structured web UI when scripts fail
- **Comment Commands**: Update issues via `/status` and `/priority` comments
- **Manual Labels**: Apply via GitHub UI if automation fails

**4. Error Recovery**
- Clear error messages with suggested fixes
- Fallback ID generation if API calls fail
- Non-critical failures don't stop the workflow

**5. GitHub Actions Support**
- Auto-labeling based on issue titles and content
- Comment-based status updates
- Works alongside scripts, not replacing them

### VS Code Integration
Use Command Palette → "Tasks: Run Task" to access:
- "GitHub: Create Feature Issue (Smart)"
- "GitHub: Create Enhancement Issue (Smart)" 
- "GitHub: Create Bug Issue (Smart)"
- "GitHub: Update Issue Status"
- "GitHub: List Open Issues"
- "GitHub: View Project Board"

---

## Simplified Label System

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

### ❌ REMOVED Labels (No Longer Used)
The following labels were removed per user feedback to simplify workflow:
- `epic`, `epic-item` 
- `has-dependencies`, `has-dependents`
- Complex relationship labels

---

## Development Workflow

### 1. Issue-First Development
```bash
# 1. Create issue for work
./scripts/create-feature-issue.sh "OAuth Integration" "Add Google OAuth login" "Phase 6" "High"

# 2. Update status when starting work  
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"

# 3. Implement the feature
# [Your implementation work here]

# 4. Update status when complete
./scripts/update-issue-status.sh "FEAT-001" "status-complete"
```

### 2. Quality Assurance
- Ensure implementation fulfills issue acceptance criteria
- Test all functionality thoroughly
- Update issue with implementation notes if needed
- Coordinate with Gemini CLI for validation

### 3. Documentation Updates
- Update relevant documentation if feature changes workflow
- Ensure README reflects current application state
- Keep `.aicontext/context.md` current with handoff logs

---

## Three-Way Collaboration Protocol

### Critical Protocol Rules

1. **Shared Context File**: `.aicontext/context.md` is our primary communication hub
2. **Handoff Log**: Add timestamped entries in the "Agent Handoff & Status Log" section
3. **The Golden Rule**: 
   - **Read First**: ALWAYS read `.aicontext/context.md` at start of every task
   - **Write Last**: ALWAYS update handoff log at end of every completed task
4. **Issue References**: Always include relevant GitHub issue numbers in handoff logs

### Handoff Template
```markdown
**Timestamp:** [YYYY-MM-DDTHH:MM:SSZ]
**From:** Claude Code
**To:** User/Gemini CLI
**Status:** [FEATURE_COMPLETE|TASK_COMPLETE|SESSION_RESUMED]
**Branch:** [current git branch]
**Issues Worked On:** [#123: FEAT-001, #124: ENH-002]
**Summary:** [What you accomplished]
**Technical Details:** [Implementation specifics, files modified, functions added]
**Context Preservation:** [Critical info for next agent]
**Next:** [What should happen next]
```

---

## Setup Requirements

### Prerequisites
1. **Repository Setup**: Run `./scripts/setup-github-labels.sh` once to create required labels
2. **GitHub CLI**: Must be authenticated (`gh auth status`)
3. **Permissions**: Repository write access, GitHub Projects access
4. **VS Code**: Optional but recommended for task integration

### Required Environment
- **Repository**: `petergiordano/category-blueprint`
- **Project Board**: https://github.com/users/petergiordano/projects/1
- **Production App**: https://category-blueprint.vercel.app/
- **Development Server**: `http://localhost:3000` (when running locally)

---

## Application Context

### What You're Working On
- **Interactive GTM Blueprint** - A web application for B2B SaaS go-to-market strategy development
- **Tech Stack**: HTML/CSS/JavaScript frontend, Vercel serverless functions, Brave Search API
- **Key Features**: Segment Foundation, AI-powered drafters, ICP analysis, company context setup
- **Current Phase**: All major features complete, production deployed

### Key Implementation Files
- **`index.html`** - Main application (single-page application)
- **`api/*.js`** - Serverless functions for AI-powered features
- **`.env.local`** - Environment variables (BRAVE_API_KEY)
- **`package.json`** - Dependencies and scripts
- **`vercel.json`** - Deployment configuration

---

## Build & Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
vercel dev

# Open application
open http://localhost:3000
```

### Production Deployment
```bash
# Deploy to Vercel (automatically triggered by git push to main)
vercel deploy --prod
```

### Issue Management
```bash
# List current issues
gh issue list --repo petergiordano/category-blueprint

# View specific issue
gh issue view 123 --repo petergiordano/category-blueprint

# Create issues via scripts (preferred)
./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"
```

---

## Quality Standards

### Implementation Requirements
- Follow existing code patterns and conventions
- Ensure responsive design (mobile-friendly)
- Maintain Scale Venture Partners brand guidelines
- Test functionality across different browsers
- Validate with real user scenarios

### Issue Management Requirements
- Create issues before starting significant work
- Update issue status accurately and promptly
- Include clear acceptance criteria in issue descriptions
- Reference relevant issues in commit messages
- Coordinate with other agents through handoff logs

---

## 🔴 MANDATORY CHECKPOINTS

### When You Must Update Handoff Log
- Complete any FEAT/ENH/BUG issue
- Make significant code changes (50+ lines)
- Resolve implementation challenges
- Session start/end
- Before any git push

### Validation Triggers
- Feature implementation complete → Request Gemini CLI validation
- Significant changes made → Update issue status
- Production deployment → Verify functionality

---

## Reference Documentation

### Current Documentation
- **`docs/GITHUB_CLI_ISSUE_TRACKING_SETUP.md`** - Complete setup guide
- **`docs/DATABASE_DRIVEN_WORKFLOW.md`** - Simplified workflow rules
- **`docs/GEMINI_CLI_TRAINING_PROMPT.md`** - Comprehensive Gemini CLI training
- **`.vscode/tasks.json`** - VS Code task definitions
- **`.github/ISSUE_TEMPLATE/feature_request.md`** - GitHub issue template

### Project Context
- **`.aicontext/context.md`** - Shared context and handoff logs
- **Current production status** - All major features deployed and working

---

**Simplified Database-Driven Protocol Ready**: Focus on clean individual issue tracking, quality implementation, and seamless three-way collaboration through GitHub Issues as the authoritative data source.