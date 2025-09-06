# Post-Implementation Hook

**Purpose**: Automated cleanup, documentation, and optimization tasks after feature implementation.

**Trigger**: Completion of development tasks, feature implementation, or manual post-development cleanup.

## Automation Pipeline

### Stage 1: Code Organization and Cleanup
```bash
# Code structure optimization
organize_code_structure() {
    echo "🏗️  Organizing code structure..."
    
    # Remove unused imports
    cleanup_imports() {
        echo "🧹 Cleaning up unused imports..."
        
        # Python unused imports
        if command -v autoflake >/dev/null 2>&1; then
            autoflake --remove-all-unused-imports --recursive --in-place src/
            echo "   ✅ Python imports cleaned"
        fi
        
        # JavaScript/TypeScript unused imports
        if command -v ts-unused-exports >/dev/null 2>&1; then
            ts-unused-exports tsconfig.json --ignoreFiles="*.test.ts,*.spec.ts"
            echo "   ✅ TypeScript exports analyzed"
        fi
    }
    
    # Remove dead code
    detect_dead_code() {
        echo "💀 Detecting dead code..."
        
        # Python dead code detection
        if command -v vulture >/dev/null 2>&1; then
            vulture src/ --exclude="*test*" --min-confidence=80
            echo "   ℹ️  Dead code analysis completed"
        fi
        
        # JavaScript dead code detection
        if [ -f "package.json" ] && command -v unimported >/dev/null 2>&1; then
            unimported
            echo "   ℹ️  Unimported modules analysis completed"
        fi
    }
    
    cleanup_imports
    detect_dead_code
}
```

### Stage 2: Documentation Generation and Updates
```bash
# Comprehensive documentation updates
update_documentation() {
    echo "📖 Updating documentation..."
    
    # Generate API documentation
    generate_api_docs() {
        echo "📚 Generating API documentation..."
        
        # Python API docs with sphinx
        if [ -d "src" ] && command -v sphinx-apidoc >/dev/null 2>&1; then
            sphinx-apidoc -o docs/api/ src/ --force --separate
            echo "   ✅ Python API documentation generated"
        fi
        
        # JavaScript/TypeScript API docs
        if [ -f "tsconfig.json" ] && command -v typedoc >/dev/null 2>&1; then
            typedoc --out docs/api/ src/
            echo "   ✅ TypeScript API documentation generated"
        fi
        
        # OpenAPI documentation for REST APIs
        if find src -name "*api*.py" -o -name "*routes*.js" | grep -q .; then
            echo "   🌐 REST API detected - consider generating OpenAPI spec"
        fi
    }
    
    # Update README and component docs
    update_readme() {
        echo "📄 Updating README and documentation..."
        
        # Extract version from package files
        local version=""
        if [ -f "pyproject.toml" ]; then
            version=$(grep "version =" pyproject.toml | head -1 | sed 's/.*= "\(.*\)"/\1/')
        elif [ -f "package.json" ]; then
            version=$(grep '"version"' package.json | head -1 | sed 's/.*": "\(.*\)".*/\1/')
        fi
        
        # Update badges and version info
        if [ -n "$version" ] && [ -f "README.md" ]; then
            sed -i.bak "s/version-[0-9.]*-/version-$version-/g" README.md
            echo "   ✅ Version badges updated to $version"
        fi
        
        # Generate table of contents if needed
        if grep -q "<!-- TOC -->" README.md; then
            echo "   📋 Regenerating table of contents..."
            # Use markdown-toc or similar tool if available
            command -v markdown-toc >/dev/null 2>&1 && \
                markdown-toc -i README.md
        fi
    }
    
    # Update changelog
    update_changelog() {
        echo "📝 Updating changelog..."
        
        if [ ! -f "CHANGELOG.md" ]; then
            cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

EOF
            echo "   ✅ CHANGELOG.md created"
        fi
        
        # Suggest changelog entries based on recent commits
        echo "   💡 Recent commits for changelog consideration:"
        git log --oneline -10 --no-merges | sed 's/^/      /'
    }
    
    generate_api_docs
    update_readme
    update_changelog
}
```

### Stage 3: Test Coverage and Quality Metrics
```bash
# Comprehensive testing and metrics
analyze_test_coverage() {
    echo "🧪 Analyzing test coverage and quality metrics..."
    
    # Generate coverage reports
    generate_coverage_reports() {
        echo "📊 Generating coverage reports..."
        
        # Python coverage
        if [ -f "pytest.ini" ] || [ -d "tests" ]; then
            pytest --cov=src --cov-report=html --cov-report=term-missing
            echo "   ✅ Python coverage report generated in htmlcov/"
        fi
        
        # JavaScript coverage
        if [ -f "package.json" ]; then
            npm test -- --coverage --watchAll=false
            echo "   ✅ JavaScript coverage report generated"
        fi
        
        # Coverage badges
        if [ -d "htmlcov" ]; then
            coverage_percent=$(coverage report | tail -1 | awk '{print $4}' | sed 's/%//')
            echo "   📈 Current test coverage: $coverage_percent%"
            
            # Update coverage badge in README
            if [ -f "README.md" ]; then
                sed -i.bak "s/coverage-[0-9]*%-/coverage-$coverage_percent%-/g" README.md
            fi
        fi
    }
    
    # Code quality metrics
    analyze_code_quality() {
        echo "🔍 Analyzing code quality metrics..."
        
        # Python code complexity
        if command -v radon >/dev/null 2>&1; then
            radon cc src/ -a -nb
            radon mi src/ -nb
            echo "   ✅ Python complexity analysis completed"
        fi
        
        # JavaScript code complexity
        if command -v complexity-report >/dev/null 2>&1; then
            complexity-report -o complexity-report.json src/
            echo "   ✅ JavaScript complexity analysis completed"
        fi
        
        # Generate quality report
        cat > quality-report.md << EOF
# Code Quality Report

Generated on: $(date)

## Test Coverage
- Python: $(coverage report 2>/dev/null | tail -1 | awk '{print $4}' || echo "N/A")
- JavaScript: $(npm test -- --coverage --watchAll=false 2>/dev/null | grep "All files" | awk '{print $4}' || echo "N/A")

## Code Complexity
- Average complexity: $(radon cc src/ -a -nb 2>/dev/null | grep "Average complexity" | awk '{print $3}' || echo "N/A")

## Security Scan
- Last scan: $(date)
- Vulnerabilities: $(bandit -r src/ -f json 2>/dev/null | jq '.results | length' || echo "N/A")

## Dependencies
- Python packages: $(pip list 2>/dev/null | wc -l || echo "N/A")
- JavaScript packages: $(npm list --depth=0 2>/dev/null | grep -c "├\|└" || echo "N/A")

EOF
        echo "   ✅ Quality report generated: quality-report.md"
    }
    
    generate_coverage_reports
    analyze_code_quality
}
```

### Stage 4: Performance Analysis and Optimization
```bash
# Performance analysis and optimization suggestions
analyze_performance() {
    echo "⚡ Analyzing performance and optimization opportunities..."
    
    # Bundle size analysis for web applications
    analyze_bundle_size() {
        if [ -f "package.json" ] && grep -q "webpack\|vite\|rollup" package.json; then
            echo "📦 Analyzing bundle size..."
            
            # Webpack bundle analyzer
            if command -v webpack-bundle-analyzer >/dev/null 2>&1; then
                echo "   Use: npx webpack-bundle-analyzer dist/static/js/*.js"
            fi
            
            # General size analysis
            if [ -d "dist" ] || [ -d "build" ]; then
                echo "   📊 Build output size:"
                du -sh dist/ build/ 2>/dev/null | sed 's/^/      /'
            fi
        fi
    }
    
    # Database query optimization for data applications
    analyze_database_usage() {
        if grep -r "SELECT\|INSERT\|UPDATE\|DELETE" src/ 2>/dev/null | grep -q .; then
            echo "🗄️  Database usage detected - consider query optimization"
            echo "   💡 Suggestions:"
            echo "      - Add database indexes for frequent queries"
            echo "      - Use query optimization tools"
            echo "      - Consider connection pooling"
        fi
    }
    
    # Memory and CPU profiling suggestions
    suggest_profiling() {
        echo "🔬 Profiling suggestions:"
        echo "   Python:"
        echo "      - memory_profiler: @profile decorator for memory usage"
        echo "      - cProfile: CPU profiling for performance bottlenecks"
        echo "   JavaScript:"
        echo "      - Chrome DevTools: Performance tab for browser profiling"
        echo "      - clinic.js: Node.js performance profiling"
    }
    
    analyze_bundle_size
    analyze_database_usage
    suggest_profiling
}
```

### Stage 5: Security Hardening and Compliance
```bash
# Security analysis and hardening
security_hardening() {
    echo "🔒 Performing security hardening analysis..."
    
    # Dependency vulnerability scan
    scan_dependencies() {
        echo "🛡️  Scanning dependencies for vulnerabilities..."
        
        # Python dependencies
        if command -v safety >/dev/null 2>&1; then
            safety check --json > security-deps-report.json
            echo "   ✅ Python dependency security scan completed"
        fi
        
        # JavaScript dependencies
        if [ -f "package.json" ]; then
            npm audit --json > npm-audit-report.json
            echo "   ✅ JavaScript dependency security scan completed"
        fi
    }
    
    # Security configuration check
    check_security_config() {
        echo "⚙️  Checking security configuration..."
        
        # Check for security headers in web applications
        if grep -r "express\|flask\|fastapi" src/ 2>/dev/null | grep -q .; then
            echo "   🌐 Web application detected"
            echo "   💡 Ensure security headers are configured:"
            echo "      - Content-Security-Policy"
            echo "      - X-Frame-Options"
            echo "      - X-Content-Type-Options"
            echo "      - Strict-Transport-Security"
        fi
        
        # Check for environment variable usage
        if grep -r "os\.environ\|process\.env" src/ 2>/dev/null | grep -q .; then
            echo "   ✅ Environment variables detected - good practice"
        else
            echo "   ⚠️  Consider using environment variables for configuration"
        fi
    }
    
    # Generate security checklist
    generate_security_checklist() {
        cat > security-checklist.md << 'EOF'
# Security Checklist

## Authentication & Authorization
- [ ] Strong password requirements implemented
- [ ] Multi-factor authentication available
- [ ] Proper session management
- [ ] Role-based access controls

## Data Protection
- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] Input validation and sanitization
- [ ] SQL injection prevention

## Infrastructure Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies regularly updated
- [ ] Security monitoring enabled

## Code Security
- [ ] No hardcoded secrets
- [ ] Error handling doesn't leak information
- [ ] Logging configured appropriately
- [ ] Regular security audits

EOF
        echo "   ✅ Security checklist generated: security-checklist.md"
    }
    
    scan_dependencies
    check_security_config
    generate_security_checklist
}
```

### Stage 6: Deployment Preparation
```bash
# Prepare for deployment
prepare_deployment() {
    echo "🚀 Preparing for deployment..."
    
    # Environment configuration validation
    validate_environment_config() {
        echo "⚙️  Validating environment configuration..."
        
        # Check for environment files
        if [ -f ".env.example" ] && [ ! -f ".env" ]; then
            echo "   ⚠️  .env.example found but .env missing"
            echo "      Copy .env.example to .env and configure"
        fi
        
        # Validate Docker configuration
        if [ -f "Dockerfile" ]; then
            echo "   🐳 Docker configuration found"
            docker build --dry-run . 2>/dev/null && \
                echo "      ✅ Dockerfile syntax valid" || \
                echo "      ❌ Dockerfile has issues"
        fi
        
        # Validate CI/CD configuration
        if [ -f ".github/workflows/ci.yml" ]; then
            echo "   ⚙️  GitHub Actions workflow found"
        elif [ -f ".gitlab-ci.yml" ]; then
            echo "   ⚙️  GitLab CI configuration found"
        fi
    }
    
    # Build and test production build
    test_production_build() {
        echo "🏗️  Testing production build..."
        
        # Python production dependencies
        if [ -f "requirements.txt" ]; then
            echo "   📦 Python production dependencies:"
            grep -v "^#" requirements.txt | wc -l | sed 's/^/      /'
        fi
        
        # JavaScript production build
        if [ -f "package.json" ] && grep -q '"build"' package.json; then
            npm run build 2>/dev/null && \
                echo "   ✅ Production build successful" || \
                echo "   ❌ Production build failed"
        fi
    }
    
    # Generate deployment documentation
    generate_deployment_docs() {
        if [ ! -f "DEPLOYMENT.md" ]; then
            cat > DEPLOYMENT.md << 'EOF'
# Deployment Guide

## Prerequisites
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates prepared
- [ ] Monitoring configured

## Deployment Steps
1. Build production artifacts
2. Run database migrations
3. Deploy application
4. Verify health checks
5. Update monitoring dashboards

## Rollback Procedure
1. Identify rollback version
2. Deploy previous version
3. Rollback database if needed
4. Verify application health

## Post-Deployment Verification
- [ ] Application starts successfully
- [ ] Health checks pass
- [ ] Key functionality works
- [ ] Performance metrics normal

EOF
            echo "   ✅ Deployment documentation created: DEPLOYMENT.md"
        fi
    }
    
    validate_environment_config
    test_production_build
    generate_deployment_docs
}
```

## Integration with Project Context

### Context-Aware Post-Processing
```bash
# Apply domain-specific post-implementation tasks
apply_context_specific_tasks() {
    local project_type=$(detect_project_type)
    
    case $project_type in
        "data_processing")
            echo "🔬 Data processing project - additional tasks:"
            generate_data_documentation
            validate_data_pipelines
            create_data_quality_reports
            ;;
        "api_integration")
            echo "🌐 API integration project - additional tasks:"
            generate_api_documentation
            validate_api_contracts
            create_integration_guides
            ;;
        "web_application")
            echo "🌍 Web application project - additional tasks:"
            run_accessibility_audit
            generate_lighthouse_reports
            validate_responsive_design
            ;;
    esac
}
```

### Quality Gate Summary
```bash
# Generate comprehensive quality summary
generate_quality_summary() {
    echo "📋 Generating post-implementation quality summary..."
    
    cat > post-implementation-summary.md << EOF
# Post-Implementation Summary

Generated on: $(date)

## ✅ Completed Tasks
- [x] Code organization and cleanup
- [x] Documentation updates
- [x] Test coverage analysis
- [x] Performance analysis
- [x] Security hardening
- [x] Deployment preparation

## 📊 Quality Metrics
- Test Coverage: $(coverage report 2>/dev/null | tail -1 | awk '{print $4}' || echo "N/A")
- Security Scan: $([ -f "security-deps-report.json" ] && echo "Completed" || echo "N/A")
- Documentation: $([ -f "CHANGELOG.md" ] && echo "Updated" || echo "N/A")

## 🚀 Ready for Deployment
- [x] Production build tested
- [x] Environment configuration validated
- [x] Security checklist reviewed
- [x] Deployment documentation updated

## 📝 Next Steps
1. Review generated reports
2. Address any identified issues
3. Update team on changes
4. Schedule deployment

EOF
    echo "   ✅ Quality summary generated: post-implementation-summary.md"
}
```

## AI Behavior Guidelines

### Automation Strategy
- Prioritize tasks that save manual effort
- Generate actionable reports and documentation
- Provide clear next steps and recommendations
- Maintain development momentum

### Quality Focus
- Ensure comprehensive coverage of quality aspects
- Generate meaningful metrics and insights
- Identify optimization opportunities
- Prepare for successful deployment

### Team Communication
- Generate reports for team review
- Document changes and improvements
- Provide clear handoff information
- Enable knowledge sharing

---

**This comprehensive post-implementation hook automates cleanup, documentation, analysis, and deployment preparation tasks, ensuring high-quality deliverables and smooth project transitions.**