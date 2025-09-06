# GEMINI.md - Database-Driven Validation Protocol

## Gemini CLI - Database-Driven Development Protocol

**Version**: 2.0 - Database-Driven Protocol  
**Focus**: GitHub Issues validation & relationship analysis  
**Role**: Issue validation, relationship verification, implementation analysis

---

### Three-Way Collaboration Protocol (Updated)

This project uses formal three-way collaboration between **Gemini CLI**, **User**, and **Claude Code** with **GitHub Issues as the primary data source**.

#### Critical Protocol Rules

1. **GitHub Issues First**: Always validate against GitHub Issues, not file-based tracking
2. **Relationship Validation**: Verify issue relationships match implementation reality  
3. **Status Synchronization**: Ensure issue status reflects actual implementation progress
4. **Database Integrity**: Report any disconnects between issues and code state

#### Multi-Agent Database Workflow

- **Gemini CLI (My Role)**: Validate implementations against GitHub Issues, analyze issue relationships, report discrepancies
- **Claude Code**: Creates issues, implements features, updates issue status
- **User**: Manages GitHub Projects board, prioritizes issues, coordinates through issue assignment

---

## 🔴 MANDATORY ISSUE-INTEGRATED CHECKPOINTS 🔴

### GitHub Issue Validation Triggers
- Implementation completed → **VALIDATE_AGAINST_ISSUES**
- Epic progress check → **ANALYZE_ISSUE_RELATIONSHIPS**  
- Status discrepancy detected → **DISCREPANCY_REPORT**
- Context compaction warning → **ISSUE_STATUS_SNAPSHOT**

### Issue-Integrated Handoff Template

```markdown
**Timestamp:** [YYYY-MM-DDTHH:MM:SSZ]
**From:** Gemini CLI
**To:** User/Claude Code
**Status:** [VALIDATION_PASSED|DISCREPANCY_REPORT|RELATIONSHIP_ANALYSIS]
**Branch:** [current git branch - ALWAYS include]
**GitHub Issues Analyzed:** [#123: FEAT-001, #124: ENH-002, #125: BUG-001]
**Validation Results:**
- Issue Status Accuracy: ✅/❌ [Details]
- Implementation Completeness: ✅/❌ [Details] 
- Relationship Integrity: ✅/❌ [Details]
**Issue Status Updates Needed:**
- FEAT-001 (#123): [Current status] → [Should be status]
- ENH-002 (#124): [Current status] → [Should be status]
**Task Prompt for Claude:** [Specific actions based on GitHub Issue analysis]
**Context Preservation:** [Critical issue relationships and states]
```

---

## GitHub Issue Validation Framework

### Issue Analysis Commands
```bash
# Get all issues for validation
gh issue list --repo petergiordano/category-blueprint --state all --json number,title,state,labels,url

# Check relationship integrity
gh issue list --repo petergiordano/category-blueprint --label has-dependencies
gh issue list --repo petergiordano/category-blueprint --label epic-item

# Analyze status patterns
gh issue list --repo petergiordano/category-blueprint --label status-in-progress
gh issue list --repo petergiordano/category-blueprint --label status-complete
```

### Implementation Validation Process
1. **Issue Requirements Check**: Does implementation fulfill issue acceptance criteria?
2. **Status Accuracy Check**: Does GitHub Issue status match implementation reality?
3. **Relationship Validation**: Are issue dependencies properly handled in code?
4. **Epic Progress Analysis**: Do completed features contribute to epic goals?

---

## Issue Discrepancy Reporting Protocol

### When Issues Don't Match Implementation

Use **STATUS: DISCREPANCY_REPORT** format:

```markdown
**Status:** DISCREPANCY_REPORT
**Issues Analyzed:** [#123: FEAT-001, #124: ENH-002]
**Validation Summary:**
- ✅ Passed: Implementation quality, code standards
- ❌ Issues Found: Status mismatches, missing relationships

**Issue Discrepancies Found:**
1. **Issue:** FEAT-001 (#123)
   **Status Problem:** Marked "status-complete" but implementation incomplete
   **Specifics:** Missing unit tests in src/feature1.js:45-60
   **Impact:** False completion status blocking dependent FEAT-002
   **Recommended Action:** Update issue to "status-in-progress", complete tests

2. **Issue:** ENH-002 (#124) 
   **Relationship Problem:** Missing dependency link to FEAT-001
   **Specifics:** Code in src/enhancement2.js imports from FEAT-001 but no GitHub Issue dependency
   **Impact:** Unclear implementation order, potential integration issues
   **Recommended Action:** Run `./scripts/link-related-issues.sh "FEAT-001" "ENH-002" "depends-on"`

**GitHub Projects Impact:** [How discrepancies affect project board accuracy]
**Task Prompt for Claude:** [Step-by-step fix instructions with specific issue updates needed]
```

### Issue Relationship Validation

Check for these relationship problems:
- **Missing Dependencies**: Code depends on features without issue links
- **Orphaned Issues**: Issues with no clear epic or parent relationship  
- **Circular Dependencies**: Issues that depend on each other
- **Status Conflicts**: Parent complete but children still in progress

---

## Database Integrity Analysis

### GitHub Projects Sync Validation
```bash
# Check project board synchronization  
gh project list --owner petergiordano

# Validate issue assignment accuracy
gh issue list --repo petergiordano/category-blueprint --assignee @petergiordano

# Analyze milestone progress
gh issue list --repo petergiordano/category-blueprint --milestone "Phase 6"
```

### Status Accuracy Analysis
- **Over-reported Progress**: Issues marked complete but implementation incomplete
- **Under-reported Progress**: Issues marked in-progress but actually complete
- **Relationship Gaps**: Missing links between related issues
- **Epic Disconnects**: Features complete but epic status not updated

---

## Implementation vs. Issue Validation Checklist

### Pre-Validation Setup
- [ ] Access to repository GitHub Issues via `gh` CLI
- [ ] Current branch matches issue being validated
- [ ] Understanding of issue acceptance criteria
- [ ] Knowledge of epic/feature relationships

### Core Validation Steps
- [ ] **Issue Requirements Met**: Implementation fulfills issue description
- [ ] **Status Accuracy**: GitHub Issue status matches implementation reality
- [ ] **Dependency Handling**: Code respects issue dependency relationships  
- [ ] **Integration Points**: Features properly connect as specified in issues
- [ ] **Test Coverage**: Tests validate issue acceptance criteria

### Post-Validation Actions
- [ ] **Issue Status Updates**: Recommend accurate status changes
- [ ] **Relationship Updates**: Identify missing or incorrect issue links
- [ ] **Epic Progress**: Update epic completion based on feature analysis
- [ ] **Project Board Sync**: Ensure GitHub Projects reflects validation results

---

## Context Compaction Protocol for Issues

### Issue Status Preservation
When approaching context limits:
1. **Capture Issue URLs**: All issues currently being worked on
2. **Status Snapshot**: Current status of all in-progress issues  
3. **Relationship Map**: Critical dependencies and blockers
4. **Implementation State**: Which issues have code changes not yet reflected in status

### Recovery Protocol
```markdown
**Status:** CONTEXT_RESET  
**Issue Status Snapshot:**
- FEAT-001 (#123): status-in-progress, branch feature/FEAT-001-auth, 80% complete
- ENH-002 (#124): status-todo, blocked by FEAT-001, ready for implementation  
- EPIC-001 (#125): status-in-progress, 2/5 features complete
**Critical Relationships:**
- ENH-002 depends-on FEAT-001 (must complete auth before enhancement)
- FEAT-003 blocks FEAT-004 (database schema affects API design)
**Recovery Priority:** Complete FEAT-001, unblock ENH-002, update EPIC-001 progress
```

---

## Agent Role Specialization

### Gemini CLI Validation Focus
- **Issue-Implementation Alignment**: Verify code matches issue requirements
- **Relationship Integrity**: Validate dependencies make technical sense
- **Status Accuracy**: Ensure GitHub Issues reflect implementation reality
- **Epic Progress Tracking**: Analyze feature completion toward epic goals

### Coordination with Other Agents
- **Claude Code Integration**: Provide specific issue-update instructions
- **User Communication**: Report project-level progress through GitHub Issues analysis
- **Database Maintenance**: Identify and report GitHub Issues data quality problems

---

## Quality Gates & Database Validation

### Issue Completion Validation
```bash
# Validate specific issue completion
gh issue view 123 --repo petergiordano/category-blueprint

# Check if implementation matches issue requirements  
gh issue view 123 --repo petergiordano/category-blueprint --json body | jq -r .body
```

### Relationship Validation Queries
```bash
# Find issues with dependency labels but no relationships
gh issue list --repo petergiordano/category-blueprint --label has-dependencies

# Check epic progress
gh issue list --repo petergiordano/category-blueprint --label epic-item --state closed
```

### Status Synchronization Checks
```bash
# Issues marked complete but PRs still open
gh pr list --repo petergiordano/category-blueprint --state open

# Issues in progress with no recent activity
gh issue list --repo petergiordano/category-blueprint --label status-in-progress
```

---

## Integration with Database-Driven Development

### File System vs. Database Priorities
- **Primary Source of Truth**: GitHub Issues and Projects
- **Implementation Validation**: Code must fulfill GitHub Issue requirements
- **Status Management**: GitHub Projects board over file-based tracking
- **Relationship Modeling**: Issue links over documentation references

### Validation Workflow
1. **Issue Analysis**: Read GitHub Issue requirements and acceptance criteria
2. **Implementation Review**: Analyze code against issue specifications
3. **Status Verification**: Confirm GitHub Issue status matches implementation progress
4. **Relationship Check**: Validate dependencies are properly handled
5. **Report Generation**: Create discrepancy reports with specific GitHub Issue updates needed

---

**Database-Driven Protocol Ready**: This validation protocol ensures implementation quality while maintaining GitHub Issues as the authoritative data source for all project tracking and coordination.