# Security Scanner Hook Template

**Purpose**: Automated security vulnerability detection and prevention during development.

**Trigger**: File creation, modification, or save events for source code and configuration files.

## Security Scanning Strategy

### Multi-Layer Security Analysis

#### Static Code Analysis
```bash
# Comprehensive static security analysis
perform_static_security_analysis() {
    local file_path="$1"
    local file_ext="${file_path##*.}"
    
    echo "🔒 Performing static security analysis on: $file_path"
    
    case $file_ext in
        "py")
            scan_python_security "$file_path"
            ;;
        "js"|"ts"|"jsx"|"tsx")
            scan_javascript_security "$file_path"
            ;;
        "go")
            scan_go_security "$file_path"
            ;;
        "java")
            scan_java_security "$file_path"
            ;;
        "php")
            scan_php_security "$file_path"
            ;;
        "rb")
            scan_ruby_security "$file_path"
            ;;
        *)
            scan_generic_security "$file_path"
            ;;
    esac
}

# Python security scanning
scan_python_security() {
    local py_file="$1"
    
    echo "🐍 Scanning Python file for security vulnerabilities..."
    
    # Use bandit for Python security scanning
    if command -v bandit >/dev/null 2>&1; then
        echo "   🔍 Running bandit security scan..."
        bandit -r "$py_file" -f json -o "${py_file}.security.json" 2>/dev/null
        
        # Parse bandit results
        if [ -f "${py_file}.security.json" ]; then
            python << EOF
import json
import os

try:
    with open('${py_file}.security.json', 'r') as f:
        results = json.load(f)
    
    if results.get('results'):
        print("   ❌ Security vulnerabilities found:")
        for issue in results['results']:
            severity = issue.get('issue_severity', 'UNKNOWN')
            test_name = issue.get('test_name', 'Unknown Test')
            line_number = issue.get('line_number', 0)
            issue_text = issue.get('issue_text', 'No description')
            
            print(f"      [{severity}] Line {line_number}: {test_name}")
            print(f"         {issue_text}")
    else:
        print("   ✅ No security vulnerabilities detected")
        
    # Clean up temporary file
    os.remove('${py_file}.security.json')
    
except Exception as e:
    print(f"   ⚠️  Error processing bandit results: {e}")
EOF
        fi
    fi
    
    # Custom Python security patterns
    scan_python_custom_patterns "$py_file"
}

# Custom Python security pattern scanning
scan_python_custom_patterns() {
    local py_file="$1"
    
    echo "   🔍 Scanning for custom Python security patterns..."
    
    # SQL injection patterns
    if grep -n -E "(execute|query).*%.*s|f['\"].*SELECT.*{" "$py_file"; then
        echo "   ⚠️  Potential SQL injection vulnerability detected"
        echo "      Use parameterized queries instead of string formatting"
    fi
    
    # Hardcoded credentials
    if grep -n -E "(password|secret|token|key).*=.*['\"][^'\"]{8,}" "$py_file"; then
        echo "   ❌ Hardcoded credentials detected"
        echo "      Use environment variables or secure configuration"
    fi
    
    # Unsafe deserialization
    if grep -n -E "pickle\.loads?|yaml\.load[^s]|eval\(|exec\(" "$py_file"; then
        echo "   ⚠️  Potentially unsafe deserialization/execution detected"
        echo "      Review for security implications"
    fi
    
    # Insecure random number generation
    if grep -n -E "random\.random|random\.choice" "$py_file"; then
        echo "   ⚠️  Insecure random number generation detected"
        echo "      Use secrets module for cryptographic purposes"
    fi
    
    # Debug mode in production
    if grep -n -E "debug.*=.*True|DEBUG.*=.*True" "$py_file"; then
        echo "   ⚠️  Debug mode enabled - ensure disabled in production"
    fi
}

# JavaScript/TypeScript security scanning
scan_javascript_security() {
    local js_file="$1"
    
    echo "🟨 Scanning JavaScript/TypeScript file for security vulnerabilities..."
    
    # Use ESLint security plugin if available
    if command -v eslint >/dev/null 2>&1 && [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
        echo "   🔍 Running ESLint security scan..."
        eslint "$js_file" --format json > "${js_file}.eslint.json" 2>/dev/null
        
        # Parse ESLint results for security issues
        if [ -f "${js_file}.eslint.json" ]; then
            node << EOF
const fs = require('fs');

try {
    const results = JSON.parse(fs.readFileSync('${js_file}.eslint.json', 'utf8'));
    
    if (results[0] && results[0].messages) {
        const securityIssues = results[0].messages.filter(msg => 
            msg.ruleId && (
                msg.ruleId.includes('security') || 
                msg.ruleId.includes('xss') ||
                msg.ruleId.includes('injection')
            )
        );
        
        if (securityIssues.length > 0) {
            console.log('   ❌ Security issues found:');
            securityIssues.forEach(issue => {
                console.log(\`      Line \${issue.line}: \${issue.message}\`);
            });
        } else {
            console.log('   ✅ No security issues detected by ESLint');
        }
    }
    
    // Clean up temporary file
    fs.unlinkSync('${js_file}.eslint.json');
    
} catch (error) {
    console.log(\`   ⚠️  Error processing ESLint results: \${error.message}\`);
}
EOF
        fi
    fi
    
    # Custom JavaScript security patterns
    scan_javascript_custom_patterns "$js_file"
}

# Custom JavaScript security pattern scanning
scan_javascript_custom_patterns() {
    local js_file="$1"
    
    echo "   🔍 Scanning for custom JavaScript security patterns..."
    
    # XSS vulnerabilities
    if grep -n -E "innerHTML.*=|outerHTML.*=|document\.write\(" "$js_file"; then
        echo "   ⚠️  Potential XSS vulnerability detected"
        echo "      Use textContent or sanitize HTML input"
    fi
    
    # Dangerous functions
    if grep -n -E "eval\(|Function\(|setTimeout.*['\"]|setInterval.*['\"]" "$js_file"; then
        echo "   ⚠️  Dangerous function usage detected"
        echo "      Avoid eval() and string-based function execution"
    fi
    
    # Hardcoded secrets
    if grep -n -E "(api_key|password|secret|token).*[=:].*['\"][^'\"]{10,}" "$js_file"; then
        echo "   ❌ Hardcoded credentials detected"
        echo "      Use environment variables or secure configuration"
    fi
    
    # Insecure HTTP requests
    if grep -n -E "http://.*fetch|http://.*axios|http://.*request" "$js_file"; then
        echo "   ⚠️  Insecure HTTP requests detected"
        echo "      Use HTTPS for all external requests"
    fi
    
    # Local storage of sensitive data
    if grep -n -E "localStorage\.setItem.*password|localStorage\.setItem.*token|localStorage\.setItem.*key" "$js_file"; then
        echo "   ⚠️  Sensitive data stored in localStorage"
        echo "      Consider using secure storage alternatives"
    fi
    
    # CSRF vulnerabilities
    if grep -n -E "fetch.*POST|axios\.post" "$js_file" && ! grep -q "csrf\|xsrf" "$js_file"; then
        echo "   ⚠️  POST requests without CSRF protection"
        echo "      Ensure CSRF tokens are included"
    fi
}
```

#### Dependency Security Scanning
```bash
# Scan dependencies for known vulnerabilities
scan_dependency_security() {
    echo "📦 Scanning dependencies for security vulnerabilities..."
    
    # Python dependency scanning
    scan_python_dependencies() {
        if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "Pipfile" ]; then
            echo "🐍 Scanning Python dependencies..."
            
            # Use safety to check for known vulnerabilities
            if command -v safety >/dev/null 2>&1; then
                safety check --json > safety-report.json 2>/dev/null
                
                if [ -f "safety-report.json" ]; then
                    python << EOF
import json

try:
    with open('safety-report.json', 'r') as f:
        results = json.load(f)
    
    if results:
        print("   ❌ Vulnerable Python dependencies found:")
        for vuln in results:
            package = vuln.get('package', 'Unknown')
            installed = vuln.get('installed', 'Unknown')
            vulnerability = vuln.get('vulnerability', 'No description')
            
            print(f"      {package} ({installed}): {vulnerability}")
    else:
        print("   ✅ No vulnerable Python dependencies detected")
        
except Exception as e:
    print(f"   ⚠️  Error checking Python dependencies: {e}")
EOF
                    rm safety-report.json
                fi
            fi
            
            # Use pip-audit if available
            if command -v pip-audit >/dev/null 2>&1; then
                echo "   🔍 Running pip-audit scan..."
                pip-audit --format=json --output=pip-audit-report.json 2>/dev/null
                
                if [ -f "pip-audit-report.json" ]; then
                    python << EOF
import json

try:
    with open('pip-audit-report.json', 'r') as f:
        results = json.load(f)
    
    vulnerabilities = results.get('vulnerabilities', [])
    
    if vulnerabilities:
        print("   ❌ Additional vulnerabilities found by pip-audit:")
        for vuln in vulnerabilities[:5]:  # Show first 5
            package = vuln.get('package', 'Unknown')
            version = vuln.get('version', 'Unknown')
            id = vuln.get('id', 'Unknown')
            
            print(f"      {package} ({version}): {id}")
    else:
        print("   ✅ No additional vulnerabilities found by pip-audit")
        
except Exception as e:
    print(f"   ⚠️  Error processing pip-audit results: {e}")
EOF
                    rm pip-audit-report.json
                fi
            fi
        fi
    }
    
    # JavaScript dependency scanning
    scan_javascript_dependencies() {
        if [ -f "package.json" ]; then
            echo "🟨 Scanning JavaScript dependencies..."
            
            # Use npm audit
            if command -v npm >/dev/null 2>&1; then
                npm audit --json > npm-audit.json 2>/dev/null
                
                if [ -f "npm-audit.json" ]; then
                    node << EOF
const fs = require('fs');

try {
    const results = JSON.parse(fs.readFileSync('npm-audit.json', 'utf8'));
    
    const vulnerabilities = results.vulnerabilities || {};
    const vulnCount = Object.keys(vulnerabilities).length;
    
    if (vulnCount > 0) {
        console.log(\`   ❌ \${vulnCount} vulnerable JavaScript dependencies found:\`);
        
        Object.entries(vulnerabilities).slice(0, 5).forEach(([pkg, vuln]) => {
            const severity = vuln.severity || 'unknown';
            const title = vuln.via?.[0]?.title || 'No description';
            console.log(\`      \${pkg} [\${severity.toUpperCase()}]: \${title}\`);
        });
        
        if (vulnCount > 5) {
            console.log(\`      ... and \${vulnCount - 5} more\`);
        }
        
        console.log('   💡 Run "npm audit fix" to attempt automatic fixes');
    } else {
        console.log('   ✅ No vulnerable JavaScript dependencies detected');
    }
    
} catch (error) {
    console.log(\`   ⚠️  Error checking JavaScript dependencies: \${error.message}\`);
}
EOF
                    rm npm-audit.json
                fi
            fi
            
            # Check for yarn if npm not available
            if command -v yarn >/dev/null 2>&1; then
                yarn audit --json > yarn-audit.json 2>/dev/null
                
                if [ -f "yarn-audit.json" ]; then
                    # Process yarn audit results
                    echo "   🔍 Yarn audit completed - check yarn-audit.json for details"
                    rm yarn-audit.json
                fi
            fi
        fi
    }
    
    scan_python_dependencies
    scan_javascript_dependencies
}
```

#### Configuration Security Analysis
```bash
# Scan configuration files for security issues
scan_configuration_security() {
    echo "⚙️  Scanning configuration files for security issues..."
    
    # Environment files scanning
    scan_environment_files() {
        local env_files=(".env" ".env.local" ".env.production" ".env.example")
        
        for env_file in "${env_files[@]}"; do
            if [ -f "$env_file" ]; then
                echo "   🔍 Scanning environment file: $env_file"
                
                # Check for weak or default passwords
                if grep -n -E "(password|pass).*=.*(admin|password|123|test)" "$env_file" 2>/dev/null; then
                    echo "   ❌ Weak or default passwords detected in $env_file"
                fi
                
                # Check for debug mode
                if grep -n -E "DEBUG.*=.*true|DEBUG.*=.*1" "$env_file" 2>/dev/null; then
                    echo "   ⚠️  Debug mode enabled in $env_file"
                fi
                
                # Check for insecure protocols
                if grep -n -E "http://|ftp://" "$env_file" 2>/dev/null; then
                    echo "   ⚠️  Insecure protocols detected in $env_file"
                fi
                
                # Check for exposed secrets in .env.example
                if [[ "$env_file" == ".env.example" ]]; then
                    if grep -n -E "=.{10,}" "$env_file" 2>/dev/null; then
                        echo "   ⚠️  Potential secrets in example file: $env_file"
                        echo "      Example files should contain placeholder values"
                    fi
                fi
            fi
        done
    }
    
    # Docker configuration scanning
    scan_docker_security() {
        if [ -f "Dockerfile" ]; then
            echo "   🐳 Scanning Dockerfile for security issues..."
            
            # Check for root user
            if ! grep -q "USER " Dockerfile; then
                echo "   ⚠️  Dockerfile runs as root - consider adding non-root user"
            fi
            
            # Check for COPY/ADD with broad permissions
            if grep -n -E "COPY.*\*|ADD.*\*" Dockerfile; then
                echo "   ⚠️  Broad file copy operations detected"
                echo "      Be specific about which files to copy"
            fi
            
            # Check for hardcoded secrets
            if grep -n -E "ENV.*PASSWORD|ENV.*SECRET|ENV.*KEY.*=" Dockerfile; then
                echo "   ❌ Hardcoded secrets in Dockerfile"
                echo "      Use build-time arguments or runtime environment variables"
            fi
            
            # Check for latest tag usage
            if grep -n "FROM.*:latest" Dockerfile; then
                echo "   ⚠️  Using 'latest' tag in base images"
                echo "      Pin to specific versions for reproducibility"
            fi
        fi
        
        if [ -f "docker-compose.yml" ] || [ -f "docker-compose.yaml" ]; then
            echo "   🐳 Scanning docker-compose for security issues..."
            
            local compose_file="docker-compose.yml"
            [ -f "docker-compose.yaml" ] && compose_file="docker-compose.yaml"
            
            # Check for privileged mode
            if grep -n "privileged.*true" "$compose_file"; then
                echo "   ❌ Privileged mode detected in docker-compose"
                echo "      Avoid privileged containers when possible"
            fi
            
            # Check for host network mode
            if grep -n "network_mode.*host" "$compose_file"; then
                echo "   ⚠️  Host network mode detected"
                echo "      Consider using bridge networks for isolation"
            fi
            
            # Check for volume mounting sensitive directories
            if grep -n -E "volumes:.*/(etc|var|usr)" "$compose_file"; then
                echo "   ⚠️  Mounting sensitive system directories"
                echo "      Be cautious when mounting system directories"
            fi
        fi
    }
    
    # Cloud configuration scanning
    scan_cloud_configs() {
        # AWS CloudFormation
        if find . -name "*.yaml" -o -name "*.yml" | xargs grep -l "AWSTemplateFormatVersion" 2>/dev/null; then
            echo "   ☁️  Scanning CloudFormation templates..."
            
            find . -name "*.yaml" -o -name "*.yml" | xargs grep -l "AWSTemplateFormatVersion" | while read -r cf_file; do
                # Check for open security groups
                if grep -n -E "CidrIp.*0\.0\.0\.0/0" "$cf_file"; then
                    echo "   ⚠️  Open security group rules detected in $cf_file"
                fi
                
                # Check for hardcoded secrets
                if grep -n -E "(AccessKey|SecretKey).*:" "$cf_file"; then
                    echo "   ❌ Hardcoded AWS credentials in $cf_file"
                fi
            done
        fi
        
        # Kubernetes manifests
        if find . -name "*.yaml" -o -name "*.yml" | xargs grep -l "apiVersion" 2>/dev/null; then
            echo "   ☸️  Scanning Kubernetes manifests..."
            
            find . -name "*.yaml" -o -name "*.yml" | xargs grep -l "apiVersion" | while read -r k8s_file; do
                # Check for privileged containers
                if grep -n "privileged.*true" "$k8s_file"; then
                    echo "   ❌ Privileged containers detected in $k8s_file"
                fi
                
                # Check for host network
                if grep -n "hostNetwork.*true" "$k8s_file"; then
                    echo "   ⚠️  Host network usage detected in $k8s_file"
                fi
                
                # Check for no resource limits
                if grep -A 10 -B 10 "kind: Deployment" "$k8s_file" | grep -q "containers:" && \
                   ! grep -A 20 "containers:" "$k8s_file" | grep -q "resources:"; then
                    echo "   ⚠️  No resource limits specified in $k8s_file"
                fi
            done
        fi
    }
    
    scan_environment_files
    scan_docker_security
    scan_cloud_configs
}
```

#### Secrets Detection
```bash
# Advanced secrets detection
detect_secrets() {
    echo "🔐 Performing advanced secrets detection..."
    
    # Use detect-secrets if available
    if command -v detect-secrets >/dev/null 2>&1; then
        echo "   🔍 Running detect-secrets scan..."
        detect-secrets scan --all-files --force-use-all-plugins > .secrets.baseline 2>/dev/null
        
        if [ -f ".secrets.baseline" ]; then
            python << EOF
import json

try:
    with open('.secrets.baseline', 'r') as f:
        results = json.load(f)
    
    secrets_found = results.get('results', {})
    
    if secrets_found:
        print("   ❌ Potential secrets detected:")
        for filename, secrets in secrets_found.items():
            if secrets:
                print(f"      {filename}:")
                for secret in secrets:
                    line = secret.get('line_number', 'unknown')
                    type_name = secret.get('type', 'unknown')
                    print(f"         Line {line}: {type_name}")
    else:
        print("   ✅ No secrets detected by detect-secrets")
        
except Exception as e:
    print(f"   ⚠️  Error processing detect-secrets results: {e}")
EOF
            rm .secrets.baseline
        fi
    fi
    
    # Custom pattern-based secrets detection
    detect_custom_secret_patterns() {
        echo "   🔍 Running custom secrets detection..."
        
        local secret_patterns=(
            "api[_-]?key['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{20,}['\"]"
            "secret[_-]?key['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{20,}['\"]"
            "password['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{8,}['\"]"
            "token['\"]?\s*[:=]\s*['\"][a-zA-Z0-9]{20,}['\"]"
            "aws[_-]?access[_-]?key['\"]?\s*[:=]\s*['\"][A-Z0-9]{20}['\"]"
            "aws[_-]?secret[_-]?key['\"]?\s*[:=]\s*['\"][a-zA-Z0-9/+=]{40}['\"]"
            "github[_-]?token['\"]?\s*[:=]\s*['\"]ghp_[a-zA-Z0-9]{36}['\"]"
            "slack[_-]?token['\"]?\s*[:=]\s*['\"]xox[a-zA-Z]-[a-zA-Z0-9-]+['\"]"
        )
        
        local found_secrets=false
        
        for pattern in "${secret_patterns[@]}"; do
            local matches=$(grep -rn -E "$pattern" --include="*.py" --include="*.js" --include="*.ts" --include="*.json" --include="*.yaml" --include="*.yml" . 2>/dev/null)
            
            if [ -n "$matches" ]; then
                found_secrets=true
                echo "   ❌ Potential secrets found:"
                echo "$matches" | while IFS=: read -r file line match; do
                    echo "      $file:$line"
                done
            fi
        done
        
        if [ "$found_secrets" = false ]; then
            echo "   ✅ No obvious secret patterns detected"
        fi
    }
    
    detect_custom_secret_patterns
}
```

### Security Reporting and Remediation

#### Security Report Generation
```bash
# Generate comprehensive security report
generate_security_report() {
    echo "📋 Generating comprehensive security report..."
    
    local report_file="security-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# Security Analysis Report

**Generated**: $(date)
**Commit**: $(git rev-parse HEAD 2>/dev/null || echo "N/A")
**Branch**: $(git branch --show-current 2>/dev/null || echo "N/A")

## Executive Summary

This report contains the results of automated security analysis performed on the codebase.

## Analysis Results

### Static Code Analysis
$([ -f "bandit-results.json" ] && echo "✅ Python security scan completed" || echo "⚠️  Python security scan not available")
$([ -f "eslint-security.json" ] && echo "✅ JavaScript security scan completed" || echo "⚠️  JavaScript security scan not available")

### Dependency Analysis
$(command -v safety >/dev/null 2>&1 && echo "✅ Python dependency scan available" || echo "⚠️  Python dependency scan not available")
$(command -v npm >/dev/null 2>&1 && echo "✅ JavaScript dependency scan available" || echo "⚠️  JavaScript dependency scan not available")

### Configuration Analysis
$([ -f "Dockerfile" ] && echo "✅ Docker configuration analyzed" || echo "ℹ️  No Docker configuration found")
$([ -f ".env" ] && echo "✅ Environment configuration analyzed" || echo "ℹ️  No environment files found")

### Secrets Detection
$(command -v detect-secrets >/dev/null 2>&1 && echo "✅ Advanced secrets detection available" || echo "⚠️  Using basic pattern matching only")

## Recommendations

### High Priority
- Review any identified hardcoded credentials
- Update vulnerable dependencies
- Implement proper secret management

### Medium Priority
- Enable additional security scanning tools
- Implement security headers for web applications
- Review file permissions and access controls

### Low Priority
- Add security documentation
- Implement security testing in CI/CD
- Regular security audit scheduling

## Security Checklist

- [ ] No hardcoded credentials in source code
- [ ] All dependencies up to date and secure
- [ ] Proper input validation and sanitization
- [ ] Secure configuration management
- [ ] Regular security scans in CI/CD pipeline
- [ ] Security headers implemented for web apps
- [ ] Proper error handling (no information leakage)
- [ ] Secure communication (HTTPS/TLS)

## Next Steps

1. Address any high-severity findings immediately
2. Plan remediation for medium-severity issues
3. Consider implementing additional security measures
4. Schedule regular security reviews

---
*This report was generated automatically. Manual review and validation recommended.*
EOF
    
    echo "   ✅ Security report generated: $report_file"
    
    # Add to gitignore if not already present
    if [ -f ".gitignore" ] && ! grep -q "security-report-" .gitignore; then
        echo "security-report-*.md" >> .gitignore
        echo "   📝 Added security reports to .gitignore"
    fi
}
```

#### Automated Remediation Suggestions
```bash
# Provide automated remediation suggestions
suggest_security_remediations() {
    echo "💡 Generating security remediation suggestions..."
    
    create_remediation_guide() {
        cat > security-remediation-guide.md << 'EOF'
# Security Remediation Guide

## Common Security Issues and Solutions

### 1. Hardcoded Credentials
**Problem**: Passwords, API keys, or tokens in source code
**Solution**: 
- Use environment variables
- Implement proper secrets management (AWS Secrets Manager, HashiCorp Vault)
- Use configuration files with proper access controls

**Example Fix**:
```python
# Bad
api_key = "sk-1234567890abcdef"

# Good
import os
api_key = os.getenv('API_KEY')
if not api_key:
    raise ValueError("API_KEY environment variable required")
```

### 2. SQL Injection
**Problem**: Dynamic SQL queries with user input
**Solution**: Use parameterized queries or ORM

**Example Fix**:
```python
# Bad
query = f"SELECT * FROM users WHERE id = {user_id}"

# Good
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))
```

### 3. XSS Vulnerabilities
**Problem**: Unsanitized user input in HTML output
**Solution**: Sanitize input and use safe output methods

**Example Fix**:
```javascript
// Bad
element.innerHTML = userInput;

// Good
element.textContent = userInput;
// Or use a sanitization library
element.innerHTML = DOMPurify.sanitize(userInput);
```

### 4. Insecure Dependencies
**Problem**: Outdated packages with known vulnerabilities
**Solution**: Regular dependency updates and scanning

**Commands**:
```bash
# Python
pip install --upgrade package_name
safety check

# JavaScript
npm update
npm audit fix
```

### 5. Weak Authentication
**Problem**: Weak password requirements or storage
**Solution**: Strong password policies and secure hashing

**Example**:
```python
import bcrypt

# Hash password
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Verify password
bcrypt.checkpw(password.encode('utf-8'), password_hash)
```

## Security Best Practices

### Development
- Never commit secrets to version control
- Use linting tools with security rules
- Implement proper error handling
- Validate all user inputs
- Use HTTPS for all communications

### Deployment
- Enable security headers
- Use proper file permissions
- Implement monitoring and logging
- Regular security updates
- Backup and disaster recovery plans

### Monitoring
- Set up vulnerability scanning
- Monitor for unusual activity
- Regular security assessments
- Incident response procedures

EOF
        echo "   ✅ Security remediation guide created: security-remediation-guide.md"
    }
    
    create_remediation_guide
}
```

### Integration with CI/CD

#### Security Gate Integration
```bash
# Integration with CI/CD security gates
integrate_security_gates() {
    echo "🚪 Setting up security gates for CI/CD..."
    
    create_security_gate_config() {
        cat > .github/workflows/security-scan.yml << 'EOF'
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v3
      with:
        python-version: '3.9'
    
    - name: Install security tools
      run: |
        pip install bandit safety
        npm install -g audit-ci
    
    - name: Run Python security scan
      run: |
        bandit -r src/ -f json -o bandit-report.json
        safety check --json > safety-report.json
    
    - name: Run JavaScript security scan
      run: |
        npm audit --audit-level high
        audit-ci --config audit-ci.json
    
    - name: Upload security reports
      uses: actions/upload-artifact@v3
      with:
        name: security-reports
        path: |
          bandit-report.json
          safety-report.json
    
    - name: Security gate check
      run: |
        # Fail build if high-severity vulnerabilities found
        if grep -q '"severity": "HIGH"' bandit-report.json; then
          echo "High-severity security issues found"
          exit 1
        fi
EOF
        
        echo "   ✅ GitHub Actions security workflow created"
    }
    
    create_precommit_security_hook() {
        cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/PyCQA/bandit
    rev: '1.7.4'
    hooks:
      - id: bandit
        args: ['-c', 'pyproject.toml']
  
  - repo: https://github.com/gitguardian/ggshield
    rev: v1.18.0
    hooks:
      - id: ggshield
        language: python
        stages: [commit]
  
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
EOF
        
        echo "   ✅ Pre-commit security hooks configured"
    }
    
    if [ -d ".github" ]; then
        create_security_gate_config
    fi
    
    create_precommit_security_hook
}
```

## AI Behavior Guidelines

### Security Scanning Strategy
- Perform comprehensive multi-layer security analysis
- Use multiple tools and approaches for better coverage
- Provide clear, actionable remediation guidance
- Integrate seamlessly with development workflow

### Vulnerability Assessment
- Prioritize findings by severity and exploitability
- Provide context-specific remediation suggestions
- Consider false positives and provide guidance for review
- Balance security with development productivity

### Continuous Security
- Enable automated security scanning in CI/CD
- Provide ongoing monitoring and alerting
- Keep security tools and databases updated
- Learn from security incidents and improve detection

---

**This security scanner hook template provides comprehensive, automated security analysis that integrates with development workflows while maintaining high security standards and providing actionable remediation guidance.**