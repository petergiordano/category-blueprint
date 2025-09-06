# GitHub CLI + VS Code Issue Automation Setup

This guide documents how we configure GitHub CLI (gh) and VS Code tasks so agents (Claude, Gemini, ChatGPT) can create and manage GitHub issues directly in the **category-blueprint** repository and project board.

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

## 4) VS Code Tasks Configuration

Add tasks to `.vscode/tasks.json` so agents can run them inside VS Code.

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "GitHub: Create issue + add to Project",
      "type": "shell",
      "command": "bash",
      "args": [
        "-lc",
        "ISSUE_URL=$(gh issue create --repo petergiordano/category-blueprint --title \"${input:issueTitle}\" --body \"${input:issueBody}\" --assignee @me --label ${input:labels} | tail -n1); gh project item-add 1 --owner petergiordano --url \"$ISSUE_URL\"; echo Created: $ISSUE_URL"
      ]
    },
    {
      "label": "GitHub: Comment on issue #",
      "type": "shell",
      "command": "bash",
      "args": [
        "-lc",
        "gh issue comment ${input:issueNumber} --repo petergiordano/category-blueprint --body \"${input:comment}\""
      ]
    },
    {
      "label": "GitHub: Close issue #",
      "type": "shell",
      "command": "bash",
      "args": [
        "-lc",
        "gh issue close ${input:issueNumber} --repo petergiordano/category-blueprint"
      ]
    }
  ],
  "inputs": [
    { "id": "issueTitle",  "type": "promptString", "description": "Issue title (use [FEAT-ID]/[ENH-ID]/[BUG-ID]: <Title>)" },
    { "id": "labels",      "type": "promptString", "description": "Comma-separated labels (e.g., enhancement, Phase 6, status-todo)" },
    { "id": "issueBody",   "type": "promptString", "description": "Issue body markdown" },
    { "id": "issueNumber", "type": "promptString", "description": "Issue number" },
    { "id": "comment",     "type": "promptString", "description": "Comment body" }
  ]
}
```

Tips:
- Title format and labels should follow Sections **7** and **10** below.
- The task echoes the created issue URL so agents can capture it.

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

## 9) Quick-create Tasks (agent friendly)

Use the task **GitHub: Create issue + add to Project** and supply:
- **Title**: `"[FEAT-###] / [ENH-###] / [BUG-###]: <Title>"`
- **Labels**: `enhancement` *or* `bug`, plus `Phase X`, `status-todo`
- **Body**: paste the *Recommended body block* from Section 7

Other handy tasks: **Comment on issue #**, **Close issue #**.

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