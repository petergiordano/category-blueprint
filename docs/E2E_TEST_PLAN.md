# End-to-End Test Plan: Database-Driven Workflow System

**Test Date**: 2025-09-06  
**Tester**: Claude Code  
**System Version**: Database-Driven Protocol v2.0  
**Objective**: Validate complete workflow from issue creation → implementation → validation

---

## Test Environment Setup

### Prerequisites Checklist
- [ ] GitHub CLI authenticated (`gh auth status`)
- [ ] Repository access confirmed (`gh repo view petergiordano/category-blueprint`)
- [ ] GitHub Projects board accessible (https://github.com/users/petergiordano/projects/1)
- [ ] All scripts executable (`ls -la scripts/*.sh`)
- [ ] VS Code tasks.json loaded
- [ ] Agent protocols active (CLAUDE.md, .gemini/GEMINI.md)

---

## Test 1: Issue Creation Scripts

### 1.1 Feature Issue Creation
**Command**: `./scripts/create-feature-issue.sh "Test Feature" "Testing FEAT creation" "Phase 6" "High"`

**Expected Results**:
- [ ] Issue created with FEAT-XXX ID format
- [ ] Proper labels applied (enhancement, Phase 6, status-todo, priority-high)  
- [ ] Issue body contains structured format
- [ ] Issue added to GitHub Projects board
- [ ] Sequential ID generation works

**Actual Results**:
```
[To be filled during test execution]
```

### 1.2 Enhancement Issue Creation  
**Command**: `./scripts/create-enhancement-issue.sh "Test Enhancement" "Testing ENH creation" "Phase 6" "Medium"`

**Expected Results**:
- [ ] Issue created with ENH-XXX ID format
- [ ] Proper labels applied (enhancement, Phase 6, status-todo, priority-medium)
- [ ] Issue body contains structured format
- [ ] Issue added to GitHub Projects board

**Actual Results**:
```
[To be filled during test execution]
```

### 1.3 Bug Issue Creation
**Command**: `./scripts/create-bug-issue.sh "Test Bug" "Testing BUG creation" "Phase 6" "High"`

**Expected Results**:
- [ ] Issue created with BUG-XXX ID format  
- [ ] Proper labels applied (bug, Phase 6, status-todo, priority-high)
- [ ] Issue body contains structured format
- [ ] Issue added to GitHub Projects board

**Actual Results**:
```
[To be filled during test execution]
```

### 1.4 Epic Creation with Features
**Command**: `./scripts/create-epic-issues.sh "Test Epic" "Testing epic creation" "Phase 6" "Component A" "Component B"`

**Expected Results**:
- [ ] Epic issue created with EPIC-XXX ID
- [ ] Two feature issues created (FEAT-XXX)
- [ ] Automatic relationship linking (epic → features)
- [ ] All issues added to GitHub Projects board
- [ ] Proper epic/feature labels applied

**Actual Results**:
```
[To be filled during test execution]
```

---

## Test 2: Issue Relationship Management

### 2.1 Dependency Linking
**Command**: `./scripts/link-related-issues.sh "FEAT-001" "FEAT-002" "depends-on"`

**Expected Results**:
- [ ] Comment added to FEAT-002 indicating dependency on FEAT-001
- [ ] Comment added to FEAT-001 indicating it's a dependency for FEAT-002  
- [ ] Labels applied: has-dependencies, has-dependents
- [ ] Relationship visible in GitHub Issues

**Actual Results**:
```
[To be filled during test execution]
```

### 2.2 Epic Relationship Linking
**Command**: `./scripts/link-related-issues.sh "EPIC-001" "FEAT-003" "epic"`

**Expected Results**:
- [ ] Comment added to FEAT-003 indicating it's part of EPIC-001
- [ ] Comment added to EPIC-001 listing FEAT-003 as component
- [ ] epic-item label applied to FEAT-003
- [ ] Relationship visible in GitHub Issues

**Actual Results**:
```
[To be filled during test execution]
```

### 2.3 Status Updates
**Command**: `./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"`

**Expected Results**:
- [ ] Label changed from status-todo to status-in-progress
- [ ] Comment added documenting status change
- [ ] GitHub Projects board updated

**Actual Results**:
```
[To be filled during test execution]
```

---

## Test 3: VS Code Integration

### 3.1 Task Accessibility
**Test**: Open VS Code Command Palette → "Tasks: Run Task"

**Expected Results**:
- [ ] "GitHub: Create Feature Issue (Smart)" appears
- [ ] "GitHub: Create Epic with Features" appears  
- [ ] "GitHub: Link Related Issues" appears
- [ ] "GitHub: Update Issue Status" appears
- [ ] "GitHub: View Project Board" appears

**Actual Results**:
```
[To be filled during test execution]
```

### 3.2 Task Execution
**Test**: Execute "GitHub: Create Feature Issue (Smart)" task

**Expected Results**:
- [ ] Input prompts appear for title, description, phase, priority
- [ ] Task executes create-feature-issue.sh script
- [ ] Issue created successfully through VS Code
- [ ] Output displayed in VS Code terminal

**Actual Results**:
```
[To be filled during test execution]
```

---

## Test 4: GitHub Projects Integration

### 4.1 Board Access
**Test**: Visit https://github.com/users/petergiordano/projects/1

**Expected Results**:
- [ ] Project board loads successfully
- [ ] Test issues appear on board
- [ ] Issues show in appropriate status columns
- [ ] Labels and metadata visible

**Actual Results**:
```
[To be filled during test execution]
```

### 4.2 Status Flow
**Test**: Move issue through board columns manually

**Expected Results**:
- [ ] Issue status updates reflect in labels
- [ ] Status changes visible across GitHub Issues and Projects
- [ ] No synchronization issues

**Actual Results**:
```
[To be filled during test execution]
```

---

## Test 5: Agent Protocol Compliance

### 5.1 CLAUDE.md Protocol
**Test**: Read CLAUDE.md and verify database-driven principles

**Expected Results**:
- [ ] GitHub Issues First approach documented
- [ ] Issue creation commands present and accurate  
- [ ] Relationship management scripts referenced
- [ ] VS Code integration documented
- [ ] Handoff template includes GitHub Issues

**Actual Results**:
```
[To be filled during test execution]
```

### 5.2 GEMINI.md Protocol  
**Test**: Read .gemini/GEMINI.md and verify validation framework

**Expected Results**:
- [ ] Issue validation triggers documented
- [ ] GitHub CLI commands for analysis present
- [ ] Discrepancy reporting format defined
- [ ] Database integrity checks specified

**Actual Results**:
```
[To be filled during test execution]
```

---

## Test 6: Feature Spec Template Workflow

### 6.1 Template Content
**Test**: Review docs/specifications/FEATURE_SPEC_TEMPLATE.md

**Expected Results**:
- [ ] Feature ID integration present
- [ ] GitHub Issues references included
- [ ] Development cycle compatibility documented
- [ ] Post-implementation GitHub Issue management specified

**Actual Results**:
```
[To be filled during test execution]
```

---

## Test 7: Complete Workflow Simulation

### 7.1 Full Feature Development Cycle
**Scenario**: Create and implement a test feature following complete workflow

**Steps**:
1. Create epic with features using VS Code task
2. Link feature dependencies  
3. Create feature spec from template
4. Update issue status to in-progress
5. Simulate implementation completion
6. Update status to complete
7. Validate in GitHub Projects

**Expected Results**:
- [ ] All steps complete without errors
- [ ] Issue relationships maintained throughout
- [ ] GitHub Projects board reflects accurate status
- [ ] Documentation references align with reality

**Actual Results**:
```
[To be filled during test execution]
```

---

## Test Results Summary

### Issues Discovered
```
[To be documented during testing]
```

### Performance Metrics  
- **Issue Creation Time**: [Average time per issue type]
- **Relationship Linking Time**: [Average time per relationship]  
- **GitHub Projects Sync Time**: [Time for status updates to reflect]

### Recommendations
```
[Improvements identified during testing]
```

---

## Post-Test Actions

### Documentation Updates Required
- [ ] Fix any inaccurate command examples
- [ ] Update workflow guides based on test results
- [ ] Revise agent protocols if needed

### Script Improvements  
- [ ] Fix any bugs discovered in automation scripts
- [ ] Enhance error handling where needed
- [ ] Optimize performance bottlenecks

### Visualization Updates
- [ ] Create "As-built" version based on actual test results
- [ ] Include real timing and performance data
- [ ] Reflect actual user experience vs designed workflow

---

**Test Execution Ready**: This comprehensive test plan will validate all components of the database-driven workflow system and identify any improvements needed before finalizing the system.