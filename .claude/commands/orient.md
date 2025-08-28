# Orient - Project Status & Navigation

Get oriented in your current project and see your next best actions based on current context.

## Purpose

This command helps you get re-oriented when returning to a project after time away. It combines system status with project analysis to show:
- Where you are in the AI-assisted development workflow
- What options are available based on your current project state  
- Exact commands to run for your next best actions

## Process

1. **System Status Check**
   - Display Claude Code system information
   - Show available MCP servers and integrations
   - Confirm working directory and technical setup

2. **Project State Analysis**
   - Scan current directory for key project files
   - Determine which workflow stage you're in
   - Identify available tools and capabilities

3. **Contextual Guidance**
   - Show your current position in the workflow
   - Provide 3-5 numbered next action options
   - Include exact commands and file references

4. **Self-Teaching Phase**
   - Read relevant project context files
   - Load appropriate workflow documentation
   - Ensure understanding of current project state

## Implementation

### Phase 1: System Status
First, gather technical context about the current environment:

```bash
Working Directory: [show current path]
IDE Integration: [VS Code status] 
MCP Servers: [list active servers]
Account: [current login info]
Model: [current model and limits]
```

### Phase 2: Project Analysis
Analyze the current directory structure and files:

**Key Files to Check:**
- `docs/specifications/PRD.md` - Project requirements and component status
- `.claude/` directory - Claude Code configuration and commands
- `.aicontext/` directory - AI coordination documentation
- `docs/specifications/` directory - Planning documents and feature specs
- `src/` directory - Source code structure
- `tests/` directory - Test files and references
- `config/` directory - Project configuration files

**Workflow Stage Detection Logic:**
```
IF no PRD.md exists:
  → "Project Setup Mode" - need to initialize project structure

ELIF PRD exists but no feature specs:
  → "Component Planning" - ready to create detailed feature specifications

ELIF feature specs exist but no implementation:
  → "Implementation Ready" - ready for AI-assisted development

ELIF implementation exists with incomplete components:
  → "Active Development" - components in progress

ELIF all components appear complete:
  → "Project Complete" - ready for next iteration or maintenance
```

### Phase 3: Contextual Action Menu

Based on detected stage, provide numbered options:

**Project Setup Mode:**
```
📍 Status: Project Setup Required
🎯 Next Actions:
1. Initialize project structure using template
2. Customize PRD template for your domain
3. Set up AI coordination tools
4. Learn about the development workflow
5. Configure project-specific settings
```

**Component Planning:**
```
📍 Status: Component Planning Phase
🎯 Next Actions:
1. Review PRD and identify next component to build
2. Create detailed feature specification for next component
3. Set up component development branch
4. Prepare reference test case for validation
```

**Implementation Ready:**
```
📍 Status: Ready for AI Implementation
🎯 Next Actions:
1. Begin AI-assisted implementation of current feature spec
2. Set up development environment and dependencies
3. Create implementation plan and task breakdown
4. Start with component unit tests and validation
```

**Active Development:**
```
📍 Status: Active Development in Progress
🎯 Next Actions:
1. Continue current component implementation
2. Run tests and validation on completed parts
3. Review and refine current implementation
4. Prepare for integration testing
```

**Project Complete:**
```
📍 Status: Current Iteration Complete
🎯 Next Actions:
1. Plan next component or feature iteration
2. Run comprehensive system testing
3. Update documentation and deployment guides
4. Begin next development cycle
5. Review and improve development process
```

### Phase 4: Self-Teaching Integration

Based on detected project state, instruct Claude Code to read relevant context:

```
For any project state:
- Read docs/specifications/PRD.md for project overview
- Read .claude/persona.md for development philosophy
- Read docs/architecture/ files for design principles

For specific stages:
- Component Planning: Read FEATURE_SPEC_TEMPLATE.md
- Implementation: Read dev-cycle.md workflow guide
- Testing: Read component-specific test requirements
```

## Output Format

```
🔄 CLAUDE CODE SYSTEM STATUS
[Display key system information]

📁 PROJECT STATE ANALYSIS  
Current Directory: [path]
Workflow Stage: [detected stage]
Key Files Found: [list relevant files]
PRD Status: [component completion status]

📍 WHERE YOU ARE
[Clear description of current position in development cycle]

🎯 YOUR NEXT BEST OPTIONS
1. [Action 1 with exact command/approach]
2. [Action 2 with exact command/approach] 
3. [Action 3 with exact command/approach]
4. [Action 4 with exact command/approach]

💡 NEED MORE HELP?
- Read docs/specifications/dev-cycle.md for complete workflow
- Check .aicontext/ directory for coordination guides
- Review component-specific documentation in docs/specifications/
```

## Template Customization

### Adapting for Your Project

1. **Update File Paths**: Modify the key files list to match your project structure
2. **Define Workflow Stages**: Customize stages to match your development process
3. **Set Component Types**: Adjust component detection logic for your domain
4. **Configure Actions**: Update next action options for your specific workflow
5. **Add Domain Logic**: Include domain-specific status checks and guidance

### Example Customizations

**Data Processing Project**:
- Check for `data/` directories and sample datasets
- Validate configuration files for data sources
- Monitor processing pipeline status and logs

**Content Generation Project**:
- Check for template libraries and asset directories
- Validate API keys and service configurations
- Monitor generation queues and output quality

**API Integration Project**:
- Check for endpoint documentation and schemas
- Validate authentication and connection status
- Monitor rate limits and usage metrics

## Notes

- This command should work regardless of project state
- Always provide actionable next steps with exact commands
- Use progressive disclosure - start simple, offer more detail if needed
- Ensure AI has full context before making recommendations
- Adapt the workflow stages and actions to match your project's specific needs