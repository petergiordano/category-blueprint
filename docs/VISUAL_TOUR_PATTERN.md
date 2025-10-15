# Visual Tour Design Pattern

A comprehensive, reusable pattern for implementing interactive product tours with progressive disclosure, visual highlighting, and multi-step journeys.

---

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Data Structure](#data-structure)
4. [State Management](#state-management)
5. [Key Features](#key-features)
6. [Implementation Guide](#implementation-guide)
7. [Customization Points](#customization-points)

---

## Overview

This pattern creates an engaging onboarding/tour experience with:
- **Two-level navigation**: Main steps (parts) and sub-steps within each part
- **Visual highlighting**: Interactive diagrams/visualizations that highlight current focus areas
- **Progress tracking**: Visual progress bar and step indicators
- **Flexible content**: Support for both static content and interactive step-through experiences
- **Keyboard navigation**: Arrow keys for navigation, Escape to close
- **Persistence**: Optional "don't show again" with localStorage

---

## Component Architecture

### Core Components

```
TourComponent (Main Container)
├── TourHeader
│   ├── Title & Subtitle
│   ├── Close Button
│   └── ProgressBar
├── TourContent
│   ├── VisualizationPanel (Left/Main)
│   │   ├── InteractiveDiagram (optional)
│   │   ├── VisibilityToggle
│   │   └── SubStepIndicators
│   └── ExplanationPanel (Right/Sidebar)
│       ├── StepHeader (icon + title)
│       ├── ContentCard (description)
│       ├── NavigationInfo
│       └── MainStepIndicators
└── TourFooter
    ├── StepCounter
    └── NavigationButtons (Back/Continue)
```

### Visualization Components (Optional)

```
InteractiveDiagram
├── SVG/Visual Content
├── Highlight Logic
└── Transition Effects
```

---

## Data Structure

### Tour Steps Configuration

```javascript
const tourSteps = [
    {
        // Unique identifier
        id: "step-1",

        // Display information
        title: "Step Title",
        icon: "🏗️", // Emoji or icon identifier

        // Content type
        hasInteractive: true, // or false for static content

        // Static content (for simple steps)
        content: "Static description text for simple steps",

        // Interactive substeps (for complex steps)
        subSteps: [
            {
                // Highlight identifier for visual component
                highlight: "element-id-1", // or null for overview

                // Step information
                title: "SubStep Title",
                description: "Detailed explanation of this substep"
            },
            // ... more substeps
        ]
    },
    // ... more main steps
];
```

### State Structure

```javascript
{
    // Current position in tour
    currentStep: 1,        // Main step (1-indexed)
    subStep: 0,            // Sub-step (0-indexed)

    // UI state
    isOpen: true,          // Tour visibility
    visualMode: true,      // Show/hide visualizations

    // User preferences
    dontShowAgain: false   // Persistence flag
}
```

---

## State Management

### Navigation Logic

```javascript
// Progress through substeps first, then main steps
handleNext() {
    const currentStepData = tourSteps[currentStep - 1];

    if (currentStepData.hasInteractive && subStep < subSteps.length - 1) {
        // Advance substep
        setSubStep(subStep + 1);
    } else if (currentStep < tourSteps.length) {
        // Advance main step, reset substep
        setCurrentStep(currentStep + 1);
        setSubStep(0);
    }
}

// Reverse navigation with proper state management
handleBack() {
    const currentStepData = tourSteps[currentStep - 1];

    if (currentStepData.hasInteractive && subStep > 0) {
        // Go back one substep
        setSubStep(subStep - 1);
    } else if (currentStep > 1) {
        // Go back to previous main step
        setCurrentStep(currentStep - 1);

        // Set to last substep of previous step
        const prevStepData = tourSteps[currentStep - 2];
        setSubStep(prevStepData.hasInteractive ? prevStepData.subSteps.length - 1 : 0);
    }
}
```

### Progress Calculation

```javascript
calculateProgress() {
    let totalSteps = 0;
    let completedSteps = 0;

    tourSteps.forEach((step, index) => {
        if (step.hasInteractive) {
            // Count all substeps
            totalSteps += step.subSteps.length;

            if (index + 1 < currentStep) {
                // Previous step: all substeps complete
                completedSteps += step.subSteps.length;
            } else if (index + 1 === currentStep) {
                // Current step: count completed substeps
                completedSteps += subStep;
            }
        } else {
            // Simple step counts as one
            totalSteps += 1;
            if (index + 1 < currentStep) {
                completedSteps += 1;
            }
        }
    });

    return Math.round((completedSteps / totalSteps) * 100);
}
```

---

## Key Features

### 1. Progressive Disclosure

**Pattern**: Show information incrementally, building context step-by-step

```javascript
// Interactive steps have substeps that build understanding
subSteps: [
    { highlight: null, title: "Overview", description: "See the big picture" },
    { highlight: "part-1", title: "First Element", description: "Focus on first component" },
    { highlight: "part-2", title: "Second Element", description: "Build on previous" },
    // ...
]
```

### 2. Visual Highlighting

**Pattern**: Dim non-relevant elements, emphasize current focus

```javascript
// In visualization component
const getElementOpacity = (elementId) => {
    if (!currentHighlight) return 1; // All visible when no highlight
    return currentHighlight === elementId ? 1 : 0.3; // Dim non-highlighted
};

const getElementFilter = (elementId) => {
    return currentHighlight === elementId
        ? 'drop-shadow(0 0 8px currentColor)' // Glow effect
        : '';
};
```

### 3. Multi-Level Navigation

**Pattern**: Two indicator systems for different navigation levels

```javascript
// Main step indicators (bottom of sidebar)
<div className="main-step-indicators">
    {tourSteps.map((step, index) => (
        <button
            onClick={() => jumpToStep(index)}
            className={index === currentStep - 1 ? 'active' : 'inactive'}
        />
    ))}
</div>

// Substep indicators (below visualization)
{currentStepData.hasInteractive && (
    <div className="substep-indicators">
        {currentStepData.subSteps.map((_, index) => (
            <div className={index <= subStep ? 'completed' : 'pending'} />
        ))}
    </div>
)}
```

### 4. Keyboard Navigation

**Pattern**: Standard keyboard shortcuts for accessibility

```javascript
useEffect(() => {
    const handleKeyPress = (e) => {
        switch(e.key) {
            case 'Escape':
                handleClose();
                break;
            case 'ArrowLeft':
                handleBack();
                break;
            case 'ArrowRight':
                handleNext();
                break;
        }
    };

    if (isOpen) {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }
}, [isOpen, currentStep, subStep]);
```

### 5. Persistence

**Pattern**: Remember user preferences across sessions

```javascript
// On close
const handleClose = () => {
    if (dontShowAgain) {
        localStorage.setItem('hasCompletedTour', 'true');
    }
    onClose();
};

// On app load
const shouldShowTour = () => {
    return !localStorage.getItem('hasCompletedTour');
};
```

---

## Implementation Guide

### Step 1: Define Your Tour Structure

```javascript
// Create your tour steps configuration
const tourConfig = [
    {
        id: "introduction",
        title: "Welcome",
        icon: "👋",
        hasInteractive: false,
        content: "Welcome to the application. Let's explore the key features."
    },
    {
        id: "feature-walkthrough",
        title: "Core Feature",
        icon: "⚡",
        hasInteractive: true,
        subSteps: [
            {
                highlight: null,
                title: "Overview",
                description: "This feature helps you accomplish X"
            },
            {
                highlight: "element-1",
                title: "First Component",
                description: "This is how you use component 1"
            },
            {
                highlight: "element-2",
                title: "Second Component",
                description: "This builds on the first component"
            }
        ]
    }
];
```

### Step 2: Create Visualization Components

```javascript
const FeatureDiagram = ({ highlightedElement }) => {
    const getOpacity = (id) => highlightedElement === id || !highlightedElement ? 1 : 0.3;

    return (
        <svg viewBox="0 0 800 600">
            {/* Your visual elements */}
            <g style={{
                opacity: getOpacity('element-1'),
                transition: 'all 0.3s ease'
            }}>
                {/* Element 1 content */}
            </g>

            <g style={{
                opacity: getOpacity('element-2'),
                transition: 'all 0.3s ease'
            }}>
                {/* Element 2 content */}
            </g>
        </svg>
    );
};
```

### Step 3: Implement Main Tour Component

```javascript
const Tour = ({ isOpen, onClose, startStep = 1 }) => {
    const [currentStep, setCurrentStep] = useState(startStep);
    const [subStep, setSubStep] = useState(0);
    const [visualMode, setVisualMode] = useState(true);

    // ... navigation handlers (see State Management section)

    const currentStepData = tourConfig[currentStep - 1];
    const currentSubStep = currentStepData.hasInteractive
        ? currentStepData.subSteps[subStep]
        : null;

    return (
        <div className="tour-overlay">
            <div className="tour-container">
                <TourHeader
                    progress={calculateProgress()}
                    onClose={handleClose}
                />

                <div className="tour-body">
                    <VisualizationPanel
                        stepData={currentStepData}
                        highlightElement={currentSubStep?.highlight}
                        visualMode={visualMode}
                        onToggleVisual={() => setVisualMode(!visualMode)}
                    />

                    <ExplanationPanel
                        stepData={currentStepData}
                        subStepData={currentSubStep}
                        currentStep={currentStep}
                        totalSteps={tourConfig.length}
                        subStep={subStep}
                    />
                </div>

                <TourFooter
                    currentStep={currentStep}
                    subStep={subStep}
                    stepData={currentStepData}
                    onBack={handleBack}
                    onNext={handleNext}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
};
```

### Step 4: Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (Fixed Height ~120px)                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Title & Subtitle                            [Close] │ │
│ │ Progress: ████████░░░░░░░░ 60%                    │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ BODY (Flexible Height)                                  │
│ ┌────────────────────┬──────────────────────────────┐   │
│ │ VISUALIZATION      │ EXPLANATION PANEL            │   │
│ │ (60-70% width)     │ (30-40% width)               │   │
│ │                    │                              │   │
│ │  [Toggle Visual]   │  Icon + Title                │   │
│ │                    │  "Part X of Y"               │   │
│ │  ┌──────────────┐  │                              │   │
│ │  │              │  │  ┌────────────────────────┐  │   │
│ │  │  Interactive │  │  │ Current Step Info      │  │   │
│ │  │   Diagram    │  │  │ Title & Description    │  │   │
│ │  │              │  │  └────────────────────────┘  │   │
│ │  └──────────────┘  │                              │   │
│ │                    │  Navigation Tips             │   │
│ │  ● ● ○ ○ ○ ○       │                              │   │
│ │  (substeps)        │  ● ○ ○ ○  (main steps)       │   │
│ └────────────────────┴──────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ FOOTER (Fixed Height ~60px)                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Part 2 • Step 3 of 6          [← Back] [Continue →]│ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Customization Points

### Visual Styling

You can customize these elements to match your brand:

1. **Header Gradient/Background**
   - Default: Gradient from brand-primary to brand-secondary
   - Apply to: `.tour-header`

2. **Progress Bar**
   - Default: White bar on translucent background
   - Apply to: `.progress-bar-fill`

3. **Button Styles**
   - Continue button: Primary action (gradient recommended)
   - Back button: Secondary action (outline/border)
   - Close button: Subtle, icon-only

4. **Step Indicators**
   - Active: Primary color, slightly larger
   - Inactive: Neutral gray
   - Completed (substeps): Primary color
   - Pending (substeps): Light gray

5. **Panel Backgrounds**
   - Visualization panel: White/transparent
   - Explanation panel: Light neutral (e.g., gray-50)
   - Content cards: White with colored left border

### Behavioral Customization

```javascript
// Optional features to enable/disable
const tourOptions = {
    // Allow keyboard navigation
    keyboardNav: true,

    // Show "don't show again" option
    allowDismissal: true,

    // Allow clicking dots to jump between steps
    allowStepJumping: true,

    // Toggle visibility of visualizations
    allowVisualToggle: true,

    // Auto-advance after timer
    autoAdvance: false,
    autoAdvanceDelay: 5000, // ms

    // Start from specific step
    defaultStartStep: 1,

    // Close on overlay click
    closeOnOverlayClick: false
};
```

### Content Variations

```javascript
// Mix of simple and complex steps
const mixedTourSteps = [
    {
        // Simple introduction
        hasInteractive: false,
        title: "Welcome",
        content: "Static content here"
    },
    {
        // Complex interactive walkthrough
        hasInteractive: true,
        title: "Feature Deep Dive",
        subSteps: [
            // 6-8 substeps recommended max
        ]
    },
    {
        // Another simple step
        hasInteractive: false,
        title: "Next Steps",
        content: "Call to action"
    }
];
```

---

## Best Practices

### Content

1. **Keep substeps focused**: Each substep should explain one concept
2. **Build progressively**: Each step should build on the previous
3. **Use clear language**: Avoid jargon, explain terms
4. **Limit substep count**: 4-8 substeps per main step is ideal
5. **Start with overview**: First substep should show the whole picture

### Interaction

1. **Provide multiple navigation methods**: Buttons, keyboard, dots
2. **Show progress clearly**: Users should always know where they are
3. **Make close easy**: Always accessible, no confirmation needed (except on last step)
4. **Smooth transitions**: 300ms is ideal for most animations
5. **Responsive design**: Test on mobile, tablet, desktop

### Accessibility

1. **Keyboard navigation**: Arrow keys, Escape, Enter
2. **Focus management**: Trap focus within tour when open
3. **Screen reader support**: Use ARIA labels and roles
4. **Color contrast**: Ensure text is readable in all states
5. **Motion preferences**: Respect prefers-reduced-motion

---

## Integration Example

```javascript
// In your main app component
import Tour from './components/Tour';

function App() {
    const [showTour, setShowTour] = useState(() => {
        return !localStorage.getItem('hasCompletedTour');
    });

    return (
        <>
            {/* Your app content */}
            <MainApp />

            {/* Tour overlay */}
            <Tour
                isOpen={showTour}
                onClose={() => setShowTour(false)}
                startStep={1}
            />

            {/* Optional: Help button to reopen tour */}
            <button onClick={() => setShowTour(true)}>
                Help / Take Tour
            </button>
        </>
    );
}
```

---

## Summary

This pattern provides:
- ✅ Two-level navigation (main steps + substeps)
- ✅ Visual highlighting with smooth transitions
- ✅ Progress tracking and indicators
- ✅ Keyboard navigation
- ✅ Flexible content (static + interactive)
- ✅ User preferences persistence
- ✅ Responsive design considerations
- ✅ Accessibility features

Use this as a starting point and customize the styling, content, and behavior to match your specific application needs.
