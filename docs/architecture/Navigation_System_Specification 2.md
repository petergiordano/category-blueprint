# Navigation System Specification

**Version**: 1.0  
**Last Updated**: 2025-01-08  
**Epic**: POSITIONING-REFACTOR

## Overview

This document defines the unified navigation architecture for the Interactive Category Blueprint application. It establishes a three-component navigation system based on UX best practices for multi-step workflows, ensuring consistency, usability, and scalability across all application parts.

## Core Design Philosophy

Our navigation design is guided by three core principles:

1. **[SLC Principles](./SLC_Principles.md)**: Simple, Lovable, Complete approach to feature development
2. **[Experience Goals](./Experience_Goals.md)**: User confidence and seamless workflow progression  
3. **[Component Library](./ComponentLibrary.md)**: Consistent visual and structural components

## Navigation Architecture

### Three-Component System

The navigation system consists of three distinct components working in harmony:

1. **Global Progress Stepper** (Top Level)
2. **Primary Action Buttons** (Top Right) 
3. **Sticky Sub-Section Navigation** (Left Sidebar)

```
┌─────────────────────────────────────────────────────────────┐
│ [✓] Part 1 → [●] Part 2 → [ ] Part 3 → [ ] Part 4         │ ← Global Progress Stepper
│                                    [Export] [Continue →]    │ ← Primary Action Buttons
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────┐ ┌─────────────────────────────────────────┐ │
│ │ Sections    │ │                                         │ │
│ │ 1. Overview │ │         Main Content Area               │ │
│ │ 2. Details  │ │                                         │ │ ← Sticky Sub-Section Nav
│ │ 3. Summary  │ │                                         │ │
│ └─────────────┘ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Specifications

### 1. Global Progress Stepper

**Purpose**: Provides high-level workflow progress and enables navigation to completed parts.

**Location**: Fixed at top of all pages  
**Behavior**: 
- Shows all 4 parts of the workflow
- Visual states: Completed (✓), Active (highlighted), Upcoming (disabled)
- Clickable for completed parts only
- Updates automatically based on completion status

**Technical Implementation**:
```javascript
const ProgressStepper = ({ currentPart, completedParts, onNavigate }) => {
  const parts = [
    { id: 'segment', name: 'Foundation', number: 1 },
    { id: 'icp', name: 'ICP Definition', number: 2 },
    { id: 'positioning', name: 'Positioning', number: 3 },
    { id: 'category', name: 'Category Design', number: 4 }
  ];

  return (
    <div className="progress-stepper">
      {parts.map((part, index) => (
        <div key={part.id} className="progress-step-container">
          <div 
            className={`progress-step ${getStepState(part.id, currentPart, completedParts)}`}
            onClick={() => handleStepClick(part.id, completedParts)}
          >
            {completedParts.includes(part.id) ? (
              <span className="checkmark">✓</span>
            ) : (
              <span className="step-number">{part.number}</span>
            )}
            <span className="step-name">Part {part.number}: {part.name}</span>
          </div>
          {index < parts.length - 1 && <div className="step-arrow">→</div>}
        </div>
      ))}
    </div>
  );
};
```

**CSS Classes**:
```css
.progress-stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.progress-step.completed {
  background: #10b981;
  color: white;
}

.progress-step.active {
  background: #3b82f6;
  color: white;
}

.progress-step.upcoming {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.progress-step.disabled {
  pointer-events: none;
}

.step-arrow {
  margin: 0 0.5rem;
  color: #9ca3af;
  font-weight: bold;
}

@media (max-width: 768px) {
  .progress-stepper {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .step-arrow {
    transform: rotate(90deg);
    margin: 0.25rem 0;
  }
}
```

### 2. Primary Action Buttons

**Purpose**: Consistent workflow progression controls across all parts.

**Location**: Top-right of each page header  
**Behavior**:
- Always shows relevant primary and secondary actions
- Maintains visual hierarchy and consistent positioning
- Adapts labels based on current part

**Standard Button Layout**:
```javascript
const PrimaryActions = ({ currentPart, onExport, onContinue, onReset }) => {
  const getButtonConfig = (part) => {
    const configs = {
      'segment': { 
        continue: 'Continue to Part 2: ICP Definition →',
        export: 'Export Foundation'
      },
      'icp': { 
        continue: 'Continue to Part 3: Positioning →',
        export: 'Export ICP'
      },
      'positioning': { 
        continue: 'Continue to Part 4: Category Design →',
        export: 'Export Positioning'
      },
      'category': { 
        continue: 'Complete Blueprint',
        export: 'Export Category Design'
      }
    };
    return configs[part];
  };

  const config = getButtonConfig(currentPart);
  
  return (
    <div className="primary-actions">
      {onReset && (
        <button className="btn-tertiary" onClick={onReset}>
          Reset
        </button>
      )}
      <button className="btn-secondary" onClick={onExport}>
        {config.export}
      </button>
      <button className="btn-primary" onClick={onContinue}>
        {config.continue}
      </button>
    </div>
  );
};
```

**CSS Classes**:
```css
.primary-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-primary {
  background: #10b981;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #059669;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-tertiary {
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-tertiary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

@media (max-width: 768px) {
  .primary-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-tertiary {
    width: 100%;
    text-align: center;
  }
}
```

### 3. Sticky Sub-Section Navigation

**Purpose**: Quick navigation within the current part only.

**Location**: Left sidebar on desktop, collapsible on mobile  
**Behavior**:
- Shows only sections from the current part
- Section numbering starts at 1 for each part
- No cross-part navigation links
- Active section highlighting

**Implementation**:
```javascript
const SubSectionNav = ({ sections, activeSection, currentPart }) => {
  return (
    <nav className="sub-section-nav">
      <div className="nav-container">
        <h3 className="nav-title">Sections</h3>
        <ul className="nav-list">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a 
                href={`#${section.id}`}
                className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
              >
                {index + 1}. {section.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
```

**CSS Classes**:
```css
.sub-section-nav {
  position: sticky;
  top: 7rem; /* Below progress stepper */
  width: 25%;
  height: fit-content;
}

.nav-container {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-title {
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-link {
  display: block;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #374151;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #10b981;
}

.nav-link.active {
  background: #d1fae5;
  color: #059669;
}

@media (max-width: 1024px) {
  .sub-section-nav {
    display: none; /* Hide on tablet and mobile */
  }
}
```

## State Management

### Navigation Progress State

The application state must be extended to track navigation progress:

```javascript
const navigationProgressSchema = {
  navigationProgress: {
    completedParts: [], // Array of completed part IDs
    currentPart: 'segment', // Current active part
    partCompletionData: {
      segment: { completed: false, completedAt: null },
      icp: { completed: false, completedAt: null },
      positioning: { completed: false, completedAt: null },
      category: { completed: false, completedAt: null }
    }
  }
};

// Helper functions
const markPartComplete = (partId) => {
  setAppState(prev => ({
    ...prev,
    navigationProgress: {
      ...prev.navigationProgress,
      completedParts: [...prev.navigationProgress.completedParts, partId],
      partCompletionData: {
        ...prev.navigationProgress.partCompletionData,
        [partId]: {
          completed: true,
          completedAt: new Date().toISOString()
        }
      }
    }
  }));
};

const canNavigateTopart = (partId, completedParts, currentPart) => {
  // Can always go back to completed parts
  if (completedParts.includes(partId)) return true;
  
  // Can navigate to current part
  if (partId === currentPart) return true;
  
  // Cannot skip ahead to incomplete parts
  return false;
};
```

## Page Addition/Removal Guidelines

### Adding a New Page

1. **Update Progress Stepper Configuration**:
   ```javascript
   const parts = [
     // ... existing parts
     { id: 'newPart', name: 'New Part Name', number: 5 }
   ];
   ```

2. **Create Part Component Following Standards**:
   - Include Global Progress Stepper at top
   - Add Primary Action Buttons in header
   - Implement Sub-Section Navigation for page sections
   - Add proper state management integration

3. **Update Navigation State Schema**:
   ```javascript
   partCompletionData: {
     // ... existing parts
     newPart: { completed: false, completedAt: null }
   }
   ```

4. **Configure Button Labels**:
   ```javascript
   const buttonConfigs = {
     // ... existing configs
     'newPart': { 
       continue: 'Continue to Next Part →',
       export: 'Export New Part Data'
     }
   };
   ```

### Removing a Page

1. Remove part from progress stepper configuration
2. Update all button configurations that reference the removed part
3. Clean up navigation state schema
4. Update routing logic in main App component

## Testing Requirements

### Navigation Flow Testing

**Forward Navigation**:
- [ ] Can progress through parts in sequence
- [ ] Cannot skip to incomplete parts
- [ ] Primary action buttons work correctly
- [ ] State persists across navigation

**Backward Navigation**:
- [ ] Can return to any completed part via progress stepper
- [ ] State is preserved when returning
- [ ] Cannot click on incomplete parts
- [ ] Disabled state is visually clear

**Sub-Section Navigation**:
- [ ] Sidebar shows only current part sections
- [ ] Section numbering starts at 1 for each part
- [ ] Active section is properly highlighted
- [ ] Smooth scrolling to sections works

### Responsive Testing

**Desktop** (1024px+):
- [ ] All three navigation components visible
- [ ] Proper spacing and alignment
- [ ] Hover states work correctly

**Tablet** (768px - 1023px):
- [ ] Progress stepper remains horizontal
- [ ] Primary actions stack if needed
- [ ] Sub-section nav is hidden/collapsed

**Mobile** (< 768px):
- [ ] Progress stepper stacks vertically
- [ ] Primary actions are full-width
- [ ] Navigation is accessible via hamburger menu

### Accessibility Testing

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader compatibility for progress indication
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Focus indicators are visible and logical

## Implementation Checklist

### Phase 1: Core Components
- [ ] Create ProgressStepper React component
- [ ] Create PrimaryActions React component  
- [ ] Create SubSectionNav React component
- [ ] Add base CSS styles for all components

### Phase 2: Integration
- [ ] Add ProgressStepper to all page headers
- [ ] Replace existing navigation with PrimaryActions
- [ ] Update all sidebars to use SubSectionNav
- [ ] Remove old navigation patterns

### Phase 3: State Management
- [ ] Extend appState schema for navigation tracking
- [ ] Implement completion detection logic
- [ ] Add navigation validation
- [ ] Test state persistence

### Phase 4: Responsive Design
- [ ] Add mobile breakpoints
- [ ] Test across devices
- [ ] Implement hamburger menu for mobile
- [ ] Validate accessibility

### Phase 5: Testing & Validation
- [ ] Complete navigation flow testing
- [ ] Validate responsive behavior
- [ ] Confirm accessibility compliance
- [ ] Performance testing

## Brand Consistency

This navigation system adheres to Scale Venture Partners brand guidelines:

- **Primary Green**: `#10b981` for completed states and primary actions
- **Secondary Blue**: `#3b82f6` for active/current states  
- **Neutral Grays**: `#f3f4f6`, `#6b7280` for secondary elements
- **Typography**: Consistent with existing Scale VP font hierarchy
- **Spacing**: Following established 8px grid system

## Success Metrics

The navigation system will be considered successful when:

- **User Confidence**: Users understand their progress and next steps at all times
- **Consistency**: Navigation behavior is identical across all parts
- **Accessibility**: All users can navigate effectively regardless of device or ability
- **Performance**: Navigation updates are instantaneous and smooth
- **Maintainability**: Adding new parts follows a clear, documented process

---

*This specification serves as the definitive guide for navigation implementation and must be updated whenever navigation requirements change.*