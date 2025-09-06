#!/usr/bin/env python3
"""
Specification Validation Script
Validates consistency and completeness of project specifications
"""

import os
import json
import yaml
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass
from enum import Enum

class ValidationLevel(Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"

@dataclass
class ValidationResult:
    level: ValidationLevel
    message: str
    file_path: str = ""
    line_number: int = 0
    suggestion: str = ""

class SpecificationValidator:
    """Validates project specifications for consistency and completeness"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results: List[ValidationResult] = []
        self.specs_dir = self.project_root / "docs" / "specifications"
        self.config = self._load_validation_config()
        
    def _load_validation_config(self) -> Dict:
        """Load validation configuration"""
        config_path = self.project_root / ".claude" / "validation-config.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return self._default_config()
    
    def _default_config(self) -> Dict:
        """Default validation configuration"""
        return {
            "required_sections": {
                "requirements": ["purpose", "scope", "user_stories", "acceptance_criteria"],
                "design": ["architecture", "data_model", "api_design", "security"],
                "tasks": ["task_breakdown", "dependencies", "timeline", "testing"]
            },
            "naming_conventions": {
                "requirements_file": r".*requirements\.md$",
                "design_file": r".*design\.md$", 
                "tasks_file": r".*tasks\.md$"
            },
            "cross_reference_checks": True,
            "completeness_threshold": 0.8
        }
    
    def validate_all(self) -> List[ValidationResult]:
        """Run all specification validations"""
        self.results = []
        
        # Check if specifications directory exists
        if not self.specs_dir.exists():
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message="Specifications directory not found",
                file_path=str(self.specs_dir),
                suggestion="Create docs/specifications/ directory"
            ))
            return self.results
        
        # Validate individual specification files
        self._validate_requirements_files()
        self._validate_design_files()
        self._validate_task_files()
        
        # Validate cross-references and consistency
        self._validate_cross_references()
        self._validate_completeness()
        self._validate_traceability()
        
        return self.results
    
    def _validate_requirements_files(self):
        """Validate requirements specification files"""
        req_files = list(self.specs_dir.glob("*requirements*.md"))
        
        if not req_files:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No requirements files found",
                suggestion="Create requirements.md files for your features"
            ))
            return
        
        for req_file in req_files:
            self._validate_requirements_structure(req_file)
            self._validate_requirements_content(req_file)
    
    def _validate_requirements_structure(self, file_path: Path):
        """Validate requirements file structure"""
        content = file_path.read_text()
        required_sections = self.config["required_sections"]["requirements"]
        
        for section in required_sections:
            if not self._has_section(content, section):
                self.results.append(ValidationResult(
                    level=ValidationLevel.ERROR,
                    message=f"Missing required section: {section}",
                    file_path=str(file_path),
                    suggestion=f"Add ## {section.title()} section to requirements"
                ))
    
    def _validate_requirements_content(self, file_path: Path):
        """Validate requirements content quality"""
        content = file_path.read_text()
        
        # Check for user stories format
        user_story_pattern = r"As a .*, I want .*, so that .*"
        if "user stories" in content.lower() and not re.search(user_story_pattern, content, re.IGNORECASE):
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="User stories not in standard format",
                file_path=str(file_path),
                suggestion="Use format: 'As a [user], I want [goal], so that [benefit]'"
            ))
        
        # Check for acceptance criteria
        if "acceptance criteria" in content.lower():
            ac_pattern = r"(Given|When|Then|And)"
            if not re.search(ac_pattern, content):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Acceptance criteria missing Given/When/Then format",
                    file_path=str(file_path),
                    suggestion="Use Gherkin syntax for acceptance criteria"
                ))
    
    def _validate_design_files(self):
        """Validate design specification files"""
        design_files = list(self.specs_dir.glob("*design*.md"))
        
        for design_file in design_files:
            self._validate_design_structure(design_file)
            self._validate_design_content(design_file)
    
    def _validate_design_structure(self, file_path: Path):
        """Validate design file structure"""
        content = file_path.read_text()
        required_sections = self.config["required_sections"]["design"]
        
        for section in required_sections:
            if not self._has_section(content, section):
                self.results.append(ValidationResult(
                    level=ValidationLevel.ERROR,
                    message=f"Missing required section: {section}",
                    file_path=str(file_path),
                    suggestion=f"Add ## {section.replace('_', ' ').title()} section"
                ))
    
    def _validate_design_content(self, file_path: Path):
        """Validate design content quality"""
        content = file_path.read_text()
        
        # Check for API documentation
        if "api" in content.lower():
            if not re.search(r"(GET|POST|PUT|DELETE|PATCH)", content):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="API design missing HTTP methods",
                    file_path=str(file_path),
                    suggestion="Specify HTTP methods for API endpoints"
                ))
        
        # Check for database schema
        if "database" in content.lower() or "data model" in content.lower():
            if not re.search(r"(table|schema|entity|relationship)", content, re.IGNORECASE):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Data model lacks detailed schema information",
                    file_path=str(file_path),
                    suggestion="Include table structures and relationships"
                ))
    
    def _validate_task_files(self):
        """Validate task specification files"""
        task_files = list(self.specs_dir.glob("*task*.md"))
        
        for task_file in task_files:
            self._validate_task_structure(task_file)
            self._validate_task_content(task_file)
    
    def _validate_task_structure(self, file_path: Path):
        """Validate task file structure"""
        content = file_path.read_text()
        required_sections = self.config["required_sections"]["tasks"]
        
        for section in required_sections:
            if not self._has_section(content, section):
                self.results.append(ValidationResult(
                    level=ValidationLevel.ERROR,
                    message=f"Missing required section: {section}",
                    file_path=str(file_path),
                    suggestion=f"Add ## {section.replace('_', ' ').title()} section"
                ))
    
    def _validate_task_content(self, file_path: Path):
        """Validate task content quality"""
        content = file_path.read_text()
        
        # Check for task numbering/identification
        task_pattern = r"(Task|TODO|Feature)[\s\-#]*\d+"
        if not re.search(task_pattern, content, re.IGNORECASE):
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="Tasks not clearly numbered or identified",
                file_path=str(file_path),
                suggestion="Use clear task numbering (e.g., Task 1, Task 2)"
            ))
        
        # Check for dependency information
        if "dependencies" in content.lower():
            dep_pattern = r"(depends on|requires|after|before)"
            if not re.search(dep_pattern, content, re.IGNORECASE):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Dependencies section lacks clear dependency relationships",
                    file_path=str(file_path),
                    suggestion="Specify which tasks depend on others"
                ))
    
    def _validate_cross_references(self):
        """Validate cross-references between specification files"""
        if not self.config.get("cross_reference_checks", True):
            return
        
        spec_files = list(self.specs_dir.glob("*.md"))
        
        for spec_file in spec_files:
            content = spec_file.read_text()
            
            # Find references to other files
            ref_pattern = r"\[.*?\]\((.*?\.md)\)"
            references = re.findall(ref_pattern, content)
            
            for ref in references:
                ref_path = self.specs_dir / ref
                if not ref_path.exists():
                    self.results.append(ValidationResult(
                        level=ValidationLevel.ERROR,
                        message=f"Broken reference to {ref}",
                        file_path=str(spec_file),
                        suggestion=f"Create {ref} or fix the reference"
                    ))
    
    def _validate_completeness(self):
        """Validate overall specification completeness"""
        expected_files = [
            "requirements.md",
            "design.md", 
            "tasks.md"
        ]
        
        missing_files = []
        for expected_file in expected_files:
            if not (self.specs_dir / expected_file).exists():
                # Check for similar files
                pattern = expected_file.replace(".md", "*.md")
                similar_files = list(self.specs_dir.glob(pattern))
                if not similar_files:
                    missing_files.append(expected_file)
        
        if missing_files:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"Missing specification files: {', '.join(missing_files)}",
                suggestion="Create missing specification files for complete coverage"
            ))
    
    def _validate_traceability(self):
        """Validate traceability between requirements, design, and tasks"""
        req_files = list(self.specs_dir.glob("*requirements*.md"))
        design_files = list(self.specs_dir.glob("*design*.md"))
        task_files = list(self.specs_dir.glob("*task*.md"))
        
        if req_files and design_files:
            self._check_requirements_to_design_traceability(req_files[0], design_files[0])
        
        if design_files and task_files:
            self._check_design_to_tasks_traceability(design_files[0], task_files[0])
    
    def _check_requirements_to_design_traceability(self, req_file: Path, design_file: Path):
        """Check if requirements are addressed in design"""
        req_content = req_file.read_text()
        design_content = design_file.read_text()
        
        # Extract user stories
        user_stories = re.findall(r"As a .*, I want .*, so that .*", req_content, re.IGNORECASE)
        
        unaddressed_stories = []
        for story in user_stories:
            # Simple check if story concepts appear in design
            story_words = re.findall(r'\b\w+\b', story.lower())
            key_words = [word for word in story_words if len(word) > 4]
            
            if key_words:
                found_in_design = any(word in design_content.lower() for word in key_words[:3])
                if not found_in_design:
                    unaddressed_stories.append(story[:50] + "...")
        
        if unaddressed_stories:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"Some user stories may not be addressed in design",
                file_path=str(design_file),
                suggestion="Ensure all requirements are addressed in design"
            ))
    
    def _check_design_to_tasks_traceability(self, design_file: Path, task_file: Path):
        """Check if design elements are covered in tasks"""
        design_content = design_file.read_text()
        task_content = task_file.read_text()
        
        # Look for design components that should have corresponding tasks
        components = re.findall(r"(component|service|module|api|database)\s+(\w+)", 
                              design_content, re.IGNORECASE)
        
        missing_tasks = []
        for comp_type, comp_name in components:
            if comp_name.lower() not in task_content.lower():
                missing_tasks.append(f"{comp_type} {comp_name}")
        
        if missing_tasks and len(missing_tasks) > 2:  # Threshold to avoid noise
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="Some design components may not have corresponding tasks",
                file_path=str(task_file),
                suggestion="Ensure all design components have implementation tasks"
            ))
    
    def _has_section(self, content: str, section: str) -> bool:
        """Check if content has a specific section"""
        section_patterns = [
            f"^#{1,4}\\s+{section.replace('_', '\\s+')}",
            f"^#{1,4}\\s+{section.replace('_', '\\s+').title()}",
            f"^#{1,4}\\s+{section.replace('_', '\\s+').upper()}"
        ]
        
        for pattern in section_patterns:
            if re.search(pattern, content, re.MULTILINE | re.IGNORECASE):
                return True
        return False
    
    def generate_report(self) -> Dict:
        """Generate validation report"""
        errors = [r for r in self.results if r.level == ValidationLevel.ERROR]
        warnings = [r for r in self.results if r.level == ValidationLevel.WARNING]
        info = [r for r in self.results if r.level == ValidationLevel.INFO]
        
        return {
            "summary": {
                "total_issues": len(self.results),
                "errors": len(errors),
                "warnings": len(warnings),
                "info": len(info),
                "validation_passed": len(errors) == 0
            },
            "issues": {
                "errors": [self._result_to_dict(r) for r in errors],
                "warnings": [self._result_to_dict(r) for r in warnings],
                "info": [self._result_to_dict(r) for r in info]
            },
            "recommendations": self._generate_recommendations()
        }
    
    def _result_to_dict(self, result: ValidationResult) -> Dict:
        """Convert validation result to dictionary"""
        return {
            "level": result.level.value,
            "message": result.message,
            "file_path": result.file_path,
            "line_number": result.line_number,
            "suggestion": result.suggestion
        }
    
    def _generate_recommendations(self) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []
        
        error_count = len([r for r in self.results if r.level == ValidationLevel.ERROR])
        warning_count = len([r for r in self.results if r.level == ValidationLevel.WARNING])
        
        if error_count > 0:
            recommendations.append(f"Address {error_count} critical specification issues")
        
        if warning_count > 3:
            recommendations.append("Consider improving specification quality standards")
        
        if not self.specs_dir.exists():
            recommendations.append("Establish specification documentation structure")
        
        # File-specific recommendations
        missing_files = []
        for expected in ["requirements.md", "design.md", "tasks.md"]:
            if not (self.specs_dir / expected).exists():
                missing_files.append(expected)
        
        if missing_files:
            recommendations.append(f"Create missing specification files: {', '.join(missing_files)}")
        
        if len(recommendations) == 0:
            recommendations.append("Specifications are well-structured and complete")
        
        return recommendations

def main():
    """Main validation function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate project specifications')
    parser.add_argument('project_root', help='Project root directory')
    parser.add_argument('--output', help='Output file for validation report')
    parser.add_argument('--format', choices=['json', 'text'], default='text',
                      help='Output format')
    parser.add_argument('--fail-on-errors', action='store_true',
                      help='Exit with error code if validation errors found')
    
    args = parser.parse_args()
    
    validator = SpecificationValidator(args.project_root)
    validator.validate_all()
    report = validator.generate_report()
    
    if args.format == 'json':
        output = json.dumps(report, indent=2)
    else:
        output = format_text_report(report)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
    else:
        print(output)
    
    if args.fail_on_errors and report['summary']['errors'] > 0:
        sys.exit(1)

def format_text_report(report: Dict) -> str:
    """Format report as human-readable text"""
    lines = []
    summary = report['summary']
    
    lines.append("Specification Validation Report")
    lines.append("=" * 50)
    lines.append(f"Total Issues: {summary['total_issues']}")
    lines.append(f"Errors: {summary['errors']}")
    lines.append(f"Warnings: {summary['warnings']}")
    lines.append(f"Info: {summary['info']}")
    lines.append(f"Validation Passed: {'✅ Yes' if summary['validation_passed'] else '❌ No'}")
    lines.append("")
    
    if report['issues']['errors']:
        lines.append("🚨 Errors:")
        for error in report['issues']['errors']:
            lines.append(f"  - {error['message']}")
            if error['file_path']:
                lines.append(f"    File: {error['file_path']}")
            if error['suggestion']:
                lines.append(f"    Suggestion: {error['suggestion']}")
        lines.append("")
    
    if report['issues']['warnings']:
        lines.append("⚠️  Warnings:")
        for warning in report['issues']['warnings']:
            lines.append(f"  - {warning['message']}")
            if warning['file_path']:
                lines.append(f"    File: {warning['file_path']}")
            if warning['suggestion']:
                lines.append(f"    Suggestion: {warning['suggestion']}")
        lines.append("")
    
    if report['recommendations']:
        lines.append("💡 Recommendations:")
        for rec in report['recommendations']:
            lines.append(f"  - {rec}")
    
    return "\n".join(lines)

if __name__ == "__main__":
    main()