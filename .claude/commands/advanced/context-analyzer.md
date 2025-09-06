# Context Analyzer Command

## Purpose
Analyze the current project state, understand context, and provide comprehensive insights about the codebase, dependencies, and development status.

## Usage
```
@context-analyzer [analysis-type] [options]
```

## Analysis Types

### 1. Project Overview
```
@context-analyzer overview
```
Provides high-level project analysis:
- Technology stack identification
- Architecture patterns in use
- Project maturity assessment
- Development phase detection
- Key dependencies and integrations

### 2. Code Structure Analysis
```
@context-analyzer structure [--path src/]
```
Analyzes codebase organization:
- File and directory structure
- Component relationships
- Design pattern usage
- Code organization quality
- Modularity assessment

### 3. Dependency Analysis
```
@context-analyzer dependencies [--include-dev]
```
Examines project dependencies:
- Direct and transitive dependencies
- Version compatibility
- Security vulnerabilities
- License compliance
- Outdated packages

### 4. Quality Metrics
```
@context-analyzer quality [--detailed]
```
Evaluates code quality:
- Test coverage statistics
- Code complexity metrics
- Documentation coverage
- Style consistency
- Performance indicators

### 5. Development Status
```
@context-analyzer status [--git-aware]
```
Assesses current development state:
- Recent changes and commits
- Work in progress analysis
- Branch status and conflicts
- TODO and FIXME tracking
- Outstanding issues

### 6. Technical Debt
```
@context-analyzer debt [--severity medium]
```
Identifies technical debt:
- Code smells and anti-patterns
- Outdated practices
- Performance bottlenecks
- Security vulnerabilities
- Maintenance burden

## Output Formats

### Console Report (Default)
```
Project Context Analysis
════════════════════════════════════════════════

📊 Project Overview
├─ Type: React TypeScript Application
├─ Phase: Active Development
├─ Maturity: Intermediate (6 months)
└─ Team Size: 3-5 developers (estimated)

🏗️ Architecture
├─ Pattern: Component-based with custom hooks
├─ State Management: Redux Toolkit + RTK Query
├─ Routing: React Router v6
└─ Build Tool: Vite with TypeScript

📦 Dependencies (42 total)
├─ React Ecosystem: 12 packages
├─ Development Tools: 18 packages
├─ Security Issues: 2 medium severity
└─ Outdated: 7 packages need updates

🧪 Quality Metrics
├─ Test Coverage: 73% (target: 80%)
├─ TypeScript Coverage: 89%
├─ ESLint Issues: 14 warnings, 2 errors
└─ Bundle Size: 2.3MB (reasonable)

⚠️ Areas of Concern
├─ Missing error boundaries
├─ Inconsistent error handling
├─ Large component files (>300 lines)
└─ Outdated testing utilities
```

### JSON Report
```
@context-analyzer overview --format json --output analysis.json
```

### Markdown Report
```
@context-analyzer overview --format markdown --output PROJECT_ANALYSIS.md
```

## Advanced Analysis Options

### Filter by Component
```
@context-analyzer structure --component UserProfile --deep
```
Focuses analysis on specific components and their dependencies.

### Historical Analysis
```
@context-analyzer status --since "2024-01-01" --commits 50
```
Analyzes changes over time to identify trends.

### Comparative Analysis
```
@context-analyzer quality --compare-branch main --baseline
```
Compares current state with another branch or baseline.

### Security Focus
```
@context-analyzer dependencies --security-only --critical
```
Security-focused dependency analysis.

### Performance Focus
```
@context-analyzer quality --performance --bundle-analysis
```
Performance-specific code analysis.

## Integration with AI Development

### Context Loading for AI
```
@context-analyzer ai-context [--for-task "implement authentication"]
```
Generates AI-optimized context summaries:
- Relevant code patterns
- Existing implementations
- Project conventions
- Related components

### Smart Recommendations
```
@context-analyzer recommendations [--priority high]
```
AI-generated improvement suggestions:
- Architecture improvements
- Performance optimizations
- Security enhancements
- Best practice adoptions

### Gap Analysis
```
@context-analyzer gaps --specification requirements.md
```
Identifies missing implementations:
- Unimplemented requirements
- Missing test coverage
- Documentation gaps
- Integration missing

## Configuration

### Analysis Configuration File
Create `.claude/analysis-config.json`:

```json
{
  "analysis_settings": {
    "code_quality": {
      "complexity_threshold": 10,
      "file_size_limit": 300,
      "test_coverage_target": 80,
      "enable_performance_checks": true
    },
    "dependency_analysis": {
      "check_security": true,
      "check_licenses": true,
      "exclude_dev_dependencies": false,
      "vulnerability_severity": "medium"
    },
    "architecture_analysis": {
      "detect_patterns": true,
      "analyze_coupling": true,
      "check_best_practices": true,
      "framework_specific_checks": true
    },
    "excluded_paths": [
      "node_modules/",
      "dist/",
      "build/",
      ".git/"
    ],
    "file_type_weights": {
      "source_files": 1.0,
      "test_files": 0.8,
      "config_files": 0.6,
      "documentation": 0.4
    }
  },
  "output_preferences": {
    "default_format": "console",
    "include_suggestions": true,
    "show_progress": true,
    "color_output": true
  }
}
```

### Project-Specific Rules
Create `.claude/analysis-rules.json`:

```json
{
  "custom_rules": {
    "naming_conventions": {
      "components": "PascalCase",
      "hooks": "camelCase with 'use' prefix",
      "constants": "SCREAMING_SNAKE_CASE",
      "files": "kebab-case"
    },
    "architecture_rules": {
      "max_component_size": 200,
      "max_hook_complexity": 5,
      "require_prop_types": true,
      "enforce_error_boundaries": true
    },
    "quality_gates": {
      "minimum_test_coverage": 75,
      "maximum_cyclomatic_complexity": 8,
      "maximum_file_size": 250,
      "maximum_function_length": 30
    }
  }
}
```

## Detailed Analysis Features

### Architectural Pattern Detection
```
Detected Patterns:
├─ Repository Pattern (data layer)
├─ Observer Pattern (state management)
├─ Factory Pattern (service creation)
├─ Singleton Pattern (configuration)
└─ Command Pattern (user actions)

Pattern Consistency: 82%
Recommendations:
- Standardize error handling across repositories
- Consider implementing Strategy pattern for API clients
- Add Builder pattern for complex object creation
```

### Code Relationship Mapping
```
Component Dependencies:
UserProfile
├─ Direct Dependencies (3)
│   ├─ UserService (data)
│   ├─ Avatar (UI)
│   └─ LoadingSpinner (UI)
├─ Indirect Dependencies (7)
│   ├─ APIClient (via UserService)
│   ├─ Cache (via UserService)
│   └─ ErrorHandler (via UserService)
└─ Dependents (5)
    ├─ UserDashboard
    ├─ ProfileSettings
    └─ UserList
```

### Performance Impact Analysis
```
Performance Analysis:
Bundle Impact:
├─ UserProfile: 12KB (0.5% of total)
├─ Dependencies: 45KB (1.8% of total)
└─ Lazy Loading: Supported ✓

Runtime Performance:
├─ Render Time: 8ms (target: <16ms)
├─ Memory Usage: 2MB (acceptable)
├─ Re-render Frequency: Low ✓
└─ Bundle Splitting: Optimized ✓

Optimization Opportunities:
- Memoize expensive calculations
- Implement virtual scrolling for large lists
- Consider lazy loading for heavy components
```

### Security Assessment
```
Security Analysis:
Dependencies:
├─ Known Vulnerabilities: 2 medium severity
├─ License Issues: None detected
└─ Outdated Packages: 5 requiring updates

Code Security:
├─ Input Validation: Partially implemented
├─ XSS Protection: React defaults (good)
├─ CSRF Protection: Token-based ✓
└─ Secret Management: Needs improvement

Recommendations:
- Update vulnerable dependencies
- Implement input sanitization
- Add rate limiting
- Review environment variable usage
```

## Integration Points

### With Other Commands
```bash
# Generate context for workflow orchestrator
@context-analyzer ai-context --export-for workflow-orchestrator

# Feed analysis to quality assessor
@context-analyzer quality --pipe-to quality-assessor

# Use with dependency mapper
@context-analyzer dependencies --format json | @dependency-mapper --input -
```

### With External Tools
```bash
# Export for SonarQube
@context-analyzer quality --format sonar --output sonar-analysis.json

# Export for GitHub
@context-analyzer overview --format github --output .github/PROJECT_STATUS.md

# Export for Confluence
@context-analyzer documentation --format confluence --output confluence-export.xml
```

## Continuous Analysis

### Scheduled Analysis
```json
{
  "scheduled_analysis": {
    "daily": ["status", "dependencies"],
    "weekly": ["quality", "structure"],
    "monthly": ["overview", "debt"]
  }
}
```

### Git Hook Integration
```bash
# Pre-commit analysis
@context-analyzer changes --staged-only --fail-on-issues

# Post-merge analysis
@context-analyzer impact --merge-commit HEAD~1..HEAD
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Analyze Code Context
  run: @context-analyzer quality --format json --output analysis.json
  
- name: Upload Analysis Results
  uses: actions/upload-artifact@v2
  with:
    name: code-analysis
    path: analysis.json
```

## Advanced Features

### AI-Powered Insights
- **Pattern Recognition**: Identifies emerging patterns in the codebase
- **Anomaly Detection**: Spots unusual code patterns or structures
- **Trend Analysis**: Tracks quality and complexity trends over time
- **Smart Suggestions**: Context-aware improvement recommendations

### Interactive Mode
```
@context-analyzer interactive
```
Provides an interactive analysis session:
- Ask questions about the codebase
- Drill down into specific areas
- Generate custom reports
- Export findings in various formats

### Collaborative Analysis
```
@context-analyzer collaborate --share-with team
```
Enables team-wide analysis sharing:
- Share analysis results with team members
- Collaborative annotation of findings
- Team-wide quality metrics
- Centralized recommendation tracking

## Best Practices

### Regular Analysis Schedule
1. **Daily**: Quick status and dependency checks
2. **Weekly**: Comprehensive quality analysis
3. **Monthly**: Full architectural review
4. **Release**: Complete technical debt assessment

### Acting on Analysis Results
1. **Prioritize**: Focus on high-impact issues first
2. **Track**: Monitor improvements over time
3. **Share**: Discuss findings with the team
4. **Automate**: Fix recurring issues automatically
5. **Learn**: Use insights to improve development practices