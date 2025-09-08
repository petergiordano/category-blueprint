# Gemini CLI Update Prompt: Simplified Database-Driven Workflow

**Purpose**: Guide Gemini CLI to learn the complete simplified issue tracking system and update its own configuration files.

---

## 🎯 Your Mission, Gemini CLI

You need to **learn the entire simplified database-driven workflow** and **update your configuration files** to reflect the current system. The workflow has been significantly simplified based on user feedback to eliminate "complicated and brittle" relationship systems.

### **Critical Context**: Major Simplification
- ❌ **REMOVED**: Complex issue relationships (depends-on, blocks, epic, subtask)
- ❌ **REMOVED**: Epic management and relationship scripts
- ✅ **SIMPLIFIED**: Clean individual issue tracking only
- ✅ **STREAMLINED**: Basic labels only (status, priority, phase, type)

---

## 📚 Step 1: Read All Current Documentation (In This Order)

### **1. Foundation Knowledge**
Read these files to understand the complete current system:

**Primary System Documentation:**
- `/Users/petergiordano/Documents/GitHub/category-blueprint/README.md` - **NEW** project overview
- `/Users/petergiordano/Documents/GitHub/category-blueprint/CLAUDE.md` - **UPDATED** Claude Code protocol (v3.0)
- `/Users/petergiordano/Documents/GitHub/category-blueprint/docs/DATABASE_DRIVEN_WORKFLOW.md` - Simplified workflow rules
- `/Users/petergiordano/Documents/GitHub/category-blueprint/docs/GITHUB_CLI_ISSUE_TRACKING_SETUP.md` - Complete setup guide

### **2. Training Documentation**
- `/Users/petergiordano/Documents/GitHub/category-blueprint/docs/GEMINI_CLI_TRAINING_PROMPT.md` - Your comprehensive training guide (280+ lines)

### **3. Technical Implementation**
**GitHub Integration Files:**
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.github/ISSUE_TEMPLATE/feature_request.md` - Unified issue template
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.github/ISSUE_TEMPLATE/config.yml` - Template configuration

**VS Code Integration:**
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.vscode/tasks.json` - Simplified task definitions

**Automation Scripts:** (Study these to understand the workflow)
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/issue-utils.sh` - Core utilities
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/create-feature-issue.sh` - Feature creation
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/create-enhancement-issue.sh` - Enhancement creation
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/create-bug-issue.sh` - Bug creation
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/update-issue-status.sh` - Status management
- `/Users/petergiordano/Documents/GitHub/category-blueprint/scripts/setup-github-labels.sh` - Required labels setup

### **4. Context and History**
- `/Users/petergiordano/Documents/GitHub/category-blueprint/.aicontext/context.md` - Current project state and handoff logs

---

## 🔍 Step 2: Analyze What You've Learned

After reading all files, you should understand:

### **The Simplified System**
- **Individual Issue Tracking**: No complex relationships between issues
- **Simple Labels**: Only status-todo/in-progress/complete, priority-high/medium/low, Phase 1-10, enhancement/bug
- **Clean Workflow**: Create issue → implement → update status → validate
- **Automation Scripts**: 7 core scripts that handle issue management seamlessly

### **Your Updated Role**
- **Issue-Implementation Alignment**: Verify code matches issue requirements
- **Status Accuracy**: Ensure GitHub Issues reflect implementation reality
- **Quality Assurance**: Check acceptance criteria are met
- **No Relationship Management**: Focus on individual issue quality only

### **Key Changes from Previous System**
- ❌ No more epic management or complex relationships
- ❌ No more dependency tracking between issues
- ✅ Simple, reliable individual issue validation
- ✅ Focus on implementation quality and status accuracy

---

## 📝 Step 3: Update Your Configuration Files

### **Update `.gemini/GEMINI.md`**
Your current `.gemini/GEMINI.md` file needs updating to reflect the simplified workflow. Update it to include:

**Remove These Sections:**
- Epic and relationship management
- Complex dependency validation  
- Issue relationship integrity checks
- Has-dependencies/has-dependents label references

**Update These Sections:**
- **Simplified Label System**: Only status, priority, phase, type labels
- **Individual Issue Validation**: Focus on single issue quality
- **Validation Commands**: Remove epic-related GitHub CLI commands
- **Handoff Templates**: Simplify to individual issue tracking

**Add These New Sections:**
- **Project Context**: Interactive GTM Blueprint application details
- **Production Environment**: Live application at category-blueprint.vercel.app
- **Current Automation**: Reference to all 7 automation scripts
- **Simplified Workflow**: No complex relationships, individual tracking only

### **Key Updates for Your GEMINI.md:**

```markdown
## Simplified Issue Validation (Updated)

### Labels to Validate
- status-todo, status-in-progress, status-complete
- priority-high, priority-medium, priority-low  
- Phase 1 through Phase 10
- enhancement (for features and enhancements)
- bug (for bug fixes)

### ❌ REMOVED Labels (No Longer Validate)
- epic, epic-item
- has-dependencies, has-dependents
- Complex relationship labels

### Validation Focus (Simplified)
1. **Issue Requirements Met**: Implementation fulfills issue acceptance criteria
2. **Status Accuracy**: GitHub Issue status matches implementation reality
3. **Code Quality**: Implementation follows best practices
4. **Individual Completeness**: Each issue stands alone and is properly resolved

### GitHub CLI Commands (Updated)
```bash
# Get issues for validation (simplified)
gh issue list --repo petergiordano/category-blueprint --state all

# Check status accuracy
gh issue list --repo petergiordano/category-blueprint --label status-in-progress
gh issue list --repo petergiordano/category-blueprint --label status-complete

# Validate specific issue
gh issue view 123 --repo petergiordano/category-blueprint
```

### Handoff Template (Simplified)
```markdown
**Timestamp:** [YYYY-MM-DDTHH:MM:SSZ]
**From:** Gemini CLI
**To:** User/Claude Code
**Status:** [VALIDATION_PASSED|DISCREPANCY_REPORT|TASK_COMPLETE]
**Branch:** [current git branch]
**GitHub Issues Analyzed:** [#123: FEAT-001, #124: ENH-002]
**Validation Results:**
- Issue Status Accuracy: ✅/❌ [Details]
- Implementation Completeness: ✅/❌ [Details]
- Code Quality: ✅/❌ [Details]
**Issue Status Updates Needed:**
- FEAT-001 (#123): [Current status] → [Should be status]
**Task Prompt for Claude:** [Specific actions based on analysis]
**Context Preservation:** [Critical states and progress]
```
```

---

## 🧪 Step 4: Test Your Understanding

### **Validation Tests**
After updating your configuration, test that you understand:

1. **Script Usage**: How to use the 7 automation scripts for issue management
2. **Label System**: The simplified label structure (no complex relationships)
3. **Validation Process**: How to validate individual issues without relationship checks
4. **GitHub CLI**: Commands for analyzing simplified issue tracking
5. **Handoff Protocol**: Updated format for coordination with Claude Code and User

### **Practice Validation**
Try to:
- List current GitHub issues in the repository
- Identify any status discrepancies between issues and implementation
- Generate a sample validation report using the simplified handoff template
- Confirm you understand the project context (Interactive GTM Blueprint)

---

## 🔄 Step 5: Update Confirmation

### **After Reading All Files and Updating Your Config**
Provide a summary of:

1. **What You Learned**: Key insights about the simplified system
2. **What You Updated**: Specific changes made to your `.gemini/GEMINI.md` file
3. **What You Removed**: Complex relationship management features no longer used
4. **What You Added**: New project-specific context and simplified validation approaches
5. **Test Results**: Confirmation that you can perform simplified issue validation

### **Ready State Confirmation**
Confirm you're ready to:
- Validate individual issues without complex relationship checking
- Use the simplified label system for status tracking
- Coordinate with Claude Code using the updated handoff protocol
- Focus on implementation quality and status accuracy
- Work with the Interactive GTM Blueprint project context

---

## 📋 Success Criteria

You'll know you're ready when you can:

✅ **Explain the simplified workflow** without mentioning complex relationships  
✅ **Use the 7 automation scripts** to understand how issues are managed  
✅ **Validate individual issues** for implementation completeness and status accuracy  
✅ **Generate proper handoff reports** using the simplified template  
✅ **Focus on quality assurance** without relationship complexity  
✅ **Understand the GTM Blueprint project** context and current production status

---

## 🚨 Critical Reminders

### **What Changed (User Feedback)**
The user specifically said the dependency system was "complicated and brittle" and requested to "eliminate any requirement for connecting github project issues to each other." The entire system has been simplified accordingly.

### **Your New Focus**
- ✅ **Individual Issue Quality**: Each issue stands alone
- ✅ **Status Accuracy**: Implementation matches GitHub Issue status
- ✅ **Code Quality**: Best practices and acceptance criteria met
- ❌ **No Relationship Management**: Complex dependencies eliminated

### **Repository Details**
- **Repository**: `petergiordano/category-blueprint`
- **Project Board**: https://github.com/users/petergiordano/projects/1
- **Production App**: https://category-blueprint.vercel.app/
- **Tech Stack**: HTML/CSS/JavaScript, Vercel serverless functions, Brave Search API

---

**Begin your learning journey now. Read all the files, update your configuration, and prepare for simplified, reliable issue validation in the Interactive GTM Blueprint project.**