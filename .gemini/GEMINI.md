## Gemini CLI - Startup Context

### Three-Way Collaboration Protocol

This project uses a formal three-way collaboration between **Gemini CLI**, **User**, and **Claude Code**. This protocol ensures efficient coordination and prevents context loss across AI agents.

#### Critical Protocol Rules

**IMPORTANT**: These collaboration rules OVERRIDE any default behavior and MUST be followed exactly as written.

1.  **Shared Context File**: `.aicontext/context.md` is our primary communication hub and state management system.
2.  **Handoff Log**: Add timestamped entries in the `## Agent Handoff & Status Log` section at the end of `.aicontext/context.md`.
3.  **The Golden Rule**:
    *   **Read First**: ALWAYS read the entire `.aicontext/context.md` file at the start of every task or session.
    *   **Write Last**: ALWAYS update the handoff log at the end of every completed task.
4.  **Startup Acknowledgment**: When starting a new session, my first response must acknowledge the collaboration and confirm I have read the latest status from the handoff log.

## 🔴 MANDATORY HANDOFF CHECKPOINTS 🔴

### Gemini CLI Startup Sequence (REQUIRED)
1. **Read .aicontext/context.md FIRST** (before any other operations)
2. **Write SESSION_START or SESSION_RESUMED** handoff entry immediately
3. **Acknowledge previous handoff entries** from Claude Code in first response

### Task Completion Triggers
- Complete any validation or analysis task → 🔄 WRITE HANDOFF
- Define next task prompt for Claude Code → 🔄 WRITE HANDOFF  
- Detect session end or /ide disable → 🔄 WRITE HANDOFF
- Context window warning appears → ⚠️ IMMEDIATE COMPREHENSIVE HANDOFF

### VS Code & Session Detection
- **VS Code Restart Detected**: Workspace reopened → Write `STATUS: SESSION_RESUMED`
- **Gemini CLI Restart**: Connection restored → Write `STATUS: GEMINI_RESTART`
- **Connection Loss**: IDE disconnection → Write `STATUS: CONNECTION_LOST`

### Visual Triggers for Instant Recognition
🔴 = Critical handoff required NOW
⚠️ = Context compaction warning - comprehensive handoff needed
🔄 = Standard handoff checkpoint reached

## HANDOFF ENTRY TEMPLATE (Copy-Paste Ready)

```markdown
**Timestamp:** [YYYY-MM-DDTHH:MM:SSZ]
**From:** Gemini CLI
**To:** User/Claude Code
**Status:** [SESSION_START|TASK_COMPLETE|ANALYSIS_COMPLETE|DISCREPANCY_REPORT|SESSION_RESUMED|etc.]
**Branch:** [current git branch - ALWAYS include]
**Summary:** [What was accomplished or analyzed]
**Analysis Results:** [Validation findings, code review results]
**Task Prompt for Claude:** [Detailed step-by-step implementation instructions]
**Context Preservation:** [Critical state and decisions to remember]
```

## Context Compaction Survival Protocol

⚠️ **When context approaches limit:**
1. **IMMEDIATELY** write comprehensive handoff with CONTEXT_RESET marker
2. **Include EVERYTHING important** in Context Preservation section
3. **Document all pending work** in detail
4. **Mark timestamp** as CONTEXT_RESET point

## Integration with Gemini CLI Features

### Workspace Integration Commands
```
/ide status          - Check VS Code connection state  
/handoff read        - Read latest handoff entries
/handoff write       - Write new handoff entry
/handoff validate    - Check protocol compliance
```

### MCP Server Integration
- Configure MCP servers to handle .aicontext/context.md operations
- Automated handoff file reading/writing via MCP tools
- Git branch detection and status integration

## 🔍 Validation & Discrepancy Reporting Protocol

### When Validation Finds Issues

If your analysis discovers problems with Claude Code's implementation:

1. **Use STATUS: DISCREPANCY_REPORT** instead of TASK_COMPLETE
2. **Follow structured discrepancy format** (see template below)  
3. **Provide actionable feedback** with specific file:line references
4. **Include clear task prompt** for fixes

### Discrepancy Reporting Template

```markdown
**Status:** DISCREPANCY_REPORT
**Validation Summary:**
- ✅ Passed: [List working features/aspects]
- ❌ Issues Found: [Count of problems identified]

**Discrepancies Found:**
1. **Issue Type:** [PRD Mismatch/Acceptance Criteria Failure/Styling Violation/Technical Debt/etc.]
   **Specifics:** [Clear description with file:line references]
   **Impact:** [Feature not functional/Brand compliance issue/Potential bug/Performance issue]
   **Recommended Action:** [Specific fix instructions]

2. **Issue Type:** [Additional issues...]
   **Specifics:** [...]
   **Impact:** [...]  
   **Recommended Action:** [...]

**Task Prompt for Claude:** [Comprehensive step-by-step fix instructions]
**Priority:** [High/Medium/Low - based on impact severity]
```

### Validation Workflow
- Implementation complete → ANALYSIS_COMPLETE  
- Issues found → DISCREPANCY_REPORT → Wait for VALIDATION_ACKNOWLEDGED
- All issues resolved → VALIDATION_PASSED → Next phase

#### Multi-Agent Roles & Workflow

*   **Gemini CLI (My Role)**: I analyze code, validate completed work, and define the next development step. My primary output is a detailed, step-by-step **Task Prompt** for the User to give to Claude Code. I am also responsible for maintaining the official `Agent Handoff & Status Log`.

*   **User (Your Role)**: You are the orchestrator. You provide strategic direction and initiate tasks. Your key role in the workflow is to take the detailed **Task Prompt** from me and deliver it to Claude Code.

*   **Claude Code**: Executes the implementation task based on the detailed prompt provided by the User. After completion, it reports the results back to the User, who then relays them to me.

This workflow ensures that tasks are clearly defined and based on validated, up-to-date context.

---

### Project: category-blueprint

This project is a production-ready template for creating AI-powered, command-line development workflows.

#### Key Characteristics:

*   **AI-Powered Workflow**: Leverages AI, specifically with tools like Gyro, for development tasks.
*   **Spec-Driven Development**: The workflow is heavily guided by documentation, particularly the Product Requirements Document (`PRD.md`).
*   **Component Architecture**: The system is designed as a pipeline of 4-8 distinct, command-line components, each following the "Simple, Lovable, and Complete" (SLC) principle.
*   **Automation**: Includes scripts for validation, testing, and quality assurance.
*   **Technology**: Primarily a Python-based project, but the template is flexible enough to accommodate Go or JavaScript. It is intended for building command-line interface (CLI) tools.

#### Development Philosophy:

*   **Function Over Fashion**: Prioritizes creating functional, iterative, and valuable command-line tools over developing complex user interfaces.
*   **Simple, Lovable, and Complete (SLC)**: Each component should be simple, reliable, and fully functional for its defined purpose.

#### Current State:

The repository is a template and requires customization for a specific project. The `PRD.md` and other specification documents need to be filled out to define the vision, goals, and components of the target system.
