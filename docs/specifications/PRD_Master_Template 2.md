# [Project Name] - Unified Product Requirements Document

**Version**: 1.0  
**Last Updated**: [Date]  
**Development Philosophy**: Function Over Fashion - Build iteratively with compound value  
**Workflow Integration**: Compatible with dev-cycle.md AI-powered development workflow

---

## 1. Executive Summary

### 1.1. Vision
[CUSTOMIZE: Define your project's vision - what automated system are you building and what manual work does it eliminate?]

### 1.2. Business Goals & Objectives
* **Primary Goal**: [CUSTOMIZE: Your main quantifiable goal]
* **Secondary Goals**:
  * [CUSTOMIZE: Time savings goal]
  * [CUSTOMIZE: Quality improvement goal]
  * [CUSTOMIZE: Scalability goal]

### 1.3. Guiding Principles
* **Function Over Fashion**: Build iteratively with compound value
* **Simple, Lovable, and Complete (SLC)**: Each component follows SLC principles
* **AI-Powered Development**: Leverage AI assistants with human oversight

---

## 2. System Architecture & Development Status

### 2.1. [N]-Component Pipeline Overview

*[CUSTOMIZE: Define your pipeline components - typically 4-8 components work well]*

| ID | Component | Status | GitHub Issues | Feature Spec | Implementation Log |
|---|---|---|---|---|---|
| FEAT-001 | [Component 1 Name] | [STATUS] | [#issue-links] | `feat_spec-component1.md` | `feat_spec-component1-tasks.md` |
| FEAT-002 | [Component 2 Name] | [STATUS] | [#issue-links] | `feat_spec-component2.md` | `feat_spec-component2-tasks.md` |
| FEAT-003 | [Component 3 Name] | [STATUS] | [#issue-links] | `feat_spec-component3.md` | `feat_spec-component3-tasks.md` |
| FEAT-004 | [Component 4 Name] | [STATUS] | [#issue-links] | `feat_spec-component4.md` | `feat_spec-component4-tasks.md` |

*Status Legend: ✅ COMPLETE | 🚧 IN PROGRESS | 📝 PLANNED*

### 2.2. Non-Core Features & Enhancements

| ID | Feature | Type | Status | GitHub Issues | Description |
|---|---|---|---|---|---|
| ENH-001 | [Enhancement Name] | Enhancement | [STATUS] | [#issue-links] | [Description] |
| BUG-001 | [Bug Name] | Bug Fix | [STATUS] | [#issue-links] | [Description] |

### 2.3. Technical Stack
* **Language**: [CUSTOMIZE: Primary programming language]
* **Domain Tools**: [CUSTOMIZE: Domain-specific tools/APIs]
* **Deployment**: [CUSTOMIZE: Deployment strategy]
* **AI Integration**: Claude Code, Gemini CLI, feature spec generation

---

## 3. Development Workflow Integration

### 3.1. AI-Powered Development Cycle
This PRD integrates with the established development workflow in `docs/specifications/dev-cycle.md`:

1. **PRD as Source of Truth** → This document
2. **Component Identification** → Select next FEAT-XXX from table above
3. **Feature Spec Generation** → AI generates `feat_spec-[component].md`
4. **AI Implementation** → AI creates branch, implements, creates PR
5. **Review & Merge** → Human review and merge
6. **PRD Update** → Update status in this document

### 3.2. Feature ID System
* **Core Components**: `FEAT-001`, `FEAT-002`, etc.
* **Enhancements**: `ENH-001`, `ENH-002`, etc.
* **Bug Fixes**: `BUG-001`, `BUG-002`, etc.
* **GitHub Issue Integration**: Each feature ID maps to GitHub Issues

### 3.3. Documentation Tracking
* **Feature Specs**: `docs/specifications/feat_spec-[component].md`
* **Implementation Logs**: `docs/implementation-logs/feat_spec-[component]-tasks.md`
* **GitHub Issues**: Linked in PRD table and cross-referenced in feature specs

---

## 4. Component Specifications

### 4.1. FEAT-001: [Component 1 Name] [STATUS]
* **Status**: [Current status and completion date if applicable]
* **Purpose**: [What this component does]
* **Input**: [What it receives]
* **Output**: [What it produces]
* **Success Criteria**: [How you measure success]
* **GitHub Issues**: [Link to related issues]
* **Feature Spec**: `docs/specifications/feat_spec-component1.md`
* **Implementation Log**: `docs/implementation-logs/feat_spec-component1-tasks.md`

### 4.2. FEAT-002: [Component 2 Name] [STATUS]
* **Status**: [Current status and completion date if applicable]
* **Purpose**: [What this component does]
* **Input**: [What it receives]
* **Output**: [What it produces]
* **Success Criteria**: [How you measure success]
* **GitHub Issues**: [Link to related issues]
* **Feature Spec**: `docs/specifications/feat_spec-component2.md`
* **Implementation Log**: `docs/implementation-logs/feat_spec-component2-tasks.md`

*[Continue for all components...]*

---

## 5. Enhancement & Bug Tracking

### 5.1. ENH-001: [Enhancement Name] [STATUS]
* **Type**: Enhancement
* **Status**: [Current status]
* **Description**: [What this enhancement adds]
* **Justification**: [Why this enhancement is needed]
* **GitHub Issues**: [Link to related issues]
* **Dependencies**: [Any component dependencies]

### 5.2. BUG-001: [Bug Name] [STATUS]
* **Type**: Bug Fix
* **Status**: [Current status]
* **Description**: [What bug this fixes]
* **Impact**: [Severity and user impact]
* **GitHub Issues**: [Link to related issues]
* **Root Cause**: [Technical cause if known]

---

## 6. Technical Requirements & Constraints

### 6.1. Dependencies
* [CUSTOMIZE: Programming language and version]
* [CUSTOMIZE: Required external services/APIs]
* [CUSTOMIZE: Key libraries and tools]
* [CUSTOMIZE: AI assistant requirements]

### 6.2. AI Development Requirements
* **Claude Code Integration**: For complex implementation tasks
* **Gemini CLI Integration**: For validation and analysis
* **Feature Spec Generation**: AI-generated detailed specifications
* **Task Management**: Two-tier system (AI-managed core + external housekeeping)

---

## 7. Success Metrics & Validation

### 7.1. Overall Project Success
* [CUSTOMIZE: Quantifiable output goal]
* [CUSTOMIZE: Time performance target]
* [CUSTOMIZE: Quality standard]
* [CUSTOMIZE: AI automation effectiveness]

### 7.2. Development Process Success
* **Feature Spec Quality**: AI-generated specs meet implementation requirements
* **Implementation Success**: Components pass validation on first attempt
* **Integration Success**: Components work together in pipeline
* **Documentation Completeness**: All logs and specs maintained

---

## 8. Project Management

### 8.1. Source of Truth
This document serves as the definitive source of truth for:
* Component specifications and status
* Feature ID assignments
* GitHub Issue relationships
* Development workflow integration

### 8.2. Update Protocol
* **Never Change**: Core requirements, success criteria, component architecture
* **Regular Updates**: Status markers, completion dates, GitHub Issue links
* **AI Commands**: Use `@update-prd` for automated status synchronization

### 8.3. GitHub Integration
* All features tracked as GitHub Issues with consistent ID format
* GitHub Project board reflects PRD status
* Automated issue creation from PRD component definitions

---

## 9. Migration from Legacy Systems

### 9.1. Feature ID Migration
* **Legacy F-1, F-2 format** → **New FEAT-001, FEAT-002 format**
* **Legacy epic-based tracking** → **Unified PRD + GitHub Issues**
* **Manual handoff logs** → **Automated status synchronization**

### 9.2. Documentation Consolidation
* **Multiple PRD files** → **Single PRD_Master.md**
* **Separate feature tracking** → **Integrated table system**
* **Disconnected issue tracking** → **Bidirectional PRD-GitHub sync**

---

**Workflow Ready**: This PRD integrates with the established AI-powered development cycle in `dev-cycle.md` while adding GitHub Issue management and unified feature tracking.