# Implementation Prompt for Claude Code: Home Navigation Enhancement

## Project Context
Adding a home/restart navigation option to the Interactive GTM Blueprint application to allow users to return to the welcome screen and optionally re-run company setup.

## Database-Driven Workflow Requirements

### Before Starting:
```bash
# Create the enhancement issue
./scripts/create-enhancement-issue.sh "Add Home Navigation Button" "Allow users to return to home screen and re-run company setup" "Phase 6" "Medium"

# Note the issue ID (e.g., ENH-XXX)
# Update status to in-progress
./scripts/update-issue-status.sh "ENH-XXX" "status-in-progress"
```

## Objective
Add a home navigation button that allows users to return to the welcome screen and optionally re-run the company setup wizard.

## Implementation Instructions

### Step 1: Add Home Button to Progress Bar Component

**Commit message:** `feat(ENH-XXX): Add home navigation button to progress bar`

Update the ProgressStepper component to include a home button on the left side:

```javascript
const ProgressStepper = ({ currentPart, completedParts, onNavigate, appState, saveAppState }) => {
    // ... existing parts array ...

    const handleHomeClick = () => {
        // Save current state before navigating home
        if (saveAppState && appState) {
            saveAppState(appState);
        }
        
        // Navigate to home
        onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',  // Changed from 'center'
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
            {/* Home Button - Left Side */}
            <button
                onClick={handleHomeClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                title="Return to Home"
                aria-label="Return to Home Screen"
            >
                {/* Home Icon SVG */}
                <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    style={{ marginRight: '0.25rem' }}
                >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="hidden sm:inline">GTM Blueprint</span>
                <span className="sm:hidden">Home</span>
            </button>

            {/* Progress Steps - Center */}
            <nav role="navigation" aria-label="Blueprint progress">
                {/* ... existing progress steps code ... */}
            </nav>

            {/* Spacer for balance - Right Side */}
            <div style={{ width: '140px' }}></div>
        </div>
    );
};
```

### Step 2: Add Company Setup Reset Option to Home Screen

**Commit message:** `feat(ENH-XXX): Add company setup reset option to home screen`

In the main App component's home view, add a button to reset company setup:

```javascript
// In the home/welcome screen section where buttons are displayed:
{appState.currentView === 'home' && (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
            {/* Existing welcome content */}
            <h1 className="text-4xl font-bold text-center mb-8">Welcome to GTM Blueprint</h1>
            
            {/* Company Context Display */}
            {appState.companyContext?.isSetupComplete && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-3">Current Company Context</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Company:</span> {appState.companyContext.companyName}
                        </div>
                        <div>
                            <span className="font-medium">Product:</span> {appState.companyContext.productName}
                        </div>
                        <div>
                            <span className="font-medium">Industry:</span> {appState.companyContext.industry}
                        </div>
                        <div>
                            <span className="font-medium">Market:</span> {appState.companyContext.targetMarket}
                        </div>
                    </div>
                    
                    {/* Reset Company Setup Button */}
                    <button
                        onClick={() => {
                            if (window.confirm('This will reset your company setup and clear all form data. Are you sure?')) {
                                // Reset company context
                                setAppState(prev => ({
                                    ...prev,
                                    companyContext: {
                                        ...prev.companyContext,
                                        isSetupComplete: false
                                    }
                                }));
                                // This will trigger the CompanySetupModal to show again
                            }
                        }}
                        className="mt-4 text-sm text-gray-600 hover:text-blue-600 underline"
                    >
                        Change Company Setup
                    </button>
                </div>
            )}
            
            {/* Continue/Start Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {appState.navigationProgress.completedParts.length > 0 ? (
                    <>
                        <button
                            onClick={() => {
                                // Find the last incomplete part
                                const parts = ['segment', 'icp', 'positioning', 'category'];
                                const nextPart = parts.find(p => !appState.navigationProgress.completedParts.includes(p));
                                onNavigate(nextPart || 'segment');
                            }}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Continue Where You Left Off
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('This will clear all your progress and form data. Are you sure?')) {
                                    // Clear all progress
                                    localStorage.removeItem('klarityGTMBlueprintState');
                                    window.location.reload();
                                }
                            }}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Start Fresh
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onNavigate('segment')}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Start Blueprint Process
                    </button>
                )}
            </div>
        </div>
    </div>
)}
```

### Step 3: Add Quick Actions Menu (Optional Enhancement)

**Commit message:** `feat(ENH-XXX): Add quick actions menu for advanced navigation`

Add a settings/menu button next to the home button for quick actions:

```javascript
// Add this after the home button in ProgressStepper:
const [showQuickMenu, setShowQuickMenu] = useState(false);

// After the home button:
<div style={{ position: 'relative' }}>
    <button
        onClick={() => setShowQuickMenu(!showQuickMenu)}
        style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            marginLeft: '0.5rem'
        }}
        title="Quick Actions"
    >
        ⚙️
    </button>
    
    {showQuickMenu && (
        <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.5rem',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            minWidth: '200px'
        }}>
            <button
                onClick={() => {
                    handleHomeClick();
                    setShowQuickMenu(false);
                }}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                }}
            >
                🏠 Return to Home
            </button>
            <button
                onClick={() => {
                    if (window.confirm('Reset company setup?')) {
                        setAppState(prev => ({
                            ...prev,
                            companyContext: { ...prev.companyContext, isSetupComplete: false }
                        }));
                        onNavigate('home');
                    }
                    setShowQuickMenu(false);
                }}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                }}
            >
                🔄 Reset Company Setup
            </button>
            <button
                onClick={() => {
                    const state = JSON.stringify(appState, null, 2);
                    const blob = new Blob([state], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'gtm-blueprint-backup.json';
                    a.click();
                    setShowQuickMenu(false);
                }}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                }}
            >
                💾 Export Progress
            </button>
        </div>
    )}
</div>
```

## Testing Checklist

1. **Home Navigation**
   - [ ] Home button visible on all pages with progress bar
   - [ ] Clicking home saves current state
   - [ ] Returns to welcome screen smoothly

2. **Company Setup Reset**
   - [ ] "Change Company Setup" link visible on home when setup is complete
   - [ ] Confirmation dialog appears before reset
   - [ ] Company setup modal reopens after reset

3. **Progress Preservation**
   - [ ] Form data saved when navigating home
   - [ ] Can continue where left off
   - [ ] "Start Fresh" option clears everything

4. **Visual Design**
   - [ ] Home button styled consistently
   - [ ] Responsive on mobile
   - [ ] Clear hover states

5. **Quick Actions Menu** (if implemented)
   - [ ] Menu opens/closes properly
   - [ ] All actions work correctly
   - [ ] Closes when clicking outside

## Final Steps

```bash
# Complete the implementation
./scripts/update-issue-status.sh "ENH-XXX" "status-complete"

# Commit final changes
git add .
git commit -m "feat(ENH-XXX): Complete home navigation enhancement

- Added home button to progress bar
- Implemented company setup reset option
- Added continue/start fresh options on home screen
- Ensured state preservation when navigating

Closes #XXX"
```

## Success Criteria

- Users can easily return to home from any page
- Company setup can be changed without losing all progress
- Clear options to continue or start fresh
- Consistent with existing navigation patterns
