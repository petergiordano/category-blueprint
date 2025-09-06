# Claude Desktop Prompt: Database-Driven Workflow Interactive Visualization

Copy and paste this prompt into Claude Desktop to create an interactive HTML visualization of the database-driven development workflow:

---

**Prompt for Claude Desktop:**

Create a standalone interactive HTML file that visualizes and demonstrates the database-driven development workflow for a GitHub Issues-based project management system. The HTML should be fully self-contained with embedded CSS and JavaScript.

**Important Context**: Read these key files to understand the complete workflow and implementation details:

- `/Users/petergiordano/Documents/GitHub/category-blueprint/docs/DATABASE_DRIVEN_WORKFLOW.md` - Complete workflow guide with rules, commands, and examples
- `/Users/petergiordano/Documents/GitHub/category-blueprint/CLAUDE.md` - Claude Code agent protocol for database-driven development  
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.gemini/GEMINI.md` - Gemini CLI validation and analysis protocol
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.vscode/tasks.json` - VS Code task definitions for issue management
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/create-epic-issues.sh` - Example epic creation script
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/link-related-issues.sh` - Issue relationship linking script
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/issue-utils.sh` - Shared utilities and helper functions

## Requirements

### 1. Workflow Overview Section

- Visual flowchart showing: PRD → GitHub Issues → Implementation → Validation → GitHub Projects
- Interactive elements that highlight each stage when clicked
- Show the relationship between Files (reference only) vs Database (primary tracking)

### 2. Issue Types Demonstration

Create interactive sections for each issue type:

- **FEAT**: Features (new functionality)
- **ENH**: Enhancements (improvements to existing features)  
- **BUG**: Bug fixes
- **EPIC**: Collections of related issues

Each section should show:

- Sample issue creation command
- Example GitHub issue format
- How it appears in GitHub Projects board
- Relationship connections to other issues

### 3. Script Usage Guide

Interactive demonstration of key scripts:

**Issue Creation Scripts:**

- `./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"`
- `./scripts/create-enhancement-issue.sh "Enhancement Name" "Description" "Phase 6" "Medium"`
- `./scripts/create-bug-issue.sh "Bug Name" "Description" "Phase 6" "High"`

**Relationship Management:**

- `./scripts/link-related-issues.sh "FEAT-001" "FEAT-002" "depends-on"`
- `./scripts/create-epic-issues.sh "Epic Title" "Description" "Phase 6" "Component 1" "Component 2"`

**Status Updates:**

- `./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"`

### 4. VS Code Integration Panel

Show the VS Code Command Palette tasks:

- "GitHub: Create Feature Issue (Smart)"
- "GitHub: Create Epic with Features"
- "GitHub: Link Related Issues"
- "GitHub: Update Issue Status"
- "GitHub: View Project Board"

### 5. Agent Coordination Visualization

Show how the three agents interact:

- **Claude Code**: Creates issues, implements features, updates status
- **Gemini CLI**: Validates implementations, analyzes relationships
- **User**: Manages epics, prioritizes through GitHub Projects

Include sample handoff log entries and status updates.

### 6. GitHub Projects Integration

Visual representation of:

- How issues flow through project board columns
- Status labels (status-todo, status-in-progress, status-complete)
- Relationship labels (epic-item, has-dependencies, has-dependents)
- Project board URL: <https://github.com/users/petergiordano/projects/1>

### 7. Relationship Types Examples

Interactive examples showing:

- **depends-on**: FEAT-002 depends on FEAT-001
- **blocks**: BUG-001 blocks FEAT-003
- **epic**: EPIC-001 contains FEAT-001, FEAT-002, FEAT-003
- **subtask**: FEAT-004 is a subtask of FEAT-001
- **related-to**: ENH-001 is related to FEAT-001

### 8. Quality Gates Section

Show validation checkpoints:

- Issue requirements validation
- Status accuracy checks
- Relationship integrity verification
- Epic progress tracking

### Technical Requirements

- Use modern CSS Grid/Flexbox for responsive layout
- Include smooth transitions and hover effects
- Color scheme should match Scale Venture Partners brand (dark green #224f41, blue #0d71a9)
- Use Work Sans font for headings, Outfit for body text
- Make it mobile-friendly
- Include a "Download" button to save the file
- Add syntax highlighting for bash commands
- Include collapsible sections for detailed information

### Interactive Features

- Click to expand detailed examples
- Hover tooltips explaining each component
- Copy-to-clipboard buttons for all commands
- Filter buttons to show specific workflow paths
- Live preview of GitHub issue formats
- Animated flow between workflow stages

The final HTML should be educational, visually appealing, and demonstrate the complete database-driven development workflow from issue creation through implementation and validation.

---

**End of Prompt**

Save this HTML file as `database-driven-workflow-demo.html` and make it fully interactive and self-contained.