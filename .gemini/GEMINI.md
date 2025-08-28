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
