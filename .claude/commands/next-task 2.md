# Next Task - AI-Assisted Task Selection

Auto-select the highest priority task, update status to "In Progress", and create an implementation plan.

## Purpose

This command streamlines the task selection process by:
- Analyzing current project state and available tasks
- Selecting the most logical next task based on dependencies and priorities
- Creating a focused implementation plan
- Setting up the development environment for the selected task

## Process

1. **Project State Analysis**
   - Read current PRD status and component progress
   - Identify available tasks that aren't blocked by dependencies
   - Assess current development context and momentum

2. **Task Prioritization Logic**
   - Dependency Analysis: Tasks with no unmet dependencies
   - Sequential Logic: Next logical component in the pipeline
   - Impact Assessment: Tasks that unblock other work
   - Effort Estimation: Balance impact vs. implementation complexity

3. **Implementation Planning**
   - Break down selected task into concrete steps
   - Identify required resources and dependencies
   - Create development checklist with validation criteria
   - Set up tracking and progress monitoring

## Implementation

### Phase 1: Analyze Available Work

**Read Project State:**
- `docs/specifications/PRD.md` - Overall component status
- `docs/specifications/` - Existing feature specifications
- Current branch status and recent commits
- Development environment and tool availability

**Task Selection Criteria:**
```
Priority Order:
1. Unblocked components with complete feature specs
2. Next sequential component in pipeline (if previous complete)
3. Infrastructure/setup tasks that enable future work
4. Documentation/testing gaps in completed components
5. Optimization/enhancement tasks
```

### Phase 2: Smart Task Selection

**Decision Logic:**
```python
# Pseudo-logic for task selection
if incomplete_components_with_specs:
    select_highest_priority_ready_component()
elif next_sequential_component_ready:
    select_next_in_pipeline()
elif infrastructure_needed:
    select_blocking_infrastructure_task()
elif quality_gaps_exist:
    select_quality_improvement_task()
else:
    suggest_next_iteration_planning()
```

**Selection Factors:**
- **Readiness**: Complete feature specification available
- **Dependencies**: All prerequisite components completed
- **Impact**: Enables other components or delivers user value
- **Momentum**: Builds on recent development work
- **Complexity**: Appropriate for current session length

### Phase 3: Implementation Plan Creation

**Task Breakdown Template:**
```
🎯 SELECTED TASK: [Component/Task Name]
📋 SCOPE: [Brief description of what will be accomplished]

🔧 IMPLEMENTATION PLAN:
1. [Setup/preparation step]
2. [Core implementation step 1]
3. [Core implementation step 2]
4. [Testing/validation step]
5. [Integration/completion step]

📝 SUCCESS CRITERIA:
- [ ] [Functional requirement 1]
- [ ] [Functional requirement 2]
- [ ] [Quality requirement]
- [ ] [Integration requirement]

⏱️ ESTIMATED EFFORT: [Time estimate]
🧪 VALIDATION: [How to test completion]
```

### Phase 4: Development Environment Setup

**Prepare Workspace:**
- Create or switch to appropriate feature branch
- Ensure development dependencies are available
- Set up test data or reference materials
- Configure any required services or APIs

**Context Loading:**
- Read relevant feature specification
- Load architectural guidelines and patterns
- Review related component implementations
- Prepare debugging and monitoring tools

## Output Format

```
🔍 PROJECT ANALYSIS COMPLETE
Current Status: [X of N] components complete
Active Branch: [branch name]
Last Commit: [recent commit summary]

🎯 RECOMMENDED NEXT TASK
Component: [Selected component name]
Priority: [High/Medium/Low] (Reason: [why this task now])
Readiness: [Dependencies met/Feature spec ready/etc.]

📋 IMPLEMENTATION PLAN
[Detailed step-by-step plan as generated above]

🚀 READY TO START?
The task has been set up and is ready for implementation.
Development environment configured and dependencies verified.

💡 ALTERNATIVE OPTIONS
If you prefer a different task:
1. [Alternative task option 1]
2. [Alternative task option 2]
3. [Alternative task option 3]
```

## Decision Framework

### Task Readiness Assessment
- **Green**: Feature spec complete, dependencies met, clear success criteria
- **Yellow**: Minor blockers or spec gaps, but implementable
- **Red**: Major dependencies missing or spec incomplete

### Priority Weighting
1. **User Impact** (40%): How much does this advance user-facing functionality?
2. **Technical Dependencies** (30%): Does this unblock other components?
3. **Development Momentum** (20%): Does this build on recent work?
4. **Implementation Risk** (10%): How confident are we in the approach?

### Common Selection Patterns

**Early Project**: Focus on foundational components that enable other work
**Mid Project**: Prioritize components that complete user workflows
**Late Project**: Emphasize integration, quality, and performance optimization

## Template Customization

### Adapting the Selection Logic

1. **Define Your Pipeline**: Customize the component dependency logic for your specific workflow
2. **Set Priority Weights**: Adjust the priority factors based on your project goals
3. **Configure Readiness Checks**: Define what makes a task "ready" in your domain
4. **Customize Success Criteria**: Set domain-specific validation requirements

### Example Customizations

**Data Processing Pipeline**:
- Prioritize data validation components early
- Focus on throughput and accuracy metrics
- Consider data source availability and quality

**Content Generation System**:
- Prioritize quality and consistency features
- Focus on user experience and output polish
- Consider API costs and rate limiting

**API Integration Project**:
- Prioritize connection stability and error handling
- Focus on data mapping and transformation logic
- Consider authentication and security requirements

## Notes

- This command should work autonomously but allow for user override
- Always provide clear reasoning for task selection
- Include fallback options if the recommended task isn't suitable
- Ensure selected tasks align with overall project strategy and PRD goals