# Component Library & Design System

**Version**: 2.0  
**Template Version**: 1.0  
**Last Updated**: 2025-07-19

This document is the **Design System Guide** for your project. It defines the reusable components, patterns, and styles that ensure a consistent, high-quality user experience across the entire application.

## Core Design Philosophy

Our design is guided by three core documents. It is crucial to understand all three to make effective design decisions:

1. **[SLC Principles](./SLC_Principles.md)**: Defines **how** we approach building features (our process).
2. **[Experience Goals](./Experience_Goals.md)**: Defines **why** we are building and how users should feel (our emotional target).
3. **This Document**: Defines the **what**—the specific visual and structural components to use (our toolkit).

## System Architecture & Components

The system is built on a component-based pipeline. For a detailed breakdown of each component's specifications and status, refer to the **[Project Requirements Document (PRD)](../specifications/PRD.md)**, which is the source of truth for implementation details.

This library provides the patterns and standards that should be applied when building those components.

### **User Interface Components**

#### **Command-Line Interface**
These commands are often invoked by AI agents (e.g., via `.claude/commands/*.md` files) to automate development workflows.

```bash
# Primary Commands - CUSTOMIZE for your domain
[PROJECT] [action] [target]         # Main processing command
[PROJECT] validate [target]         # Validate input/output
[PROJECT] status                     # Show current status
[PROJECT] [action] --help           # Get help for specific actions

# Example customization:
# myapp process data.json            # Process input data
# myapp validate output/             # Validate results
# myapp status                       # Show processing status
```

#### **Progress Indicators**
```
[████████████████████░░░░] 80% [Component Name]
  ✓ [Task 1] completed ([details])
  ✓ [Task 2] completed ([details])  
  ✓ [Task 3] completed ([details])
  ⏳ [Current task]...
  
Estimated completion: [time estimate]
```

#### **Status Display Components**
- **Real-time Progress**: ASCII progress bars for each component
- **Validation Checkpoints**: Green checkmarks for completed validations
- **Error Messages**: Clear, actionable failure descriptions
- **Time Estimates**: Realistic completion time predictions
- **Resource Tracking**: Monitor usage and costs (if applicable)

### **Asset Management Components** (Customize for your domain)

#### **Library Structure** 
```
assets/                          # CUSTOMIZE based on your project needs
├── [category1]/
│   ├── [subcategory]/          # Organize by function/type
│   └── [subcategory]/          
├── [category2]/
│   ├── [subcategory]/          
│   └── [subcategory]/          
└── [category3]/
    ├── [subcategory]/          
    └── [subcategory]/          

# Example for data processing project:
# assets/
# ├── templates/
# │   ├── input/               # Input format templates
# │   └── output/              # Output format templates
# ├── configs/
# │   ├── development/         # Dev environment configs
# │   └── production/          # Prod environment configs
# └── samples/
#     ├── test-data/          # Sample test data
#     └── reference/          # Reference outputs
```

#### **Asset Discovery**
- **Auto-Detection**: System scans folders for new assets
- **Metadata Tracking**: Usage frequency, quality ratings
- **Smart Selection**: Context-based asset recommendations
- **Simple Addition**: Easy asset integration workflow

### **Quality Control Components**

#### **Validation Gates** (Customize for your domain)
1. **Input Validation**: Ensure all required input elements are present
2. **Processing Quality**: Validate intermediate outputs and processing steps
3. **Output Standards**: Confirm final output meets quality requirements
4. **Integration Testing**: Verify component interoperability

#### **Error Recovery**
- **Component Isolation**: Failures don't cascade to other components
- **Resume Capability**: Restart from last successful checkpoint
- **Clear Diagnostics**: Specific error messages with suggested fixes
- **Rollback Options**: Return to previous successful state

### **Resource Management Components** (If applicable)

#### **Usage Tracking**
- **API Usage**: External service consumption and costs
- **Processing Time**: Local compute resource usage
- **Storage**: Generated file size tracking
- **External Services**: Third-party service costs

#### **Cost Estimation** (Example format)
```
[Project/Task] Cost Estimate:
├── [Service 1] ([usage metric]): $[amount]
├── [Service 2] ([usage metric]): $[amount]
├── [Service 3] ([usage metric]): $[amount]
└── Total Estimated Cost: $[total]
```

## Color & Style Guidelines

### **CLI Color Scheme**
- **Success**: Green (✓ checkmarks, completed progress)
- **Warning**: Yellow (⚠️ warnings, alerts)
- **Error**: Red (❌ failures, critical issues)
- **Info**: Blue (ℹ️ information, tips)
- **Progress**: Cyan (⏳ current operations)

### **Typography Patterns**
- **Commands**: `monospace code style`
- **File Names**: `filename.extension`
- **Status**: **Bold for emphasis**
- **Progress**: █████░░░░░ ASCII blocks

### **Message Templates**
```
✓ SUCCESS: [Action] completed successfully
⚠️ WARNING: [Condition] detected
❌ ERROR: [Problem] - [specific issue details]
ℹ️ INFO: [Helpful information about state/context]
⏳ PROCESSING: [Current action] ([progress indicator])
```

## Key UI Components (Customize for your domain)

### **Processing Queue Management**
- **Current Task**: Show active processing status
- **Completed Tasks**: List with file locations and metrics
- **Failed Tasks**: Show error status and recovery options
- **Asset Library**: Available resources with usage stats

### **Configuration Management**
- **[Domain Settings]**: Domain-specific parameters
- **Quality Presets**: Different output quality levels
- **Resource Limits**: Budget/usage controls and alerts
- **Preferences**: Default behaviors and settings

### **Output Organization**
```
output/
├── [item_name]/
│   ├── [final_output].[ext]        # Primary deliverable
│   ├── [intermediate].[ext]        # Intermediate results
│   ├── [metadata]/                 # Processing artifacts
│   ├── manifest.json               # Asset/resource manifest
│   └── report.json                 # Complete processing report
```

## Visual References

### **Inspiration CLI Tools**
- **Modern Tools**: `fd`, `ripgrep`, `bat` - clean, fast, informative
- **Progress Bars**: `wget`, `rsync` - clear progress indication
- **Status Display**: `htop`, `git status` - organized information hierarchy
- **Error Handling**: `rust compiler` - helpful, actionable error messages

### **Quality Standards** (Customize for your domain)
- **Output Quality**: [Define your quality standards]
- **Processing Reliability**: Consistent results with clear error handling
- **User Confidence**: Never break without clear recovery path
- **Performance**: Optimized for target environment

---

## Template Customization Guide

### Required Customizations

1. **Command Structure**: Replace `[PROJECT]` with your project name and define your specific actions
2. **Asset Categories**: Define your domain-specific asset organization in the Library Structure
3. **Validation Gates**: Specify your domain's quality control requirements
4. **Resource Tracking**: Define what resources/costs you need to monitor
5. **Output Organization**: Structure your output directories for your specific deliverables
6. **Quality Standards**: Define quality metrics specific to your domain

### Example Customizations by Domain

#### Data Processing Project
- Commands: `dataproc process`, `dataproc validate`, `dataproc analyze`
- Assets: `inputs/`, `configs/`, `templates/`, `samples/`
- Validation: Input format, processing accuracy, output completeness
- Resources: API calls, compute time, storage usage

#### Content Generation Project  
- Commands: `contentgen create`, `contentgen review`, `contentgen publish`
- Assets: `templates/`, `media/`, `styles/`, `references/`
- Validation: Content quality, format compliance, publication readiness
- Resources: AI service costs, storage, bandwidth

#### Development Automation Project
- Commands: `devops deploy`, `devops test`, `devops monitor`
- Assets: `configs/`, `scripts/`, `templates/`, `environments/`
- Validation: Code quality, test coverage, deployment success
- Resources: Cloud costs, build time, test execution

---

*Component Library Template Version: 1.0*  
*Adapt this template to match your specific project domain and requirements*