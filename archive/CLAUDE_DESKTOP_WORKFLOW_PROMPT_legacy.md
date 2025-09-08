# Claude Desktop Prompt: Database-Driven Workflow Interactive Visualization

Copy and paste this prompt into Claude Desktop to create an interactive HTML visualization of the database-driven development workflow:

---

**Prompt for Claude Desktop:**

Create a standalone interactive HTML file that visualizes and demonstrates the simplified database-driven development workflow for a GitHub Issues-based project management system. The HTML should be fully self-contained with embedded CSS and JavaScript.

**Important Context**: Read these key files to understand the complete workflow and implementation details:

- `/Users/petergiordano/Documents/GitHub/category-blueprint/docs/DATABASE_DRIVEN_WORKFLOW.md` - Complete simplified workflow guide with rules, commands, and examples
- `/Users/petergiordano/Documents/GitHub/category-blueprint/CLAUDE.md` - Claude Code agent protocol for database-driven development  
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.gemini/GEMINI.md` - Gemini CLI validation and analysis protocol
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.vscode/tasks.json` - VS Code task definitions for issue management
- **Key automation scripts in `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/` directory**

**CRITICAL**: This system requires specific GitHub labels to function. The visualization must include setup requirements.

**IMPORTANT**: The workflow has been simplified to remove complex issue relationships and dependencies for better reliability and ease of use.

## As-Built System Details (MUST INCLUDE IN VISUALIZATION)

### Setup Requirements (Show as prerequisite step)
- **Repository Setup**: Requires `./scripts/setup-github-labels.sh` to create required labels
- **Required Labels**: priority-high/medium/low, status-todo/in-progress/complete, Phase 1-10
- **Authentication**: GitHub CLI must be authenticated (`gh auth status`)
- **Permissions**: Repository write access, GitHub Projects access

### Core Automation Scripts (Annotate each workflow step with script filenames)
```bash
# Essential Issue Creation Scripts
./scripts/create-feature-issue.sh "Title" "Description" "Phase 6" "High"
./scripts/create-enhancement-issue.sh "Title" "Description" "Phase 6" "Medium" 
./scripts/create-bug-issue.sh "Title" "Description" "Phase 6" "High"
./scripts/create-issue-ai.sh "FEAT" "Title" "Description" "Phase 6"

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
- Simplified task set focused on core functionality

### GitHub Projects Integration (Show data flow)
- Project URL: https://github.com/users/petergiordano/projects/1
- Auto-addition of issues to project board
- Status synchronization through labels
- Clean individual issue tracking

### Testing Results (Include performance data)
- **Issue Creation Time**: ~2-3 seconds per issue
- **Label Application**: Automatic with proper validation
- **Project Board Sync**: Immediate
- **Simplified Workflow**: Clean individual issue tracking without complex relationships

## Requirements

### 1. Workflow Overview Section

- Visual flowchart showing: PRD → GitHub Issues → Implementation → Validation → GitHub Projects
- Interactive elements that highlight each stage when clicked
- Show the simplified individual issue tracking approach (no complex relationships)
- Emphasize Files (reference only) vs Database (primary tracking)

### 2. Issue Types Demonstration

Create interactive sections for each issue type:

- **FEAT**: Features (new functionality)
- **ENH**: Enhancements (improvements to existing features)  
- **BUG**: Bug fixes

Each section should show:

- Sample issue creation command
- Example GitHub issue format
- How it appears in GitHub Projects board
- Simple clean labels (no complex relationships)

### 3. Script Usage Guide

Interactive demonstration of key scripts:

**Issue Creation Scripts:**

- `./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"`
- `./scripts/create-enhancement-issue.sh "Enhancement Name" "Description" "Phase 6" "Medium"`
- `./scripts/create-bug-issue.sh "Bug Name" "Description" "Phase 6" "High"`

**Status Updates:**

- `./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"`

### 4. VS Code Integration Panel

Show the VS Code Command Palette tasks:

- "GitHub: Create Feature Issue (Smart)"
- "GitHub: Create Enhancement Issue (Smart)"
- "GitHub: Create Bug Issue (Smart)"
- "GitHub: Update Issue Status"
- "GitHub: List Open Issues"
- "GitHub: View Project Board"

### 5. Agent Coordination Visualization

Show how the three agents interact:

- **Claude Code**: Creates issues, implements features, updates status
- **Gemini CLI**: Validates implementations, checks issue accuracy
- **User**: Prioritizes work through GitHub Projects board

Include sample handoff log entries and status updates.

### 6. GitHub Projects Integration

Visual representation of:

- How issues flow through project board columns
- Status labels (status-todo, status-in-progress, status-complete)
- Priority labels (priority-high, priority-medium, priority-low)
- Phase labels (Phase 1-10)
- Project board URL: <https://github.com/users/petergiordano/projects/1>

### 7. Quality Gates Section

Show validation checkpoints:

- Issue requirements validation
- Status accuracy checks
- Implementation completeness verification

### 8. Setup & Prerequisites Section (CRITICAL - Must be first step)

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