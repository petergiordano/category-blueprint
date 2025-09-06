# Database-Driven Development Workflow

**Philosophy**: GitHub Issues & Projects are the database. Files provide context and automation.

---

## Quick Start Guide

### 1. Create Issues First
```bash
# Feature with smart automation
./scripts/create-feature-issue.sh "User Authentication" "Login and session management" "Phase 6" "High"

# Enhancement  
./scripts/create-enhancement-issue.sh "Improve Login Speed" "Optimize authentication performance" "Phase 6" "Medium"

# Bug fix
./scripts/create-bug-issue.sh "Login Timeout" "Sessions expire too quickly" "Phase 6" "High"
```

### 2. Link Related Issues
```bash
# Create dependencies
./scripts/link-related-issues.sh "FEAT-001" "ENH-001" "depends-on"

# Create epics with features
./scripts/create-epic-issues.sh "User Management System" "Complete user lifecycle" "Phase 6" "Authentication" "Profile Management" "Permissions"
```

### 3. Track Everything in GitHub Projects
- **Live Status**: https://github.com/users/petergiordano/projects/1
- **No file-based status tracking**: GitHub Projects is the single source of truth
- **Relationships visible**: Issues show dependencies through comments and labels

---

## The Database-First Rules

### ✅ Do This (Database-Driven)
- **Create GitHub Issue for every feature, bug, enhancement**
- **Use issue relationships to show connections**
- **Update issue status as work progresses** 
- **Reference issue URLs in all documentation**
- **Use GitHub Projects board for visual management**

### ❌ Don't Do This (File-Driven)
- **Track status in markdown files**
- **Create TODO lists in documentation** 
- **Maintain feature lists outside GitHub Issues**
- **Duplicate issue data in files**

---

## Issue Relationships System

### Relationship Types & Usage
```bash
# Epic relationships  
./scripts/link-related-issues.sh "EPIC-001" "FEAT-001" "epic"

# Dependencies
./scripts/link-related-issues.sh "FEAT-001" "FEAT-002" "depends-on"  

# Blocking relationships
./scripts/link-related-issues.sh "BUG-001" "FEAT-003" "blocks"

# Subtasks
./scripts/link-related-issues.sh "FEAT-001" "FEAT-004" "subtask"
```

### Finding Related Issues
```bash
# All epic features
gh issue list --repo petergiordano/category-blueprint --label epic-item

# Dependencies
gh issue list --repo petergiordano/category-blueprint --label has-dependencies

# Blocking issues  
gh issue list --repo petergiordano/category-blueprint --label has-dependents
```

---

## AI Agent Integration

### For Claude Code
1. **Always create issues before implementing**
2. **Update issue status at milestones**
3. **Include issue URLs in handoff entries**
4. **Use VS Code tasks for issue management**

### For Gemini CLI  
1. **Validate against GitHub Issue requirements**
2. **Check issue status accuracy**
3. **Analyze relationship integrity**
4. **Report discrepancies with specific issue updates**

### For User/Project Director
1. **Manage epics in GitHub Projects board**
2. **Prioritize through issue assignment and milestones** 
3. **Review agent work via issue comments**
4. **Coordinate through issue relationships**

---

## VS Code Integration

Open Command Palette (Cmd/Ctrl+Shift+P) → "Tasks: Run Task":

### Primary Issue Management
- **GitHub: Create Feature Issue (Smart)** - Standard feature creation
- **GitHub: Create Epic with Features** - Bulk epic + features  
- **GitHub: Link Related Issues** - Create relationships
- **GitHub: Update Issue Status** - Change status

### Quick Views
- **GitHub: List Open Issues** - Current work overview
- **GitHub: View Project Board** - Open GitHub Projects
- **GitHub: Sync PRD Status** - Validate synchronization

---

## File Integration Patterns

### PRD Documents (Reference Only)
```markdown
## Core Features Status

**Live Dashboard**: [GitHub Projects](https://github.com/users/petergiordano/projects/1)

| Feature | GitHub Issues | Quick View |
|---------|---------------|------------|  
| Authentication | [FEAT-001](https://github.com/petergiordano/category-blueprint/issues/1) | [Search Issues](https://github.com/petergiordano/category-blueprint/issues?q=FEAT-001) |
| User Profiles | [FEAT-002](https://github.com/petergiordano/category-blueprint/issues/2) | [Search Issues](https://github.com/petergiordano/category-blueprint/issues?q=FEAT-002) |

**Note**: Status is managed in GitHub Projects, not this file.
```

### Feature Specs (Issue-Linked)  
```markdown  
# Feature Specification: User Authentication

**GitHub Issue**: [FEAT-001](https://github.com/petergiordano/category-blueprint/issues/1)  
**Epic**: [EPIC-001: User Management](https://github.com/petergiordano/category-blueprint/issues/5)  
**Dependencies**: [ENH-001](https://github.com/petergiordano/category-blueprint/issues/3)

## Implementation Requirements
[Detailed spec content...]

## Completion Criteria  
Implementation complete when GitHub Issue FEAT-001 can be closed.
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