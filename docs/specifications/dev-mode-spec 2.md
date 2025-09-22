# Dev Mode Specification

*Based on the most recent implementation in week-9-map-buyer-stakeholders/activity-unified.html*

## Overview

Dev Mode is a development and testing feature embedded in all GTM Workshop activities that enables rapid form population with realistic test data. It provides a streamlined way for developers, testers, and demonstrators to quickly populate complex multi-step forms without manual data entry.

## Purpose

1. **Rapid Testing**: Instantly populate all form fields with realistic business data
2. **Quality Assurance**: Verify form validation, completion logic, and export functionality
3. **Demonstration**: Showcase workshop functionality with professional, contextual data
4. **Development Efficiency**: Reduce time spent manually entering test data during development

## Core Features

### 1. Activation Method
- **Trigger**: Double-click on the activity title
- **Toggle**: Each double-click toggles dev mode on/off
- **Persistence**: Dev mode state is NOT persisted (resets on page refresh)

### 2. Visual Indicators
When dev mode is active:
- Title text changes to orange color (`text-orange-600`)
- 🔧 emoji appears after the title
- Dev mode control panel appears below the title with orange border

### 3. Test Data Loading
- Single-click "Fill Test Data" button
- Loading state with spinner (⏳) and disabled button
- Success/error console logging
- Populates all activity fields including multi-step forms

## Technical Implementation

### State Management

```javascript
// Dev mode state variables (inside component)
const [devMode, setDevMode] = useState(false);
const [devFillLoading, setDevFillLoading] = useState(false);
```

### Toggle Function

```javascript
// Toggle dev mode on/off
const toggleDevMode = () => {
    setDevMode(!devMode);
    console.log(devMode ? '🔒 Dev mode disabled' : '🔓 Dev mode enabled');
};
```

### Data Loading Function

```javascript
// Load test data from embedded JSON
const devFillData = () => {
    setDevFillLoading(true);
    try {
        const testData = JSON.parse(document.getElementById('testData').textContent);
        
        // Map test data to state variables
        // Example for Activity 1 state
        setSelectedBuyingJobs(testData.selectedBuyingJobs || []);
        setJobJustifications(testData.jobJustifications || {});
        
        // Example for Activity 2 state
        setBuyingGroupType(testData.buyingGroupType || 'Type3');
        
        // Handle complex nested data
        const loadedStakeholders = testData.stakeholders || [];
        const stakeholdersWithArtifacts = loadedStakeholders.map(s => ({
            ...s,
            enablementArtifact: s.enablementArtifact || ''
        }));
        setStakeholders(stakeholdersWithArtifacts);
        
        // Set navigation state if multi-step
        setCurrentStep(testData.currentStep || 3);
        
        console.log('✅ Dev data loaded successfully');
    } catch (error) {
        console.error('❌ Failed to load dev data:', error);
    } finally {
        setDevFillLoading(false);
    }
};
```

### UI Components

#### Title with Dev Mode Toggle

```javascript
<h1 
    className={`text-xl font-bold text-gray-800 ${devMode ? 'text-orange-600' : ''} cursor-pointer select-none`}
    onDoubleClick={toggleDevMode}
    title="Double-click to toggle dev mode"
>
    Activity Title {devMode && '🔧'}
</h1>
```

#### Dev Mode Control Panel

```javascript
{devMode && (
    <div className="mt-3 pt-3 border-t border-orange-200">
        <div className="flex items-center justify-between">
            <span className="text-xs text-orange-600 font-medium">🔧 Dev Mode Active</span>
            <button
                onClick={devFillData}
                disabled={devFillLoading}
                className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
                {devFillLoading ? '⏳ Loading...' : '📝 Fill Test Data'}
            </button>
        </div>
    </div>
)}
```

## Test Data Integration

### Embedded Test Data Format

Test data is embedded directly in the HTML file using a script tag:

```html
<!-- Test Data from specifications -->
<script type="application/json" id="testData">
{
    "selectedBuyingJobs": ["Consensus Creation", "Validation", "Supplier Selection"],
    "jobJustifications": {
        "Consensus Creation": "This is the hardest part because...",
        "Validation": "Our champions struggle to prove the ROI...",
        "Supplier Selection": "The customer often defaults to..."
    },
    "buyingGroupType": "Type4",
    "stakeholders": [
        {
            "functionalRole": "Head of DevOps",
            "commonTitles": "Lead DevOps Engineer, Senior SRE",
            "stakeholderPersona": "End User",
            "keyGoals": "Reduce time spent firefighting...",
            "challenges": "Constantly pulled away from strategic projects...",
            "enablementArtifact": "Create a '2-week POC guide'..."
        }
    ],
    "currentStep": 3
}
</script>
```

### Data Mapping Guidelines

1. **Direct Mapping**: Test data property names should exactly match state variable names
2. **Default Values**: Use logical defaults with `||` operator for optional fields
3. **Nested Data**: Handle complex nested structures appropriately
4. **Multi-Step Forms**: Include navigation state (`currentStep`) when applicable

## Visual Design Standards

### Colors
- **Orange Theme**: Primary color for dev mode indicators (`orange-500`, `orange-600`)
- **Text Color**: Orange text when active (`text-orange-600`)
- **Border Color**: Orange border for control panel (`border-orange-200`)

### Typography
- **Title**: Bold, size varies by activity (`text-xl` or `text-2xl`)
- **Control Text**: Extra small (`text-xs`)
- **Button Text**: Extra small (`text-xs`)

### Spacing
- **Control Panel**: `mt-3 pt-3` (margin-top and padding-top)
- **Button Padding**: `px-3 py-1` (compact horizontal and vertical padding)

## Console Logging Standards

### Required Log Messages

1. **Toggle Messages**:
   - Enable: `'🔓 Dev mode enabled'`
   - Disable: `'🔒 Dev mode disabled'`

2. **Data Loading**:
   - Success: `'✅ Dev data loaded successfully'`
   - Error: `'❌ Failed to load dev data:', error`

3. **Optional Debug Logs**:
   - For complex activities, log validation state or data transformation details

## User Experience Flow

1. **Discovery**
   - User hovers over title and sees tooltip: "Double-click to toggle dev mode"
   - Cursor changes to pointer on title hover

2. **Activation**
   - User double-clicks title
   - Title turns orange with 🔧 emoji
   - Control panel slides in below title
   - Console logs activation

3. **Data Loading**
   - User clicks "Fill Test Data" button
   - Button shows loading state with spinner
   - All form fields populate simultaneously
   - Console logs success
   - User can immediately interact with populated data

4. **Deactivation**
   - User double-clicks title again
   - Visual indicators disappear
   - Data remains populated (not cleared)
   - Console logs deactivation

## Security and Privacy Considerations

1. **No Network Requests**: Test data is embedded, never fetched
2. **No Data Persistence**: Dev mode state doesn't persist across sessions
3. **No Production Impact**: Dev mode is purely client-side
4. **Professional Data**: Use realistic but fictional business scenarios

## Implementation Checklist

When implementing dev mode in a new activity:

- [ ] Add dev mode state variables (`devMode`, `devFillLoading`)
- [ ] Implement `toggleDevMode` function with console logging
- [ ] Implement `devFillData` function with proper data mapping
- [ ] Add `onDoubleClick` handler to activity title
- [ ] Add conditional 🔧 emoji to title
- [ ] Add orange color class when dev mode active
- [ ] Add dev mode control panel with conditional rendering
- [ ] Embed test data in `<script type="application/json" id="testData">`
- [ ] Test double-click activation/deactivation
- [ ] Test data loading with all fields
- [ ] Verify console messages appear correctly
- [ ] Ensure loading state works properly
- [ ] Confirm data populates all nested/complex structures
- [ ] Test with multi-step navigation if applicable

## Best Practices

1. **Realistic Data**: Use complete, professional business scenarios
2. **Comprehensive Coverage**: Ensure test data populates ALL fields
3. **Word Count Compliance**: Test data should meet minimum word requirements
4. **Multi-Step Support**: Include navigation state for wizard-style forms
5. **Error Handling**: Gracefully handle missing or malformed test data
6. **Consistent Naming**: Match test data properties to state variables exactly
7. **Clear Feedback**: Use emojis and colors for instant visual feedback

## Common Patterns

### Pattern 1: Simple Form Fields
```javascript
setFieldName(testData.fieldName || '');
```

### Pattern 2: Array Data
```javascript
setItems(testData.items || []);
```

### Pattern 3: Object/Map Data
```javascript
setMappings(testData.mappings || {});
```

### Pattern 4: Complex Nested Data
```javascript
const processedData = testData.complexData.map(item => ({
    ...item,
    additionalField: item.additionalField || defaultValue
}));
setComplexData(processedData);
```

### Pattern 5: Multi-Step Navigation
```javascript
setCurrentStep(testData.currentStep || 1);
```

## Version History

- **v1.0** (Aug 2024): Initial implementation in week-9-map-buyer-stakeholders/activity-unified.html
- Establishes canonical pattern for all workshop activities
- Based on embedded test data system (no external JSON files)
- Optimized for laptop screens and professional use cases

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Overall project guidelines including dev mode usage
- [TODO.md](TODO.md) - Historical implementation notes
- [activity_standards.md](activity_standards.md) - Broader activity design standards

---

*This specification represents the authoritative implementation pattern for dev mode across all GTM Workshop activities. All new activities should follow these guidelines exactly for consistency and quality.*