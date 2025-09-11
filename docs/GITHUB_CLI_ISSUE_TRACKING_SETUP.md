> **Note:** This document provides the technical setup instructions for the issue tracking system. For a complete overview of the multi-agent collaboration model and the overall workflow, please see the main protocol file: [**AGENTS.md**](/AGENTS.md).

# GitHub CLI + VS Code Issue Automation Setup (Enhanced v2.0)

This guide documents the **simplified database-driven workflow** with **enhanced resilience features** for GitHub CLI (gh) and VS Code integration. Agents (Claude, Gemini) and users can create and manage GitHub issues directly in the **category-blueprint** repository and project board using automated scripts with multiple fallback options.

**Key Principle**: GitHub Issues are the database. Individual issue tracking with clean labels, no complex relationships.

---

## 🆕 0) Validate Your Setup

**Before starting, run the validation script to check all dependencies:**

```bash
./scripts/validate-workflow.sh
```

This script checks:
- GitHub CLI installation and version
- Authentication status
- Repository access permissions  
- Required label existence
- Script dependencies
- VS Code integration

If any checks fail, the script provides clear instructions for fixing issues.

---

## 1) Prerequisites

- **GitHub CLI** (`gh`) installed and on PATH.
- **VS Code** with the **GitHub Pull Requests and Issues** extension.
- You have **push** access to `petergiordano/category-blueprint` and access to the project board.

Check versions:
```bash
gh --version
code --version
```

---

## 2) Authenticate & Permissions

Authenticate once, then grant additional scopes so we can write issues and attach them to Projects.

```bash
gh auth login
# When prompted: GitHub.com → HTTPS → Authenticate with GitHub credentials → login with a web browser

# Add required scopes for Projects and repo
gh auth refresh -s project -s repo -s read:org

# (Optional) extra scopes were previously granted: gist, workflow

# Verify
gh auth status
```

**Scopes needed**
- `repo` — read/write issues
- `project` — manage GitHub Projects
- `read:org` — confirm org membership (if any)
- *(optional)* `gist`, `workflow`

---

## 3) Identify Project & Owner

We add issues to the project by URL. First, confirm the project number and owner.

```bash
# List projects you own
gh project list --owner petergiordano
```
Note the **project number** (e.g., `1`) for `category-blueprint-roadmap` and the **owner** `petergiordano`.

---

## 4) Automated Scripts + VS Code Integration (Enhanced with Resilience)

We use **automation scripts** with **retry logic and error recovery**. The scripts handle ID generation, validation, and project board integration automatically.

### 🆕 Enhanced Core Automation Scripts

Located in `scripts/` directory:

```bash
# Validation and setup
./scripts/validate-workflow.sh  # 🆕 Check all dependencies before starting
./scripts/setup-github-labels.sh  # One-time label setup

# Essential Issue Creation (with auto-ID generation + retry logic)
./scripts/create-feature-issue.sh "Feature Title" "Description" "Phase 6" "High"
./scripts/create-enhancement-issue.sh "Enhancement Title" "Description" "Phase 6" "Medium"
./scripts/create-bug-issue.sh "Bug Title" "Description" "Phase 6" "High"

# AI-powered universal creation
./scripts/create-issue-ai.sh "FEAT" "Title" "Description" "Phase 6"

# Status management (with retry logic)
./scripts/update-issue-status.sh "FEAT-001" "status-in-progress"
```

### VS Code Tasks (Current)

The current `.vscode/tasks.json` integrates with these scripts:

- **GitHub: Create Feature Issue (Smart)** - Uses create-feature-issue.sh
- **GitHub: Create Enhancement Issue (Smart)** - Uses create-enhancement-issue.sh  
- **GitHub: Create Bug Issue (Smart)** - Uses create-bug-issue.sh
- **GitHub: Update Issue Status** - Uses update-issue-status.sh
- **GitHub: List Open Issues** - View current work
- **GitHub: View Project Board** - Open GitHub Projects

### Benefits of Script-Based Approach

- **Auto-ID Generation**: FEAT-001, ENH-001, BUG-001 with smart incrementing
- **Validation**: Title, phase, and priority validation built-in
- **Project Integration**: Automatic addition to GitHub Projects board
- **Error Handling**: Comprehensive validation and user feedback
- **Consistent Format**: Standardized issue templates and labels

---

## 🆕 4.5) Resilience Features

### Automatic Retry Logic
All scripts now include retry logic that automatically retries failed GitHub API calls:
- Default: 3 retry attempts with 2-second delays
- Configurable via environment variables:
```bash
export GH_MAX_RETRIES=5      # Increase retry attempts
export GH_RETRY_DELAY=3      # Delay between retries (seconds)
```

### Fallback Options

#### GitHub Issue Forms (Web UI)
If scripts fail, use GitHub's web interface:
1. Go to Issues → New Issue
2. Choose from structured forms:
   - 🚀 Feature Request
   - 🐛 Bug Report  
   - ✨ Enhancement Request
3. Fill out the form with dropdowns and validations
4. Submit (labels auto-applied)

#### Comment Commands (GitHub Actions)
Quick status updates via issue comments:
```bash
/status in-progress    # Changes status to in-progress
/status done          # Changes status to complete
/priority high        # Changes priority to high
```

### Error Recovery
Scripts provide helpful error messages:
- Authentication issues → suggests `gh auth refresh`
- Network failures → automatic retry
- Rate limits → wait and retry guidance
- Missing labels → run setup script

---

## 5) Labels Baseline (UI or CLI)

Create/confirm these labels once (UI: Repo → **Issues** → **Labels** → *New label*):

- `enhancement` (`#A2EEEF`)
- `bug` (`#D73A4A`)
- `status-todo`, `status-in-progress`, `status-complete` (all `#4C9AFF`)
- `documentation` (`#0075CA`), `ux` (`#D4C5F9`) *(optional but kept)*
- `Phase 1` … `Phase 10` (all `#B392F0`)

CLI alternative:
```bash
# Status
for s in todo in-progress complete; do gh label create status-$s -c 4C9AFF || true; done
# Types
gh label create enhancement -c A2EEEF || true
gh label create bug -c D73A4A || true
# Phases 1..10
for i in 1 2 3 4 5 6 7 8 9 10; do gh label create "Phase $i" -c B392F0 || true; done
```

---

## 6) Single Issue Template

We use **one** template for features, enhancements, and bugs. GitHub requires this path **exactly**:

```
.github/ISSUE_TEMPLATE/feature_request.md
```

Also include:
```
.github/ISSUE_TEMPLATE/config.yml
```
with:
```yaml
blank_issues_enabled: false
contact_links: []
```

Template content (see Section 8) defines the body structure; labels are applied via the VS Code task or UI.

---

## 7) Standardized Issue Format

We use a single, simple format for new PRD items (features, enhancements, bugs). Titles encode the ID; labels encode **type**, **phase**, and **status**.

**Title schema**
```
[FEAT-ID]: [Feature Name]
[ENH-ID]: [Enhancement Name]
[BUG-ID]:  [Bug Name]
```

**Required labels**
- One **type** label: `enhancement` or `bug`
- One **status** label: `status-todo` | `status-in-progress` | `status-complete`
- One **phase** label: `Phase 1` … `Phase 10`  

**Recommended body block** (agents paste this when creating issues):
```markdown
## Description
[One sentence purpose]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Phase
Phase X: [Phase Name]

## Status
⬜ Todo  
🚧 In Progress  
✅ Complete (Date)
```

---

## 8) GitHub Issue Template (All Issue Types)

Path: **`.github/ISSUE_TEMPLATE/feature_request.md`**

```markdown
---
name: New Issue (Feature / Enhancement / Bug)
about: Create a new feature, enhancement, or bug report
title: "[FEAT-ID] / [ENH-ID] / [BUG-ID]: [Title]"
labels:
assignees: ''
---

## Description
[One sentence purpose of the feature, enhancement, or bug]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Phase
Phase X: [Phase Name]

## Status
⬜ Todo  *(select one)*  
🚧 In Progress  *(select one)*  
✅ Complete (Date)  *(select one)*
```

Notes:
- We use **one** template for all issue types; categorization is by label (`enhancement` or `bug`).
- Add a **Phase** label during creation or via the VS Code task.

---

## 9) Quick-create with Automation Scripts

Use the automation scripts for reliable issue creation:

```bash
# Features (new functionality)
./scripts/create-feature-issue.sh "Feature Name" "Description" "Phase 6" "High"

# Enhancements (improvements to existing features)  
./scripts/create-enhancement-issue.sh "Enhancement Name" "Description" "Phase 6" "Medium"

# Bug fixes
./scripts/create-bug-issue.sh "Bug Name" "Description" "Phase 6" "High"
```

**Benefits:**
- Auto-generates IDs (FEAT-001, ENH-001, BUG-001)
- Validates input and applies correct labels automatically
- Adds to GitHub Projects board
- Consistent formatting and structure

**VS Code Alternative:** Use Command Palette → "Tasks: Run Task" → Select the appropriate GitHub task.

---

## 10) Repository Labels (reference)

The following labels are configured in this repository:

| Name              | Description                                | Color   |
|-------------------|--------------------------------------------|---------|
| bug               | Something isn't working                    | `#d73a4a` |
| documentation     | Improvements or additions to documentation | `#0075ca` |
| enhancement       | New feature or request                     | `#a2eeef` |
| status-complete   | Done / finished                            | `#4C9AFF` |
| status-todo       | Planned, not started                       | `#4C9AFF` |
| status-in-progress| Currently being worked on                  | `#4C9AFF` |
| ux                | User experience related                    | `#D4C5F9` |
| Phase 1           | Phase 1 work                               | `#B392F0` |
| Phase 2           | Phase 2 work                               | `#B392F0` |
| Phase 3           | Phase 3 work                               | `#B392F0` |
| Phase 4           | Phase 4 work                               | `#B392F0` |
| Phase 5           | Phase 5 work                               | `#B392F0` |
| Phase 6           | Phase 6 work                               | `#B392F0` |
| Phase 7           | Phase 7 work                               | `#B392F0` |
| Phase 8           | Phase 8 work                               | `#B392F0` |
| Phase 9           | Phase 9 work                               | `#B392F0` |
| Phase 10          | Phase 10 work                              | `#B392F0` |

---

## 11) Verification Checklist

After setup, confirm the following:

1. Navigate to  
   `https://github.com/petergiordano/category-blueprint/issues/new/choose`

   You should see a single option:  
   **“New Issue (Feature / Enhancement / Bug)”**.

2. Clicking this opens the unified template defined in  
   `.github/ISSUE_TEMPLATE/feature_request.md`.

3. Blank issues are disabled, because  
   `.github/ISSUE_TEMPLATE/config.yml` has `blank_issues_enabled: false`.

4. The label list (Section 10) matches the repository’s actual Labels page.

When all four are correct, the repository is ready for agents and VS Code tasks to create and manage issues consistently.