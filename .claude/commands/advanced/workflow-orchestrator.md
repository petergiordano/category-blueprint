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
