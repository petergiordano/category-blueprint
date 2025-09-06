# Test Completion Hook

**Purpose**: Process test results, generate reports, and trigger follow-up actions after test execution.

**Trigger**: Completion of test suites (unit, integration, system, or performance tests).

## Test Result Processing Pipeline

### Stage 1: Test Result Analysis
```bash
# Comprehensive test result analysis
analyze_test_results() {
    echo "🧪 Analyzing test execution results..."
    
    # Process test output files
    process_test_outputs() {
        local test_type="$1"
        local results_file="$2"
        
        echo "📊 Processing $test_type test results..."
        
        # Extract key metrics
        if [ -f "$results_file" ]; then
            local total_tests=$(grep -c "PASSED\|FAILED\|SKIPPED" "$results_file" 2>/dev/null || echo "0")
            local passed_tests=$(grep -c "PASSED" "$results_file" 2>/dev/null || echo "0")
            local failed_tests=$(grep -c "FAILED" "$results_file" 2>/dev/null || echo "0")
            local skipped_tests=$(grep -c "SKIPPED" "$results_file" 2>/dev/null || echo "0")
            
            echo "   📈 $test_type Results:"
            echo "      Total: $total_tests"
            echo "      Passed: $passed_tests"
            echo "      Failed: $failed_tests"
            echo "      Skipped: $skipped_tests"
            
            # Calculate success rate
            if [ "$total_tests" -gt 0 ]; then
                local success_rate=$((passed_tests * 100 / total_tests))
                echo "      Success Rate: $success_rate%"
                
                # Store metrics for reporting
                echo "$test_type,$total_tests,$passed_tests,$failed_tests,$skipped_tests,$success_rate" >> test-metrics.csv
            fi
        fi
    }
    
    # Process different test types
    process_test_outputs "Unit" "unit-test-results.xml"
    process_test_outputs "Integration" "integration-test-results.xml"
    process_test_outputs "System" "system-test-results.xml"
    
    # Process pytest results
    if [ -f "pytest-results.xml" ]; then
        process_pytest_results
    fi
    
    # Process Jest results
    if [ -f "jest-results.json" ]; then
        process_jest_results
    fi
}

# Process pytest XML results
process_pytest_results() {
    echo "🐍 Processing pytest results..."
    
    if command -v python >/dev/null 2>&1; then
        python << 'EOF'
import xml.etree.ElementTree as ET
import sys

try:
    tree = ET.parse('pytest-results.xml')
    root = tree.getroot()
    
    # Extract test suite information
    for testsuite in root.findall('testsuite'):
        tests = testsuite.get('tests', '0')
        failures = testsuite.get('failures', '0')
        errors = testsuite.get('errors', '0')
        skipped = testsuite.get('skipped', '0')
        time = testsuite.get('time', '0')
        
        print(f"   📋 Test Suite: {testsuite.get('name', 'Unknown')}")
        print(f"      Tests: {tests}, Failures: {failures}, Errors: {errors}")
        print(f"      Skipped: {skipped}, Duration: {time}s")
        
        # Identify slow tests
        for testcase in testsuite.findall('testcase'):
            test_time = float(testcase.get('time', '0'))
            if test_time > 5.0:  # Slow test threshold
                print(f"      ⏱️  Slow test: {testcase.get('name')} ({test_time:.2f}s)")

except Exception as e:
    print(f"   ❌ Error processing pytest results: {e}")
EOF
    fi
}

# Process Jest JSON results
process_jest_results() {
    echo "🟨 Processing Jest results..."
    
    if command -v jq >/dev/null 2>&1 && [ -f "jest-results.json" ]; then
        # Extract summary statistics
        jq -r '
            .summary |
            "   📋 Jest Summary:",
            "      Total Tests: \(.numTotalTests)",
            "      Passed: \(.numPassedTests)",
            "      Failed: \(.numFailedTests)",
            "      Skipped: \(.numPendingTests)",
            "      Duration: \(.runtime/1000)s"
        ' jest-results.json
        
        # Identify failed tests
        jq -r '
            .testResults[] |
            select(.status == "failed") |
            "   ❌ Failed: \(.name)"
        ' jest-results.json
        
        # Identify slow tests
        jq -r '
            .testResults[] |
            select(.duration > 5000) |
            "   ⏱️  Slow test: \(.name) (\(.duration/1000)s)"
        ' jest-results.json
    fi
}
```

### Stage 2: Coverage Analysis and Reporting
```bash
# Test coverage analysis
analyze_test_coverage() {
    echo "📊 Analyzing test coverage..."
    
    # Process Python coverage
    analyze_python_coverage() {
        if [ -f ".coverage" ] || [ -f "coverage.xml" ]; then
            echo "🐍 Python coverage analysis:"
            
            # Generate coverage report
            if command -v coverage >/dev/null 2>&1; then
                coverage report --show-missing > coverage-report.txt
                
                # Extract coverage percentage
                local coverage_percent=$(coverage report | tail -1 | awk '{print $4}' | sed 's/%//')
                echo "   📈 Overall Coverage: $coverage_percent%"
                
                # Identify uncovered files
                echo "   📝 Files needing coverage improvement:"
                coverage report --show-missing | grep -E "^[^-].*[0-9]+%" | \
                    awk '$4 < 80 {print "      " $1 " (" $4 ")"}' | head -10
                
                # Generate HTML report
                coverage html
                echo "   📄 HTML coverage report generated in htmlcov/"
            fi
        fi
    }
    
    # Process JavaScript coverage
    analyze_javascript_coverage() {
        if [ -f "coverage/lcov.info" ] || [ -f "coverage/coverage-summary.json" ]; then
            echo "🟨 JavaScript coverage analysis:"
            
            if [ -f "coverage/coverage-summary.json" ]; then
                # Extract coverage metrics using jq
                if command -v jq >/dev/null 2>&1; then
                    jq -r '
                        .total |
                        "   📈 Coverage Summary:",
                        "      Lines: \(.lines.pct)%",
                        "      Statements: \(.statements.pct)%",
                        "      Functions: \(.functions.pct)%",
                        "      Branches: \(.branches.pct)%"
                    ' coverage/coverage-summary.json
                fi
                
                # Identify files with low coverage
                echo "   📝 Files needing coverage improvement:"
                jq -r '
                    to_entries[] |
                    select(.key != "total" and .value.lines.pct < 80) |
                    "      \(.key) (\(.value.lines.pct)%)"
                ' coverage/coverage-summary.json | head -10
            fi
        fi
    }
    
    # Generate coverage trends
    generate_coverage_trends() {
        echo "📈 Generating coverage trends..."
        
        # Append current coverage to history
        local current_date=$(date +"%Y-%m-%d")
        local python_coverage=$(coverage report 2>/dev/null | tail -1 | awk '{print $4}' | sed 's/%//' || echo "N/A")
        local js_coverage=$(jq -r '.total.lines.pct' coverage/coverage-summary.json 2>/dev/null || echo "N/A")
        
        echo "$current_date,$python_coverage,$js_coverage" >> coverage-history.csv
        
        # Generate trend analysis
        if [ -f "coverage-history.csv" ] && [ $(wc -l < coverage-history.csv) -gt 1 ]; then
            echo "   📊 Coverage trend analysis:"
            tail -5 coverage-history.csv | while IFS=, read -r date py_cov js_cov; do
                echo "      $date: Python $py_cov%, JavaScript $js_cov%"
            done
        fi
    }
    
    analyze_python_coverage
    analyze_javascript_coverage
    generate_coverage_trends
}
```

### Stage 3: Performance Test Analysis
```bash
# Performance test result analysis
analyze_performance_tests() {
    echo "⚡ Analyzing performance test results..."
    
    # Process load test results
    process_load_test_results() {
        if [ -f "load-test-results.json" ]; then
            echo "🔥 Load test analysis:"
            
            # Extract performance metrics
            if command -v jq >/dev/null 2>&1; then
                jq -r '
                    .summary |
                    "   📊 Load Test Summary:",
                    "      Total Requests: \(.count)",
                    "      Average Response Time: \(.average_response_time)ms",
                    "      95th Percentile: \(.p95_response_time)ms",
                    "      Error Rate: \(.error_rate)%",
                    "      Throughput: \(.throughput) req/s"
                ' load-test-results.json
                
                # Check performance thresholds
                local avg_response=$(jq -r '.summary.average_response_time' load-test-results.json)
                local error_rate=$(jq -r '.summary.error_rate' load-test-results.json)
                
                # Performance threshold validation
                if (( $(echo "$avg_response > 1000" | bc -l) )); then
                    echo "   ⚠️  Average response time exceeds 1000ms threshold"
                fi
                
                if (( $(echo "$error_rate > 5" | bc -l) )); then
                    echo "   ❌ Error rate exceeds 5% threshold"
                fi
            fi
        fi
    }
    
    # Process benchmark results
    process_benchmark_results() {
        if [ -f "benchmark-results.json" ]; then
            echo "🏃 Benchmark analysis:"
            
            # Compare with previous benchmarks
            if [ -f "benchmark-history.json" ]; then
                echo "   📈 Performance trend analysis:"
                
                # Simple performance regression detection
                python << 'EOF'
import json
import sys

try:
    with open('benchmark-results.json', 'r') as f:
        current = json.load(f)
    
    with open('benchmark-history.json', 'r') as f:
        history = json.load(f)
    
    if history and len(history) > 0:
        previous = history[-1]
        
        for test_name, current_result in current.items():
            if test_name in previous:
                prev_time = previous[test_name].get('time', 0)
                curr_time = current_result.get('time', 0)
                
                if curr_time > prev_time * 1.1:  # 10% regression threshold
                    print(f"      ⚠️  Performance regression in {test_name}: {prev_time:.2f}ms → {curr_time:.2f}ms")
                elif curr_time < prev_time * 0.9:  # 10% improvement
                    print(f"      ✅ Performance improvement in {test_name}: {prev_time:.2f}ms → {curr_time:.2f}ms")
    
    # Append current results to history
    history.append(current)
    with open('benchmark-history.json', 'w') as f:
        json.dump(history, f, indent=2)

except Exception as e:
    print(f"   ❌ Error processing benchmark results: {e}")
EOF
            fi
        fi
    }
    
    process_load_test_results
    process_benchmark_results
}
```

### Stage 4: Test Quality Assessment
```bash
# Test quality and reliability assessment
assess_test_quality() {
    echo "🔍 Assessing test quality and reliability..."
    
    # Flaky test detection
    detect_flaky_tests() {
        echo "🎲 Detecting flaky tests..."
        
        if [ -f "test-history.json" ]; then
            python << 'EOF'
import json
from collections import defaultdict

try:
    with open('test-history.json', 'r') as f:
        history = json.load(f)
    
    # Analyze test result patterns
    test_results = defaultdict(list)
    
    for run in history[-10:]:  # Last 10 runs
        for test_name, result in run.get('tests', {}).items():
            test_results[test_name].append(result.get('status', 'unknown'))
    
    # Identify flaky tests (inconsistent results)
    flaky_tests = []
    for test_name, results in test_results.items():
        if len(set(results)) > 1 and len(results) >= 3:
            pass_rate = results.count('passed') / len(results)
            if 0.2 < pass_rate < 0.8:  # Between 20% and 80% pass rate
                flaky_tests.append((test_name, pass_rate))
    
    if flaky_tests:
        print("   🎲 Flaky tests detected:")
        for test_name, pass_rate in sorted(flaky_tests, key=lambda x: x[1]):
            print(f"      {test_name} (pass rate: {pass_rate:.1%})")
    else:
        print("   ✅ No flaky tests detected")

except Exception as e:
    print(f"   ❌ Error detecting flaky tests: {e}")
EOF
        fi
    }
    
    # Test execution time analysis
    analyze_test_performance() {
        echo "⏱️  Analyzing test execution performance..."
        
        # Identify slow tests
        if [ -f "pytest-results.xml" ]; then
            python << 'EOF'
import xml.etree.ElementTree as ET

try:
    tree = ET.parse('pytest-results.xml')
    root = tree.getroot()
    
    slow_tests = []
    
    for testsuite in root.findall('testsuite'):
        for testcase in testsuite.findall('testcase'):
            test_time = float(testcase.get('time', '0'))
            test_name = testcase.get('name', 'unknown')
            if test_time > 2.0:  # Slow test threshold
                slow_tests.append((test_name, test_time))
    
    if slow_tests:
        slow_tests.sort(key=lambda x: x[1], reverse=True)
        print("   ⏱️  Slowest tests:")
        for test_name, test_time in slow_tests[:10]:
            print(f"      {test_name}: {test_time:.2f}s")
    
    # Total test execution time
    total_time = sum(float(ts.get('time', '0')) for ts in root.findall('testsuite'))
    print(f"   ⏲️  Total test execution time: {total_time:.2f}s")
    
    if total_time > 300:  # 5 minutes threshold
        print("   ⚠️  Test suite execution time exceeds recommended threshold")

except Exception as e:
    print(f"   ❌ Error analyzing test performance: {e}")
EOF
        fi
    }
    
    # Test maintainability assessment
    assess_test_maintainability() {
        echo "🔧 Assessing test maintainability..."
        
        # Count test files and assertions
        local test_files=$(find tests/ -name "*.py" -o -name "*.js" -o -name "*.ts" 2>/dev/null | wc -l)
        local test_assertions=$(grep -r "assert\|expect\|should" tests/ 2>/dev/null | wc -l)
        
        echo "   📊 Test suite metrics:"
        echo "      Test files: $test_files"
        echo "      Test assertions: $test_assertions"
        
        if [ "$test_files" -gt 0 ]; then
            local avg_assertions=$((test_assertions / test_files))
            echo "      Average assertions per file: $avg_assertions"
            
            if [ "$avg_assertions" -lt 5 ]; then
                echo "   ⚠️  Low assertion density - consider adding more test cases"
            fi
        fi
        
        # Check for test duplication
        echo "   🔍 Checking for potential test duplication:"
        if command -v similarity-detector >/dev/null 2>&1; then
            similarity-detector tests/ --threshold 0.8
        else
            echo "      Install similarity detection tool for duplication analysis"
        fi
    }
    
    detect_flaky_tests
    analyze_test_performance
    assess_test_maintainability
}
```

### Stage 5: Automated Follow-up Actions
```bash
# Automated actions based on test results
trigger_follow_up_actions() {
    echo "🎯 Triggering follow-up actions based on test results..."
    
    # Auto-create issues for failing tests
    create_failure_issues() {
        if [ -f "test-failures.txt" ] && [ -s "test-failures.txt" ]; then
            echo "🐛 Creating issues for test failures..."
            
            while IFS= read -r failed_test; do
                local issue_title="Test Failure: $failed_test"
                local issue_body="Test '$failed_test' is consistently failing. Investigation needed."
                
                echo "   📝 Issue suggested: $issue_title"
                
                # If GitHub CLI is available, create actual issues
                if command -v gh >/dev/null 2>&1; then
                    gh issue create --title "$issue_title" --body "$issue_body" --label "bug,test-failure"
                fi
            done < test-failures.txt
        fi
    }
    
    # Update test badges and documentation
    update_test_badges() {
        echo "📊 Updating test status badges..."
        
        local success_rate=$(grep "Success Rate" test-metrics.csv 2>/dev/null | tail -1 | cut -d',' -f6 || echo "0")
        local coverage_percent=$(coverage report 2>/dev/null | tail -1 | awk '{print $4}' | sed 's/%//' || echo "0")
        
        # Update README badges
        if [ -f "README.md" ]; then
            # Update test status badge
            if [ "$success_rate" -ge 95 ]; then
                sed -i.bak 's/tests-[^-]*-/tests-passing-green/g' README.md
            elif [ "$success_rate" -ge 80 ]; then
                sed -i.bak 's/tests-[^-]*-/tests-mostly_passing-yellow/g' README.md
            else
                sed -i.bak 's/tests-[^-]*-/tests-failing-red/g' README.md
            fi
            
            # Update coverage badge
            sed -i.bak "s/coverage-[0-9]*%-/coverage-$coverage_percent%-/g" README.md
            
            echo "   ✅ README badges updated"
        fi
    }
    
    # Notify team of critical failures
    notify_critical_failures() {
        local critical_failures=$(grep -c "CRITICAL\|FATAL" test-failures.txt 2>/dev/null || echo "0")
        
        if [ "$critical_failures" -gt 0 ]; then
            echo "🚨 Critical test failures detected!"
            echo "   💬 Consider team notification:"
            echo "      - Slack/Teams message"
            echo "      - Email notification"
            echo "      - Block deployment pipeline"
            
            # Create notification file for CI/CD integration
            cat > critical-test-failures.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "critical_failures": $critical_failures,
  "message": "Critical test failures require immediate attention",
  "action_required": true
}
EOF
        fi
    }
    
    # Schedule test optimization tasks
    schedule_optimization_tasks() {
        echo "⚡ Scheduling test optimization tasks..."
        
        # Create optimization recommendations
        cat > test-optimization-tasks.md << 'EOF'
# Test Optimization Tasks

Generated based on test completion analysis.

## High Priority
- [ ] Fix flaky tests identified in analysis
- [ ] Optimize slow-running tests (>5s execution time)
- [ ] Address critical test failures

## Medium Priority
- [ ] Improve test coverage for low-coverage files
- [ ] Reduce test execution time for large test suites
- [ ] Remove duplicate or redundant tests

## Low Priority
- [ ] Enhance test documentation and comments
- [ ] Standardize test naming conventions
- [ ] Add performance benchmarks for critical paths

## Performance Optimizations
- [ ] Parallelize test execution where possible
- [ ] Use test fixtures and mocking effectively
- [ ] Optimize test data setup and teardown

EOF
        echo "   ✅ Optimization tasks documented: test-optimization-tasks.md"
    }
    
    create_failure_issues
    update_test_badges
    notify_critical_failures
    schedule_optimization_tasks
}
```

### Stage 6: Comprehensive Test Reporting
```bash
# Generate comprehensive test completion report
generate_test_report() {
    echo "📋 Generating comprehensive test completion report..."
    
    cat > test-completion-report.md << EOF
# Test Completion Report

Generated on: $(date)
Test Suite: $(git branch --show-current 2>/dev/null || echo "unknown")

## Executive Summary
$([ -f "test-metrics.csv" ] && tail -1 test-metrics.csv | awk -F',' '{
    printf "- **Total Tests**: %s\n", $2
    printf "- **Success Rate**: %s%%\n", $6
    printf "- **Coverage**: %s%%\n", "'$(coverage report 2>/dev/null | tail -1 | awk '{print $4}' | sed 's/%//' || echo "N/A")'"
}' || echo "- No test metrics available")

## Test Results by Category
$([ -f "test-metrics.csv" ] && while IFS=, read -r type total passed failed skipped rate; do
    echo "### $type Tests"
    echo "- Total: $total"
    echo "- Passed: $passed"
    echo "- Failed: $failed"
    echo "- Skipped: $skipped"
    echo "- Success Rate: $rate%"
    echo ""
done < test-metrics.csv || echo "No detailed metrics available")

## Coverage Analysis
$([ -f "coverage-report.txt" ] && echo '```' && head -20 coverage-report.txt && echo '```' || echo "Coverage report not available")

## Performance Analysis
$([ -f "load-test-results.json" ] && echo "Load testing completed - see detailed results in load-test-results.json" || echo "No performance tests executed")

## Quality Indicators
- **Flaky Tests**: $(grep -c "flaky" test-completion-report.md 2>/dev/null || echo "0") detected
- **Slow Tests**: $(grep -c "slow" test-completion-report.md 2>/dev/null || echo "0") identified
- **Test Execution Time**: $(grep "Total test execution time" test-completion-report.md 2>/dev/null | awk '{print $5}' || echo "N/A")

## Recommendations
$([ -f "test-optimization-tasks.md" ] && echo "See test-optimization-tasks.md for detailed recommendations" || echo "No specific recommendations generated")

## Next Steps
1. Review failed tests and address issues
2. Improve coverage for files below 80%
3. Optimize slow-running tests
4. Address any flaky test behavior
5. Update test documentation as needed

---
*Report generated automatically by test completion hook*
EOF
    
    echo "   ✅ Comprehensive test report generated: test-completion-report.md"
}
```

## Integration with CI/CD and Notifications

### CI/CD Integration
```bash
# Export results for CI/CD pipeline consumption
export_ci_cd_results() {
    echo "🔄 Exporting results for CI/CD integration..."
    
    # Create pipeline-friendly output
    cat > test-results-summary.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "test_results": {
$([ -f "test-metrics.csv" ] && tail -1 test-metrics.csv | awk -F',' '{
    printf "    \"total_tests\": %s,\n", $2
    printf "    \"passed_tests\": %s,\n", $3
    printf "    \"failed_tests\": %s,\n", $4
    printf "    \"success_rate\": %s\n", $6
}' || echo '    "total_tests": 0, "passed_tests": 0, "failed_tests": 0, "success_rate": 0')
  },
  "coverage": {
    "percentage": $(coverage report 2>/dev/null | tail -1 | awk '{print $4}' | sed 's/%//' || echo "0")
  },
  "quality_gates": {
    "tests_passing": $([ "$(tail -1 test-metrics.csv 2>/dev/null | cut -d',' -f6 || echo 0)" -ge 95 ] && echo "true" || echo "false"),
    "coverage_sufficient": $([ "$(coverage report 2>/dev/null | tail -1 | awk '{print $4}' | sed 's/%//' || echo 0)" -ge 80 ] && echo "true" || echo "false")
  }
}
EOF
    
    echo "   ✅ CI/CD results exported: test-results-summary.json"
}
```

## AI Behavior Guidelines

### Test Result Interpretation
- Provide clear analysis of test outcomes
- Identify patterns and trends in test results
- Suggest specific improvements and optimizations
- Prioritize critical issues over minor concerns

### Automated Actions
- Create actionable follow-up tasks
- Update documentation and badges automatically
- Generate meaningful reports for team review
- Integrate with existing development workflows

### Quality Focus
- Monitor test quality and reliability trends
- Detect performance regressions early
- Ensure comprehensive coverage analysis
- Maintain test suite health over time

---

**This comprehensive test completion hook processes all aspects of test results, providing detailed analysis, automated follow-up actions, and integration with development workflows to maintain high-quality testing practices.**