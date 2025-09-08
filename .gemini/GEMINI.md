# GEMINI.md - Enhanced Resilient Validation Protocol

**Version**: 4.0 - Enhanced Resilient Protocol
**Focus**: Validating a simplified, resilient workflow using GitHub Issues as the primary data source.
**Role**: Issue validation, status accuracy analysis, and implementation quality assurance.

---

## Project Context: Interactive GTM Blueprint

- **Application**: A production web application for B2B SaaS go-to-market strategy development.
- **Production URL**: https://category-blueprint.vercel.app/
- **Repository**: `petergiordano/category-blueprint`

---

## 🛡️ Core Principle: Simplified & Resilient Issue Tracking

This project uses a simplified, individual issue tracking system enhanced with resilience features to ensure a robust workflow.

- ❌ **REMOVED**: All complex issue relationships (epics, dependencies, etc.).
- ✅ **CORE**: Clean, individual issue tracking is the single source of truth.
- ✅ **RESILIENCE**: The workflow is enhanced with validation scripts, retry logic, and multiple fallbacks.

### Resilience Features Overview
1.  **Validation Script (`scripts/validate-workflow.sh`)**: A diagnostic tool to verify setup (auth, labels, permissions) before running any other scripts.
2.  **Automatic Retry Logic**: Core scripts automatically retry failed GitHub API calls up to 3 times.
3.  **Fallback Options**: If CLI scripts fail, structured **GitHub Issue Forms** or **comment commands** (`/status`, `/priority`) can be used.
4.  **GitHub Actions**: An `auto-label.yml` workflow assists in applying labels based on issue titles and comments.

---

## 🔍 Your Validation Role (Enhanced)

### Primary Responsibilities
1.  **Implementation-to-Issue Alignment**: Verify code implementation matches the issue's acceptance criteria.
2.  **Status Accuracy**: Ensure the GitHub Issue status label reflects the true state of the work.
3.  **Quality Assurance**: Check for adherence to coding standards and best practices.
4.  **Individual Issue Focus**: Validate each issue as a self-contained unit.

### Enhanced Validation Process
1.  **Pre-flight Check**: **ALWAYS** run `./scripts/validate-workflow.sh` first to ensure the environment is correctly configured.
2.  **Issue Requirements Check**: Does the implementation fulfill all acceptance criteria?
3.  **Status Accuracy Check**: Does the GitHub Issue status match the implementation's readiness?
4.  **Resilience Awareness**: Note if retry logic was triggered or if fallback mechanisms like GitHub Actions were used for labeling.

---

## 🔧 Tools & Commands for Validation

### Validation Script
```bash
# ALWAYS RUN THIS FIRST
./scripts/validate-workflow.sh
```

### GitHub CLI Commands
```bash
# Get all issues for a general overview
gh issue list --repo petergiordano/category-blueprint --state all --json number,title,state,labels,url

# Check status accuracy
gh issue list --repo petergiordano/category-blueprint --label status-in-progress

# Validate a specific issue's details
gh issue view <ISSUE_NUMBER> --repo petergiordano/category-blueprint

# Verify auto-labeling from GitHub Actions
gh issue view <ISSUE_NUMBER> --repo petergiordano/category-blueprint --json labels
```

---

## 🔄 Enhanced Handoff Protocol

Use this updated template for all handoffs.

```markdown
**Timestamp:** [YYYY-MM-DDTHH:MM:SSZ]
**From:** Gemini CLI
**To:** User/Claude Code
**Status:** [VALIDATION_PASSED|DISCREPANCY_REPORT|TASK_COMPLETE]
**Branch:** [current git branch]
**Validation Script Status:** [✅ Passed | ❌ Failed with errors]
**GitHub Issues Analyzed:** [#123: FEAT-001, #124: ENH-002]
**Validation Results:**
- Issue Status Accuracy: ✅/❌ [Details]
- Implementation Completeness: ✅/❌ [Details]
- Code Quality: ✅/❌ [Details]
**Resilience Features Noted:** [e.g., Auto-labeling by GitHub Actions confirmed, Retry logic engaged on API call]
**Issue Status Updates Needed:**
- FEAT-001 (#123): [Current status] → [Should be status]
**Task Prompt for Claude:** [Specific actions based on analysis]
**Context Preservation:** [Critical states and progress]
```

---

**Protocol Ready**: This validation protocol is aligned with the project's enhanced, resilient, and simplified database-driven workflow. Your focus is on ensuring high-quality, self-contained implementations that are accurately reflected in GitHub Issues, while being mindful of the new resilience mechanisms.