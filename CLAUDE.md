# CLAUDE.md - Interactive Positioning Blueprint Development Guide

This file provides comprehensive instructions for Claude Code when working on the Positioning Blueprint repository, following database-driven development with GitHub Issues as the single source of truth.

**Version**: 4.0 - Enhanced Structure Following LangChain Best Practices
**Repository**: `petergiordano/positioning-blueprint`
**Production**: https://positioning-blueprint.vercel.app/

---

## 1. Project Structure & Requirements

### Core Application Architecture
```
positioning-blueprint/
├── index.html           # Single-page React application
├── api/                 # Vercel serverless functions
│   ├── generate-research-prompt.js
│   ├── process-deep-research.js
│   └── ai-research-assistant.js
├── scripts/            # GitHub automation scripts
├── docs/               # Documentation & specifications
└── .vscode/           # VS Code integration
```

### Technology Stack
- **Frontend**: React (via CDN), Tailwind CSS, Local Storage
- **Backend**: Vercel Serverless Functions
- **APIs**: Brave Search API, Google Gemini API
- **Deployment**: Vercel (automatic on push to main)
- **Database**: GitHub Issues (authoritative data source)

---

## 2. 🔴 MANDATORY Pre-Work Validation

**ALWAYS run these checks before ANY development work:**

```bash
# Step 1: Validate entire workflow setup
./scripts/validate-workflow.sh

# Step 2: Ensure on latest main branch
git checkout main
git pull origin main

# Step 3: Create feature branch
git checkout -b feat/descriptive-name

# Step 4: Kill any existing dev servers
pkill -f "vercel dev"

# Step 5: Start fresh dev server with environment variables
BRAVE_API_KEY=[YOUR_BRAVE_API_KEY] \
GEMINI_API_KEY=[YOUR_GEMINI_API_KEY] \
vercel dev --listen 3000 --token [YOUR_VERCEL_TOKEN]

# Step 6: Verify application loads correctly
open http://localhost:3000
# Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
```

---

## 3. Core Development Principles

### Database-First Philosophy
- **GitHub Issues = Single Source of Truth**
- **No Status in Files** - All status tracked via GitHub labels
- **Simple Individual Issues** - No complex dependencies
- **Direct Implementation** - Issue → Code → Status Update

### Issue Management Workflow
```bash
# Create issue BEFORE starting work
./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"

# Update status when starting
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"

# Implement feature
[Your code here]

# Update status when complete
./scripts/update-issue-status.sh "FEAT-001" "status-complete"
```

### Simplified Label System
| Type | Labels | Purpose |
|------|--------|---------|
| Status | `status-todo`, `status-in-progress`, `status-complete` | Track progress |
| Priority | `priority-high`, `priority-medium`, `priority-low` | Set importance |
| Phase | `Phase 1` through `Phase 10` | Development phases |
| Type | `enhancement`, `bug` | Issue classification |

---

## 4. Code Patterns & Implementation Standards

### React Component Pattern
```javascript
// Standard component structure for this project
const ComponentName = () => {
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        // Side effects and data loading
    }, [dependencies]);

    const handleAction = async () => {
        try {
            // Action logic
        } catch (error) {
            console.error('Error in ComponentName:', error);
            // User-friendly error handling
        }
    };

    return (
        <div className="standard-tailwind-classes">
            {/* Component JSX */}
        </div>
    );
};
```

### API Function Pattern
```javascript
// api/function-name.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { param1, param2 } = req.body;

        // Validate inputs
        if (!param1) {
            return res.status(400).json({ error: 'Missing required parameter' });
        }

        // Process request
        const result = await processLogic(param1, param2);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

### State Management Pattern
```javascript
// Local storage for persistence
const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return defaultValue;
    }
};
```

---

## 5. Tool Usage & Automation

### Essential Scripts
```bash
# Validation & Setup
./scripts/validate-workflow.sh          # Check all dependencies
./scripts/setup-github-labels.sh        # One-time label setup

# Issue Management
./scripts/create-feature-issue.sh       # Create FEAT-xxx issues
./scripts/create-enhancement-issue.sh   # Create ENH-xxx issues
./scripts/create-bug-issue.sh          # Create BUG-xxx issues
./scripts/update-issue-status.sh       # Update issue status

# AI-Powered Creation
./scripts/create-issue-ai.sh "FEAT" "Title" "Description" "Phase"
```

### Error Recovery & Resilience
- **Automatic Retry**: Scripts retry 3 times on failure
- **Fallback Options**: Use GitHub web UI if scripts fail
- **Comment Commands**: `/status in-progress`, `/priority high`
- **Environment Variables**:
  ```bash
  export GH_MAX_RETRIES=5      # Increase retry attempts
  export GH_RETRY_DELAY=3      # Delay between retries
  ```

---

## 6. Best Practices & Coding Standards

### Implementation Checklist
- [ ] Create GitHub issue before starting work
- [ ] Update issue status to in-progress
- [ ] Follow existing code patterns
- [ ] Test across different browsers
- [ ] Ensure mobile responsiveness
- [ ] Update issue status when complete
- [ ] Reference issue in commit message

### Code Quality Standards
- **No Comments**: Unless explicitly requested
- **Follow Conventions**: Match existing code style
- **Security First**: Never commit secrets or API keys
- **Error Handling**: Always use try-catch blocks
- **User Experience**: Provide clear feedback for all actions

### Git Commit Messages
```bash
# Format: type: description [#issue]
git commit -m "feat: Add OAuth integration [#123: FEAT-001]"
git commit -m "fix: Resolve modal closing issue [#124: BUG-002]"
git commit -m "enhance: Improve form validation [#125: ENH-003]"
```

---

## 7. Common Pitfalls & Solutions

### ❌ Outdated Code After Branch Switch
**Problem**: Dev server shows old UI after changing branches
**Solution**:
```bash
pkill -f "vercel dev"
git fetch origin && git merge origin/main
# Restart server with full environment variables
```

### ❌ Missing Recent Features
**Problem**: Feature branch lacks recently merged changes
**Solution**:
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge origin/main  # or git rebase origin/main
```

### ❌ Server Not Picking Up Changes
**Problem**: Changes not reflected even after save
**Solution**:
1. Kill all Node processes: `pkill -f "node"`
2. Clear browser cache: Cmd+Shift+R
3. Restart dev server with environment variables

### ❌ Issue Creation Failures
**Problem**: Scripts fail to create issues
**Solution**:
1. Run `./scripts/validate-workflow.sh`
2. Check authentication: `gh auth status`
3. Use GitHub web UI as fallback
4. Apply labels manually if needed

---

## 8. Multi-Agent Collaboration Protocol

### Agent Roles (4-Agent Model)
1. **The Director** (Human): Sets goals and provides final approval
2. **The AI Strategist** (Browser LLM): Creates technical requirements as GitHub Issues
3. **The AI Implementers** (Claude & Codex): Collaboratively implement features based on issues
   - **Claude Code** (You): Primary implementer with access to codebase
   - **Codex**: Collaborative implementer following CODEX.md protocol
4. **The AI Validator** (Gemini): Validates implementations against acceptance criteria

### GitHub Issue Capabilities
- **Your Responsibility (Claude/Codex)**: As an AI Implementer, you are responsible for creating and editing issues with detailed, multi-line descriptions.
- **Gemini's (Validator) Limitation**: The AI Validator, Gemini, **cannot** create or edit issues with complex, multi-line bodies due to an environment restriction. It can only manage labels and status, or create issues with simple, single-line bodies.
- **Workflow Implication**: Do not instruct Gemini to create or edit detailed issues. Perform these actions yourself.

### Collaboration with Codex
When working with Codex on the same issue:
- **Division of Work**: Coordinate implementation tasks to avoid conflicts
- **Code Review**: Review Codex's implementations for consistency
- **Shared Standards**: Both follow the same coding guidelines from AGENTS.md
- **Status Updates**: Ensure issue status reflects combined progress

### Handoff Communication
Update `.aicontext/context.md` with:
```markdown
**Timestamp:** 2025-01-19T12:00:00Z
**From:** Claude Code
**To:** User/Gemini CLI/Codex
**Status:** FEATURE_COMPLETE
**Branch:** feat/feature-name
**Issues Worked On:** #123: FEAT-001
**Summary:** Implemented OAuth integration
**Technical Details:** Added Google OAuth to api/auth.js
**Context Preservation:** Environment variables configured
**Next:** Ready for validation testing
```

---

## 9. Deployment & Production

### Local Development
```bash
npm install                # Install dependencies
npm run dev               # Start dev server
open http://localhost:3000  # View application
```

### Production Deployment
```bash
# Automatic deployment on push to main
git push origin main

# Manual deployment
vercel deploy --prod

# Verify production
open https://positioning-blueprint.vercel.app/
```

### Environment Variables
Required in Vercel dashboard:
- `BRAVE_API_KEY` - Brave Search API key
- `GEMINI_API_KEY` - Google Gemini API key

---

## 10. Quick Reference

### File Locations
| Purpose | File/Directory |
|---------|---------------|
| Main Application | `index.html` |
| API Functions | `api/*.js` |
| Issue Scripts | `scripts/*.sh` |
| Documentation | `docs/*.md` |
| Shared Context | `.aicontext/context.md` |

### Key URLs
- **Production**: https://positioning-blueprint.vercel.app/
- **Repository**: https://github.com/petergiordano/positioning-blueprint
- **Project Board**: https://github.com/users/petergiordano/projects/1
- **Issues**: https://github.com/petergiordano/positioning-blueprint/issues

### Emergency Commands
```bash
# Fix everything and start fresh
pkill -f "vercel\|node"
git checkout main && git pull
./scripts/validate-workflow.sh
git checkout -b fix/emergency-fix
# Then restart dev server with full command
```

---

**Remember**: GitHub Issues are the single source of truth. Every feature starts with an issue, every implementation updates issue status, and every completion closes an issue. This is non-negotiable.