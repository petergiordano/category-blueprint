#!/usr/bin/env python3
"""
Enhanced Testing Framework for Gyro-Style Development
Comprehensive testing with validation integration and reporting
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import xml.etree.ElementTree as ET

@dataclass
class TestResult:
    name: str
    passed: bool
    duration: float
    output: str = ""
    error: str = ""
    category: str = "unit"

class EnhancedTestFramework:
    """Enhanced testing framework with validation integration"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results: List[TestResult] = []
        self.config = self._load_test_config()
        
    def _load_test_config(self) -> Dict:
        """Load testing configuration"""
        config_path = self.project_root / "config" / "test-config.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return self._default_config()
    
    def _default_config(self) -> Dict:
        """Default testing configuration"""
        return {
            "test_discovery": {
                "patterns": ["test_*.py", "*_test.py"],
                "directories": ["tests/", "src/tests/"],
                "exclude": ["__pycache__", ".pytest_cache"]
            },
            "coverage": {
                "minimum": 80,
                "exclude": ["tests/*", "*/migrations/*"],
                "report_format": ["term", "html", "xml"]
            },
            "test_types": {
                "unit": {
                    "pattern": "tests/unit/**/*.py",
                    "timeout": 30,
                    "parallel": True
                },
                "integration": {
                    "pattern": "tests/integration/**/*.py", 
                    "timeout": 120,
                    "parallel": False
                },
                "performance": {
                    "pattern": "tests/performance/**/*.py",
                    "timeout": 300,
                    "parallel": False
                },
                "acceptance": {
                    "pattern": "tests/acceptance/**/*.py",
                    "timeout": 600,
                    "parallel": False
                }
            },
            "validation_integration": {
                "run_before_tests": True,
                "fail_on_validation_errors": True,
                "include_in_report": True
            },
            "reporting": {
                "formats": ["console", "json", "junit", "html"],
                "output_dir": "test-reports",
                "include_coverage": True,
                "include_validation": True
            }
        }
    
    def run_comprehensive_tests(self, test_types: List[str] = None, 
                               include_validation: bool = True) -> Dict:
        """Run comprehensive test suite with validation"""
        print("🧪 Running enhanced test framework...")
        print("=" * 60)
        
        if test_types is None:
            test_types = list(self.config["test_types"].keys())
        
        # Run validation if enabled
        validation_results = {}
        if include_validation and self.config["validation_integration"]["run_before_tests"]:
            validation_results = self._run_validation_checks()
            
            if (validation_results.get("failed", 0) > 0 and 
                self.config["validation_integration"]["fail_on_validation_errors"]):
                print("❌ Validation checks failed, stopping test execution")
                return self._generate_failed_report(validation_results)
        
        # Run tests by type
        for test_type in test_types:
            if test_type in self.config["test_types"]:
                print(f"\\n📋 Running {test_type} tests...")
                self._run_test_type(test_type)
        
        # Run coverage analysis
        coverage_results = self._run_coverage_analysis()
        
        # Generate comprehensive report
        report = self._generate_comprehensive_report(validation_results, coverage_results)
        
        print("\\n" + "=" * 60)
        print("🎯 Test Summary")
        print("=" * 60)
        self._print_summary(report)
        
        return report
    
    def _run_validation_checks(self) -> Dict:
        """Run validation checks before testing"""
        print("🔍 Running validation checks...")
        
        validation_script = self.project_root / "scripts" / "validation" / "run-all-validations.py"
        if not validation_script.exists():
            return {"status": "skipped", "reason": "Validation scripts not found"}
        
        try:
            result = subprocess.run([
                sys.executable, str(validation_script), str(self.project_root),
                "--format", "json", "--quiet"
            ], capture_output=True, text=True, timeout=300)
            
            if result.stdout:
                return json.loads(result.stdout)
            else:
                return {"status": "failed", "reason": "No validation output"}
                
        except subprocess.TimeoutExpired:
            return {"status": "failed", "reason": "Validation timeout"}
        except json.JSONDecodeError:
            return {"status": "failed", "reason": "Invalid validation output"}
        except Exception as e:
            return {"status": "failed", "reason": f"Validation error: {e}"}
    
    def _run_test_type(self, test_type: str):
        """Run specific type of tests"""
        config = self.config["test_types"][test_type]
        pattern = config["pattern"]
        timeout = config.get("timeout", 60)
        
        # Find test files
        test_files = list(self.project_root.glob(pattern))
        if not test_files:
            print(f"  ⚠️  No {test_type} tests found (pattern: {pattern})")
            return
        
        print(f"  Found {len(test_files)} {test_type} test files")
        
        # Run tests with pytest
        cmd = [
            sys.executable, "-m", "pytest",
            "--tb=short",
            "--no-header",
            "-v"
        ]
        
        # Add test files
        cmd.extend([str(f) for f in test_files])
        
        # Run with coverage for unit tests
        if test_type == "unit":
            cmd.extend([
                "--cov=src",
                "--cov-report=term-missing",
                "--cov-report=xml"
            ])
        
        try:
            start_time = datetime.now()
            result = subprocess.run(cmd, capture_output=True, text=True, 
                                  timeout=timeout, cwd=self.project_root)
            duration = (datetime.now() - start_time).total_seconds()
            
            # Parse results
            self._parse_pytest_results(result, test_type, duration)
            
        except subprocess.TimeoutExpired:
            self.results.append(TestResult(
                name=f"{test_type}_tests",
                passed=False,
                duration=timeout,
                error=f"Tests timed out after {timeout}s",
                category=test_type
            ))
        except Exception as e:
            self.results.append(TestResult(
                name=f"{test_type}_tests",
                passed=False,
                duration=0,
                error=f"Test execution failed: {e}",
                category=test_type
            ))
    
    def _parse_pytest_results(self, result: subprocess.CompletedProcess, 
                             test_type: str, duration: float):
        """Parse pytest output to extract test results"""
        output = result.stdout
        lines = output.split('\\n')
        
        # Extract test results
        test_count = 0
        passed_count = 0
        failed_count = 0
        
        for line in lines:
            if " PASSED " in line:
                passed_count += 1
                test_count += 1
            elif " FAILED " in line:
                failed_count += 1
                test_count += 1
            elif " ERROR " in line:
                failed_count += 1
                test_count += 1
        
        # Create summary result
        self.results.append(TestResult(
            name=f"{test_type}_suite",
            passed=failed_count == 0,
            duration=duration,
            output=f"Ran {test_count} tests: {passed_count} passed, {failed_count} failed",
            error=result.stderr if failed_count > 0 else "",
            category=test_type
        ))
    
    def _run_coverage_analysis(self) -> Dict:
        """Run code coverage analysis"""
        print("\\n📊 Analyzing code coverage...")
        
        coverage_file = self.project_root / "coverage.xml"
        if not coverage_file.exists():
            return {"status": "not_available", "coverage": 0}
        
        try:
            tree = ET.parse(coverage_file)
            root = tree.getroot()
            
            # Extract coverage percentage
            coverage_attr = root.get('line-rate', '0')
            coverage_percentage = float(coverage_attr) * 100
            
            return {
                "status": "success",
                "coverage": round(coverage_percentage, 1),
                "minimum": self.config["coverage"]["minimum"],
                "passed": coverage_percentage >= self.config["coverage"]["minimum"]
            }
            
        except Exception as e:
            return {"status": "error", "error": str(e), "coverage": 0}
    
    def _generate_comprehensive_report(self, validation_results: Dict, 
                                     coverage_results: Dict) -> Dict:
        """Generate comprehensive test report"""
        timestamp = datetime.now().isoformat()
        
        # Calculate test statistics
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if r.passed])
        failed_tests = total_tests - passed_tests
        total_duration = sum(r.duration for r in self.results)
        
        # Test results by category
        categories = {}
        for result in self.results:
            category = result.category
            if category not in categories:
                categories[category] = {"passed": 0, "failed": 0, "duration": 0}
            
            if result.passed:
                categories[category]["passed"] += 1
            else:
                categories[category]["failed"] += 1
            categories[category]["duration"] += result.duration
        
        # Overall success determination
        validation_passed = validation_results.get("overall_success", True)
        tests_passed = failed_tests == 0
        coverage_passed = coverage_results.get("passed", True)
        overall_success = validation_passed and tests_passed and coverage_passed
        
        return {
            "timestamp": timestamp,
            "overall_success": overall_success,
            "summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "total_duration": round(total_duration, 2),
                "success_rate": round((passed_tests / total_tests * 100) if total_tests > 0 else 0, 1)
            },
            "validation": validation_results,
            "coverage": coverage_results,
            "categories": categories,
            "test_results": [
                {
                    "name": r.name,
                    "passed": r.passed,
                    "duration": r.duration,
                    "category": r.category,
                    "output": r.output,
                    "error": r.error
                } for r in self.results
            ],
            "recommendations": self._generate_recommendations(validation_results, coverage_results)
        }
    
    def _generate_failed_report(self, validation_results: Dict) -> Dict:
        """Generate report when validation fails"""
        return {
            "timestamp": datetime.now().isoformat(),
            "overall_success": False,
            "summary": {
                "total_tests": 0,
                "passed_tests": 0,
                "failed_tests": 0,
                "total_duration": 0,
                "success_rate": 0
            },
            "validation": validation_results,
            "failure_reason": "Validation checks failed",
            "recommendations": ["Fix validation errors before running tests"]
        }
    
    def _generate_recommendations(self, validation_results: Dict, 
                                coverage_results: Dict) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Test-specific recommendations
        failed_tests = [r for r in self.results if not r.passed]
        if failed_tests:
            recommendations.append(f"Fix {len(failed_tests)} failing tests")
        
        # Coverage recommendations
        if coverage_results.get("status") == "success":
            coverage = coverage_results["coverage"]
            minimum = coverage_results["minimum"]
            if coverage < minimum:
                recommendations.append(f"Improve test coverage from {coverage}% to {minimum}%")
        
        # Validation recommendations
        if validation_results.get("overall_success") == False:
            recommendations.append("Address validation issues before deployment")
        
        # Performance recommendations
        slow_tests = [r for r in self.results if r.duration > 30]
        if slow_tests:
            recommendations.append(f"Optimize {len(slow_tests)} slow-running tests")
        
        # Success recommendations
        if not recommendations:
            recommendations.append("✅ All tests passing! Ready for deployment")
        
        return recommendations
    
    def _print_summary(self, report: Dict):
        """Print test summary to console"""
        summary = report["summary"]
        
        # Overall status
        status_icon = "✅" if report["overall_success"] else "❌"
        print(f"{status_icon} Overall Status: {'PASSED' if report['overall_success'] else 'FAILED'}")
        print(f"📊 Test Results: {summary['passed_tests']}/{summary['total_tests']} passed ({summary['success_rate']}%)")
        print(f"⏱️  Duration: {summary['total_duration']}s")
        
        # Coverage
        if "coverage" in report and report["coverage"].get("status") == "success":
            coverage = report["coverage"]
            coverage_icon = "✅" if coverage["passed"] else "❌"
            print(f"{coverage_icon} Coverage: {coverage['coverage']}% (minimum: {coverage['minimum']}%)")
        
        # Validation
        if "validation" in report and report["validation"].get("overall_success") is not None:
            validation_icon = "✅" if report["validation"]["overall_success"] else "❌"
            print(f"{validation_icon} Validation: {'PASSED' if report['validation']['overall_success'] else 'FAILED'}")
        
        # Category breakdown
        if report["categories"]:
            print("\\n📋 Test Categories:")
            for category, stats in report["categories"].items():
                total = stats["passed"] + stats["failed"]
                print(f"  {category}: {stats['passed']}/{total} passed ({stats['duration']:.1f}s)")
        
        # Recommendations
        if report["recommendations"]:
            print("\\n💡 Recommendations:")
            for rec in report["recommendations"]:
                print(f"  {rec}")
    
    def save_report(self, report: Dict, output_dir: str = "test-reports"):
        """Save test report in multiple formats"""
        output_path = self.project_root / output_dir
        output_path.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save JSON report
        json_file = output_path / f"test_report_{timestamp}.json"
        with open(json_file, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        # Save JUnit XML for CI/CD integration
        junit_file = output_path / f"junit_report_{timestamp}.xml"
        self._save_junit_report(report, junit_file)
        
        print(f"\\n📄 Reports saved:")
        print(f"  JSON: {json_file}")
        print(f"  JUnit: {junit_file}")
    
    def _save_junit_report(self, report: Dict, output_file: Path):
        """Save test report in JUnit XML format"""
        root = ET.Element("testsuite")
        root.set("name", "comprehensive_test_suite")
        root.set("tests", str(report["summary"]["total_tests"]))
        root.set("failures", str(report["summary"]["failed_tests"]))
        root.set("time", str(report["summary"]["total_duration"]))
        
        for test_result in report["test_results"]:
            testcase = ET.SubElement(root, "testcase")
            testcase.set("name", test_result["name"])
            testcase.set("classname", test_result["category"])
            testcase.set("time", str(test_result["duration"]))
            
            if not test_result["passed"]:
                failure = ET.SubElement(testcase, "failure")
                failure.set("message", test_result["error"][:100])
                failure.text = test_result["error"]
        
        tree = ET.ElementTree(root)
        tree.write(output_file, encoding="utf-8", xml_declaration=True)

def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description='Enhanced Testing Framework for Gyro-Style Development'
    )
    
    parser.add_argument('project_root', help='Project root directory')
    parser.add_argument('--types', nargs='+', 
                       choices=['unit', 'integration', 'performance', 'acceptance'],
                       help='Test types to run (default: all)')
    parser.add_argument('--no-validation', action='store_true',
                       help='Skip validation checks')
    parser.add_argument('--output-dir', default='test-reports',
                       help='Output directory for reports')
    parser.add_argument('--save-reports', action='store_true',
                       help='Save detailed reports to files')
    
    args = parser.parse_args()
    
    # Initialize framework
    framework = EnhancedTestFramework(args.project_root)
    
    # Run tests
    report = framework.run_comprehensive_tests(
        test_types=args.types,
        include_validation=not args.no_validation
    )
    
    # Save reports if requested
    if args.save_reports:
        framework.save_report(report, args.output_dir)
    
    # Exit with appropriate code
    if not report["overall_success"]:
        sys.exit(1)

if __name__ == "__main__":
    main()