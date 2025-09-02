# AI-Powered Product Development Workflow

**Note:** This document describes the high-level component development cycle. For detailed implementation guidance, AI coordination, and task management, see [WORKFLOW_GUIDE.md](../../.aicontext/WORKFLOW_GUIDE.md).

---
## 🧠 Step 1: Use the PRD as the Source of Truth
- The `docs/specifications/PRD.md` file is the master vision and roadmap for the product.
- It defines the big picture.
- This is the only document where full product context is maintained.

## 🔍 Step 2: Identify the Next Component to Build
- Open `docs/specifications/PRD.md` and review the next prioritized component.
- Use its context to guide your detailed planning.

## 🧾 Step 3: Generate a Detailed Feature Spec
- In Claude Chat Desktop (not claude code), paste in the PRD component context.
- Prompt it to generate a detailed feature spec using this structure:
  - **Filename:** `feat_spec-[component-name].md`
  - **Location:** `docs/specifications/`
  - **Contents should include:**
    - Purpose
    - Scope and boundaries
    - User flows
    - Edge cases
    - Logic requirements
    - UX/tech constraints
    - Test plan

## 🧠 Step 4: AI Assistant Implements Core Components
- Go to your preferred AI coding assistant (e.g., chatgpt.com/codex, claude.ai/code, etc.).
- Begin a session and tell the AI to read the feature spec you just created.
  - Example: `"Use docs/specifications/feat_spec-[component-name].md as input. Begin implementation."`
- The AI will:
  - Internally break down the feature spec into granular tasks.
  - Create a new branch for the implementation.
  - Implement the code and tests for the component.
  - Create a pull request (PR) upon completion.
  - Generate a detailed log of the tasks it created and completed for archiving.

## 🔍 Step 4.5: Review and Refine AI-Generated Tasks
- Before starting implementation, review all suggested tasks for accuracy and completeness
- **Critical Checks:**
  - Verify correct file references match your project structure
  - Confirm configuration paths point to correct locations
  - Check tasks align with existing codebase patterns and standards
- **Enhancement Opportunities:**
  - Add specific implementation guidance where helpful
  - Include technical approach details in task descriptions
  - Verify tasks reference correct dependencies and libraries
- **AI Assistance:** Use Claude Code or similar to help identify potential issues or suggest improvements to task descriptions
- **Edit Tasks:** Modify task descriptions before starting implementation
- **Validate Against Feature Spec:** Ensure all tasks contribute to meeting feature specification requirements

## 🧪 Step 5: Review + Merge
- Help the user switch to the branch the AI created. 
- Open the PR in GitHub or VS Code. 
- Review code, verify test coverage, and request edits if needed.
- Merge once satisfied.

## 🔄 Step 6: Loop Back to the PRD
- Mark the component as completed in `docs/specifications/PRD.md`.
- Update any roadmap insights, follow-ups, or notes.
- Return to Step 2 and select the next component.

## 🧰 Step 6.1: Archive Implementation Logs
- AI assistants will generate detailed logs of the tasks they created and completed for each component.
- These logs should be archived in `docs/implementation-logs/feat_spec-[component-name]-tasks.md` for historical reference and auditing.

## 🧰 Step 6.2: Two-Tier Task Management

### Core Component Tasks (AI-Managed)
- **Scope**: Components 1-N of the main pipeline (as defined in your PRD)
- **Management**: AI assistants operate with full autonomy - creates, executes, and tracks tasks independently
- **Tracking**: Detailed logs in `docs/implementation-logs/feat_spec-[component-name]-tasks.md`
- **No External Dependencies**: AI assistants do NOT access external task management systems for core component work

### Non-Core Tasks (External Task Management)
- **Scope**: Housekeeping, architectural, infrastructure, process, research, and maintenance tasks
- **Management**: Use your preferred task management system (Notion, GitHub Issues, etc.)
- **AI Access Control**: AI assistants access external systems only with explicit user instruction
- **Examples**: Documentation updates, dependency management, refactoring, CI/CD, security audits

### Task Type Decision Matrix
- **New Feature Implementation** → AI autonomous (core components)
- **Bug Fixes in Core Components** → AI autonomous
- **Documentation Updates** → External system (user-directed)
- **Infrastructure Changes** → External system (user-directed)
- **Process Improvements** → External system (user-directed)

---

## Workflow Customization Guide

### Adapting to Your Project
1. **Define Your Pipeline**: Identify 4-8 core components that form your processing pipeline
2. **Set Up PRD**: Use the PRD template to define your components and success criteria
3. **Configure AI Tools**: Set up Claude Code, Gemini CLI, or your preferred AI coding assistant
4. **Establish Testing**: Define your reference test case for validating each component
5. **Create Branches**: Use feature branches for each component implementation

### Best Practices
- **Keep Components Independent**: Each should work standalone and be testable independently
- **Maintain Clear Interfaces**: Define precise input/output formats between components
- **Validate Early and Often**: Test each component against your reference case
- **Document Decisions**: Use the two-tier logging system to track implementation choices
- **Iterate Based on Learning**: Update your PRD and templates based on what you learn

### Tool Integration
- **Version Control**: Use Git with feature branches for each component
- **AI Coordination**: Claude Code for complex tasks, specialized AIs for domain-specific work
- **Testing**: Automated testing for each component, integration testing for the pipeline
- **Documentation**: Keep PRD updated, archive implementation logs, maintain workflow guides

---

This workflow is designed to leverage AI assistance while maintaining human oversight and control over the development process. The key is balancing AI autonomy for implementation with human direction for strategy and architecture.