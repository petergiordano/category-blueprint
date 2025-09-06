# Finalize Task - Complete Current Work

Auto-detect current task, run tests, generate commit commands, and update project status to "Done".

## Purpose

This command provides a comprehensive completion workflow:
- Automatically detect the current task/component being worked on
- Run appropriate tests and quality checks
- Generate proper commit messages following project conventions
- Update project documentation and status tracking
- Prepare for the next development cycle

## Process

1. **Current Work Detection**
   - Analyze git status and recent changes
   - Identify modified files and their relationships to components
   - Determine which task/component is being completed

2. **Quality Validation**
   - Run component-specific tests and validation
   - Check code quality and style compliance
   - Verify integration with existing components
   - Validate against success criteria from feature spec

3. **Documentation Updates**
   - Update PRD component status
   - Generate or update implementation logs
   - Update any relevant architectural documentation
   - Create completion summary with metrics

4. **Git Workflow Completion**
   - Generate appropriate commit message
   - Provide commands for commit and push
   - Suggest PR creation if appropriate
   - Clean up development artifacts

## Implementation

### Phase 1: Work Detection Analysis

**Git Status Analysis:**
```bash
# Analyze current changes
git status --porcelain
git diff --name-only
git log --oneline -5
```

**File Change Mapping:**
- Map changed files to project components
- Identify the primary component being worked on
- Detect if this is a new feature, bug fix, or enhancement
- Check for any cross-component changes

**Component Identification Logic:**
```
IF changes in src/[component_name]/:
  → Working on Component: [component_name]
  
IF changes in docs/specifications/:
  → Working on: Documentation/Planning
  
IF changes in tests/:
  → Working on: Testing/Validation
  
IF changes in config/:
  → Working on: Configuration/Setup
```

### Phase 2: Quality Validation Checks

**Test Execution:**
```bash
# Run component-specific tests
[language-specific test command]

# Examples:
# Python: pytest tests/test_[component].py -v
# Node.js: npm test -- --grep "[component]"
# Go: go test ./[component]/...
```

**Code Quality Checks:**
```bash
# Style and linting
[language-specific linter]

# Examples:
# Python: black src/ && flake8 src/ && mypy src/
# Node.js: eslint src/ && prettier --check src/
# Go: gofmt -l . && golint ./...
```

**Integration Validation:**
- Test component interfaces with adjacent components
- Verify data flow and format compatibility
- Check error handling and edge cases
- Validate against reference test case

### Phase 3: Documentation Updates

**PRD Status Update:**
- Update component status from 🚧 IN PROGRESS to ✅ COMPLETE
- Add completion date and performance metrics
- Update any dependencies or next steps

**Implementation Log Creation:**
```markdown
## Component [Name] - Implementation Complete

**Completion Date**: [Date]
**Development Time**: [Estimated hours]
**Files Modified**: [List key files]

### What Was Built
- [Key feature 1]
- [Key feature 2]
- [Key feature 3]

### Performance Metrics
- [Metric 1]: [Value]
- [Metric 2]: [Value]

### Testing Results
- Unit Tests: [Pass/Fail count]
- Integration Tests: [Pass/Fail count]
- Reference Case: [Pass/Fail with details]

### Next Steps
- [Recommended next component]
- [Any follow-up items]
```

### Phase 4: Git Workflow Completion

**Commit Message Generation:**
```
[Component Type]: [Brief description]

- [Change 1]
- [Change 2]
- [Change 3]

[Performance/validation notes]

🤖 Generated with Claude Code
```

**Example Commit Messages:**
```
feat: Add data parser component

- Implement JSON to structured data conversion
- Add input validation and error handling
- Include comprehensive test suite
- Process reference test case in 0.3s (target: <1s)

🤖 Generated with Claude Code

fix: Improve error handling in voice generation

- Add retry logic for API timeouts
- Better error messages for invalid inputs
- Handle edge cases for empty dialogue
- All tests passing, 98% coverage maintained

🤖 Generated with Claude Code
```

## Output Format

```
🔍 CURRENT WORK ANALYSIS
Detected Component: [Component Name]
Files Modified: [Count] files
Primary Changes: [Brief summary]
Development Branch: [branch name]

🧪 QUALITY VALIDATION
✅ Unit Tests: [X/X passing]
✅ Integration Tests: [X/X passing]  
✅ Code Quality: [Linting/style checks passed]
✅ Reference Case: [Validation results]

📝 DOCUMENTATION UPDATES
✅ PRD Status: Updated to COMPLETE
✅ Implementation Log: Created
✅ Performance Metrics: Recorded

🚀 READY TO COMMIT
Generated Commit Message:
---
[Generated commit message]
---

Commands to execute:
git add .
git commit -m "[commit message]"
git push origin [branch]

💡 NEXT STEPS
1. Create pull request for review
2. Begin next component: [Recommended next task]
3. Update project planning based on learnings
```

## Validation Criteria

### Completion Checklist
- [ ] All planned functionality implemented
- [ ] Tests passing for component and integration
- [ ] Code quality checks passed
- [ ] Reference test case validates successfully
- [ ] Documentation updated appropriately
- [ ] Performance targets met

### Quality Gates
- **Functional**: Does it work as specified?
- **Tested**: Are all paths covered by tests?
- **Integrated**: Does it work with other components?
- **Documented**: Is it clear how to use and maintain?
- **Performant**: Does it meet speed/resource requirements?

## Template Customization

### Project-Specific Adaptations

1. **Test Commands**: Update test execution for your language/framework
2. **Quality Tools**: Configure linting and style checking for your stack
3. **Performance Metrics**: Define success criteria specific to your domain
4. **Documentation Structure**: Adapt logging format to your project needs
5. **Git Workflow**: Customize branch naming and commit conventions

### Domain Examples

**Data Processing Project**:
- Validate data accuracy and completeness
- Check processing speed and memory usage
- Test error handling for malformed inputs

**Content Generation Project**:
- Validate output quality and consistency
- Check API usage and cost metrics
- Test edge cases and error scenarios

**API Integration Project**:
- Validate request/response formats
- Check error handling and timeouts
- Test authentication and rate limiting

## Notes

- This command should be safe to run multiple times
- Always verify tests pass before finalizing
- Provide clear next steps after completion
- Maintain consistency with project conventions and standards
- Allow for manual override of auto-detection if needed