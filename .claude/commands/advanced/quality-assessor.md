# Quality Assessor Command

## Purpose
Comprehensively evaluate code quality, enforce standards, and provide actionable recommendations for maintaining high-quality software development practices.

## Usage
```
@quality-assessor [assessment-type] [options]
```

## Assessment Types

### 1. Code Quality Assessment
```
@quality-assessor code [--strict] [--path src/]
```
Evaluates code quality metrics:
- Cyclomatic complexity
- Code duplication
- Maintainability index
- Readability score
- Style consistency

### 2. Test Quality Assessment
```
@quality-assessor tests [--coverage-threshold 80]
```
Analyzes test quality and coverage:
- Test coverage metrics
- Test quality indicators
- Mock usage patterns
- Test maintainability
- Performance test coverage

### 3. Architecture Quality Assessment
```
@quality-assessor architecture [--pattern-analysis]
```
Evaluates architectural quality:
- Design pattern adherence
- SOLID principles compliance
- Separation of concerns
- Coupling and cohesion metrics
- Architectural debt

### 4. Security Assessment
```
@quality-assessor security [--include-dependencies]
```
Security-focused quality analysis:
- Vulnerability scanning
- Security best practices
- Input validation coverage
- Authentication/authorization patterns
- Secure coding practices

### 5. Performance Assessment
```
@quality-assessor performance [--profile-build]
```
Performance quality evaluation:
- Bundle size analysis
- Render performance
- Memory usage patterns
- Network optimization
- Loading performance

### 6. Documentation Assessment
```
@quality-assessor documentation [--api-docs]
```
Documentation quality review:
- Code documentation coverage
- API documentation completeness
- README and setup guides
- Inline comment quality
- Documentation maintenance

## Quality Scoring System

### Overall Quality Score
```
Project Quality Assessment
══════════════════════════════════════════════

🏆 Overall Quality Score: 87/100 (EXCELLENT)

📊 Category Breakdown:
├─ Code Quality: 89/100 (🟢 Excellent)
├─ Test Quality: 92/100 (🟢 Outstanding)
├─ Architecture: 85/100 (🟢 Very Good)
├─ Security: 78/100 (🟡 Good)
├─ Performance: 90/100 (🟢 Excellent)
└─ Documentation: 84/100 (🟢 Very Good)

🎯 Quality Gates Status:
├─ Code Standards: ✅ PASSED
├─ Test Coverage: ✅ PASSED (89% > 80% target)
├─ Security Scan: ⚠️ WARNING (2 medium issues)
├─ Performance: ✅ PASSED
└─ Documentation: ✅ PASSED

📈 Trend Analysis (30 days):
├─ Quality Score: +3 points (improving)
├─ Test Coverage: +5% (significant improvement)
├─ Security Issues: -1 (resolved critical issue)
└─ Performance Score: +2 points (optimizations)
```

### Detailed Code Quality Report
```
Code Quality Analysis
══════════════════════════════════════════════

📊 Metrics Summary:
├─ Lines of Code: 12,847
├─ Cyclomatic Complexity: 2.3 avg (🟢 target: <5)
├─ Maintainability Index: 78 (🟢 target: >60)
├─ Technical Debt Ratio: 0.8% (🟢 target: <5%)
└─ Code Duplication: 2.1% (🟢 target: <3%)

🔍 File-Level Analysis:
High Quality Files (>90 score):
├─ utils/dateHelpers.ts (96/100)
├─ components/Button.tsx (94/100)
├─ hooks/useAuth.ts (92/100)
└─ services/APIClient.ts (91/100)

Files Needing Attention (<70 score):
├─ components/Dashboard.tsx (68/100)
│   ├─ Issue: High complexity (CC: 12)
│   ├─ Issue: Large file size (456 lines)
│   └─ Suggestion: Split into smaller components
├─ utils/dataProcessor.ts (65/100)
│   ├─ Issue: Code duplication (15%)
│   ├─ Issue: Poor test coverage (45%)
│   └─ Suggestion: Refactor common logic
└─ services/PaymentService.ts (62/100)
    ├─ Issue: High coupling (8 dependencies)
    ├─ Issue: Complex error handling
    └─ Suggestion: Apply dependency injection

🎯 Quality Improvement Opportunities:
├─ Reduce complexity in 3 functions
├─ Extract 2 utility functions
├─ Add error boundaries to 4 components
├─ Improve type safety in 6 files
└─ Add JSDoc comments to 12 functions
```

## Detailed Assessments

### Test Quality Deep Dive
```
@quality-assessor tests --detailed --include-e2e
```

```
Test Quality Assessment
══════════════════════════════════════════════

📊 Coverage Summary:
├─ Overall Coverage: 89.3% (🟢 target: 80%)
├─ Statement Coverage: 91.2%
├─ Branch Coverage: 87.8%
├─ Function Coverage: 92.1%
└─ Line Coverage: 89.3%

🧪 Test Distribution:
├─ Unit Tests: 247 tests (85% of total)
├─ Integration Tests: 34 tests (12% of total)
├─ E2E Tests: 12 tests (3% of total)
└─ Performance Tests: 3 tests (<1% of total)

🔍 Test Quality Metrics:
├─ Test Maintainability: 84/100
├─ Test Readability: 88/100
├─ Mock Usage Quality: 76/100
├─ Assertion Quality: 91/100
└─ Test Organization: 85/100

⚠️ Areas for Improvement:
├─ Low coverage components:
│   ├─ PaymentForm.tsx (67% coverage)
│   ├─ FileUploader.tsx (72% coverage)
│   └─ ChartRenderer.tsx (74% coverage)
├─ Missing edge case tests:
│   ├─ Error handling in UserService
│   ├─ Network failures in APIClient
│   └─ Validation edge cases in forms
├─ Flaky tests detected:
│   ├─ UserProfile integration test (3 failures/50 runs)
│   └─ Dashboard E2E test (timeout issues)

💡 Recommendations:
├─ Add property-based testing for validation
├─ Implement visual regression testing
├─ Improve mock stability and realism
├─ Add performance regression tests
└─ Create test data factories
```

### Security Assessment Report
```
@quality-assessor security --comprehensive
```

```
Security Quality Assessment
══════════════════════════════════════════════

🛡️ Security Score: 78/100 (GOOD)

🔍 Vulnerability Scan Results:
├─ Critical: 0 issues (🟢)
├─ High: 0 issues (🟢)
├─ Medium: 2 issues (🟡)
├─ Low: 5 issues (🟡)
└─ Info: 8 notices (ℹ️)

📊 Security Practices Evaluation:
├─ Input Validation: 85% coverage (🟢)
├─ Output Encoding: 92% coverage (🟢)
├─ Authentication: Strong implementation (🟢)
├─ Authorization: Good patterns (🟢)
├─ Error Handling: Needs improvement (🟡)
└─ Logging & Monitoring: Basic implementation (🟡)

⚠️ Medium Severity Issues:
├─ Dependency vulnerability in lodash@4.17.20
│   ├─ CVE-2021-23337: Command injection
│   ├─ Fix: Update to lodash@4.17.21
│   └─ Impact: Prototype pollution risk
└─ Missing rate limiting on API endpoints
    ├─ Endpoints: /api/upload, /api/search
    ├─ Risk: DoS attacks possible
    └─ Fix: Implement express-rate-limit

🔒 Security Best Practices Check:
├─ HTTPS enforcement: ✅ Implemented
├─ CSP headers: ✅ Configured
├─ XSS protection: ✅ React defaults + validation
├─ CSRF protection: ✅ Token-based
├─ SQL injection: ✅ Parameterized queries
├─ Secret management: ⚠️ Environment variables exposed
├─ Password hashing: ✅ bcrypt with salt
└─ Session management: ✅ Secure cookies

💡 Security Improvements:
├─ Implement Content Security Policy headers
├─ Add input sanitization middleware
├─ Enable security logging for audit trails
├─ Add API rate limiting and throttling
├─ Implement secret scanning in CI/CD
└─ Add security headers middleware
```

### Performance Assessment
```
@quality-assessor performance --bundle-analysis --lighthouse
```

```
Performance Quality Assessment
══════════════════════════════════════════════

⚡ Performance Score: 90/100 (EXCELLENT)

📊 Bundle Analysis:
├─ Total Bundle Size: 2.1MB (🟢 target: <3MB)
├─ Initial Load: 345KB (🟢 target: <500KB)
├─ Vendor Bundle: 1.2MB (🟢 optimized)
├─ App Bundle: 567KB (🟢 code-split)
└─ Assets: 234KB (🟢 compressed)

🚀 Runtime Performance:
├─ First Contentful Paint: 1.2s (🟢 target: <1.5s)
├─ Largest Contentful Paint: 2.1s (🟢 target: <2.5s)
├─ Time to Interactive: 2.8s (🟢 target: <3s)
├─ Cumulative Layout Shift: 0.05 (🟢 target: <0.1)
└─ First Input Delay: 45ms (🟢 target: <100ms)

💾 Memory Usage:
├─ Initial Memory: 23MB (🟢 acceptable)
├─ Peak Memory: 67MB (🟢 within limits)
├─ Memory Leaks: None detected (🟢)
└─ Garbage Collection: Efficient (🟢)

🔍 Optimization Opportunities:
├─ Image optimization: 67KB savings possible
│   ├─ Convert to WebP format
│   ├─ Implement responsive images
│   └─ Add lazy loading for below-fold images
├─ Code splitting: 123KB additional savings
│   ├─ Split admin routes
│   ├─ Lazy load charts library
│   └─ Dynamic import heavy utilities
├─ Caching improvements:
│   ├─ Add service worker for static assets
│   ├─ Implement API response caching
│   └─ Use browser caching headers

📱 Mobile Performance:
├─ Mobile Score: 87/100 (🟢 very good)
├─ Touch Response: 16ms avg (🟢 responsive)
├─ Viewport Optimization: ✅ Implemented
└─ Touch Target Size: ✅ Adequate
```

## Quality Gates Configuration

### Custom Quality Gates
Create `.claude/quality-gates.json`:

```json
{
  "quality_gates": {
    "code_quality": {
      "enabled": true,
      "thresholds": {
        "complexity_max": 10,
        "duplication_max": 3,
        "maintainability_min": 60,
        "file_size_max": 300
      },
      "fail_on_violation": true
    },
    "test_quality": {
      "enabled": true,
      "thresholds": {
        "coverage_min": 80,
        "branch_coverage_min": 75,
        "test_quality_min": 70
      },
      "fail_on_violation": false,
      "warnings_only": false
    },
    "security": {
      "enabled": true,
      "thresholds": {
        "critical_max": 0,
        "high_max": 0,
        "medium_max": 3
      },
      "fail_on_violation": true,
      "block_on_critical": true
    },
    "performance": {
      "enabled": true,
      "thresholds": {
        "bundle_size_max": "3MB",
        "initial_load_max": "500KB",
        "lighthouse_min": 85
      },
      "fail_on_violation": false
    }
  },
  "enforcement": {
    "pre_commit": ["code_quality", "security"],
    "pre_merge": ["test_quality", "security"],
    "pre_deploy": ["all"]
  }
}
```

### Project-Specific Standards
Create `.claude/quality-standards.json`:

```json
{
  "coding_standards": {
    "naming_conventions": {
      "components": "PascalCase",
      "functions": "camelCase",
      "constants": "SCREAMING_SNAKE_CASE",
      "files": "kebab-case"
    },
    "file_organization": {
      "max_file_size": 250,
      "max_function_size": 30,
      "max_class_size": 300,
      "imports_organization": "grouped_and_sorted"
    },
    "documentation_requirements": {
      "public_functions": "required",
      "complex_logic": "required",
      "api_endpoints": "required",
      "components": "recommended"
    },
    "testing_requirements": {
      "unit_tests": "required",
      "integration_tests": "recommended",
      "e2e_tests": "critical_paths_only",
      "test_naming": "descriptive"
    }
  }
}
```

## Integration and Automation

### CI/CD Pipeline Integration
```yaml
# .github/workflows/quality-check.yml
name: Quality Assessment

on: [push, pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run Quality Assessment
        run: |
          @quality-assessor code --strict --output quality-report.json
          @quality-assessor tests --coverage-threshold 80
          @quality-assessor security --fail-on-medium
          @quality-assessor performance --lighthouse --budget performance-budget.json
        
      - name: Quality Gate Check
        run: |
          @quality-assessor validate-gates --config .claude/quality-gates.json
        
      - name: Upload Quality Reports
        uses: actions/upload-artifact@v2
        with:
          name: quality-reports
          path: |
            quality-report.json
            coverage-report.html
            security-report.json
            performance-report.json
```

### Pre-commit Hook Integration
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Running quality assessment..."

# Quick quality check on staged files
@quality-assessor code --staged-only --fail-fast

if [ $? -ne 0 ]; then
    echo "❌ Quality assessment failed. Please fix issues before committing."
    exit 1
fi

echo "✅ Quality assessment passed."
```

### IDE Integration
```json
{
  "vscode_settings": {
    "quality_assessor.auto_run": true,
    "quality_assessor.show_inline_warnings": true,
    "quality_assessor.fail_on_save": false,
    "quality_assessor.report_format": "overlay"
  },
  "eslint_integration": {
    "extend_with_quality_rules": true,
    "sync_quality_standards": true
  }
}
```

## Continuous Quality Monitoring

### Quality Dashboard
```
Quality Dashboard - Last 30 Days
════════════════════════════════════════════════

📈 Quality Trends:
├─ Overall Score: 87 → 89 (+2.3%) 📈
├─ Code Quality: 85 → 89 (+4.7%) 📈  
├─ Test Coverage: 78% → 89% (+11%) 📈
├─ Security Score: 82 → 78 (-4.9%) 📉
└─ Performance: 88 → 90 (+2.3%) 📈

🎯 Quality Goals Progress:
├─ Test Coverage 90%: 89% (99% complete) ▓▓▓▓▓▓▓▓▓░
├─ Zero Critical Issues: ✅ Achieved
├─ Performance Score 85%: 90% ✅ Exceeded
└─ Documentation 80%: 84% ✅ Achieved

⚠️ Quality Alerts:
├─ New security vulnerability in dependencies
├─ Test coverage dropped in payment module
└─ Performance regression in dashboard loading

🏆 Quality Achievements:
├─ 15 days without critical issues
├─ Test coverage increased 11% this month
├─ Performance improved 50ms average load time
└─ Zero code duplication violations
```

### Automated Quality Reports
```json
{
  "reporting_schedule": {
    "daily": {
      "recipients": ["dev-team"],
      "content": ["quality_summary", "new_issues"],
      "format": "slack_notification"
    },
    "weekly": {
      "recipients": ["tech-leads", "product-manager"],
      "content": ["full_assessment", "trends", "recommendations"],
      "format": "html_email"
    },
    "monthly": {
      "recipients": ["engineering-manager", "stakeholders"],
      "content": ["executive_summary", "quality_roadmap"],
      "format": "pdf_report"
    }
  }
}
```

## Best Practices

### Quality-Driven Development
1. **Quality First**: Consider quality from the beginning of development
2. **Continuous Assessment**: Run quality checks frequently, not just before releases
3. **Team Standards**: Establish and enforce consistent quality standards
4. **Incremental Improvement**: Focus on gradual, consistent quality improvements
5. **Tool Integration**: Integrate quality tools into the development workflow

### Quality Improvement Strategies
1. **Identify Patterns**: Look for recurring quality issues
2. **Root Cause Analysis**: Understand why quality issues occur
3. **Preventive Measures**: Implement processes to prevent quality issues
4. **Training and Education**: Help team members understand quality practices
5. **Measurement and Feedback**: Track quality metrics and provide feedback

### Quality Culture
1. **Shared Responsibility**: Everyone is responsible for quality
2. **Quality Advocacy**: Promote quality best practices
3. **Learning Environment**: Treat quality issues as learning opportunities
4. **Continuous Improvement**: Always look for ways to improve quality
5. **Quality Celebration**: Recognize and celebrate quality achievements