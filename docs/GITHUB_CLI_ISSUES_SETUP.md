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

## 8) GitHub Issue Template (Feature Request)

Path: **`.github/ISSUE_TEMPLATE/feature_request.md`**

```markdown
---
name: Feature Request
about: Suggest a new feature, enhancement, or improvement
title: "[FEAT-ID]: [Feature Name]"
labels: enhancement, status-todo
assignees: ''
---

## Description
[One sentence purpose of the feature]

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

Notes:
- The template adds `enhancement` + `status-todo` automatically.  
- Add a **Phase** label (`Phase 1` … `Phase 10`) during creation or with the CLI/VS Code tasks.

---

## 9) Quick-create Tasks (agent friendly)

Use the existing tasks (Section 3) or the prompts below. Tasks create an issue and attach it to the Project in one step.

**Create Feature (+project)**
- Task: *GitHub: Create issue + add to Project*
- Title: `"[FEAT-###]: <Title>"`
- Labels: `enhancement, Phase X, status-todo`
- Body: paste the *Recommended body block*.

**Create Bug (+project)**
- Task: *GitHub: Create issue + add to Project*
- Title: `"[BUG-###]: <Title>"`
- Labels: `bug, Phase X, status-todo`
- Body: include steps/expected/actual.

**Comment / Close**
- Tasks: *GitHub: Comment on issue #*, *GitHub: Close issue #*

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

✅ With this setup, agents (Claude Code, Gemini CLI, ChatGPT) can create, label, assign, comment, close, and automatically add issues to the **category-blueprint** Project from within VS Code.