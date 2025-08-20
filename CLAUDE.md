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