# Handoff Protocol Test Checklist

## Purpose
This file tests whether Claude Code correctly implements the handoff protocol from CLAUDE.md.

## Test Scenarios

### ✅ Test 1: Session Start
- [ ] Claude reads .aicontext/context.md on first interaction
- [ ] Claude acknowledges last handoff entry
- [ ] Claude updates todos with handoff items

**Expected Handoff Entry:**
```
STATUS: SESSION_START
Summary: Read context, acknowledged previous work on [feature]
```

### ✅ Test 2: Feature Completion  
- [ ] Claude completes a numbered feature (F-1, F-2, etc.)
- [ ] Claude updates handoff BEFORE git commit
- [ ] Handoff includes technical details

**Expected Handoff Entry:**
```
STATUS: FEATURE_COMPLETE
Summary: Implemented F-[X] with [details]
Technical Details: [files, functions, dependencies]
```

### ✅ Test 3: VS Code Restart
**User Action:** Close and reopen VS Code
- [ ] Claude detects workspace reopened
- [ ] Claude immediately checks .aicontext/context.md
- [ ] Claude writes SESSION_RESUMED entry

**Expected Handoff Entry:**
```
STATUS: SESSION_RESUMED
Summary: VS Code restarted, continuing work on [task]
Context Preservation: [critical state to remember]
```

### ✅ Test 4: Claude Code Cancel/Restart
**User Action:** Cancel Claude Code and restart within VS Code
- [ ] Claude recognizes potential context loss
- [ ] Claude reads context.md first
- [ ] Claude writes CLAUDE_RESTART entry

**Expected Handoff Entry:**
```
STATUS: CLAUDE_RESTART  
Summary: Claude Code restarted, retrieved context from handoff log
Work Pending: [what was in progress]
```

### ✅ Test 5: Connection Loss
**User Action:** Simulate connection loss (network issue, VS Code extension problem)
- [ ] Claude detects file operation failures
- [ ] Claude writes CONNECTION_LOST entry
- [ ] Claude documents last known state

**Expected Handoff Entry:**
```
STATUS: CONNECTION_LOST
Summary: Lost connection to VS Code
Last Known State: [what was being worked on]
Recovery Needed: [what to check when reconnected]
```

### ✅ Test 6: Context Compaction Warning
**User Action:** Continue until context warning appears
- [ ] Claude sees context warning
- [ ] Claude IMMEDIATELY writes comprehensive handoff
- [ ] Entry includes CONTEXT_RESET marker

**Expected Handoff Entry:**
```
STATUS: CONTEXT_WARNING
Summary: Context approaching limit, documenting full state
Context Preservation: [everything important]
CONTEXT_RESET: [timestamp]
Work Completed: [comprehensive list]
Work Pending: [comprehensive list]
```

### ✅ Test 7: Git Push Attempt
- [ ] Claude attempts git push
- [ ] Handoff updated BEFORE push
- [ ] If push fails, PUSH_PENDING added

**Expected Handoff Entry:**
```
STATUS: PRE_PUSH
Summary: About to push [commits]
Technical Details: [what's being pushed]
[If failed: PUSH_PENDING: reason]
```

### ✅ Test 8: Todo Completion
- [ ] Claude marks any todo as "completed"  
- [ ] Claude checks if handoff todo is pending
- [ ] Claude updates handoff if needed

**Expected Handoff Entry:**
```
STATUS: TASK_COMPLETE
Summary: Completed [task name]
Next: [what's next in todo list]
```

### ✅ Test 9: Validation Discrepancy Reporting
**User Action:** Have Gemini CLI find issues during validation
- [ ] Gemini CLI performs validation analysis
- [ ] Issues are found (simulated or real)
- [ ] Gemini CLI uses DISCREPANCY_REPORT status
- [ ] Report includes structured issue format

**Expected Handoff Entry:**
```
STATUS: DISCREPANCY_REPORT
Validation Summary:
- ✅ Passed: [working aspects]
- ❌ Issues Found: [count]

Discrepancies Found:
1. Issue Type: [specific type]
   Specifics: [file:line details]
   Impact: [functional impact]
   Recommended Action: [fix steps]
```

### ✅ Test 10: Validation Feedback Acknowledgment
**User Action:** Claude Code receives discrepancy report
- [ ] Claude Code reads DISCREPANCY_REPORT
- [ ] Claude Code writes VALIDATION_ACKNOWLEDGED immediately
- [ ] Claude Code addresses each listed issue
- [ ] Claude Code writes READY_FOR_REVALIDATION when complete

**Expected Handoff Entry:**
```
STATUS: VALIDATION_ACKNOWLEDGED
Discrepancies Received: [count and summary]
Action Plan:
- Issue 1: [fix description]
- Issue 2: [fix description]
Ready for Re-validation: [after fixes complete]
```

### ✅ Test 11: Validation Iteration Cycle
**User Action:** Complete validation feedback loop
- [ ] Gemini CLI reports issues → DISCREPANCY_REPORT
- [ ] Claude Code acknowledges → VALIDATION_ACKNOWLEDGED
- [ ] Claude Code fixes issues → READY_FOR_REVALIDATION  
- [ ] Gemini CLI re-validates → VALIDATION_PASSED or new DISCREPANCY_REPORT
- [ ] Cycle continues until validation passes

**Expected Flow:**
```
TASK_COMPLETE → DISCREPANCY_REPORT → VALIDATION_ACKNOWLEDGED → 
READY_FOR_REVALIDATION → [VALIDATION_PASSED or repeat cycle]
```

## Validation Script

Run these commands to check compliance:

```bash
# Check if context.md was recently modified
git log -1 --name-only | grep -q "context.md" && echo "✅ Handoff updated recently" || echo "❌ No recent handoff update"

# Check for handoff entry with current date
grep -q "$(date +%Y-%m-%d)" .aicontext/context.md && echo "✅ Today's handoff exists" || echo "❌ No handoff entry today"

# Check if handoff todo exists
grep -q "handoff log" .claude/last-todos.json 2>/dev/null && echo "✅ Handoff in todos" || echo "⚠️ No handoff todo found"

# Count handoff entries
echo "Total handoff entries: $(grep -c "^**Timestamp:**" .aicontext/context.md)"

# Validation feedback system checks
grep -q "DISCREPANCY_REPORT" .aicontext/context.md && echo "✅ Discrepancy reporting used" || echo "⚠️ No discrepancy reports found"

grep -q "VALIDATION_ACKNOWLEDGED" .aicontext/context.md && echo "✅ Validation feedback acknowledged" || echo "⚠️ No validation acknowledgments found"

grep -q "READY_FOR_REVALIDATION" .aicontext/context.md && echo "✅ Revalidation cycle active" || echo "⚠️ No revalidation cycles found"
```

## Test Results Log

### Test Run: [DATE]
- Tester: [YOUR NAME]
- Claude Code Version: [VERSION]
- Results:
  - [ ] Test 1: Pass/Fail
  - [ ] Test 2: Pass/Fail
  - [ ] Test 3: Pass/Fail
  - [ ] Test 4: Pass/Fail
  - [ ] Test 5: Pass/Fail
  - [ ] Test 6: Pass/Fail
  - [ ] Test 7: Pass/Fail
  - [ ] Test 8: Pass/Fail
  - [ ] Test 9: Pass/Fail (Validation Discrepancy Reporting)
  - [ ] Test 10: Pass/Fail (Validation Feedback Acknowledgment)
  - [ ] Test 11: Pass/Fail (Validation Iteration Cycle)

### Notes:
[Document any issues or observations]

---

## Quick Test Triggers

**To test session recovery:**
1. Have Claude do some work
2. Close VS Code / Cancel Claude Code
3. Reopen and say: "Continue where we left off"
4. Check if Claude reads context.md and writes appropriate handoff

**To test feature completion:**
1. Ask Claude to implement a small feature
2. Watch for handoff update before git commit
3. Check handoff contains technical details

**To test context warning:**
1. Have a long conversation
2. Watch for context warning
3. Verify immediate comprehensive handoff entry