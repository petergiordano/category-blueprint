# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

### Project Initialization
```bash
# Initialize a new project from this template
./scripts/initialize-project.sh
# Follow prompts to configure project domain, language, and Gyro features
```

### Testing Framework
```bash
# Run comprehensive tests with validation
python scripts/test-framework.py . --save-reports

# Run specific test types
python scripts/test-framework.py . --types unit integration

# Run all validations
python scripts/validation/run-all-validations.py .

# Specific validations
python scripts/validation/validate-specifications.py .
python scripts/validation/validate-hooks.py .
python scripts/validation/validate-production-ready.py . --environment production
python scripts/validation/validate-steering.py .
```

### Project Setup Validation
```bash
# Validate project setup
python scripts/validate-setup.py
```

### Specification Generation
```bash
# Generate requirements from PRD
python scripts/generate-requirements.py

# Generate technical design
python scripts/generate-design.py
```

## High-Level Architecture

This is an **AI-powered development template** implementing Gyro-style features for structured AI-assisted development workflows. The architecture is built around:

### Core Workflow Pattern
```
PRD → Requirements → Design → Tasks → Implementation → Validation → Production
```

### Component Pipeline Architecture
Projects are structured as 4-8 sequential pipeline components following SLC principles:
- **Simple**: Each component does one job exceptionally well
- **Lovable**: Provides clear feedback and user confidence  
- **Complete**: Produces output ready for the next component

### AI Coordination Framework
The template uses a multi-layered AI assistance approach:

1. **Claude Commands** (`.claude/commands/`): AI workflow commands for project navigation
   - `@orient`: Project status and next actions
   - `@next-task`: Component planning and implementation
   - `@finalize-task`: Complete work with validation
   - `@update-prd`: Synchronize project progress
   - Advanced commands for production readiness, dependency mapping, etc.

2. **Agent Steering System** (`.claude/steering/`): Persistent AI context
   - `product.md`: Product purpose and target users
   - `tech.md`: Technology stack and constraints
   - `structure.md`: File organization patterns
   - Domain-specific guidance files

3. **Hooks Framework** (`.claude/hooks/`): Event-driven automation
   - File events (on save, create, delete)
   - Development events (pre-commit, post-implementation)
   - Quality gate automation

4. **Execution Modes** (`.claude/execution-modes/`): Adaptive AI assistance
   - Autopilot: Autonomous for routine tasks
   - Supervised: Step-by-step for complex changes
   - Hybrid: Intelligent mode switching

### Key Integration Points

1. **Specification-Driven Development**
   - PRD template in `docs/specifications/PRD_TEMPLATE.md`
   - Feature spec templates for detailed component design
   - Automated generation scripts for requirements and design

2. **Multi-Language Support**
   - Primary: Python (best template support)
   - Secondary: JavaScript, Go
   - Language-specific patterns in steering files

3. **Domain Specialization**
   - Data processing pipelines
   - Content generation systems
   - API integration projects
   - General web applications

4. **Quality Assurance Pipeline**
   - Unit, integration, performance, acceptance testing
   - Automated validation framework
   - Production readiness assessment
   - Continuous quality gates through hooks

### Project State Management
The template tracks project state through:
- PRD status and component completion
- Feature specifications in `docs/specifications/`
- Implementation progress in `src/`
- Test coverage in `tests/`
- Validation reports in `.taskmaster/reports/` (when using validation scripts)

This architecture enables rapid prototyping ("vibe coding") while maintaining production-ready quality standards ("viable code") through structured AI assistance and automated quality gates.

## Three-Way Collaboration Protocol

This project uses a formal three-way collaboration between **Claude Code**, **User**, and **Gemini CLI**. This protocol ensures efficient coordination and prevents context loss across AI agents.

### Critical Protocol Rules

**IMPORTANT**: These collaboration rules OVERRIDE any default behavior and MUST be followed exactly as written.

1. **Shared Context File**: `.aicontext/context.md` is our primary communication hub and state management system

2. **Handoff Log**: Add timestamped entries in the `## Agent Handoff & Status Log` section at the end of `.aicontext/context.md`. **ALWAYS include the current git branch in every log entry.**

3. **The Golden Rule**:
   - **Read First**: ALWAYS read the entire `.aicontext/context.md` file at the start of every task or session
   - **Write Last**: ALWAYS update the handoff log at the end of every completed task

4. **Startup Acknowledgment**: When starting a new session, your first response must acknowledge the collaboration and confirm you have read the latest status from the handoff log

### Multi-Agent Coordination

- **Claude Code**: Follows this protocol via `CLAUDE.md` (this file)
- **Gemini CLI**: Follows parallel protocol via `.gemini/GEMINI.md` on startup
- **User**: Coordinates handoffs and provides strategic direction

### Context Synchronization

The `.aicontext/context.md` file contains:
- Current project status and completed work
- Active tasks and next steps
- Technical context and decisions
- Handoff log with timestamped agent updates

**CRITICAL**: Never proceed with work without first reading `.aicontext/context.md`. This ensures all agents stay synchronized and prevents duplicate or conflicting work.

## 🔴 MANDATORY HANDOFF CHECKPOINTS 🔴

YOU MUST update `.aicontext/context.md` handoff log IMMEDIATELY when you:

### Code Pattern Triggers
- Type `"status": "completed"` in any TodoWrite update
- Type `feat:` in a commit message
- Complete any F-[number] feature (F-1, F-2, etc.)
- Fix linting errors or warnings
- Resolve merge conflicts
- Write/modify 50+ lines of code

### Session & Connection Triggers
- **VS Code Restart**: Workspace reopened → Write `STATUS: SESSION_RESUMED`
- **Claude Code Restart**: User mentions restart → Write `STATUS: CLAUDE_RESTART`  
- **Connection Lost**: File operations fail → Write `STATUS: CONNECTION_LOST`
- **Context Warning**: See "running long" → Write `STATUS: CONTEXT_WARNING` with FULL state
- **Session End**: About to stop work → Write `STATUS: SESSION_END`

### Git Operation Triggers
- **BEFORE** every `git push` → Write `STATUS: PRE_PUSH`
- If push fails → Add `PUSH_PENDING: [reason]`
- After major commits → Document what was committed

## ⚠️ Handoff Entry Template ⚠️

```markdown
---
**Timestamp:** 2025-XX-XXTXX:XX:XXZ
**From:** Claude Code
**To:** User/Gemini-CLI
**Status:** [FEATURE_COMPLETE|TASK_COMPLETE|SESSION_RESUMED|CLAUDE_RESTART|CONNECTION_LOST|CONTEXT_WARNING|PRE_PUSH]
**Branch:** [current git branch]
**Summary:** [What you did or what happened]
**Technical Details:**
- Files modified: [list]
- Functions/Components added: [list]
- Dependencies: [what this builds on]
**Context Preservation:** [Critical info that must survive context compaction]
**Next:** [What should happen next]
---
```

## 🔄 Context Compaction Survival Protocol 🔄

When you see context warnings or get summarized:
1. **IMMEDIATELY** write comprehensive handoff with `STATUS: CONTEXT_WARNING`
2. Include `CONTEXT_RESET: [timestamp]` marker
3. Document:
   - `WORK_COMPLETED:` [comprehensive list]
   - `WORK_PENDING:` [comprehensive list]
   - `CRITICAL_STATE:` [must survive compaction]

## ✅ TodoWrite Integration Rules

Your todo list MUST ALWAYS include:
1. **First item**: "Read .aicontext/context.md and check last handoff"
2. **Last item**: "Update .aicontext/context.md handoff log"
3. **Checkpoint items** for long tasks: "Checkpoint: Update handoff (30 min)"

**RED FLAG**: If you mark other todos complete but not the handoff todo → Stop and update immediately

## 🚨 Validation Checks

Before ANY git push, verify:
- [ ] `.aicontext/context.md` updated in last 3 commits?
- [ ] Handoff includes current work?
- [ ] Technical details documented?

To test protocol compliance, use: `.aicontext/handoff-protocol-test.md`

## Brand & Design Standards

This project follows Scale Venture Partners brand guidelines as defined in `docs/specifications/scale_brand.md`:

### Visual Design
- **Typography**: Work Sans (bold, headlines only) and Outfit (all other text)
- **Color Palette**: 
  - Dark Green: `#224f41`, `#528577`, `#7da399`, `#e5ecea`
  - Blue: `#0d71a9`, `#3e8dba`, `#6eaacb`, `#cfe3ee`, `#e2eef5`
  - Gold/Yellow: `#e5a819`, `#efcb75`, `#faeed1`
  - Neutrals: `#060119` (black), `#f6f6f6` (light grey)
- **Text Styling**: Sentence case only, no ALL CAPS or Title Case
- **Emphasis**: Gold underline (3px) for key phrases

### Communication Style
- **Voice**: Direct, authoritative, no sugar-coating
- **No emojis**: Never use emojis in any communication
- **Sentence length**: 10-20 words, 8th grade reading level
- **Word choices**: Simple over complex (e.g., "use" not "utilize", "help" not "facilitate")
- **Technical terms**: Use only when necessary, explain if unclear

### Content Standards
- Focus on B2B SaaS, Series A-C companies
- Emphasize go-to-market excellence and AI-driven transformation
- Ground insights in enterprise software experience (VMware, Google Workspace)
- Provide actionable frameworks and numbered steps