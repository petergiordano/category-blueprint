# Category Blueprint Subagents

This directory contains specialized AI subagents designed to support the AI-powered development workflow for the category-blueprint project.

## Available Agents

### 1. PRD Analyzer (`prd-analyzer`)
- **Purpose**: Analyzes Product Requirements Documents and extracts actionable specifications
- **When to use**: Starting a new project or feature from a PRD
- **Example**: "Use the prd-analyzer agent to process our new feature PRD"

### 2. Specification Generator (`specification-generator`)
- **Purpose**: Creates detailed technical specifications and design documents
- **When to use**: After requirements analysis, before implementation
- **Example**: "Have the specification-generator create the technical design"

### 3. Validation Specialist (`validation-specialist`)
- **Purpose**: Manages testing frameworks and ensures production readiness
- **When to use**: During and after implementation for quality assurance
- **Example**: "Run the validation-specialist to check our test coverage"

### 4. Component Pipeline (`component-pipeline`)
- **Purpose**: Ensures proper component architecture following SLC principles
- **When to use**: When designing or reviewing system architecture
- **Example**: "Use component-pipeline to validate our pipeline design"

### 5. Brand Guardian (`brand-guardian`)
- **Purpose**: Enforces Scale Venture Partners brand guidelines
- **When to use**: Reviewing any external-facing content or documentation
- **Example**: "Have brand-guardian review our documentation"

### 6. Project Coordinator (`project-coordinator`)
- **Purpose**: Orchestrates workflow and coordinates other agents
- **When to use**: Managing complex multi-stage projects
- **Example**: "Let project-coordinator manage this feature development"

## Usage Patterns

### Automatic Delegation
Claude Code will automatically select appropriate agents based on task context:
```
"Analyze this PRD and create a technical design"
→ Automatically uses prd-analyzer then specification-generator
```

### Explicit Invocation
Request specific agents directly:
```
"Use the validation-specialist agent to run all tests"
"Have the brand-guardian review this documentation"
```

### Workflow Chains
Combine agents for complex workflows:
```
1. prd-analyzer → Extract requirements
2. specification-generator → Create design
3. component-pipeline → Validate architecture
4. validation-specialist → Set up tests
```

## Best Practices

1. **Start with project-coordinator** for complex projects
2. **Use specialized agents** for focused tasks
3. **Chain agents** for complete workflows
4. **Review with brand-guardian** for external content
5. **Validate with validation-specialist** before production

## Integration with Project Tools

These agents integrate with:
- Python scripts in `/scripts/` for automation
- Validation framework in `/scripts/validation/`
- Specification templates in `/docs/specifications/`
- Steering files in `.claude/steering/`
- Hooks in `.claude/hooks/`

## Adding New Agents

To add a new agent:
1. Create a new `.md` file with YAML frontmatter
2. Define `name`, `description`, and `tools`
3. Write detailed system prompt
4. Test with example tasks
5. Document usage patterns