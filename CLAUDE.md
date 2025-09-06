# CLAUDE.md - Database-Driven Development Protocol

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Version**: 2.0 - Database-Driven Protocol  
**Focus**: GitHub Issues & Projects as primary data source  
**Philosophy**: Database over files, relationships over isolation

---

## Core Development Principles

### 1. Database-First Approach
- **GitHub Issues**: Primary data source for all features, bugs, enhancements
- **GitHub Projects**: Live status tracking and workflow management
- **File-based docs**: Reference only, never duplicate GitHub Issues data

### 2. Relationship-Driven Development
- All issues must have clear relationships (epic, depends-on, blocks, subtask)
- Use relationship comments and labels to make connections visible
- No isolated issues - everything connects to something

### 3. AI-Powered Implementation
- Follow `docs/specifications/dev-cycle.md` workflow for component development
- Create issues first, implementation second
- Maintain bidirectional links between issues and implementation

---

## GitHub Issues Management

### Issue Creation Commands
```bash
# Feature issues
./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"

# Enhancements  
./scripts/create-enhancement-issue.sh "Enhancement Name" "Description" "Phase 6" "Medium"

# Bug fixes
./scripts/create-bug-issue.sh "Bug Name" "Description" "Phase 6" "High"

# Universal AI-powered creation
./scripts/create-issue-ai.sh "FEAT" "Title" "Description" "Phase 6"
```

### Epic & Relationship Management
```bash
# Create epic with related features
./scripts/create-epic-issues.sh "Epic Title" "Epic Description" "Phase 6" "Component 1" "Component 2"

# Link related issues
./scripts/link-related-issues.sh "FEAT-001" "FEAT-002" "depends-on"
./scripts/link-related-issues.sh "EPIC-001" "FEAT-001" "epic"

# Update issue status
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"
```

### Status Queries
```bash
# List current work
gh issue list --repo petergiordano/category-blueprint --assignee @me --state open

# View relationships
gh issue list --repo petergiordano/category-blueprint --label has-dependencies
gh issue list --repo petergiordano/category-blueprint --label epic-item

# Check project status
gh project list --owner petergiordano
```

---

## Three-Way Collaboration Protocol (Updated)

### Critical Protocol Rules

1. **GitHub Issues First**: Always create/update issues before implementation work
2. **Relationship Awareness**: Check issue relationships before starting work  
3. **Handoff Integration**: Include issue URLs in all handoff entries
4. **Status Synchronization**: Update issue status when completing work

### Multi-Agent Coordination

- **Claude Code**: Creates issues, implements features, updates issue status
- **Gemini CLI**: Validates implementations, analyzes issue relationships
- **User**: Manages epics, prioritizes issues, coordinates handoffs

### Issue-Integrated Handoffs

**Handoff Entry Template**:
```markdown
---
**Timestamp:** 2025-XX-XXTXX:XX:XXZ
**From:** Claude Code
**To:** User/Gemini-CLI
**Status:** [FEATURE_COMPLETE|EPIC_READY|ISSUE_BLOCKED]
**Branch:** [current git branch]
**GitHub Issues:** [#123, #124, #125 - links to all related issues]
**Summary:** [What was accomplished]
**Issue Status Updates:**
- FEAT-001 (#123): ✅ COMPLETE
- ENH-002 (#124): 🚧 IN PROGRESS  
- BUG-001 (#125): 📝 BLOCKED
**Next:** [What should happen next]
---
```

---

## Development Workflow Integration

### Step 1: Issue Planning Phase
1. **Create Epic Issue** (if needed): Use `create-epic-issues.sh`
2. **Create Feature Issues**: One issue per component
3. **Link Relationships**: Use `link-related-issues.sh`
4. **Validate Dependencies**: Check GitHub Projects board

### Step 2: Implementation Phase
1. **Select Issue**: Choose next unblocked issue from GitHub Projects
2. **Update Status**: Set to "status-in-progress"
3. **Create Branch**: `feature/FEAT-001-component-name`
4. **Follow dev-cycle.md**: Generate feature spec, implement, test

### Step 3: Completion Phase  
1. **Update Issue Status**: Set to "status-complete"
2. **Link Implementation**: Comment with PR links
3. **Update Relationships**: Mark dependencies as unblocked
4. **Create Handoff Entry**: Include all issue updates

---

## VS Code Integration

Use Command Palette (Cmd/Ctrl+Shift+P) → "Tasks: Run Task":

### Issue Creation Tasks
- **GitHub: Create Feature Issue (Smart)**: Standard feature creation
- **GitHub: Create Epic with Features**: Bulk epic + feature creation
- **GitHub: Create Enhancement Issue (Smart)**: Enhancement creation
- **GitHub: Create Bug Issue (Smart)**: Bug report creation

### Relationship Management Tasks
- **GitHub: Link Related Issues**: Create issue relationships
- **GitHub: Update Issue Status**: Change issue status
- **GitHub: Comment on Issue**: Add comments to issues

### Project Management Tasks
- **GitHub: List Open Issues**: View current work
- **GitHub: View Project Board**: Open GitHub Projects
- **GitHub: Sync PRD Status**: Check status synchronization

---

## File vs Database Guidelines

### ✅ Use Files For:
- **Code Implementation**: Source files, tests, documentation
- **Templates**: Reusable templates and patterns  
- **Reference Documentation**: Architecture guides, principles
- **Development Workflow**: Process documentation like dev-cycle.md

### ❌ Don't Use Files For:
- **Feature Tracking**: Use GitHub Issues instead
- **Status Management**: Use GitHub Projects instead
- **Task Lists**: Use GitHub Issues with relationships instead
- **Progress Tracking**: Use issue comments and status labels instead

### 🔄 File-to-Database Sync:
- **PRD Documents**: Should reference GitHub Issues, not duplicate them
- **Feature Specs**: Created from GitHub Issues, linked back to issues
- **Implementation Logs**: Reference issue URLs, update issue status

---

## Quality Gates & Validation

### Pre-Implementation Checks
- [ ] Issue exists with clear description
- [ ] Dependencies identified and linked
- [ ] No blocking relationships prevent work
- [ ] Issue assigned and status set to "in-progress"

### Implementation Validation
- [ ] Code follows existing patterns and standards
- [ ] Tests pass and coverage maintained
- [ ] Implementation matches issue requirements
- [ ] Related issues updated as needed

### Completion Validation
- [ ] Issue status updated to "complete"
- [ ] Implementation linked in issue comments
- [ ] Dependent issues unblocked
- [ ] Handoff entry created with issue updates

---

## Emergency Protocols

### Context Compaction Survival
When context limits approached:
1. **Prioritize Issue URLs**: Always include GitHub Issue links
2. **Status Snapshot**: Document all in-progress issue statuses
3. **Relationship Map**: Note critical dependencies and blockers
4. **Recovery Plan**: Clear next steps based on issue priorities

### Session Restoration  
When resuming after disconnection:
1. **Check Issue Status**: Review GitHub Projects board
2. **Validate Branch State**: Ensure branch matches issue progress
3. **Update Handoff**: Acknowledge session restart with current issue status
4. **Sync Implementation**: Ensure code state matches issue expectations

---

## Agent-Specific Guidelines

### For Claude Code (This Agent)
- **Always create issues before implementing features**
- **Update issue status at every major milestone**  
- **Include issue URLs in all handoff entries**
- **Use relationship scripts to connect related work**
- **Prefer VS Code tasks over direct CLI commands**

### For Gemini CLI Integration
- **Validate issue relationships match implementation**
- **Check for orphaned issues or missing dependencies**
- **Analyze issue completion patterns for bottlenecks**
- **Report discrepancies between issues and code state**

### For User Coordination
- **Use GitHub Projects board for visual status overview**
- **Create epics for multi-issue initiatives**  
- **Prioritize issues through GitHub milestone assignment**
- **Coordinate agent handoffs through issue assignment**

---

## Migration from Legacy Systems

### Deprecated Practices
- ❌ Maintaining status in markdown files
- ❌ Creating TODO lists in documentation
- ❌ Tracking features outside GitHub Issues
- ❌ Handoff entries without issue references

### New Database-Driven Practices
- ✅ All features tracked as GitHub Issues
- ✅ Status managed through GitHub Projects
- ✅ Relationships explicit through comments and labels
- ✅ Handoffs reference specific issue URLs

---

**Protocol Ready**: This database-driven development protocol ensures all work is tracked, relationships are clear, and agents can coordinate effectively through GitHub Issues and Projects.