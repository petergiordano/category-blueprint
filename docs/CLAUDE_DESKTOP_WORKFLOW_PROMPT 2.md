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
- `/Users/petergiordano/Documents/GitHub/category-blueprint/docs/E2E_TEST_PLAN.md` - End-to-end testing results and findings
- **All automation scripts in `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/` directory**

**CRITICAL**: This system requires specific GitHub labels to function. The visualization must include setup requirements.

## As-Built System Details (MUST INCLUDE IN VISUALIZATION)

### Setup Requirements (Show as prerequisite step)
- **Repository Setup**: Requires `./scripts/setup-github-labels.sh` to create required labels
- **Required Labels**: epic, epic-item, has-dependencies, has-dependents, priority-high/medium/low, status-todo/in-progress/complete, Phase 1-10
- **Authentication**: GitHub CLI must be authenticated (`gh auth status`)
- **Permissions**: Repository write access, GitHub Projects access

### Automation Scripts (Annotate each workflow step with script filenames)
```bash
# Core Issue Creation Scripts
./scripts/create-feature-issue.sh "Title" "Description" "Phase 6" "High"
./scripts/create-enhancement-issue.sh "Title" "Description" "Phase 6" "Medium" 
./scripts/create-bug-issue.sh "Title" "Description" "Phase 6" "High"
./scripts/create-issue-ai.sh "FEAT" "Title" "Description" "Phase 6"

# Epic Management
./scripts/create-epic-issues.sh "Epic Title" "Description" "Phase 6" "Component 1" "Component 2"

# Relationship Management  
./scripts/link-related-issues.sh "FEAT-001" "FEAT-002" "depends-on"
./scripts/link-related-issues.sh "EPIC-001" "FEAT-001" "epic"

# Status Management
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"

# Utilities
./scripts/issue-utils.sh - Shared functions (get_next_id, detect_current_phase, etc.)
./scripts/setup-github-labels.sh - One-time setup for required labels
```

### VS Code Integration (Show as alternative workflow path)
- Command Palette → "Tasks: Run Task" 
- Tasks defined in `.vscode/tasks.json`
- Smart input prompts for all parameters
- Direct integration with shell scripts

### GitHub Projects Integration (Show data flow)
- Project URL: https://github.com/users/petergiordano/projects/1
- Auto-addition of issues to project board
- Status synchronization through labels
- Visual relationship tracking

### Testing Results (Include performance data)
- **Issue Creation Time**: ~2-3 seconds per issue
- **Epic Creation Time**: ~5-8 seconds (epic + multiple features + linking)
- **Label Application**: Automatic with proper validation
- **Project Board Sync**: Immediate

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

### 9. Setup & Prerequisites Section (CRITICAL - Must be first step)

Show this as the mandatory first step in any workflow:

```bash
# ONE-TIME REPOSITORY SETUP (Required before any issue creation)
./scripts/setup-github-labels.sh

# Verify GitHub CLI authentication
gh auth status

# Verify repository access  
gh repo view petergiordano/category-blueprint

# Verify project board access
open https://github.com/users/petergiordano/projects/1
```

**Required Labels Created**:
- epic, epic-item (for epic relationships)
- has-dependencies, has-dependents (for issue relationships)  
- priority-high, priority-medium, priority-low (for prioritization)
- status-todo, status-in-progress, status-complete (for status tracking)
- Phase 1-10 (for phase management)

### 10. Common Issues & Solutions Section

**Issue**: "Label 'epic' not found" error
**Solution**: Run `./scripts/setup-github-labels.sh` first

**Issue**: Script fails with authentication error
**Solution**: Run `gh auth login` to authenticate GitHub CLI

**Issue**: Permission denied on project board
**Solution**: Ensure GitHub token has 'project' scope permissions

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