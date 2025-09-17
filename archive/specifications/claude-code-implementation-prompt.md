# Implementation Prompt for Claude Code: Navigation Redesign

## Project Context
You are implementing a navigation redesign for the Interactive GTM Blueprint application. The app is a single-page React application built with Tailwind CSS that guides users through a 4-part GTM (Go-To-Market) strategy process.

**Current File:** `index.html` (in project root)

## Database-Driven Workflow Requirements

**IMPORTANT**: This project uses a database-driven issue tracking system where GitHub Issues are the single source of truth. You MUST follow these protocols:

### Step 0: Create GitHub Issue FIRST
Before any code changes:

```bash
# Create the feature issue for this navigation redesign
./scripts/create-feature-issue.sh "Interactive Navigation Redesign" "Transform progress bar into clickable navigation system" "Phase 6" "High"

# Note the generated issue ID (e.g., FEAT-023)
# You'll use this ID in all commits and status updates
```

### Step 0.5: Update Issue Status to In-Progress
```bash
# Update the issue status (replace FEAT-XXX with actual ID)
./scripts/update-issue-status.sh "FEAT-XXX" "status-in-progress"
```

## Objective
Transform the existing non-interactive progress bar into the primary navigation system, removing redundant navigation elements and creating a cleaner, more intuitive user experience.

## Key Requirements

### 1. Make the Progress Bar Interactive
- Users can click on completed or current steps to navigate
- Cannot click on future/locked steps
- Visual feedback on hover and click
- Auto-save data before navigation

### 2. Remove Redundant Elements
- Remove all "Back to [Previous Step]" links
- Remove the SubSectionNav component (it's already disabled)
- Keep the green "Continue" buttons for forward progression

### 3. Maintain Data Integrity
- Auto-save current form data before navigation
- Preserve all user inputs when navigating between sections
- Update navigation progress tracking

## Implementation Instructions with Issue Tracking

### Step 1: Replace the ProgressStepper Component

**Before starting:** Create a commit message referencing the issue:
```bash
git commit -m "feat(FEAT-XXX): Replace ProgressStepper with interactive navigation component"
```

Replace the existing `ProgressStepper` component with this enhanced version:

```javascript
// Enhanced Interactive Progress Stepper Component
const ProgressStepper = ({ currentPart, completedParts, onNavigate, appState, saveAppState }) => {
    const parts = [
        { id: 'segment', name: 'Foundation', number: 1, fullName: 'Segment Foundation' },
        { id: 'icp', name: 'ICP Definition', number: 2, fullName: 'ICP Definition' },
        { id: 'positioning', name: 'Positioning', number: 3, fullName: 'Positioning' },
        { id: 'category', name: 'Category Design', number: 4, fullName: 'Category Design' }
    ];

    const isNavigable = (partId) => {
        // Can navigate to completed parts or the current part
        return completedParts.includes(partId) || partId === currentPart;
    };

    const getStepStatus = (partId) => {
        if (partId === currentPart) return 'current';
        if (completedParts.includes(partId)) return 'completed';
        return 'upcoming';
    };

    const handleStepClick = (partId) => {
        if (!isNavigable(partId)) return;
        
        // Save current state before navigation
        if (saveAppState && appState) {
            saveAppState(appState);
        }
        
        // Navigate to the selected part
        onNavigate(partId);
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStepStyles = (status, isHoverable) => {
        const baseStyles = {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease',
            cursor: isHoverable ? 'pointer' : 'not-allowed',
            userSelect: 'none',
            position: 'relative'
        };

        const statusStyles = {
            completed: {
                backgroundColor: '#10b981',
                color: 'white',
                opacity: 1
            },
            current: {
                backgroundColor: '#3b82f6',
                color: 'white',
                opacity: 1,
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
            },
            upcoming: {
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                opacity: 0.6
            }
        };

        return { ...baseStyles, ...statusStyles[status] };
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
            <nav role="navigation" aria-label="Blueprint progress">
                <ol role="list" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                    {parts.map((part, index) => {
                        const status = getStepStatus(part.id);
                        const isHoverable = isNavigable(part.id);
                        
                        return (
                            <React.Fragment key={part.id}>
                                <li role="listitem">
                                    <button
                                        onClick={() => handleStepClick(part.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleStepClick(part.id);
                                            }
                                        }}
                                        disabled={!isHoverable}
                                        aria-label={`Part ${part.number}: ${part.fullName} - ${status}`}
                                        aria-current={part.id === currentPart ? 'step' : undefined}
                                        style={getStepStyles(status, isHoverable)}
                                        onMouseEnter={(e) => {
                                            if (isHoverable) {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.opacity = '0.9';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                        title={
                                            isHoverable 
                                                ? `Navigate to Part ${part.number}: ${part.fullName}`
                                                : `Part ${part.number}: ${part.fullName} (Not yet available)`
                                        }
                                    >
                                        {status === 'completed' ? (
                                            <span style={{ fontSize: '1.1rem' }}>✓</span>
                                        ) : (
                                            <span style={{ 
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                minWidth: '1.5rem',
                                                textAlign: 'center'
                                            }}>{part.number}</span>
                                        )}
                                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                            <span className="hidden sm:inline">Part {part.number}: </span>
                                            {part.name}
                                        </span>
                                    </button>
                                </li>
                                {index < parts.length - 1 && (
                                    <li role="presentation" aria-hidden="true">
                                        <div style={{ 
                                            width: '2rem',
                                            height: '2px',
                                            backgroundColor: completedParts.includes(parts[index + 1].id) || parts[index + 1].id === currentPart ? '#10b981' : '#d1d5db',
                                            transition: 'background-color 0.3s ease'
                                        }} />
                                    </li>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
};
```

**After implementing, commit with:**
```bash
git add index.html
git commit -m "feat(FEAT-XXX): Implement interactive ProgressStepper component with navigation"
```

### Step 2: Update Component Integration

**Commit message for this step:**
```bash
git commit -m "feat(FEAT-XXX): Integrate enhanced ProgressStepper with app state management"
```

In the main App component, update the ProgressStepper usage:

```javascript
// In the render section where ProgressStepper is used:
{appState.currentView !== 'home' && appState.currentView !== 'setup' && (
    <ProgressStepper 
        currentPart={appState.currentView}
        completedParts={appState.navigationProgress.completedParts}
        onNavigate={(part) => {
            setAppState(prev => ({ ...prev, currentView: part }));
        }}
        appState={appState}
        saveAppState={saveAppState}
    />
)}
```

### Step 3: Remove Redundant Navigation Elements

**Commit message for this step:**
```bash
git commit -m "refactor(FEAT-XXX): Remove redundant back navigation elements"
```

Find and remove these patterns throughout the codebase:

1. **Remove "Back to" buttons in each component:**
```javascript
// DELETE lines like this:
<button onClick={() => onNavigate('home')} className="text-gray-600 hover:scale-gold-text">
    ← Back to ICP Definition
</button>

// And this:
<button onClick={() => onNavigate('home')} className="text-gray-600 hover:scale-gold-text">
    ← Back to Home
</button>
```

2. **Remove or simplify the header section in each tool component:**
```javascript
// REPLACE complex header sections with simplified versions
// OLD:
<header className="sticky top-16 bg-white border-b border-gray-200 z-40 py-3">
    <div className="flex justify-between items-center py-3">
        <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('home')} className="text-gray-600 hover:scale-gold-text">← Back to Home</button>
            <h1 className="text-xl sm:text-2xl font-bold scale-green-text">Part 1: Segment Foundation</h1>
        </div>
        {/* ... */}
    </div>
</header>

// NEW:
<header className="bg-white border-b border-gray-200 py-4">
    <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold scale-green-text">Part 1: Segment Foundation</h1>
        <PrimaryActions 
            currentPart="segment"
            onReset={handleReset}
            onExport={handleExport}
            onContinue={() => { onNavigate('icp'); window.scrollTo(0, 0); }}
        />
    </div>
</header>
```

### Step 4: Update Navigation Progress Tracking

**Commit message for this step:**
```bash
git commit -m "feat(FEAT-XXX): Add progress tracking for navigation completion"
```

Ensure the navigation progress is properly tracked when users complete sections:

```javascript
// Add this helper function to track completion
const markPartAsCompleted = (partId) => {
    setAppState(prev => {
        const updatedCompletedParts = prev.navigationProgress.completedParts.includes(partId)
            ? prev.navigationProgress.completedParts
            : [...prev.navigationProgress.completedParts, partId];
        
        return {
            ...prev,
            navigationProgress: {
                ...prev.navigationProgress,
                completedParts: updatedCompletedParts,
                partCompletionData: {
                    ...prev.navigationProgress.partCompletionData,
                    [partId]: {
                        completed: true,
                        completedAt: new Date().toISOString()
                    }
                }
            }
        };
    });
};

// Call this when user clicks "Continue" button at the end of each section
// Example in SegmentFoundationTool:
onContinue: () => {
    markPartAsCompleted('segment');
    onNavigate('icp');
    window.scrollTo(0, 0);
}
```

### Step 5: Mobile Responsiveness

**Commit message for this step:**
```bash
git commit -m "feat(FEAT-XXX): Add mobile responsive design to navigation"
```

Add these responsive styles to the ProgressStepper component:

```javascript
// Add media query handling within the component
const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

// Adjust text display based on screen size
<span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
    {isMobile ? part.number : (
        <>
            <span className="hidden sm:inline">Part {part.number}: </span>
            {part.name}
        </>
    )}
</span>
```

### Step 6: Testing and Validation

**Create a testing checklist issue:**
```bash
./scripts/create-enhancement-issue.sh "Navigation Testing Checklist" "Validate all navigation functionality" "Phase 6" "High"
```

## Testing Checklist

After implementation, verify:

1. **Navigation Flow**
   - [ ] Can click on completed steps to navigate back
   - [ ] Can click on current step (refreshes view)
   - [ ] Cannot click on future/locked steps
   - [ ] Visual feedback on hover for clickable steps

2. **Data Persistence**
   - [ ] Form data is saved when navigating away
   - [ ] Form data is restored when returning to a section
   - [ ] Progress tracking updates correctly

3. **Visual Design**
   - [ ] Completed steps show green with checkmark
   - [ ] Current step shows blue with number
   - [ ] Upcoming steps show gray and are not clickable
   - [ ] Smooth transitions on hover

4. **Mobile Responsiveness**
   - [ ] Progress bar is visible and usable on mobile
   - [ ] Touch targets are at least 44x44 pixels
   - [ ] Text adapts to screen size appropriately

5. **Accessibility**
   - [ ] Keyboard navigation works (Tab, Enter, Space)
   - [ ] ARIA labels are present and descriptive
   - [ ] Focus indicators are visible

## Final Steps: Complete the Issue

After all testing is complete:

```bash
# Update the issue to complete status
./scripts/update-issue-status.sh "FEAT-XXX" "status-complete"

# Final commit with all changes
git add .
git commit -m "feat(FEAT-XXX): Complete navigation redesign implementation

- Implemented interactive progress bar navigation
- Removed redundant navigation elements
- Added mobile responsive design
- Ensured data persistence across navigation
- Added accessibility features

Closes #XXX"

# Push to GitHub
git push origin main
```

## Implementation Order Summary

1. **Create GitHub Issue** (FEAT-XXX)
2. **Update issue to in-progress**
3. **Replace ProgressStepper component** → Commit
4. **Test navigation in isolation** → Verify
5. **Remove redundant navigation elements** → Commit
6. **Update progress tracking logic** → Commit
7. **Add mobile responsiveness** → Commit
8. **Run full test suite** → Document results
9. **Update issue to complete**
10. **Push all changes with proper commit messages**

## Important Notes

- **Issue Tracking is Mandatory**: Every code change must reference the GitHub Issue
- **Preserve existing functionality**: The green "Continue" buttons should still work as before
- **Auto-save is critical**: Always save state before navigation to prevent data loss
- **Keep it simple**: Don't over-engineer - the goal is cleaner, simpler navigation
- **Test incrementally**: Test each change before moving to the next
- **Use VS Code Tasks**: You can also use Command Palette → "Tasks: Run Task" for issue management

## Success Criteria

The implementation is successful when:
1. Users can navigate freely between completed sections
2. No duplicate navigation elements remain
3. Data persists correctly across navigation
4. The interface is cleaner and less cluttered
5. Mobile users can navigate effectively
6. GitHub Issue FEAT-XXX is marked as complete
7. All commits reference the issue ID

## Emergency Recovery

If something goes wrong:
1. Check issue status: `gh issue view FEAT-XXX`
2. Review commits: `git log --oneline --grep="FEAT-XXX"`
3. Rollback if needed: `git revert HEAD~n`
4. Update issue with blockers: `gh issue comment FEAT-XXX --body "Blocked by: [description]"`

---

Please implement these changes step by step, testing after each major change. Always reference issue FEAT-XXX in your commits and update the issue status as you progress.