#!/usr/bin/env python3
"""
Comprehensive Validation Runner
Orchestrates all validation scripts for complete project assessment
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

class ValidationOrchestrator:
    """Orchestrates all project validation scripts"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.validation_dir = self.project_root / "scripts" / "validation"
        self.results = {}
        self.overall_success = True
        
    def run_all_validations(self, args: argparse.Namespace) -> Dict:
        """Run all validation scripts and collect results"""
        print("🔍 Running comprehensive project validation...")
        print("=" * 60)
        
        validations = [
            ("specifications", "Specification consistency and completeness"),
            ("steering", "AI steering configuration"),
            ("hooks", "Agent hooks framework"),
            ("production-ready", "Production deployment readiness")
        ]
        
        for validation_name, description in validations:
            print(f"\n📋 {description}...")
            result = self._run_validation(validation_name, args)
            self.results[validation_name] = result
            
            if not result.get("success", False):
                self.overall_success = False
        
        # Generate combined report
        combined_report = self._generate_combined_report()
        
        print("\n" + "=" * 60)
        print("🎯 Validation Summary")
        print("=" * 60)
        self._print_summary(combined_report)
        
        return combined_report
    
    def _run_validation(self, validation_name: str, args: argparse.Namespace) -> Dict:
        """Run a specific validation script"""
        script_path = self.validation_dir / f"validate-{validation_name}.py"
        
        if not script_path.exists():
            return {
                "success": False,
                "error": f"Validation script not found: {script_path}",
                "report": {}
            }
        
        # Build command
        cmd = [
            sys.executable,
            str(script_path),
            str(self.project_root),
            "--format", "json"
        ]
        
        # Add validation-specific arguments
        if validation_name == "production-ready" and args.environment:
            cmd.extend(["--environment", args.environment])
        
        if args.fail_on_errors:
            cmd.append("--fail-on-errors")
        
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.stdout:
                try:
                    report = json.loads(result.stdout)
                    return {
                        "success": result.returncode == 0,
                        "returncode": result.returncode,
                        "report": report,
                        "stderr": result.stderr if result.stderr else None
                    }
                except json.JSONDecodeError as e:
                    return {
                        "success": False,
                        "error": f"Invalid JSON output: {e}",
                        "stdout": result.stdout,
                        "stderr": result.stderr
                    }
            else:
                return {
                    "success": False,
                    "error": "No output from validation script",
                    "stderr": result.stderr
                }
                
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": "Validation script timed out"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to run validation script: {e}"
            }
    
    def _generate_combined_report(self) -> Dict:
        """Generate combined validation report"""
        timestamp = datetime.now().isoformat()
        
        # Aggregate issues by category and level
        all_issues = {"errors": [], "warnings": [], "info": []}
        category_scores = {}
        total_score = 0
        valid_validations = 0
        
        for validation_name, result in self.results.items():
            if result.get("success") and "report" in result:
                report = result["report"]
                
                # Extract issues
                if "issues" in report:
                    for level, issues in report["issues"].items():
                        all_issues[level].extend([
                            {**issue, "validation": validation_name}
                            for issue in issues
                        ])
                
                # Extract scores
                if "summary" in report:
                    summary = report["summary"]
                    if "readiness_score" in summary:
                        score = summary["readiness_score"]
                    elif "validation_passed" in summary:
                        # Convert boolean to score
                        score = 100 if summary["validation_passed"] else 50
                    else:
                        # Calculate score based on issues
                        errors = summary.get("errors", 0)
                        warnings = summary.get("warnings", 0)
                        score = max(0, 100 - (errors * 20) - (warnings * 10))
                    
                    category_scores[validation_name] = score
                    total_score += score
                    valid_validations += 1
        
        # Calculate overall score
        overall_score = total_score / valid_validations if valid_validations > 0 else 0
        
        # Generate recommendations
        recommendations = self._generate_overall_recommendations(all_issues, category_scores)
        
        return {
            "timestamp": timestamp,
            "project_root": str(self.project_root),
            "overall_success": self.overall_success,
            "overall_score": round(overall_score, 1),
            "summary": {
                "total_validations": len(self.results),
                "successful_validations": len([r for r in self.results.values() if r.get("success")]),
                "failed_validations": len([r for r in self.results.values() if not r.get("success")]),
                "total_errors": len(all_issues["errors"]),
                "total_warnings": len(all_issues["warnings"]),
                "total_info": len(all_issues["info"])
            },
            "validation_results": self.results,
            "category_scores": category_scores,
            "aggregated_issues": all_issues,
            "recommendations": recommendations,
            "next_actions": self._generate_next_actions(all_issues, category_scores)
        }
    
    def _generate_overall_recommendations(self, issues: Dict, scores: Dict) -> List[str]:
        """Generate overall recommendations based on all validation results"""
        recommendations = []
        
        total_errors = len(issues["errors"])
        total_warnings = len(issues["warnings"])
        
        # Critical issues
        if total_errors > 0:
            recommendations.append(f"🚨 Address {total_errors} critical errors before proceeding")
        
        # Category-specific recommendations
        low_scoring_categories = [name for name, score in scores.items() if score < 70]
        if low_scoring_categories:
            recommendations.append(f"📊 Focus on improving: {', '.join(low_scoring_categories)}")
        
        # Warning-level recommendations
        if total_warnings > 5:
            recommendations.append(f"⚠️ Consider addressing {total_warnings} warnings for better quality")
        
        # Production readiness
        if "production-ready" in scores and scores["production-ready"] < 80:
            recommendations.append("🚀 Not recommended for production deployment yet")
        elif "production-ready" in scores and scores["production-ready"] >= 90:
            recommendations.append("✅ Production deployment approved")
        
        # Documentation and process
        if "specifications" in scores and scores["specifications"] < 80:
            recommendations.append("📝 Improve project documentation and specifications")
        
        if "steering" in scores and scores["steering"] < 80:
            recommendations.append("🧭 Enhance AI steering configuration for better guidance")
        
        if "hooks" in scores and scores["hooks"] < 80:
            recommendations.append("🪝 Complete hooks framework setup for automation")
        
        # Overall recommendations
        if len(recommendations) == 0:
            recommendations.append("🎉 All validations passed! Project is in excellent shape")
        elif len(recommendations) > 5:
            recommendations.append("📋 Create action plan to systematically address all issues")
        
        return recommendations
    
    def _generate_next_actions(self, issues: Dict, scores: Dict) -> List[str]:
        """Generate actionable next steps"""
        actions = []
        
        # Immediate actions for errors
        if issues["errors"]:
            actions.append("🔧 Fix critical errors immediately")
            actions.append("🧪 Re-run validations after fixes")
        
        # Medium-term actions for warnings
        if issues["warnings"]:
            actions.append("📋 Prioritize and schedule warning fixes")
            actions.append("👥 Review warnings with team for impact assessment")
        
        # Long-term improvements
        low_scores = [name for name, score in scores.items() if score < 80]
        if low_scores:
            actions.append(f"📈 Create improvement plan for: {', '.join(low_scores)}")
        
        # Process improvements
        if len(issues["errors"]) + len(issues["warnings"]) > 10:
            actions.append("🔄 Review development process to prevent future issues")
            actions.append("📚 Update team guidelines and best practices")
        
        # Success actions
        if not issues["errors"] and len(issues["warnings"]) <= 3:
            actions.append("🚀 Consider deployment to next environment")
            actions.append("📊 Set up monitoring for ongoing quality tracking")
        
        return actions
    
    def _print_summary(self, report: Dict):
        """Print validation summary to console"""
        summary = report["summary"]
        
        # Overall status
        status_icon = "✅" if report["overall_success"] else "❌"
        print(f"{status_icon} Overall Status: {'PASSED' if report['overall_success'] else 'FAILED'}")
        print(f"📊 Overall Score: {report['overall_score']}/100")
        print()
        
        # Validation breakdown
        print("📋 Validation Results:")
        for validation_name, result in report["validation_results"].items():
            if result.get("success"):
                score = report["category_scores"].get(validation_name, "N/A")
                print(f"  ✅ {validation_name}: {score}/100")
            else:
                error = result.get("error", "Unknown error")
                print(f"  ❌ {validation_name}: FAILED ({error})")
        print()
        
        # Issue summary
        print("🔍 Issue Summary:")
        print(f"  🚨 Errors: {summary['total_errors']}")
        print(f"  ⚠️  Warnings: {summary['total_warnings']}")
        print(f"  ℹ️  Info: {summary['total_info']}")
        print()
        
        # Top recommendations
        if report["recommendations"]:
            print("💡 Key Recommendations:")
            for rec in report["recommendations"][:5]:  # Show top 5
                print(f"  {rec}")
            print()
        
        # Next actions
        if report["next_actions"]:
            print("🎯 Next Actions:")
            for action in report["next_actions"][:3]:  # Show top 3
                print(f"  {action}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description='Run comprehensive project validation',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run-all-validations.py /path/to/project
  python run-all-validations.py . --environment staging --output validation-report.json
  python run-all-validations.py . --fail-on-errors --format text
        """
    )
    
    parser.add_argument('project_root', help='Project root directory')
    parser.add_argument('--output', help='Output file for combined validation report')
    parser.add_argument('--format', choices=['json', 'text'], default='text',
                      help='Output format (default: text)')
    parser.add_argument('--environment', default='production',
                      help='Target environment for production validation (default: production)')
    parser.add_argument('--fail-on-errors', action='store_true',
                      help='Exit with error code if any validation has errors')
    parser.add_argument('--fail-on-warnings', action='store_true',
                      help='Exit with error code if any validation has warnings')
    parser.add_argument('--quiet', action='store_true',
                      help='Suppress console output except for final summary')
    
    args = parser.parse_args()
    
    # Validate project root
    project_root = Path(args.project_root).resolve()
    if not project_root.exists():
        print(f"❌ Error: Project root does not exist: {project_root}")
        sys.exit(1)
    
    # Run validations
    orchestrator = ValidationOrchestrator(str(project_root))
    
    if args.quiet:
        # Suppress print statements during validation
        import io
        import contextlib
        
        f = io.StringIO()
        with contextlib.redirect_stdout(f):
            report = orchestrator.run_all_validations(args)
    else:
        report = orchestrator.run_all_validations(args)
    
    # Generate output
    if args.format == 'json':
        output = json.dumps(report, indent=2, default=str)
    else:
        output = format_text_report(report)
    
    # Save to file if requested
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
        if not args.quiet:
            print(f"\n📄 Report saved to: {args.output}")
    else:
        if args.format == 'text' and not args.quiet:
            pass  # Already printed in _print_summary
        else:
            print(output)
    
    # Exit with appropriate code
    if args.fail_on_errors and report['summary']['total_errors'] > 0:
        sys.exit(1)
    elif args.fail_on_warnings and report['summary']['total_warnings'] > 0:
        sys.exit(1)
    elif not report['overall_success']:
        sys.exit(2)

def format_text_report(report: Dict) -> str:
    """Format report as comprehensive text"""
    lines = []
    
    lines.append("Comprehensive Project Validation Report")
    lines.append("=" * 60)
    lines.append(f"Timestamp: {report['timestamp']}")
    lines.append(f"Project: {report['project_root']}")
    lines.append(f"Overall Score: {report['overall_score']}/100")
    lines.append(f"Overall Status: {'PASSED' if report['overall_success'] else 'FAILED'}")
    lines.append("")
    
    # Validation breakdown
    lines.append("📊 Validation Scores:")
    for validation_name, score in report['category_scores'].items():
        lines.append(f"  {validation_name}: {score}/100")
    lines.append("")
    
    # Issue summary by validation
    lines.append("🔍 Issues by Validation:")
    for validation_name, result in report['validation_results'].items():
        if result.get('success') and 'report' in result:
            val_report = result['report']
            if 'summary' in val_report:
                summary = val_report['summary']
                errors = summary.get('errors', 0)
                warnings = summary.get('warnings', 0)
                info = summary.get('info', 0)
                
                if errors + warnings + info > 0:
                    lines.append(f"  {validation_name}:")
                    if errors > 0:
                        lines.append(f"    🚨 Errors: {errors}")
                    if warnings > 0:
                        lines.append(f"    ⚠️  Warnings: {warnings}")
                    if info > 0:
                        lines.append(f"    ℹ️  Info: {info}")
        elif not result.get('success'):
            lines.append(f"  {validation_name}: ❌ FAILED - {result.get('error', 'Unknown error')}")
    lines.append("")
    
    # Top issues across all validations
    all_issues = report['aggregated_issues']
    if all_issues['errors']:
        lines.append("🚨 Critical Errors:")
        for error in all_issues['errors'][:5]:  # Show top 5
            lines.append(f"  [{error['validation']}] {error['message']}")
        if len(all_issues['errors']) > 5:
            lines.append(f"  ... and {len(all_issues['errors']) - 5} more errors")
        lines.append("")
    
    if all_issues['warnings']:
        lines.append("⚠️  Important Warnings:")
        for warning in all_issues['warnings'][:5]:  # Show top 5
            lines.append(f"  [{warning['validation']}] {warning['message']}")
        if len(all_issues['warnings']) > 5:
            lines.append(f"  ... and {len(all_issues['warnings']) - 5} more warnings")
        lines.append("")
    
    # Recommendations
    if report['recommendations']:
        lines.append("💡 Recommendations:")
        for rec in report['recommendations']:
            lines.append(f"  {rec}")
        lines.append("")
    
    # Next actions
    if report['next_actions']:
        lines.append("🎯 Next Actions:")
        for action in report['next_actions']:
            lines.append(f"  {action}")
        lines.append("")
    
    # Footer
    lines.append("=" * 60)
    lines.append("Generated by AI Development Cycle Template validation system")
    
    return "\n".join(lines)

if __name__ == "__main__":
    main()