#!/bin/bash

# AI-Powered Development Cycle - Project Initialization Script
# This script sets up the complete AI development workflow in a new project

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to prompt for user input with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -n "$prompt [$default]: "
    read -r input
    if [[ -z "$input" ]]; then
        eval "$var_name='$default'"
    else
        eval "$var_name='$input'"
    fi
}

# Function to validate required tools
check_dependencies() {
    print_status "Checking required dependencies..."
    
    local missing_tools=()
    
    # Check for git
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    # Check for VS Code (optional but recommended)
    if ! command -v code &> /dev/null; then
        print_warning "VS Code not found. Some features may not work optimally."
    fi
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_error "Please install missing tools and try again."
        exit 1
    fi
    
    print_success "All required dependencies found"
}

# Function to collect project information
collect_project_info() {
    print_status "Collecting project information..."
    echo
    
    # Get current directory name as default project name
    current_dir=$(basename "$PWD")
    
    prompt_with_default "Project name" "$current_dir" PROJECT_NAME
    prompt_with_default "Project description" "AI-powered automated system" PROJECT_DESCRIPTION
    prompt_with_default "Primary programming language" "python" PRIMARY_LANGUAGE
    prompt_with_default "Number of pipeline components" "6" COMPONENT_COUNT
    prompt_with_default "Project domain (data-processing/content-generation/api-integration/general)" "general" PROJECT_DOMAIN
    prompt_with_default "Enable Gyro-style features (spec-driven development, hooks, steering)" "y" ENABLE_GYRO
    
    # Convert project name to valid identifier
    PROJECT_ID=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g')
    
    echo
    print_status "Project Configuration:"
    echo "  Name: $PROJECT_NAME"
    echo "  ID: $PROJECT_ID"
    echo "  Description: $PROJECT_DESCRIPTION"
    echo "  Language: $PRIMARY_LANGUAGE"
    echo "  Components: $COMPONENT_COUNT"
    echo "  Domain: $PROJECT_DOMAIN"
    echo "  Gyro Features: $ENABLE_GYRO"
    echo
    
    echo -n "Proceed with this configuration? [Y/n]: "
    read -r confirm
    if [[ "$confirm" =~ ^[Nn]$ ]]; then
        print_error "Initialization cancelled by user"
        exit 1
    fi
}

# Function to set up directory structure
setup_directory_structure() {
    print_status "Setting up project directory structure..."
    
    # Create standard directories if they don't exist
    mkdir -p src tests config docs/implementation-logs docs/specifications
    
    # Create Gyro-style directories if enabled
    if [[ "$ENABLE_GYRO" =~ ^[Yy]$ ]]; then
        setup_gyro_directories
    fi
    
    # Language-specific setup
    case "$PRIMARY_LANGUAGE" in
        python)
            mkdir -p src/utils tests/unit tests/integration
            if [[ ! -f "requirements.txt" ]]; then
                touch requirements.txt
            fi
            if [[ ! -f "pyproject.toml" ]]; then
                cat > pyproject.toml << EOF
[build-system]
requires = ["setuptools>=45", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "$PROJECT_ID"
version = "0.1.0"
description = "$PROJECT_DESCRIPTION"
readme = "README.md"
requires-python = ">=3.8"
dependencies = []

[tool.black]
line-length = 88
target-version = ['py38']

[tool.isort]
profile = "black"

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
EOF
            fi
            ;;
        javascript|node|nodejs)
            mkdir -p src/utils tests/unit tests/integration
            if [[ ! -f "package.json" ]]; then
                cat > package.json << EOF
{
  "name": "$PROJECT_ID",
  "version": "0.1.0",
  "description": "$PROJECT_DESCRIPTION",
  "main": "src/index.js",
  "scripts": {
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.0.0"
  },
  "dependencies": {}
}
EOF
            fi
            ;;
        go)
            mkdir -p cmd pkg internal tests
            if [[ ! -f "go.mod" ]]; then
                go mod init "$PROJECT_ID" 2>/dev/null || true
            fi
            ;;
        *)
            print_warning "Unknown language '$PRIMARY_LANGUAGE', using generic structure"
            ;;
    esac
    
    print_success "Directory structure created"
}

# Function to set up Gyro-style directories and files
setup_gyro_directories() {
    print_status "Setting up Gyro-style directory structure..."
    
    # Create Gyro directory structure
    mkdir -p .claude/steering
    mkdir -p .claude/hooks/{file-events,development-events,templates}
    mkdir -p .claude/execution-modes
    mkdir -p .claude/commands/advanced
    mkdir -p scripts/validation
    mkdir -p docs/specifications
    
    # Create steering files
    create_steering_files
    
    # Create hooks framework
    create_hooks_framework
    
    # Create execution mode configurations
    create_execution_modes
    
    # Create advanced commands
    create_advanced_commands
    
    # Create configuration files
    create_gyro_config_files
    
    print_success "Gyro-style directories and files created"
}

# Function to create steering files
create_steering_files() {
    print_status "Creating steering configuration files..."
    
    # Product steering
    cat > .claude/steering/product.md << EOF
# Product Steering

## Purpose
$PROJECT_DESCRIPTION

## Target Users
- [Define primary user personas]
- [Define secondary user personas]

## Key Features
- Component-based architecture with $COMPONENT_COUNT components
- AI-assisted development workflow
- [Add domain-specific features for $PROJECT_DOMAIN]

## Success Metrics
- [Define measurable success criteria]
- [Define performance benchmarks]
- [Define user satisfaction metrics]

## Product Constraints
- Must follow SLC (Simple, Lovable, Complete) principles
- Language: $PRIMARY_LANGUAGE
- Domain focus: $PROJECT_DOMAIN
EOF

    # Technical steering
    cat > .claude/steering/tech.md << EOF
# Technical Steering

## Technology Stack
- **Primary Language**: $PRIMARY_LANGUAGE
- **Architecture**: Component-based pipeline
- **AI Integration**: Claude Code, automated workflows

## Architecture Decisions
- Sequential pipeline processing
- Independent component validation
- AI-assisted development coordination

## Technical Constraints
- Component independence and testability
- Comprehensive error handling
- Performance optimization for production

## Code Standards
- Follow language-specific best practices
- Comprehensive testing required
- Documentation for all public interfaces
EOF

    # Structure steering
    cat > .claude/steering/structure.md << EOF
# Structure Steering

## File Organization
\`\`\`
$PROJECT_ID/
├── src/                    # Core implementation
├── tests/                  # Test suites
├── docs/specifications/    # Requirements and design
├── .claude/               # AI coordination
├── config/                # Configuration files
└── scripts/               # Automation and validation
\`\`\`

## Naming Conventions
- Files: lowercase with underscores
- Classes: PascalCase
- Functions: snake_case
- Constants: UPPER_CASE

## Code Patterns
- Component-based architecture
- Error handling with try-catch patterns
- Logging for debugging and monitoring
- Configuration-driven behavior
EOF

    # Domain-specific steering
    case "$PROJECT_DOMAIN" in
        data-processing)
            cat > .claude/steering/domain-specific.md << 'EOF'
# Data Processing Domain Steering

## Data Quality Standards
- Input validation for all data sources
- Error handling for malformed data
- Data type consistency checking
- Performance optimization for large datasets

## ETL Pipeline Patterns
- Extract: Robust data source connections
- Transform: Configurable transformation rules
- Load: Reliable destination writing with rollback

## Performance Requirements
- Memory-efficient processing
- Streaming for large datasets
- Parallel processing where appropriate
- Progress tracking and monitoring
EOF
            ;;
        content-generation)
            cat > .claude/steering/domain-specific.md << 'EOF'
# Content Generation Domain Steering

## Content Quality Standards
- Brand compliance checking
- Content coherence validation
- Quality scoring mechanisms
- Version control for generated content

## API Cost Optimization
- Request batching strategies
- Caching mechanisms
- Rate limiting compliance
- Token usage monitoring

## Content Pipeline Patterns
- Template-based generation
- Multi-stage review processes
- Quality gates before publication
- Feedback loop integration
EOF
            ;;
        api-integration)
            cat > .claude/steering/domain-specific.md << 'EOF'
# API Integration Domain Steering

## API Design Standards
- RESTful design principles
- Consistent error responses
- Comprehensive documentation
- Rate limiting implementation

## Integration Patterns
- Circuit breaker for external calls
- Retry logic with exponential backoff
- Health checks for dependencies
- Graceful degradation strategies

## Data Consistency
- Transaction management
- Conflict resolution strategies
- Data synchronization patterns
- Audit logging for changes
EOF
            ;;
        *)
            cat > .claude/steering/domain-specific.md << 'EOF'
# General Domain Steering

## Development Principles
- Iterative development approach
- User feedback integration
- Continuous improvement mindset
- Documentation-driven development

## Quality Standards
- Comprehensive testing strategy
- Code review requirements
- Performance benchmarking
- Security considerations

## Operational Excellence
- Monitoring and alerting
- Error tracking and resolution
- Performance optimization
- Scalability planning
EOF
            ;;
    esac
}

# Function to create hooks framework
create_hooks_framework() {
    print_status "Creating hooks framework..."
    
    # File event hooks
    cat > .claude/hooks/file-events/on-save.md << 'EOF'
# On Save Hook

## Trigger
File save events for source code files

## Conditions
- if file_type == "python": Run Python-specific checks
- if file_type == "javascript": Run JS-specific checks
- if path_matches("src/**"): Run source code validation

## Actions
1. **Code Formatting**: Auto-format saved files
2. **Lint Check**: Run language-specific linting
3. **Test Generation**: Create/update test files if needed
4. **Documentation Update**: Update docs if API changes detected

## Error Handling
- Log formatting errors but don't block save
- Show lint warnings in editor
- Create TODO items for failed test generation
EOF

    # Development event hooks
    cat > .claude/hooks/development-events/pre-commit.md << 'EOF'
# Pre-Commit Hook

## Trigger
Before git commit is executed

## Conditions
- when staged_files contain source code
- unless commit_message contains "[skip-hooks]"

## Actions
1. **Run Tests**: Execute test suite for changed components
2. **Quality Check**: Run linting and formatting checks
3. **Security Scan**: Check for potential security issues
4. **Documentation Check**: Ensure docs are up to date

## Error Handling
- Block commit if critical tests fail
- Show detailed error messages
- Allow override with --no-verify flag
EOF

    # Template hooks
    cat > .claude/hooks/templates/test-generator-hook.md << 'EOF'
# Test Generator Hook Template

## Purpose
Automatically generate test files for new source code

## Placeholders
- {{FILE_PATH}}: Path to the source file
- {{CLASS_NAME}}: Name of the class being tested
- {{FUNCTION_NAMES}}: List of functions to test

## Usage Example
When a new Python file is created at `src/utils/parser.py`:
1. Generate `tests/unit/test_parser.py`
2. Create test stubs for all public functions
3. Add basic test structure and imports

## Test Template Structure
- Import statements
- Test class definition
- Test method stubs
- Fixture definitions if needed
EOF

    # Hooks configuration
    cat > .claude/hooks-config.json << EOF
{
  "hooks": {
    "on_file_save": {
      "*.py": ["format-code", "lint-check", "test-generator"],
      "*.js": ["format-code", "lint-check", "test-generator"],
      "*.md": ["doc-updater"],
      "src/**": ["security-scanner"]
    },
    "pre_commit": {
      "**/*": ["run-tests", "quality-check", "security-scan"]
    },
    "post_implementation": {
      "src/**": ["test-coverage-check", "doc-generation"]
    }
  },
  "actions": {
    "format-code": {
      "python": "black",
      "javascript": "prettier"
    },
    "lint-check": {
      "python": "flake8",
      "javascript": "eslint"
    },
    "test-generator": {
      "template": "templates/test-generator-hook.md"
    }
  }
}
EOF
}

# Function to create execution modes
create_execution_modes() {
    print_status "Creating execution mode configurations..."
    
    cat > .claude/execution-modes/autopilot-config.md << 'EOF'
# Autopilot Execution Mode

## Autonomous Actions Allowed
- Code formatting and linting
- Test file generation
- Documentation updates
- Non-breaking refactoring

## Decision Framework
- **Low Risk**: Proceed automatically
  - Style fixes, formatting
  - Adding missing documentation
  - Creating test stubs

- **Medium Risk**: Request confirmation
  - Logic changes in existing functions
  - Adding new dependencies
  - Modifying configuration files

- **High Risk**: Always require approval
  - Database schema changes
  - External API modifications
  - Security-related changes

## Escalation Triggers
- Test failures after changes
- Linting errors that can't be auto-fixed
- Complex merge conflicts
- Performance regression detected

## Monitoring
- Track all autonomous actions
- Report decision rationale
- Log time saved vs manual mode
EOF

    cat > .claude/execution-modes/supervised-config.md << 'EOF'
# Supervised Execution Mode

## Approval Required For
- All code changes
- File creation/deletion
- Configuration modifications
- External command execution

## Approval Prompts
- **Action**: Clear description of what will be done
- **Rationale**: Why this action is needed
- **Impact**: What files/systems will be affected
- **Alternatives**: Other approaches considered

## Progress Tracking
- Show step-by-step progress
- Indicate completion percentage
- Provide rollback options
- Log all user decisions

## Error Handling
- Pause execution on any error
- Present error details and options
- Allow step-by-step debugging
- Maintain audit trail
EOF

    cat > .claude/execution-modes/hybrid-config.md << 'EOF'
# Hybrid Execution Mode

## Risk Assessment Criteria
- **Code Complexity**: Simple vs complex logic changes
- **File Impact**: Single file vs multiple files
- **System Impact**: Local vs external system changes
- **Reversibility**: Easy to undo vs permanent changes

## Mode Switching Logic
- Start in supervised mode for new projects
- Switch to autopilot for routine, proven actions
- Escalate to supervised for unexpected situations
- Learn from user approval patterns

## Adaptive Learning
- Track user approval/rejection patterns
- Adjust risk assessment based on project history
- Personalize automation level to user preferences
- Improve over time with feedback

## Context Awareness
- Consider current development phase
- Account for deadline pressure
- Adjust for team collaboration needs
- Respect project-specific constraints
EOF
}

# Function to create advanced commands
create_advanced_commands() {
    print_status "Creating advanced command system..."
    
    # Copy existing advanced commands from the template
    # Note: In a real implementation, these would be copied from the template files
    # For now, we'll create simplified versions
    
    cat > .claude/commands/advanced/workflow-orchestrator.md << 'EOF'
# Workflow Orchestrator

Automates complex multi-step development workflows with intelligent task coordination.

## Usage
`@workflow-orchestrator [workflow-type] [options]`

## Supported Workflows
- `feature`: Complete feature implementation (spec → code → tests → docs)
- `bugfix`: Bug resolution workflow (reproduce → fix → test → validate)
- `refactor`: Code refactoring (analyze → plan → implement → verify)

## Examples
```
@workflow-orchestrator feature --component="Component 3" --spec="docs/specifications/component-3.md"
@workflow-orchestrator bugfix --issue="Authentication error" --test-case="test_auth_failure"
@workflow-orchestrator refactor --target="src/parser.py" --goal="improve-performance"
```
EOF

    cat > .claude/commands/advanced/production-readiness.md << 'EOF'
# Production Readiness Checker

Comprehensive validation of production deployment readiness across all critical dimensions.

## Usage
`@production-readiness [environment] [options]`

## Validation Categories
- **Infrastructure**: Containerization, scaling, load balancing
- **Security**: Headers, authentication, secret management
- **Performance**: Optimization, caching, monitoring
- **Quality**: Test coverage, documentation, compliance

## Examples
```
@production-readiness staging --fix-issues
@production-readiness production --report-only
@production-readiness development --quick-check
```
EOF
}

# Function to create Gyro configuration files
create_gyro_config_files() {
    print_status "Creating Gyro configuration files..."
    
    cat > .claude/gyro-config.json << EOF
{
  "gyro_integration": {
    "version": "1.0.0",
    "enabled": true,
    "project_domain": "$PROJECT_DOMAIN"
  },
  "spec_driven_development": {
    "enabled": true,
    "workflow": ["requirements", "design", "tasks"],
    "validation_required": true
  },
  "steering_system": {
    "enabled": true,
    "inclusion_modes": {
      "always": ["product.md", "tech.md", "structure.md"],
      "conditional": ["domain-specific.md"]
    }
  },
  "hooks_framework": {
    "enabled": true,
    "auto_execution": true,
    "config_file": "hooks-config.json"
  },
  "execution_modes": {
    "default": "hybrid",
    "available": ["autopilot", "supervised", "hybrid"]
  },
  "validation_framework": {
    "enabled": true,
    "auto_run": false,
    "fail_on_errors": true
  }
}
EOF

    cat > .claude/validation-config.json << 'EOF'
{
  "validation_framework": {
    "version": "1.0.0",
    "description": "Gyro-enhanced validation configuration"
  },
  "specifications_validation": {
    "required_sections": {
      "requirements": ["purpose", "scope", "user_stories", "acceptance_criteria"],
      "design": ["architecture", "data_model", "api_design", "security"],
      "tasks": ["task_breakdown", "dependencies", "timeline", "testing"]
    },
    "quality_standards": {
      "min_word_count_per_section": 50,
      "require_examples": true,
      "require_acceptance_criteria": true
    }
  },
  "hooks_validation": {
    "required_directories": ["file-events", "development-events", "templates"],
    "hook_structure_requirements": {
      "trigger": "required",
      "conditions": "required",
      "actions": "required"
    }
  }
}
EOF
}

# Function to copy validation scripts
copy_validation_scripts() {
    print_status "Setting up validation framework..."
    
    # Get the directory where this script is located (template directory)
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    TEMPLATE_DIR="$(dirname "$SCRIPT_DIR")"
    
    # Copy validation scripts if they exist in template
    if [[ -f "$TEMPLATE_DIR/scripts/copy-validation-scripts.sh" ]]; then
        "$TEMPLATE_DIR/scripts/copy-validation-scripts.sh" "$PWD"
    else
        print_warning "Validation scripts not found in template, creating placeholder"
    fi
    
    cat > scripts/validation/README.md << 'EOF'
# Validation Framework

This directory contains comprehensive validation scripts for project quality assurance.

## Available Scripts

- `validate-specifications.py`: Validates project specifications for consistency
- `validate-steering.py`: Validates AI steering configuration  
- `validate-hooks.py`: Validates hooks framework setup
- `validate-production-ready.py`: Comprehensive production readiness validation
- `run-all-validations.py`: Orchestrates all validation scripts

## Usage

```bash
# Run all validations
python scripts/validation/run-all-validations.py .

# Run specific validation
python scripts/validation/validate-specifications.py .
python scripts/validation/validate-hooks.py .
python scripts/validation/validate-production-ready.py . --environment staging
```

## Integration

The validation scripts are integrated with:
- Pre-commit hooks for automatic quality gates
- CI/CD pipelines for deployment validation  
- IDE extensions for real-time feedback
- Production readiness assessments
EOF

    # Make validation scripts executable
    chmod +x scripts/validation/*.py 2>/dev/null || true
}

# Function to create specification templates
create_spec_templates() {
    print_status "Creating specification templates..."
    
    cat > docs/specifications/requirements-template.md << EOF
# Requirements Specification: [COMPONENT_NAME]

**Created**: $(date +"%Y-%m-%d")  
**Project**: $PROJECT_NAME  
**Domain**: $PROJECT_DOMAIN

## Purpose
[Describe what this component accomplishes and why it's needed]

## Scope
### In Scope
- [List what this component will handle]
- [Include specific functionality]

### Out of Scope  
- [List what this component will NOT handle]
- [Include exclusions and limitations]

## User Stories

### Primary User Story
**As a** [user type]  
**I want** [functionality]  
**So that** [benefit/value]

**Acceptance Criteria:**
- [ ] [Specific, measurable criteria]
- [ ] [Additional criteria]

### Secondary User Stories
[Additional user stories as needed]

## Functional Requirements
1. **[Requirement Category]**
   - REQ-001: [Specific requirement]
   - REQ-002: [Additional requirement]

## Non-Functional Requirements
1. **Performance**
   - Response time: [specific metrics]
   - Throughput: [specific metrics]

2. **Reliability**
   - Availability: [percentage]
   - Error handling: [specific requirements]

3. **Security**
   - Authentication: [requirements]
   - Data protection: [requirements]

## Dependencies
- **Input Dependencies**: [What this component needs]
- **Output Dependencies**: [What depends on this component]
- **External Dependencies**: [Third-party services, APIs]

## Constraints
- Technical constraints
- Business constraints  
- Timeline constraints

## Success Criteria
- [Measurable success metrics]
- [Quality standards]
- [Performance benchmarks]
EOF

    cat > docs/specifications/design-template.md << EOF
# Design Specification: [COMPONENT_NAME]

**Created**: $(date +"%Y-%m-%d")  
**Project**: $PROJECT_NAME  
**Language**: $PRIMARY_LANGUAGE

## Architecture Overview
[High-level description of the component architecture]

## System Context
\`\`\`
[ASCII diagram or description of how this component fits in the system]
\`\`\`

## Component Design

### Core Components
1. **[Component Name]**
   - Purpose: [What it does]
   - Interface: [Public methods/functions]
   - Dependencies: [What it needs]

### Data Flow
\`\`\`
Input → [Processing Steps] → Output
\`\`\`

## Data Model

### Input Data Structure
\`\`\`$PRIMARY_LANGUAGE
[Code example of input data structure]
\`\`\`

### Output Data Structure  
\`\`\`$PRIMARY_LANGUAGE
[Code example of output data structure]
\`\`\`

### Internal Data Structures
[Any internal data models needed]

## API Design

### Public Interface
\`\`\`$PRIMARY_LANGUAGE
[Function/method signatures]
\`\`\`

### Error Handling
- Error types and handling strategies
- Logging and monitoring approaches

## Implementation Strategy

### Development Phases
1. **Phase 1**: [Core functionality]
2. **Phase 2**: [Additional features] 
3. **Phase 3**: [Optimization and polish]

### Testing Strategy
- Unit testing approach
- Integration testing requirements
- Performance testing criteria

## Security Considerations
- Authentication requirements
- Data validation needs
- Security best practices

## Performance Considerations  
- Expected load characteristics
- Optimization opportunities
- Monitoring requirements

## Deployment Architecture
- Infrastructure requirements
- Configuration management
- Monitoring and alerting
EOF

    cat > docs/specifications/tasks-template.md << EOF
# Task Breakdown: [COMPONENT_NAME]

**Created**: $(date +"%Y-%m-%d")  
**Project**: $PROJECT_NAME

## Implementation Tasks

### Phase 1: Core Development
- [ ] **Task 1.1**: Setup component structure
  - Estimated effort: [time estimate]
  - Dependencies: [list dependencies]
  - Acceptance criteria: [specific criteria]

- [ ] **Task 1.2**: Implement core logic
  - Estimated effort: [time estimate]
  - Dependencies: Task 1.1
  - Acceptance criteria: [specific criteria]

### Phase 2: Integration & Testing
- [ ] **Task 2.1**: Unit test implementation
  - Estimated effort: [time estimate]
  - Dependencies: Task 1.2
  - Acceptance criteria: [coverage requirements]

- [ ] **Task 2.2**: Integration testing
  - Estimated effort: [time estimate] 
  - Dependencies: Task 2.1
  - Acceptance criteria: [integration criteria]

### Phase 3: Documentation & Deployment
- [ ] **Task 3.1**: API documentation
  - Estimated effort: [time estimate]
  - Dependencies: Task 2.2
  - Acceptance criteria: [documentation standards]

- [ ] **Task 3.2**: Deployment preparation
  - Estimated effort: [time estimate]
  - Dependencies: Task 3.1
  - Acceptance criteria: [deployment criteria]

## Task Dependencies

\`\`\`
Task 1.1 → Task 1.2 → Task 2.1 → Task 2.2 → Task 3.1 → Task 3.2
\`\`\`

## Risk Assessment

### High Risk Tasks
- [List tasks with high complexity/uncertainty]
- Mitigation strategies

### Dependencies on External Systems
- [List external dependencies]
- Contingency plans

## Timeline Estimates

| Phase | Duration | Start Date | End Date |
|-------|----------|------------|----------|
| Phase 1 | [duration] | [date] | [date] |
| Phase 2 | [duration] | [date] | [date] |
| Phase 3 | [duration] | [date] | [date] |

## Quality Gates

### Phase 1 Completion Criteria
- [ ] Core functionality implemented
- [ ] Basic error handling in place
- [ ] Code follows project standards

### Phase 2 Completion Criteria  
- [ ] All tests passing
- [ ] Test coverage meets requirements
- [ ] Integration tests successful

### Phase 3 Completion Criteria
- [ ] Documentation complete
- [ ] Deployment scripts ready
- [ ] Performance benchmarks met

## Testing Strategy

### Unit Testing
- Test coverage requirement: 80%+
- Mock external dependencies
- Test both success and failure cases

### Integration Testing
- Test component interactions
- Validate data flow
- Test error propagation

### Performance Testing
- Load testing requirements
- Performance benchmarks
- Monitoring and profiling

## Monitoring & Maintenance

### Key Metrics
- [List important metrics to monitor]
- [Performance indicators]

### Maintenance Tasks
- [Regular maintenance requirements]
- [Update procedures]
EOF
}

# Function to customize templates
customize_templates() {
    print_status "Customizing templates for your project..."
    
    # Get current date
    current_date=$(date +"%Y-%m-%d")
    
    # Customize PRD template
    if [[ -f "docs/specifications/PRD_TEMPLATE.md" ]]; then
        sed -i.bak \
            -e "s/\[PROJECT NAME\]/$PROJECT_NAME/g" \
            -e "s/\[DATE\]/$current_date/g" \
            docs/specifications/PRD_TEMPLATE.md
        mv docs/specifications/PRD_TEMPLATE.md docs/specifications/PRD.md
        rm docs/specifications/PRD_TEMPLATE.md.bak
    fi
    
    # Customize AI Context template
    if [[ -f ".aicontext/AI_CONTEXT_TEMPLATE.md" ]]; then
        sed -i.bak \
            -e "s/\[PROJECT NAME\]/$PROJECT_NAME/g" \
            -e "s/\[DATE\]/$current_date/g" \
            .aicontext/AI_CONTEXT_TEMPLATE.md
        mv .aicontext/AI_CONTEXT_TEMPLATE.md .aicontext/context.md
        rm .aicontext/AI_CONTEXT_TEMPLATE.md.bak
    fi
    
    # Create basic config file
    if [[ ! -f "config/project-config.json" ]]; then
        cat > config/project-config.json << EOF
{
  "project": {
    "name": "$PROJECT_NAME",
    "id": "$PROJECT_ID",
    "description": "$PROJECT_DESCRIPTION",
    "language": "$PRIMARY_LANGUAGE",
    "component_count": $COMPONENT_COUNT
  },
  "development": {
    "test_command": "$(get_test_command)",
    "lint_command": "$(get_lint_command)",
    "format_command": "$(get_format_command)"
  },
  "ai_workflow": {
    "enabled": true,
    "reference_test_case": "tests/reference/",
    "validation_required": true
  }
}
EOF
    fi
    
    print_success "Templates customized for $PROJECT_NAME"
}

# Helper functions for language-specific commands
get_test_command() {
    case "$PRIMARY_LANGUAGE" in
        python) echo "pytest tests/ -v" ;;
        javascript|node|nodejs) echo "npm test" ;;
        go) echo "go test ./..." ;;
        *) echo "# Add your test command here" ;;
    esac
}

get_lint_command() {
    case "$PRIMARY_LANGUAGE" in
        python) echo "flake8 src/" ;;
        javascript|node|nodejs) echo "eslint src/" ;;
        go) echo "golint ./..." ;;
        *) echo "# Add your lint command here" ;;
    esac
}

get_format_command() {
    case "$PRIMARY_LANGUAGE" in
        python) echo "black src/" ;;
        javascript|node|nodejs) echo "prettier --write src/" ;;
        go) echo "gofmt -w ." ;;
        *) echo "# Add your format command here" ;;
    esac
}

# Function to set up git repository
setup_git_repository() {
    print_status "Setting up git repository..."
    
    # Initialize git if not already done
    if [[ ! -d ".git" ]]; then
        git init
        print_success "Git repository initialized"
    else
        print_warning "Git repository already exists"
    fi
    
    # Create .gitignore if it doesn't exist
    if [[ ! -f ".gitignore" ]]; then
        cat > .gitignore << EOF
# Language-specific ignores
$(get_gitignore_patterns)

# Development tools
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Environment and secrets
.env
.env.local
.env.*.local
*.key
*.pem

# Logs and databases
*.log
*.sqlite
*.db

# Temporary files
tmp/
temp/
.tmp/
EOF
        print_success "Created .gitignore file"
    fi
    
    # Create initial commit if no commits exist
    if ! git rev-parse --verify HEAD &> /dev/null; then
        git add .
        git commit -m "Initial commit: AI-powered development workflow setup

- Configured project structure for $PROJECT_NAME
- Set up AI coordination templates and documentation
- Initialized $PRIMARY_LANGUAGE development environment
- Created $COMPONENT_COUNT-component pipeline architecture

🤖 Generated with AI Development Cycle Template"
        print_success "Initial commit created"
    fi
}

get_gitignore_patterns() {
    case "$PRIMARY_LANGUAGE" in
        python) cat << 'EOF'
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST
.pytest_cache/
.coverage
htmlcov/
.mypy_cache/
.dmypy.json
dmypy.json
EOF
            ;;
        javascript|node|nodejs) cat << 'EOF'
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.eslintcache
.yarn-integrity
.env.local
.env.development.local
.env.test.local
.env.production.local
coverage/
.nyc_output/
EOF
            ;;
        go) cat << 'EOF'
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
EOF
            ;;
        *) echo "# Add language-specific ignores here" ;;
    esac
}

# Function to create README
create_readme() {
    if [[ ! -f "README.md" ]]; then
        print_status "Creating README.md..."
        
        cat > README.md << EOF
# $PROJECT_NAME

$PROJECT_DESCRIPTION

## Overview

This project implements an AI-powered development workflow with a $COMPONENT_COUNT-component pipeline architecture. It follows the Simple, Lovable, Complete (SLC) design principles and uses AI assistants for development coordination.

## Architecture

### Component Pipeline
1. **Component 1**: [Customize: Brief description]
2. **Component 2**: [Customize: Brief description]
3. **Component 3**: [Customize: Brief description]
4. **Component 4**: [Customize: Brief description]
5. **Component 5**: [Customize: Brief description]
6. **Component 6**: [Customize: Brief description]

### Development Workflow
- **PRD-Driven**: \`docs/specifications/PRD.md\` is the source of truth
- **AI-Assisted**: Claude Code and other AI tools coordinate development
- **Component-Based**: Build and test one component at a time
- **Quality-Focused**: Comprehensive testing and validation at each step

## Getting Started

### Prerequisites
- $PRIMARY_LANGUAGE development environment
- Git for version control
- VS Code with Claude Code extension (recommended)

### Development Commands
\`\`\`bash
# Run tests
$(get_test_command)

# Code quality checks
$(get_lint_command)
$(get_format_command)

# AI workflow commands (in Claude Code)
@orient          # Get project status and next actions
@next-task       # Select and plan next component
@finalize-task   # Complete current work
@update-prd      # Sync project status
\`\`\`

## Project Structure

\`\`\`
$PROJECT_ID/
├── docs/
│   ├── specifications/        # PRD and feature specs
│   └── architecture/          # Design principles
├── src/                       # Main implementation
├── tests/                     # Test suite
├── config/                    # Configuration files
├── .aicontext/              # AI coordination docs
├── .claude/                  # Claude Code commands
└── scripts/                  # Automation scripts
\`\`\`

## Documentation

- **[PRD](docs/specifications/PRD.md)**: Project requirements and component status
- **[Development Workflow](docs/specifications/dev-cycle.md)**: AI-assisted development process
- **[Architecture Principles](docs/architecture/)**: SLC principles and design guidelines
- **[AI Context](\.aicontext/context.md)**: Project knowledge base for AI assistants

## Contributing

This project uses an AI-powered development workflow:

1. Review \`docs/specifications/PRD.md\` for current status
2. Use \`@orient\` in Claude Code to understand next steps
3. Use \`@next-task\` to select and plan work
4. Implement using AI assistance and SLC principles
5. Use \`@finalize-task\` to complete and validate work
6. Use \`@update-prd\` to sync project status

## License

[Add your license here]
EOF
        
        print_success "README.md created"
    fi
}

# Function to create Claude settings template
setup_claude_settings() {
    if [[ ! -f ".claude/settings.template.json" ]]; then
        print_status "Creating Claude Code settings template..."
        
        cat > .claude/settings.template.json << EOF
{
  "name": "$PROJECT_NAME",
  "description": "$PROJECT_DESCRIPTION",
  "claude": {
    "contextFiles": [
      ".aicontext/context.md",
      "docs/specifications/PRD.md",
      ".aicontext/WORKFLOW_GUIDE.md"
    ],
    "persona": ".claude/persona.md",
    "commands": [
      ".claude/commands/orient.md",
      ".claude/commands/next-task.md",
      ".claude/commands/finalize-task.md",
      ".claude/commands/update-prd.md"
    ]
  },
  "project": {
    "language": "$PRIMARY_LANGUAGE",
    "testCommand": "$(get_test_command)",
    "lintCommand": "$(get_lint_command)",
    "formatCommand": "$(get_format_command)"
  }
}
EOF
        
        print_success "Claude settings template created"
    fi
}

# Function to validate setup
validate_setup() {
    print_status "Validating project setup..."
    
    local validation_errors=()
    
    # Check required files exist
    local required_files=(
        "docs/specifications/PRD.md"
        ".aicontext/context.md"
        ".aicontext/WORKFLOW_GUIDE.md"
        ".claude/persona.md"
        "config/project-config.json"
        "README.md"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            validation_errors+=("Missing file: $file")
        fi
    done
    
    # Check required directories exist
    local required_dirs=(
        "src"
        "tests"
        "docs/specifications"
        "docs/architecture"
        ".claude/commands"
        ".aicontext"
    )
    
    # Add Gyro-specific directories if enabled
    if [[ "$ENABLE_GYRO" =~ ^[Yy]$ ]]; then
        required_dirs+=(
            ".claude/steering"
            ".claude/hooks"
            ".claude/execution-modes"
            "scripts/validation"
        )
    fi
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            validation_errors+=("Missing directory: $dir")
        fi
    done
    
    # Report validation results
    if [[ ${#validation_errors[@]} -eq 0 ]]; then
        print_success "Project setup validation passed"
        return 0
    else
        print_error "Project setup validation failed:"
        for error in "${validation_errors[@]}"; do
            echo "  - $error"
        done
        return 1
    fi
}

# Function to display next steps
show_next_steps() {
    print_success "Project initialization complete!"
    echo
    print_status "Your AI-powered development workflow is now set up."
    echo
    echo "📋 Next Steps:"
    echo "1. Customize your PRD: Edit docs/specifications/PRD.md"
    echo "2. Define your components: Update the component pipeline"
    echo "3. Set up development environment: Install dependencies"
    echo "4. Start Claude Code: Use 'code .' and install Claude Code extension"
    echo "5. Begin development: Use @orient command to get started"
    echo
    echo "🔧 Key Commands in Claude Code:"
    echo "  @orient          Get project status and next actions"
    echo "  @next-task       Select and plan next component"
    echo "  @finalize-task   Complete current work"
    echo "  @update-prd      Sync project status"
    
    if [[ "$ENABLE_GYRO" =~ ^[Yy]$ ]]; then
        echo
        echo "🚀 Gyro-Enhanced Features:"
        echo "  @workflow-orchestrator    Automate multi-step workflows"
        echo "  @production-readiness     Check deployment readiness"
        echo "  @validate-all            Run comprehensive validation"
        echo "  Steering system:         .claude/steering/ for AI context"
        echo "  Hooks framework:         .claude/hooks/ for automation"
        echo "  Execution modes:         Autopilot, supervised, hybrid"
    fi
    echo
    echo "📚 Documentation:"
    echo "  docs/specifications/PRD.md           Project requirements"
    echo "  docs/specifications/dev-cycle.md     Development workflow"
    echo "  .aicontext/context.md           AI knowledge base"
    echo "  docs/architecture/                   Design principles"
    echo
    print_status "Happy coding with AI assistance! 🤖"
}

# Main execution
main() {
    echo "🤖 AI-Powered Development Cycle - Project Initialization"
    echo "========================================================"
    echo
    
    # Run initialization steps
    check_dependencies
    collect_project_info
    setup_directory_structure
    customize_templates
    setup_git_repository
    create_readme
    setup_claude_settings
    
    # Setup Gyro features if enabled
    if [[ "$ENABLE_GYRO" =~ ^[Yy]$ ]]; then
        copy_validation_scripts
        create_spec_templates
        print_success "Gyro-style features enabled"
    fi
    
    # Validate setup
    if validate_setup; then
        show_next_steps
    else
        print_error "Setup validation failed. Please check the errors above."
        exit 1
    fi
}

# Run main function
main "$@"