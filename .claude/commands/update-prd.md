# Update PRD - Sync Project Status

Sync component completion status and project progress in the PRD.

## Purpose

This command maintains the PRD as the single source of truth by:
- Updating component status markers based on actual development progress
- Synchronizing completion dates and performance metrics
- Ensuring PRD accurately reflects current project state
- Providing accurate progress reporting for stakeholders

## Process

1. **Status Detection**
   - Scan project structure for completed components
   - Analyze test results and validation status
   - Check git history for implementation completion
   - Verify integration between components

2. **PRD Synchronization**
   - Update component status markers (📝 PLANNED → 🚧 IN PROGRESS → ✅ COMPLETE)
   - Add completion dates and performance metrics
   - Update dependency relationships
   - Refresh overall project progress indicators

3. **Validation**
   - Ensure status updates are accurate and consistent
   - Verify component interdependencies
   - Check that completed components meet success criteria
   - Validate overall project timeline and milestones

## Implementation

### Phase 1: Component Status Analysis

**File System Analysis:**
```bash
# Check for implementation files
ls src/               # Core implementation
ls tests/             # Test coverage
ls docs/specifications/feat_spec-*.md  # Feature specifications
```

**Git History Analysis:**
```bash
# Recent completion activity
git log --oneline --grep="feat:" --grep="complete" -10
git log --stat --since="1 week ago"
```

**Test Status Verification:**
```bash
# Component test results
[Run project test suite]
# Example: pytest tests/ -v --tb=short
```

### Phase 2: Status Mapping Logic

**Component Status Detection:**
```
Status: ✅ COMPLETE
Criteria:
- Implementation files exist in src/
- Tests exist and are passing
- Feature spec requirements met
- Integration with adjacent components verified

Status: 🚧 IN PROGRESS  
Criteria:
- Implementation files partially exist
- Some tests passing
- Feature spec exists
- Active development evident in git history

Status: 📝 PLANNED
Criteria:
- Feature spec exists or component defined in PRD
- No implementation files yet
- May have placeholder or design artifacts
```

**Dependency Validation:**
```
For each component:
1. Check if dependencies are completed
2. Verify integration points exist
3. Validate data flow compatibility
4. Confirm interface specifications match
```

### Phase 3: PRD Update Operations

**Status Marker Updates:**
```markdown
Before: * **Component 1: Data Parser** - 🚧 IN PROGRESS
After:  * **Component 1: Data Parser** - ✅ COMPLETE (2025-01-15)

Before: * **Component 2: Processor** - 📝 PLANNED  
After:  * **Component 2: Processor** - 🚧 IN PROGRESS
```

**Performance Metrics Addition:**
```markdown
### 3.1. Component 1: Data Parser ✅ COMPLETE
* **Status**: Complete (2025-01-15)
* **Performance**: 0.3s processing time (target: <1s)
* **Test Coverage**: 95% (target: >90%)
* **Reference Case**: Passes all validation criteria
```

**Progress Tracking Updates:**
```markdown
### 2.1. [N]-Component Pipeline Overview & Status
Current Progress: [X of N] components complete ([X]%)
Estimated Completion: [Date based on velocity]

* **Component 1: [NAME]** - ✅ COMPLETE (Date)
* **Component 2: [NAME]** - 🚧 IN PROGRESS 
* **Component 3: [NAME]** - 📝 PLANNED
```

### Phase 4: Consistency Validation

**Cross-Reference Checks:**
- Feature specs match PRD component descriptions
- Implementation satisfies success criteria from PRD
- Test results align with quality requirements
- Integration points work as specified

**Timeline Validation:**
- Completion dates are realistic and accurate
- Dependencies are properly sequenced
- Milestone targets are achievable
- Resource estimates remain valid

## Output Format

```
🔍 PROJECT STATUS ANALYSIS
Total Components: [N]
Completed: [X] ✅
In Progress: [Y] 🚧  
Planned: [Z] 📝

📝 PRD UPDATES REQUIRED
[List of specific updates needed]

✅ STATUS SYNCHRONIZATION COMPLETE
Updated PRD with current project state:
- Component statuses refreshed
- Completion dates added
- Performance metrics updated
- Progress indicators synchronized

📊 PROJECT PROGRESS SUMMARY
Overall Completion: [X]%
Estimated Timeline: [On track/Behind/Ahead]
Next Milestone: [Component Name] by [Date]

🎯 NEXT STEPS
1. [Next logical component to work on]
2. [Any blockers or dependencies to address]
3. [Suggested focus areas for upcoming work]
```

## Update Types

### Automatic Updates
- Component status changes (PLANNED → IN PROGRESS → COMPLETE)
- Completion dates when components finish
- Test results and coverage metrics
- Performance measurements from validation

### Manual Review Required
- Success criteria modifications
- Timeline adjustments based on learnings
- Scope changes or requirement updates
- Architecture decisions affecting multiple components

### Validation Checks
- Ensure no components marked complete without proper testing
- Verify dependencies are correctly sequenced
- Check that performance targets are realistic
- Confirm integration points are properly defined

## Template Customization

### Project-Specific Adaptations

1. **Status Criteria**: Define what "complete" means for your domain
2. **Metrics Tracking**: Choose relevant performance indicators
3. **Dependencies**: Map component relationships for your pipeline
4. **Timeline Logic**: Set realistic estimates based on your development velocity

### Domain Examples

**Data Processing Pipeline**:
- Track data accuracy and throughput metrics
- Monitor processing time and resource usage
- Validate data quality and completeness

**Content Generation System**:
- Track output quality and consistency metrics
- Monitor API usage and costs
- Validate content standards and guidelines

**API Integration Project**:
- Track response times and reliability metrics
- Monitor error rates and recovery times
- Validate data mapping and transformation accuracy

## Notes

- Run this command after major development milestones
- Always verify accuracy before updating stakeholder communications
- Use as input for sprint planning and progress reporting
- Maintain consistency with external project tracking tools
- Consider automating this as part of CI/CD pipeline for continuous accuracy