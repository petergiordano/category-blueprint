# AI Development Cycle Template - Standalone Test Plan

**Purpose**: Validate the template works correctly when moved to its own VS Code project and used to set up new projects.

**Assumption**: The template directory has been moved to a standalone location outside the original vsmonster project for independent testing.

## 🎯 Test Objectives

This test plan validates that:
1. Template works as a standalone VS Code project
2. Initialization script successfully sets up new projects
3. All AI tools integrate correctly
4. Development workflow functions end-to-end
5. Documentation is clear and complete

## 📋 Test Environment Setup

### Prerequisites
- VS Code with Claude Code extension installed
- Python 3.8+ for validation scripts
- Git for version control
- Access to Claude AI account

### Test Structure
```
test-environment/
├── ai-dev-cycle-template/          # Template repo (moved from vsmonster)
├── test-projects/
│   ├── data-processor-test/        # Test project 1: Data processing
│   ├── content-generator-test/     # Test project 2: Content generation
│   └── api-integration-test/       # Test project 3: API integration
└── test-results/
    ├── test-logs/                  # Detailed test execution logs
    └── validation-reports/         # Validation results
```

## 🧪 Test Phases

### Phase T1: Template Isolation Test

**Objective**: Verify template works independently outside original project.

#### T1.1: Template Repository Setup
```bash
# 1. Move template to standalone location
mv /path/to/vsmonster/ai-dev-cycle-template ./ai-dev-cycle-template
cd ai-dev-cycle-template

# 2. Initialize as new git repository
rm -rf .git  # Remove original git history
git init
git add .
git commit -m "Initial commit: AI Development Cycle Template v1.0"

# 3. Set up remote repository (optional)
# git remote add origin [your-template-repo-url]
# git push -u origin main
```

#### T1.2: Template Integrity Validation
```bash
# Validate template file structure
python scripts/validate-setup.py

# Expected result: All template files present and valid
# Success criteria: No missing files or structure errors
```

#### T1.3: VS Code Integration Test
```bash
# Open template in VS Code
code .

# Test Claude Code integration
# 1. Install Claude Code extension if not present
# 2. Verify extension loads without errors
# 3. Check for any missing dependencies or configuration issues
```

**Success Criteria:**
- [ ] Template directory works independently
- [ ] All files are present and readable
- [ ] VS Code opens without errors
- [ ] Validation script passes
- [ ] No broken file references or dependencies

---

### Phase T2: Template Application Test

**Objective**: Test template initialization on new projects.

#### T2.1: Data Processing Project Test
```bash
# Create test project directory
mkdir -p test-projects/data-processor-test
cd test-projects/data-processor-test

# Copy template files
cp -r ../../ai-dev-cycle-template/* .
cp -r ../../ai-dev-cycle-template/.* . 2>/dev/null || true

# Run initialization script
./scripts/initialize-project.sh
# Test inputs:
# Project name: Data Processing Pipeline
# Description: Automated data processing and analysis system
# Language: python
# Components: 5
```

#### T2.2: Content Generation Project Test
```bash
# Create test project directory
mkdir -p test-projects/content-generator-test
cd test-projects/content-generator-test

# Copy template files
cp -r ../../ai-dev-cycle-template/* .
cp -r ../../ai-dev-cycle-template/.* . 2>/dev/null || true

# Run initialization script
./scripts/initialize-project.sh
# Test inputs:
# Project name: Content Generation System
# Description: AI-powered content creation and optimization
# Language: javascript
# Components: 6
```

#### T2.3: API Integration Project Test
```bash
# Create test project directory
mkdir -p test-projects/api-integration-test
cd test-projects/api-integration-test

# Copy template files
cp -r ../../ai-dev-cycle-template/* .
cp -r ../../ai-dev-cycle-template/.* . 2>/dev/null || true

# Run initialization script
./scripts/initialize-project.sh
# Test inputs:
# Project name: API Integration Hub
# Description: Multi-service API integration and data synchronization
# Language: go
# Components: 4
```

#### T2.4: Post-Initialization Validation
For each test project:
```bash
# Validate setup completion
python scripts/validate-setup.py

# Check file customization
grep -r "\[CUSTOMIZE" docs/ || echo "No uncustomized placeholders found"
grep -r "\[PROJECT NAME\]" . || echo "No template placeholders found"

# Verify language-specific setup
# Python: Check for requirements.txt, pyproject.toml
# JavaScript: Check for package.json
# Go: Check for go.mod
```

**Success Criteria:**
- [ ] Initialization script completes without errors
- [ ] All template placeholders are replaced with project-specific content
- [ ] Language-specific files are created correctly
- [ ] Validation script passes for all test projects
- [ ] Git repository is properly initialized
- [ ] README.md reflects project-specific information

---

### Phase T3: Development Cycle Test

**Objective**: Validate complete AI-assisted development workflow.

#### T3.1: Claude Code Integration Test
For each test project:
```bash
# Open in VS Code
code .

# Test Claude Code commands:
# 1. @orient - Should show project status and next steps
# 2. Should correctly identify project as newly initialized
# 3. Should provide relevant next actions for the project type
```

#### T3.2: PRD Customization Test
```bash
# Test PRD customization workflow
# 1. Open docs/specifications/PRD.md
# 2. Verify project-specific content is present
# 3. Verify component pipeline is appropriate for domain
# 4. Test @update-prd command functionality
```

#### T3.3: Component Development Test
Select one test project for full workflow validation:
```bash
# Use data-processor-test for full workflow
cd test-projects/data-processor-test

# 1. Use @next-task to select first component
# 2. Create simple feature specification
# 3. Implement basic component structure
# 4. Write basic tests
# 5. Use @finalize-task to complete workflow
```

#### T3.4: AI Coordination Test
```bash
# Test AI context loading
# 1. Verify .aicontext/context.md loads correctly
# 2. Test persona.md integration
# 3. Verify workflow guides are accessible
# 4. Test command functionality and help text
```

**Success Criteria:**
- [ ] Claude Code extension works with all test projects
- [ ] @orient command provides relevant project status
- [ ] @next-task suggests appropriate first component
- [ ] PRD reflects project-specific information
- [ ] AI context loads correctly
- [ ] Commands execute without errors

---

### Phase T4: Template Finalization

**Objective**: Finalize template based on test results and prepare for distribution.

#### T4.1: Test Results Analysis
```bash
# Create test results summary
cd test-results

# Document any issues found
cat > test-summary.md << EOF
# Template Test Results Summary

## Test Environment
- Date: $(date)
- Tester: [Name]
- Platform: $(uname -a)

## Test Results
### Phase T1: Template Isolation
- [x] Template works independently
- [x] File integrity validated
- [x] VS Code integration successful

### Phase T2: Template Application
- [x] Data processing project setup
- [x] Content generation project setup  
- [x] API integration project setup
- [x] All validations passed

### Phase T3: Development Cycle
- [x] Claude Code integration working
- [x] AI commands functional
- [x] Workflow completes successfully

## Issues Found
[List any issues encountered]

## Recommendations
[Any improvements for template]
EOF
```

#### T4.2: Template Improvements
Based on test results, make any necessary improvements:
```bash
# Return to template directory
cd ../../ai-dev-cycle-template

# Apply any fixes or improvements discovered during testing
# Examples:
# - Fix file path references
# - Improve initialization script prompts
# - Update documentation for clarity
# - Add missing error handling
```

#### T4.3: Final Validation
```bash
# Run complete validation on improved template
python scripts/validate-setup.py

# Test with one more fresh project to verify improvements
mkdir -p ../final-test-project
cd ../final-test-project
cp -r ../ai-dev-cycle-template/* .
cp -r ../ai-dev-cycle-template/.* . 2>/dev/null || true
./scripts/initialize-project.sh
python scripts/validate-setup.py
```

#### T4.4: Documentation Updates
```bash
# Update README.md with any new findings
# Update TEMPLATE_SETUP.md with clarifications
# Update TEST_PLAN.md with lessons learned
# Create CHANGELOG.md if significant changes were made
```

**Success Criteria:**
- [ ] All test phases completed successfully
- [ ] Issues documented and addressed
- [ ] Template validated with fresh test project
- [ ] Documentation updated with findings
- [ ] Template ready for distribution

---

## 📊 Test Execution Checklist

### Pre-Test Setup
- [ ] VS Code with Claude Code extension installed
- [ ] Python 3.8+ available
- [ ] Git configured and working
- [ ] Clean test environment prepared
- [ ] Template moved to standalone location

### Phase T1: Template Isolation
- [ ] Template repository setup completed
- [ ] Template integrity validation passed
- [ ] VS Code integration tested
- [ ] No critical issues found

### Phase T2: Template Application  
- [ ] Data processing project initialized successfully
- [ ] Content generation project initialized successfully
- [ ] API integration project initialized successfully
- [ ] All post-initialization validations passed

### Phase T3: Development Cycle
- [ ] Claude Code integration working in all test projects
- [ ] AI commands functional and providing relevant output
- [ ] PRD customization working correctly
- [ ] Basic component development workflow tested

### Phase T4: Template Finalization
- [ ] Test results documented
- [ ] Template improvements implemented
- [ ] Final validation completed
- [ ] Documentation updated

## 🚨 Troubleshooting

### Common Test Issues

#### "Permission denied" errors during initialization
```bash
# Fix script permissions
chmod +x scripts/initialize-project.sh
chmod +x scripts/validate-setup.py
```

#### "Template placeholders not replaced"
```bash
# Check initialization script logic
# Verify sed commands work on your platform
# Test with simple project name (no special characters)
```

#### "Claude Code commands not working"
```bash
# Verify extension installation
# Check .claude/settings.json file exists
# Verify file paths in configuration
# Test with simple @orient command first
```

#### "Validation script fails"
```bash
# Run with verbose output
python scripts/validate-setup.py --verbose

# Check specific error messages
# Verify all required files exist
# Check file permissions and readability
```

### Recovery Procedures

#### Reset Test Environment
```bash
# Clean all test projects
rm -rf test-projects/*

# Reset template to clean state
cd ai-dev-cycle-template
git reset --hard HEAD
git clean -fd
```

#### Start Fresh
```bash
# If template is corrupted, re-copy from original
# Reset all test directories
# Restart from Phase T1
```

## 📈 Success Metrics

### Quantitative Metrics
- [ ] 100% of test phases completed successfully
- [ ] All validation scripts pass without errors
- [ ] AI commands work in 100% of test projects
- [ ] Template initialization succeeds for all 3 project types

### Qualitative Metrics
- [ ] Setup process is intuitive and well-documented
- [ ] AI integration feels seamless and helpful
- [ ] Template provides clear value over manual setup
- [ ] Documentation is comprehensive and accurate

### Performance Metrics
- [ ] Initialization completes in under 5 minutes
- [ ] Validation runs in under 30 seconds
- [ ] AI commands respond within reasonable time
- [ ] No memory or resource issues during testing

---

## 📝 Test Report Template

```markdown
# AI Development Cycle Template - Test Execution Report

**Date**: [Test Date]
**Tester**: [Your Name]
**Template Version**: [Version/Commit Hash]
**Environment**: [OS, VS Code version, etc.]

## Executive Summary
[Brief overview of test results]

## Test Results by Phase

### Phase T1: Template Isolation
- **Status**: ✅ PASS / ❌ FAIL
- **Issues**: [Any issues found]
- **Notes**: [Additional observations]

### Phase T2: Template Application
- **Status**: ✅ PASS / ❌ FAIL
- **Projects Tested**: [List of test projects]
- **Issues**: [Any issues found]
- **Notes**: [Additional observations]

### Phase T3: Development Cycle
- **Status**: ✅ PASS / ❌ FAIL
- **AI Integration**: [Working/Not Working]
- **Issues**: [Any issues found]
- **Notes**: [Additional observations]

### Phase T4: Template Finalization
- **Status**: ✅ PASS / ❌ FAIL
- **Improvements Made**: [List improvements]
- **Final Validation**: [Pass/Fail]

## Overall Assessment
- **Template Quality**: [Excellent/Good/Needs Improvement]
- **Documentation Quality**: [Excellent/Good/Needs Improvement]
- **Ease of Use**: [Excellent/Good/Needs Improvement]
- **AI Integration**: [Excellent/Good/Needs Improvement]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

## Conclusion
[Final assessment and readiness for release]
```

---

**This test plan ensures the AI Development Cycle Template works reliably as a standalone tool for setting up AI-powered development workflows in any VS Code project.**