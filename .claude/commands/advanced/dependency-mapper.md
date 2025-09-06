# Dependency Mapper Command

## Purpose
Analyze and visualize component dependencies, identify coupling issues, and optimize project architecture through comprehensive dependency mapping.

## Usage
```
@dependency-mapper [scope] [options]
```

## Analysis Scopes

### 1. Component Dependencies
```
@dependency-mapper components [--component UserProfile]
```
Maps React/Vue component relationships:
- Parent-child relationships
- Prop flow analysis
- Context consumption
- Hook dependencies
- Shared utility usage

### 2. Module Dependencies
```
@dependency-mapper modules [--depth 3]
```
Analyzes ES6/CommonJS module relationships:
- Import/export chains
- Circular dependency detection
- Dead code identification
- Module coupling metrics

### 3. Service Dependencies
```
@dependency-mapper services [--service UserService]
```
Maps service layer dependencies:
- API client relationships
- Data flow patterns
- External service integrations
- Business logic coupling

### 4. Database Dependencies
```
@dependency-mapper database [--entity User]
```
Analyzes data layer relationships:
- Entity relationships
- Foreign key constraints
- Query dependencies
- Migration dependencies

### 5. Package Dependencies
```
@dependency-mapper packages [--include-dev]
```
Examines npm/yarn package relationships:
- Direct vs transitive dependencies
- Version compatibility
- Bundle impact analysis
- Licensing dependencies

## Visualization Options

### Dependency Graph
```
@dependency-mapper components --graph --output dependency-graph.svg
```
Generates visual dependency graphs using:
- Mermaid diagrams
- DOT/Graphviz format
- Interactive HTML
- SVG export

### Dependency Matrix
```
@dependency-mapper modules --matrix --format csv
```
Creates dependency matrices showing:
- Component-to-component relationships
- Coupling strength indicators
- Bidirectional dependencies
- Dependency clusters

### Tree View
```
@dependency-mapper services --tree --root UserService
```
Displays hierarchical dependency trees:
- Root-to-leaf traversal
- Depth indicators
- Branch pruning options
- Circular reference highlighting

## Analysis Results

### Detailed Component Analysis
```
Component Dependency Analysis: UserProfile
═══════════════════════════════════════════════

📦 Direct Dependencies (8)
├─ React Hooks
│   ├─ useState (state management)
│   ├─ useEffect (lifecycle)
│   ├─ useCallback (optimization)
│   └─ useMemo (optimization)
├─ Custom Hooks
│   ├─ useUser (data fetching)
│   └─ usePermissions (authorization)
├─ UI Components
│   ├─ Avatar (presentation)
│   ├─ Button (interaction)
│   ├─ Modal (behavior)
│   └─ LoadingSpinner (feedback)
└─ Utilities
    ├─ formatDate (helper)
    └─ validateEmail (validation)

🔗 Indirect Dependencies (12)
├─ Via useUser Hook
│   ├─ UserService (data)
│   ├─ APIClient (network)
│   └─ Cache (storage)
├─ Via UI Components
│   ├─ ThemeProvider (styling)
│   ├─ IconLibrary (icons)
│   └─ AnimationSystem (effects)

📊 Dependency Metrics
├─ Coupling Score: 6/10 (moderate)
├─ Cohesion Score: 8/10 (high)
├─ Instability: 0.4 (stable)
└─ Abstractness: 0.6 (balanced)

⚠️ Issues Detected
├─ Potential circular dependency with UserList
├─ Heavy dependency on external API
└─ Tight coupling with specific UI library

💡 Recommendations
├─ Extract user logic to custom hook
├─ Add dependency injection for API client
├─ Consider component interface abstraction
└─ Implement error boundary pattern
```

### Module Dependency Graph
```
Module Dependency Map
════════════════════════════════════════════════

src/
├─ components/
│   ├─ UserProfile.tsx → [hooks/useUser, utils/format]
│   ├─ UserList.tsx → [hooks/useUsers, components/UserCard]
│   └─ UserCard.tsx → [utils/format, assets/icons]
├─ hooks/
│   ├─ useUser.ts → [services/UserService, utils/cache]
│   └─ useUsers.ts → [services/UserService, utils/pagination]
├─ services/
│   ├─ UserService.ts → [clients/APIClient, utils/transform]
│   └─ APIClient.ts → [utils/auth, config/api]
└─ utils/
    ├─ format.ts → [config/locale]
    ├─ cache.ts → [config/storage]
    └─ auth.ts → [config/security]

Circular Dependencies Detected:
⚠️ components/UserProfile ↔ components/UserList
⚠️ services/UserService ↔ utils/cache

Dependency Clusters:
🔵 User Management (5 modules, high cohesion)
🟡 API Layer (3 modules, medium cohesion)
🟢 Utilities (6 modules, low coupling)
```

## Advanced Analysis Features

### Coupling Analysis
```
@dependency-mapper coupling --threshold 0.7
```

Analyzes different types of coupling:
- **Data Coupling**: Shared data structures
- **Control Coupling**: Control flow dependencies
- **Common Coupling**: Shared global state
- **Content Coupling**: Direct access to internals

```
Coupling Analysis Results
═══════════════════════════════════════════════

High Coupling (Score > 0.7):
├─ UserProfile ↔ UserService (0.85)
│   └─ Type: Data + Control coupling
├─ APIClient ↔ AuthService (0.79)
│   └─ Type: Common coupling
└─ PaymentForm ↔ ValidationService (0.73)
    └─ Type: Control coupling

Medium Coupling (0.4 - 0.7):
├─ UserList ↔ UserCard (0.62)
├─ Dashboard ↔ MetricsService (0.58)
└─ Navigation ↔ RouteService (0.45)

Recommendations:
├─ Introduce interfaces to reduce data coupling
├─ Implement dependency injection pattern
├─ Extract shared logic to utility functions
└─ Use event-driven communication patterns
```

### Impact Analysis
```
@dependency-mapper impact --changed UserService.ts
```

Shows ripple effects of changes:
```
Change Impact Analysis: UserService.ts
══════════════════════════════════════════════

📊 Direct Impact (3 files)
├─ hooks/useUser.ts (High Impact)
│   └─ Interface changes require updates
├─ hooks/useUsers.ts (Medium Impact)
│   └─ Shared utilities affected
└─ components/UserProfile.tsx (Low Impact)
    └─ Indirect via useUser hook

📈 Cascading Impact (8 files)
├─ Level 2 (via hooks)
│   ├─ UserProfile.tsx
│   ├─ UserList.tsx
│   ├─ UserDashboard.tsx
│   └─ AdminPanel.tsx
├─ Level 3 (via components)
│   ├─ App.tsx
│   ├─ HomePage.tsx
│   └─ SettingsPage.tsx

🧪 Tests Affected (12 files)
├─ UserService.test.ts (Direct)
├─ useUser.test.ts (Direct)
├─ UserProfile.test.tsx (Indirect)
└─ 9 integration tests

⚠️ Breaking Change Risk: MEDIUM
├─ Public API changes: 2 methods
├─ Type definition changes: 1 interface
└─ Behavioral changes: None detected

💡 Migration Strategy
├─ Update hook interfaces first
├─ Add deprecation warnings
├─ Provide migration guide
└─ Update tests in parallel
```

### Optimization Suggestions
```
@dependency-mapper optimize --focus bundle-size
```

Provides optimization recommendations:
```
Dependency Optimization Report
══════════════════════════════════════════════

🎯 Bundle Size Optimization
├─ Duplicate Dependencies
│   ├─ lodash: 3 different versions (save 45KB)
│   ├─ moment: replaceable with date-fns (save 67KB)
│   └─ uuid: included twice (save 12KB)
├─ Tree Shaking Opportunities
│   ├─ @material-ui/core: only 30% used (save 120KB)
│   ├─ rxjs: only operators used (save 89KB)
│   └─ chart.js: unused features (save 34KB)

🔄 Code Splitting Opportunities
├─ Admin Components (78KB)
│   └─ Load on demand, used by <10% users
├─ Charts & Analytics (145KB)
│   └─ Separate bundle for analytics pages
└─ PDF Generation (89KB)
    └─ Dynamic import for export features

📦 Dependency Alternatives
├─ moment → date-fns (67KB → 13KB)
├─ lodash → native ES6 (102KB → 0KB)
└─ axios → fetch API (45KB → 0KB)

Potential Savings: 567KB (38% reduction)
```

## Configuration

### Dependency Mapping Rules
Create `.claude/dependency-config.json`:

```json
{
  "mapping_rules": {
    "component_analysis": {
      "include_patterns": ["src/**/*.{ts,tsx,js,jsx}"],
      "exclude_patterns": ["**/*.test.*", "**/*.stories.*"],
      "dependency_types": ["imports", "props", "context", "hooks"],
      "max_depth": 5
    },
    "coupling_thresholds": {
      "low": 0.3,
      "medium": 0.6,
      "high": 0.8,
      "critical": 0.9
    },
    "visualization": {
      "max_nodes": 50,
      "cluster_threshold": 3,
      "show_weak_dependencies": false,
      "color_by_type": true
    }
  },
  "optimization_rules": {
    "bundle_analysis": {
      "size_threshold": "10KB",
      "usage_threshold": 0.1,
      "duplicate_threshold": 2
    },
    "suggestion_types": [
      "code_splitting",
      "tree_shaking",
      "dependency_alternatives",
      "architectural_improvements"
    ]
  }
}
```

### Project-Specific Patterns
Create `.claude/dependency-patterns.json`:

```json
{
  "architectural_patterns": {
    "layered_architecture": {
      "layers": ["presentation", "business", "data"],
      "allowed_dependencies": {
        "presentation": ["business"],
        "business": ["data"],
        "data": []
      }
    },
    "component_patterns": {
      "container_component": {
        "can_depend_on": ["services", "hooks", "presentational_components"],
        "cannot_depend_on": ["other_containers"]
      },
      "presentational_component": {
        "can_depend_on": ["ui_primitives", "utilities"],
        "cannot_depend_on": ["services", "business_logic"]
      }
    }
  },
  "violation_detection": {
    "circular_dependencies": "error",
    "layer_violations": "warning",
    "high_coupling": "warning",
    "unused_dependencies": "info"
  }
}
```

## Integration Features

### Git Integration
```bash
# Analyze changes since last commit
@dependency-mapper changes --since HEAD~1

# Compare dependency changes between branches
@dependency-mapper compare --base main --target feature/auth

# Pre-commit dependency validation
@dependency-mapper validate --staged-only
```

### CI/CD Integration
```yaml
# GitHub Actions workflow
- name: Analyze Dependencies
  run: |
    @dependency-mapper validate --fail-on-violations
    @dependency-mapper optimize --report-only --output optimization-report.json

- name: Upload Dependency Report
  uses: actions/upload-artifact@v2
  with:
    name: dependency-analysis
    path: optimization-report.json
```

### IDE Integration
```json
{
  "vscode_settings": {
    "dependency_mapper.auto_analyze": true,
    "dependency_mapper.show_inline_warnings": true,
    "dependency_mapper.update_on_save": true
  }
}
```

## Real-Time Monitoring

### Dependency Health Dashboard
```
Dependency Health Status
════════════════════════════════════════════════

🟢 Overall Health: GOOD (Score: 82/100)

📊 Key Metrics
├─ Total Dependencies: 156
├─ Circular Dependencies: 2 (🟡 needs attention)
├─ High Coupling Components: 4 (🟡 monitor)
├─ Dead Code: 0.3% (🟢 excellent)
├─ Bundle Size: 2.1MB (🟢 target: <3MB)
└─ Update Coverage: 94% (🟢 up-to-date)

🔍 Recent Changes (Last 7 days)
├─ New Dependencies: 3
├─ Removed Dependencies: 1
├─ Updated Dependencies: 7
├─ Coupling Score Change: +0.05
└─ Bundle Size Change: -45KB

⚠️ Action Items
├─ Fix circular dependency in user module
├─ Refactor PaymentService coupling
├─ Update 3 security-flagged packages
└─ Review new lodash usage patterns
```

### Automated Alerts
```json
{
  "alert_rules": {
    "new_circular_dependency": {
      "severity": "high",
      "action": "block_merge",
      "notify": ["tech_lead", "architect"]
    },
    "coupling_increase": {
      "threshold": 0.1,
      "severity": "medium",
      "action": "create_issue"
    },
    "bundle_size_increase": {
      "threshold": "100KB",
      "severity": "medium",
      "action": "require_justification"
    }
  }
}
```

## Best Practices

### Regular Dependency Audits
1. **Weekly**: Quick dependency health check
2. **Monthly**: Full coupling analysis
3. **Quarterly**: Architecture review and optimization
4. **Pre-release**: Comprehensive dependency validation

### Dependency Management Strategies
1. **Minimize Coupling**: Prefer composition over inheritance
2. **Interface Segregation**: Keep interfaces focused and small
3. **Dependency Inversion**: Depend on abstractions, not concretions
4. **Single Responsibility**: Each module should have one reason to change
5. **Open/Closed Principle**: Open for extension, closed for modification

### Optimization Workflows
1. **Identify**: Use dependency mapper to find issues
2. **Prioritize**: Focus on high-impact, low-effort improvements
3. **Refactor**: Apply architectural patterns systematically
4. **Validate**: Verify improvements with metrics
5. **Monitor**: Track dependency health over time