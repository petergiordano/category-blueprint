# Database-Driven Development Workflow

**Philosophy**: GitHub Issues & Projects are the database. Keep it simple and focused.

---

## Quick Start Guide

### 1. Create Individual Issues
```bash
# Feature 
./scripts/create-feature-issue.sh "User Authentication" "Login and session management" "Phase 6" "High"

# Enhancement  
./scripts/create-enhancement-issue.sh "Improve Login Speed" "Optimize authentication performance" "Phase 6" "Medium"

# Bug fix
./scripts/create-bug-issue.sh "Login Timeout" "Sessions expire too quickly" "Phase 6" "High"
```

### 2. Track Everything in GitHub Projects
- **Live Status**: https://github.com/users/petergiordano/projects/1
- **No file-based status tracking**: GitHub Projects is the single source of truth
- **Simple status labels**: status-todo, status-in-progress, status-complete

---

## The Database-First Rules

### ✅ Do This (Database-Driven)
- **Create GitHub Issue for every feature, bug, enhancement**
- **Update issue status as work progresses** 
- **Use GitHub Projects board for visual management**
- **Reference issue numbers in commit messages and code**
- **Keep each issue focused and independent**

### ❌ Don't Do This (File-Driven)
- **Track status in markdown files**
- **Create TODO lists in documentation** 
- **Maintain feature lists outside GitHub Issues**
- **Duplicate issue data in files**
- **Create complex dependency webs between issues**

---

## Simple Issue Management

### Core Issue Creation Commands
```bash
# Feature 
./scripts/create-feature-issue.sh "User Authentication" "Complete login system" "Phase 6" "High"

# Enhancement
./scripts/create-enhancement-issue.sh "Faster Authentication" "Improve login speed" "Phase 6" "Medium"

# Bug Fix
./scripts/create-bug-issue.sh "Login Timeout" "Fix session expiration issue" "Phase 6" "High"

# Universal AI-powered creation
./scripts/create-issue-ai.sh "FEAT" "Smart Dashboard" "AI-powered analytics dashboard" "Phase 6"
```

### Status Management
```bash
# Update status
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"
./scripts/update-issue-status.sh "FEAT-001" "status-complete"

# View all issues
gh issue list --repo petergiordano/category-blueprint --state all
```

---

## AI Agent Integration

### For Claude Code
1. **Always create issues before implementing**
2. **Update issue status as work progresses**
3. **Include issue numbers in commit messages**
4. **Use VS Code tasks for streamlined issue management**

### For Gemini CLI  
1. **Validate implementations match GitHub Issue requirements**
2. **Check that issue status reflects actual progress**
3. **Verify issue descriptions are complete and clear**
4. **Report discrepancies with specific recommendations**

### For User/Project Director
1. **Manage work through GitHub Projects board**
2. **Prioritize via issue labels and assignments** 
3. **Review progress through issue status**
4. **Create epics only when you need to group related work**

---

## VS Code Integration

Open Command Palette (Cmd/Ctrl+Shift+P) → "Tasks: Run Task":

### Essential Tasks
- **GitHub: Create Feature Issue (Smart)** - Standard feature creation
- **GitHub: Create Enhancement Issue (Smart)** - Improvements to existing features
- **GitHub: Create Bug Issue (Smart)** - Bug reporting and fixes
- **GitHub: Update Issue Status** - Change issue status
- **GitHub: List Open Issues** - Current work overview
- **GitHub: View Project Board** - Open GitHub Projects

---

## File Integration Patterns

### PRD Documents (Reference Only)
```markdown
## Core Features Status

**Live Dashboard**: [GitHub Projects](https://github.com/users/petergiordano/projects/1)

| Feature | GitHub Issue | Status |
|---------|--------------|--------|  
| Authentication | [FEAT-001](https://github.com/petergiordano/category-blueprint/issues/1) | *See GitHub Projects* |
| User Profiles | [FEAT-002](https://github.com/petergiordano/category-blueprint/issues/2) | *See GitHub Projects* |

**Note**: All status tracking is in GitHub Projects, not this file.
```

### Feature Specs (Simple References)
```markdown  
# Feature Specification: User Authentication

**GitHub Issue**: [FEAT-001](https://github.com/petergiordano/category-blueprint/issues/1)

## Implementation Requirements
[Detailed spec content...]

## Completion Criteria  
Implementation complete when FEAT-001 is marked status-complete.
```
```

### Implementation Logs (Issue-Referenced)
```markdown
# Implementation Log: FEAT-001 User Authentication  

**GitHub Issue**: https://github.com/petergiordano/category-blueprint/issues/1  
**Status Updates**:
- Started: Updated issue to "status-in-progress"
- Milestone 1: Authentication service complete
- Milestone 2: Unit tests passing  
- Completed: Updated issue to "status-complete"

[Implementation details...]
```

---

## Migration from File-Based Systems

### Step 1: Create Issues for Existing Features
```bash
# For each feature in old PRD/docs
./scripts/create-feature-issue.sh "[Feature Name]" "[Description from docs]" "Phase X" "Priority"
```

### Step 2: Create Relationships
```bash  
# Link features that depend on each other
./scripts/link-related-issues.sh "FEAT-001" "FEAT-002" "depends-on"

# Create epics for groups of features
./scripts/create-epic-issues.sh "Epic Name" "Epic Description" "Phase X" "Feature 1" "Feature 2"
```

### Step 3: Update Documentation
- **Remove status tracking from files**
- **Add GitHub Issue links to replace status**  
- **Reference GitHub Projects for live status**
- **Keep only context and specifications in files**

---

## Quality Assurance

### Daily Status Checks
```bash
# My current work
gh issue list --repo petergiordano/category-blueprint --assignee @me --state open

# Project progress  
gh issue list --repo petergiordano/category-blueprint --milestone "Phase 6"

# Relationship integrity
gh issue list --repo petergiordano/category-blueprint --label has-dependencies
```

### Issue Health Validation
- **No orphaned issues**: Every issue connected to epic or other issues
- **Status accuracy**: GitHub Issue status matches implementation reality  
- **Relationship integrity**: Dependencies make technical sense
- **Epic progress**: Feature completion rolls up to epic goals

---

## Emergency Protocols

### Context Loss Recovery
1. **Check GitHub Projects board**: https://github.com/users/petergiordano/projects/1
2. **List current work**: `gh issue list --assignee @me --state open`  
3. **Identify relationships**: Check issue comments for dependencies
4. **Resume from issue**: Use issue description as context

### Agent Handoff  
```markdown
**GitHub Issues Involved**: [#123: FEAT-001, #124: ENH-002]  
**Issue Status Updates**:
- FEAT-001 (#123): status-todo → status-complete  
- ENH-002 (#124): status-todo → status-in-progress (blocked by FEAT-001, now unblocked)
**Next Agent Focus**: Complete ENH-002 implementation, update issue status when done
```

---

**Success Metrics**:
- ✅ 100% features tracked as GitHub Issues
- ✅ Clear relationships between all related issues  
- ✅ GitHub Projects board reflects accurate status
- ✅ Zero duplicate tracking in files
- ✅ All agents coordinate through issues, not files