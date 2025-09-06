#!/usr/bin/env python3
"""
Steering Files Validation Script
Validates consistency and quality of AI steering configuration files
"""

import os
import json
import yaml
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any, Set
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

class SteeringValidator:
    """Validates AI steering configuration files for consistency and completeness"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results: List[ValidationResult] = []
        self.steering_dir = self.project_root / ".claude" / "steering"
        self.config = self._load_validation_config()
        
    def _load_validation_config(self) -> Dict:
        """Load steering validation configuration"""
        config_path = self.project_root / ".claude" / "steering-config.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return self._default_config()
    
    def _default_config(self) -> Dict:
        """Default steering validation configuration"""
        return {
            "required_files": {
                "core": ["product.md", "tech.md", "structure.md"],
                "quality": ["testing.md", "security.md"],
                "development": ["api-standards.md"]
            },
            "required_sections": {
                "product.md": ["purpose", "target_users", "key_features", "success_metrics"],
                "tech.md": ["technology_stack", "architecture", "constraints", "decisions"],
                "structure.md": ["file_organization", "naming_conventions", "patterns"],
                "testing.md": ["strategy", "frameworks", "coverage_requirements"],
                "security.md": ["requirements", "best_practices", "compliance"],
                "api-standards.md": ["design_principles", "authentication", "error_handling"]
            },
            "content_quality_checks": {
                "min_word_count": 100,
                "max_word_count": 2000,
                "require_examples": True,
                "check_consistency": True
            },
            "inclusion_modes": {
                "always": ["product.md", "tech.md", "structure.md"],
                "conditional": ["testing.md", "security.md", "api-standards.md"]
            }
        }
    
    def validate_all(self) -> List[ValidationResult]:
        """Run all steering validation checks"""
        self.results = []
        
        # Check if steering directory exists
        if not self.steering_dir.exists():
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message="Steering directory not found",
                file_path=str(self.steering_dir),
                suggestion="Create .claude/steering/ directory with steering files"
            ))
            return self.results
        
        # Validate directory structure
        self._validate_directory_structure()
        
        # Validate individual steering files
        self._validate_steering_files()
        
        # Validate configuration consistency
        self._validate_configuration_consistency()
        
        # Validate content quality
        self._validate_content_quality()
        
        # Validate inclusion modes
        self._validate_inclusion_modes()
        
        return self.results
    
    def _validate_directory_structure(self):
        """Validate steering directory structure"""
        required_files = []
        for category in self.config["required_files"].values():
            required_files.extend(category)
        
        missing_files = []
        for required_file in required_files:
            file_path = self.steering_dir / required_file
            if not file_path.exists():
                missing_files.append(required_file)
        
        if missing_files:
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message=f"Missing required steering files: {', '.join(missing_files)}",
                suggestion="Create missing steering files to provide complete AI guidance"
            ))
        
        # Check for unexpected files
        expected_files = set(required_files)
        actual_files = {f.name for f in self.steering_dir.glob("*.md")}
        unexpected_files = actual_files - expected_files
        
        if unexpected_files:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message=f"Unexpected steering files found: {', '.join(unexpected_files)}",
                suggestion="Consider whether these files should be in domain-specific/ subdirectory"
            ))
    
    def _validate_steering_files(self):
        """Validate individual steering files"""
        steering_files = list(self.steering_dir.glob("*.md"))
        
        for steering_file in steering_files:
            self._validate_file_structure(steering_file)
            self._validate_file_content(steering_file)
            self._validate_file_format(steering_file)
    
    def _validate_file_structure(self, file_path: Path):
        """Validate steering file structure"""
        file_name = file_path.name
        if file_name not in self.config["required_sections"]:
            return  # Skip validation for non-standard files
        
        content = file_path.read_text()
        required_sections = self.config["required_sections"][file_name]
        
        for section in required_sections:
            if not self._has_section(content, section):
                self.results.append(ValidationResult(
                    level=ValidationLevel.ERROR,
                    message=f"Missing required section: {section}",
                    file_path=str(file_path),
                    suggestion=f"Add ## {section.replace('_', ' ').title()} section"
                ))
    
    def _validate_file_content(self, file_path: Path):
        """Validate steering file content quality"""
        content = file_path.read_text()
        file_name = file_path.name
        
        # Check word count
        word_count = len(content.split())
        min_words = self.config["content_quality_checks"]["min_word_count"]
        max_words = self.config["content_quality_checks"]["max_word_count"]
        
        if word_count < min_words:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"File content too brief ({word_count} words, minimum {min_words})",
                file_path=str(file_path),
                suggestion="Add more detailed guidance and examples"
            ))
        elif word_count > max_words:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"File content very long ({word_count} words, maximum {max_words})",
                file_path=str(file_path),
                suggestion="Consider breaking into smaller, focused sections"
            ))
        
        # Check for examples if required
        if self.config["content_quality_checks"]["require_examples"]:
            if not self._has_examples(content):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="No examples found in steering file",
                    file_path=str(file_path),
                    suggestion="Add concrete examples to illustrate guidance"
                ))
        
        # File-specific content validation
        self._validate_specific_file_content(file_path, content)
    
    def _validate_specific_file_content(self, file_path: Path, content: str):
        """Validate content specific to each steering file type"""
        file_name = file_path.name
        
        if file_name == "product.md":
            self._validate_product_content(file_path, content)
        elif file_name == "tech.md":
            self._validate_tech_content(file_path, content)
        elif file_name == "structure.md":
            self._validate_structure_content(file_path, content)
        elif file_name == "testing.md":
            self._validate_testing_content(file_path, content)
        elif file_name == "security.md":
            self._validate_security_content(file_path, content)
        elif file_name == "api-standards.md":
            self._validate_api_standards_content(file_path, content)
    
    def _validate_product_content(self, file_path: Path, content: str):
        """Validate product.md specific content"""
        # Check for target users definition
        if "target users" in content.lower() or "target audience" in content.lower():
            if not re.search(r"(persona|user group|demographic)", content, re.IGNORECASE):
                self.results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message="Target users section lacks detailed user personas",
                    file_path=str(file_path),
                    suggestion="Include specific user personas or demographics"
                ))
        
        # Check for success metrics
        if "success metrics" in content.lower() or "kpi" in content.lower():
            metric_patterns = [r"\d+%", r"\d+x", r"increase", r"decrease", r"target"]
            if not any(re.search(pattern, content, re.IGNORECASE) for pattern in metric_patterns):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Success metrics lack specific, measurable targets",
                    file_path=str(file_path),
                    suggestion="Include specific, measurable success metrics"
                ))
    
    def _validate_tech_content(self, file_path: Path, content: str):
        """Validate tech.md specific content"""
        # Check for technology stack completeness
        tech_categories = ["frontend", "backend", "database", "deployment"]
        missing_categories = []
        
        for category in tech_categories:
            if category not in content.lower():
                missing_categories.append(category)
        
        if len(missing_categories) > 2:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message=f"Technology stack may be incomplete, missing: {', '.join(missing_categories)}",
                file_path=str(file_path),
                suggestion="Ensure all relevant technology categories are covered"
            ))
        
        # Check for architecture decisions
        if "decisions" in content.lower():
            if not re.search(r"(rationale|reason|because|chosen)", content, re.IGNORECASE):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Technology decisions lack clear rationale",
                    file_path=str(file_path),
                    suggestion="Include reasoning behind technology choices"
                ))
    
    def _validate_structure_content(self, file_path: Path, content: str):
        """Validate structure.md specific content"""
        # Check for naming conventions
        if "naming" in content.lower():
            convention_patterns = [r"camelCase", r"PascalCase", r"snake_case", r"kebab-case"]
            if not any(re.search(pattern, content) for pattern in convention_patterns):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Naming conventions not clearly specified",
                    file_path=str(file_path),
                    suggestion="Specify exact naming conventions (camelCase, PascalCase, etc.)"
                ))
        
        # Check for file organization patterns
        org_patterns = [r"src/", r"components/", r"utils/", r"services/"]
        if not any(re.search(pattern, content) for pattern in org_patterns):
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="File organization examples not provided",
                file_path=str(file_path),
                suggestion="Include specific directory structure examples"
            ))
    
    def _validate_testing_content(self, file_path: Path, content: str):
        """Validate testing.md specific content"""
        # Check for testing frameworks
        frameworks = ["jest", "cypress", "pytest", "junit", "mocha", "vitest"]
        if not any(framework in content.lower() for framework in frameworks):
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No specific testing frameworks mentioned",
                file_path=str(file_path),
                suggestion="Specify which testing frameworks to use"
            ))
        
        # Check for coverage requirements
        if "coverage" in content.lower():
            if not re.search(r"\d+%", content):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Coverage requirements not quantified",
                    file_path=str(file_path),
                    suggestion="Specify exact coverage percentage targets"
                ))
    
    def _validate_security_content(self, file_path: Path, content: str):
        """Validate security.md specific content"""
        # Check for security practices
        security_topics = ["authentication", "authorization", "encryption", "validation"]
        missing_topics = [topic for topic in security_topics if topic not in content.lower()]
        
        if len(missing_topics) > 1:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"Security guidance incomplete, missing: {', '.join(missing_topics)}",
                file_path=str(file_path),
                suggestion="Include guidance for all major security areas"
            ))
        
        # Check for compliance mentions
        compliance_standards = ["gdpr", "hipaa", "pci", "sox", "iso"]
        if any(std in content.lower() for std in compliance_standards):
            if not re.search(r"(requirement|compliance|audit|certification)", content, re.IGNORECASE):
                self.results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message="Compliance standards mentioned but requirements unclear",
                    file_path=str(file_path),
                    suggestion="Clarify specific compliance requirements and implementation"
                ))
    
    def _validate_api_standards_content(self, file_path: Path, content: str):
        """Validate api-standards.md specific content"""
        # Check for HTTP methods
        http_methods = ["GET", "POST", "PUT", "DELETE", "PATCH"]
        if not any(method in content for method in http_methods):
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="API standards lack HTTP method guidelines",
                file_path=str(file_path),
                suggestion="Include guidelines for HTTP method usage"
            ))
        
        # Check for error handling
        if "error" in content.lower():
            if not re.search(r"(4\d\d|5\d\d|\d{3})", content):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="Error handling lacks specific HTTP status codes",
                    file_path=str(file_path),
                    suggestion="Specify which HTTP status codes to use for different errors"
                ))
    
    def _validate_file_format(self, file_path: Path):
        """Validate steering file format and syntax"""
        content = file_path.read_text()
        
        # Check for valid markdown syntax
        if not content.strip():
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message="Steering file is empty",
                file_path=str(file_path),
                suggestion="Add content to provide AI guidance"
            ))
            return
        
        # Check for proper heading structure
        headings = re.findall(r'^(#{1,6})\s+(.+)$', content, re.MULTILINE)
        if not headings:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No markdown headings found",
                file_path=str(file_path),
                suggestion="Use markdown headings to structure content"
            ))
        
        # Check heading hierarchy
        for i, (hashes, title) in enumerate(headings):
            level = len(hashes)
            if i > 0:
                prev_level = len(headings[i-1][0])
                if level > prev_level + 1:
                    self.results.append(ValidationResult(
                        level=ValidationLevel.INFO,
                        message=f"Heading hierarchy jump detected: {title}",
                        file_path=str(file_path),
                        suggestion="Use consistent heading hierarchy (don't skip levels)"
                    ))
    
    def _validate_configuration_consistency(self):
        """Validate consistency between steering files and configuration"""
        config_path = self.project_root / ".claude" / "steering-config.json"
        if not config_path.exists():
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="Steering configuration file not found",
                file_path=str(config_path),
                suggestion="Create steering-config.json to define inclusion modes"
            ))
            return
        
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
        except json.JSONDecodeError as e:
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message=f"Invalid JSON in steering configuration: {e}",
                file_path=str(config_path),
                suggestion="Fix JSON syntax errors in steering configuration"
            ))
            return
        
        # Validate inclusion modes reference existing files
        if "inclusion_modes" in config:
            for mode, files in config["inclusion_modes"].items():
                for file_name in files:
                    file_path = self.steering_dir / file_name
                    if not file_path.exists():
                        self.results.append(ValidationResult(
                            level=ValidationLevel.ERROR,
                            message=f"Inclusion mode references non-existent file: {file_name}",
                            file_path=str(config_path),
                            suggestion=f"Create {file_name} or remove from inclusion modes"
                        ))
    
    def _validate_content_quality(self):
        """Validate overall content quality across steering files"""
        steering_files = list(self.steering_dir.glob("*.md"))
        
        if not steering_files:
            return
        
        # Check for consistency in tone and style
        all_content = ""
        for file_path in steering_files:
            all_content += file_path.read_text() + "\n"
        
        # Check for conflicting guidance
        conflict_indicators = self._detect_conflicting_guidance(steering_files)
        for conflict in conflict_indicators:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=conflict["message"],
                file_path=conflict["file"],
                suggestion="Ensure consistent guidance across all steering files"
            ))
    
    def _detect_conflicting_guidance(self, files: List[Path]) -> List[Dict]:
        """Detect potentially conflicting guidance between files"""
        conflicts = []
        
        # Check for technology stack conflicts
        tech_mentions = {}
        for file_path in files:
            content = file_path.read_text().lower()
            
            # Look for technology mentions
            technologies = ["react", "vue", "angular", "typescript", "javascript", 
                          "python", "node", "express", "fastapi", "django"]
            
            for tech in technologies:
                if tech in content:
                    if tech not in tech_mentions:
                        tech_mentions[tech] = []
                    tech_mentions[tech].append(str(file_path))
        
        # Look for potential conflicts (oversimplified detection)
        conflicting_pairs = [("react", "vue"), ("react", "angular"), ("vue", "angular")]
        for tech1, tech2 in conflicting_pairs:
            if tech1 in tech_mentions and tech2 in tech_mentions:
                conflicts.append({
                    "message": f"Potential technology conflict: {tech1} and {tech2} both mentioned",
                    "file": ", ".join(set(tech_mentions[tech1] + tech_mentions[tech2]))
                })
        
        return conflicts
    
    def _validate_inclusion_modes(self):
        """Validate inclusion mode configuration"""
        config_path = self.project_root / ".claude" / "steering-config.json"
        if not config_path.exists():
            return
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        if "inclusion_modes" not in config:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No inclusion modes defined in steering configuration",
                suggestion="Define inclusion modes to optimize AI context loading"
            ))
            return
        
        inclusion_modes = config["inclusion_modes"]
        
        # Check if "always" mode has essential files
        essential_files = ["product.md", "tech.md", "structure.md"]
        always_files = inclusion_modes.get("always", [])
        
        missing_essential = [f for f in essential_files if f not in always_files]
        if missing_essential:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"Essential files not in 'always' inclusion mode: {', '.join(missing_essential)}",
                suggestion="Include essential steering files in 'always' mode"
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
    
    def _has_examples(self, content: str) -> bool:
        """Check if content contains examples"""
        example_indicators = [
            r"example", r"for instance", r"e\.g\.", r"such as",
            r"```", r"~~~", r"sample", r"demonstration"
        ]
        
        return any(re.search(indicator, content, re.IGNORECASE) for indicator in example_indicators)
    
    def generate_report(self) -> Dict:
        """Generate steering validation report"""
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
            "steering_completeness": self._assess_completeness(),
            "issues": {
                "errors": [self._result_to_dict(r) for r in errors],
                "warnings": [self._result_to_dict(r) for r in warnings],
                "info": [self._result_to_dict(r) for r in info]
            },
            "recommendations": self._generate_recommendations()
        }
    
    def _assess_completeness(self) -> Dict:
        """Assess steering system completeness"""
        required_files = []
        for category in self.config["required_files"].values():
            required_files.extend(category)
        
        existing_files = [f.name for f in self.steering_dir.glob("*.md") if self.steering_dir.exists()]
        
        completeness_score = len(existing_files) / len(required_files) if required_files else 0
        
        return {
            "score": round(completeness_score * 100, 1),
            "required_files": len(required_files),
            "existing_files": len(existing_files),
            "missing_files": [f for f in required_files if f not in existing_files]
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
            recommendations.append(f"Address {error_count} critical steering file issues")
        
        if warning_count > 2:
            recommendations.append("Improve steering file content quality")
        
        completeness = self._assess_completeness()
        if completeness["score"] < 80:
            recommendations.append("Create missing steering files for better AI guidance")
        
        if not self.steering_dir.exists():
            recommendations.append("Establish AI steering system with core guidance files")
        
        # Check for configuration file
        config_path = self.project_root / ".claude" / "steering-config.json"
        if not config_path.exists():
            recommendations.append("Create steering configuration to define inclusion modes")
        
        if len(recommendations) == 0:
            recommendations.append("Steering system is well-configured and complete")
        
        return recommendations

def main():
    """Main validation function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate AI steering configuration')
    parser.add_argument('project_root', help='Project root directory')
    parser.add_argument('--output', help='Output file for validation report')
    parser.add_argument('--format', choices=['json', 'text'], default='text',
                      help='Output format')
    parser.add_argument('--fail-on-errors', action='store_true',
                      help='Exit with error code if validation errors found')
    
    args = parser.parse_args()
    
    validator = SteeringValidator(args.project_root)
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
    completeness = report['steering_completeness']
    
    lines.append("Steering Files Validation Report")
    lines.append("=" * 50)
    lines.append(f"Total Issues: {summary['total_issues']}")
    lines.append(f"Errors: {summary['errors']}")
    lines.append(f"Warnings: {summary['warnings']}")
    lines.append(f"Info: {summary['info']}")
    lines.append(f"Validation Passed: {'✅ Yes' if summary['validation_passed'] else '❌ No'}")
    lines.append(f"Completeness Score: {completeness['score']}%")
    lines.append("")
    
    if completeness['missing_files']:
        lines.append(f"Missing Files: {', '.join(completeness['missing_files'])}")
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