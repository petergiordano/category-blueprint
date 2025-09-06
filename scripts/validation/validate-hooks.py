#!/usr/bin/env python3
"""
Hooks Configuration Validation Script
Validates agent hooks framework configuration and templates
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

class HooksValidator:
    """Validates agent hooks framework configuration and templates"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results: List[ValidationResult] = []
        self.hooks_dir = self.project_root / ".claude" / "hooks"
        self.config = self._load_validation_config()
        
    def _load_validation_config(self) -> Dict:
        """Load hooks validation configuration"""
        config_path = self.project_root / ".claude" / "hooks-config.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return self._default_config()
    
    def _default_config(self) -> Dict:
        """Default hooks validation configuration"""
        return {
            "required_directories": [
                "file-events",
                "development-events", 
                "templates"
            ],
            "required_hook_types": {
                "file-events": ["on-create.md", "on-save.md", "on-delete.md"],
                "development-events": ["pre-commit.md", "post-implementation.md", "test-completion.md"],
                "templates": ["test-generator-hook.md", "doc-updater-hook.md", "security-scanner-hook.md"]
            },
            "hook_structure_requirements": {
                "trigger": "required",
                "conditions": "required", 
                "actions": "required",
                "error_handling": "recommended"
            },
            "supported_triggers": [
                "file_create", "file_save", "file_delete",
                "pre_commit", "post_commit", "test_run",
                "deployment", "merge", "pull_request"
            ],
            "supported_actions": [
                "run_tests", "generate_docs", "format_code",
                "security_scan", "performance_check", "validate_schema"
            ]
        }
    
    def validate_all(self) -> List[ValidationResult]:
        """Run all hooks validation checks"""
        self.results = []
        
        # Check if hooks directory exists
        if not self.hooks_dir.exists():
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message="Hooks directory not found",
                file_path=str(self.hooks_dir),
                suggestion="Create .claude/hooks/ directory with hook templates"
            ))
            return self.results
        
        # Validate directory structure
        self._validate_directory_structure()
        
        # Validate hooks configuration
        self._validate_hooks_configuration()
        
        # Validate individual hook files
        self._validate_hook_files()
        
        # Validate hook templates
        self._validate_hook_templates()
        
        # Validate hook dependencies
        self._validate_hook_dependencies()
        
        return self.results
    
    def _validate_directory_structure(self):
        """Validate hooks directory structure"""
        required_dirs = self.config["required_directories"]
        
        missing_dirs = []
        for required_dir in required_dirs:
            dir_path = self.hooks_dir / required_dir
            if not dir_path.exists():
                missing_dirs.append(required_dir)
        
        if missing_dirs:
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message=f"Missing required hook directories: {', '.join(missing_dirs)}",
                suggestion="Create missing hook directories to organize hook types"
            ))
        
        # Validate required hook files in each directory
        for hook_dir, required_files in self.config["required_hook_types"].items():
            dir_path = self.hooks_dir / hook_dir
            if not dir_path.exists():
                continue
                
            missing_files = []
            for required_file in required_files:
                file_path = dir_path / required_file
                if not file_path.exists():
                    missing_files.append(required_file)
            
            if missing_files:
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"Missing hook files in {hook_dir}: {', '.join(missing_files)}",
                    suggestion=f"Create missing hook templates in {hook_dir}/"
                ))
    
    def _validate_hooks_configuration(self):
        """Validate hooks configuration file"""
        config_path = self.project_root / ".claude" / "hooks-config.json"
        
        if not config_path.exists():
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="Hooks configuration file not found",
                file_path=str(config_path),
                suggestion="Create hooks-config.json to define hook triggers and actions"
            ))
            return
        
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
        except json.JSONDecodeError as e:
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message=f"Invalid JSON in hooks configuration: {e}",
                file_path=str(config_path),
                suggestion="Fix JSON syntax errors in hooks configuration"
            ))
            return
        
        self._validate_config_structure(config, config_path)
        self._validate_config_content(config, config_path)
    
    def _validate_config_structure(self, config: Dict, config_path: Path):
        """Validate hooks configuration structure"""
        required_sections = ["hooks"]
        
        for section in required_sections:
            if section not in config:
                self.results.append(ValidationResult(
                    level=ValidationLevel.ERROR,
                    message=f"Missing required configuration section: {section}",
                    file_path=str(config_path),
                    suggestion=f"Add '{section}' section to hooks configuration"
                ))
        
        if "hooks" in config:
            hooks_config = config["hooks"]
            
            # Validate trigger types
            supported_triggers = self.config["supported_triggers"]
            for trigger in hooks_config.keys():
                if trigger not in supported_triggers:
                    self.results.append(ValidationResult(
                        level=ValidationLevel.WARNING,
                        message=f"Unsupported hook trigger: {trigger}",
                        file_path=str(config_path),
                        suggestion=f"Use supported triggers: {', '.join(supported_triggers)}"
                    ))
    
    def _validate_config_content(self, config: Dict, config_path: Path):
        """Validate hooks configuration content"""
        if "hooks" not in config:
            return
        
        hooks_config = config["hooks"]
        
        for trigger, file_patterns in hooks_config.items():
            if not isinstance(file_patterns, dict):
                self.results.append(ValidationResult(
                    level=ValidationLevel.ERROR,
                    message=f"Invalid configuration for trigger '{trigger}': expected object",
                    file_path=str(config_path),
                    suggestion="Configure file patterns as objects with glob patterns as keys"
                ))
                continue
            
            for pattern, actions in file_patterns.items():
                # Validate file patterns
                if not self._is_valid_glob_pattern(pattern):
                    self.results.append(ValidationResult(
                        level=ValidationLevel.WARNING,
                        message=f"Potentially invalid glob pattern: {pattern}",
                        file_path=str(config_path),
                        suggestion="Use valid glob patterns (e.g., '*.py', 'src/**/*.ts')"
                    ))
                
                # Validate actions
                if not isinstance(actions, list):
                    self.results.append(ValidationResult(
                        level=ValidationLevel.ERROR,
                        message=f"Actions for pattern '{pattern}' must be a list",
                        file_path=str(config_path),
                        suggestion="Define actions as a list of hook names"
                    ))
                    continue
                
                for action in actions:
                    if not self._hook_exists(action):
                        self.results.append(ValidationResult(
                            level=ValidationLevel.WARNING,
                            message=f"Referenced hook not found: {action}",
                            file_path=str(config_path),
                            suggestion=f"Create {action}.md hook template or fix reference"
                        ))
    
    def _validate_hook_files(self):
        """Validate individual hook files"""
        hook_files = []
        
        # Collect all hook files
        for subdir in self.hooks_dir.iterdir():
            if subdir.is_dir():
                hook_files.extend(subdir.glob("*.md"))
        
        for hook_file in hook_files:
            self._validate_hook_file_structure(hook_file)
            self._validate_hook_file_content(hook_file)
    
    def _validate_hook_file_structure(self, file_path: Path):
        """Validate hook file structure"""
        content = file_path.read_text()
        
        required_sections = self.config["hook_structure_requirements"]
        
        for section, requirement in required_sections.items():
            has_section = self._has_section(content, section)
            
            if requirement == "required" and not has_section:
                self.results.append(ValidationResult(
                    level=ValidationLevel.ERROR,
                    message=f"Missing required section: {section}",
                    file_path=str(file_path),
                    suggestion=f"Add ## {section.title()} section to hook file"
                ))
            elif requirement == "recommended" and not has_section:
                self.results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message=f"Missing recommended section: {section}",
                    file_path=str(file_path),
                    suggestion=f"Consider adding ## {section.title()} section for better error handling"
                ))
    
    def _validate_hook_file_content(self, file_path: Path):
        """Validate hook file content"""
        content = file_path.read_text()
        
        # Check for trigger definition
        if "trigger" in content.lower():
            supported_triggers = self.config["supported_triggers"]
            found_trigger = False
            
            for trigger in supported_triggers:
                if trigger in content.lower():
                    found_trigger = True
                    break
            
            if not found_trigger:
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message="No recognized trigger type found",
                    file_path=str(file_path),
                    suggestion=f"Use supported triggers: {', '.join(supported_triggers)}"
                ))
        
        # Check for conditions syntax
        if "conditions" in content.lower():
            # Look for condition patterns
            condition_patterns = [
                r"if\s+.*:",
                r"when\s+.*:",
                r"unless\s+.*:",
                r"file_type\s*==",
                r"path_matches"
            ]
            
            has_conditions = any(re.search(pattern, content, re.IGNORECASE) 
                               for pattern in condition_patterns)
            
            if not has_conditions:
                self.results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message="Conditions section lacks specific condition syntax",
                    file_path=str(file_path),
                    suggestion="Add specific conditions (e.g., 'if file_type == \"python\"')"
                ))
        
        # Check for actions
        if "actions" in content.lower():
            supported_actions = self.config["supported_actions"]
            found_actions = []
            
            for action in supported_actions:
                if action in content.lower() or action.replace("_", " ") in content.lower():
                    found_actions.append(action)
            
            if not found_actions:
                self.results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message="No recognized action types found",
                    file_path=str(file_path),
                    suggestion=f"Consider using supported actions: {', '.join(supported_actions)}"
                ))
        
        # Validate script blocks
        script_blocks = re.findall(r'```(?:bash|shell|python|javascript)\n(.*?)\n```', 
                                 content, re.DOTALL)
        
        for i, script in enumerate(script_blocks):
            if len(script.strip()) == 0:
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"Empty script block found (block {i+1})",
                    file_path=str(file_path),
                    suggestion="Add script content or remove empty code blocks"
                ))
    
    def _validate_hook_templates(self):
        """Validate hook templates for completeness and quality"""
        templates_dir = self.hooks_dir / "templates"
        
        if not templates_dir.exists():
            return
        
        template_files = list(templates_dir.glob("*.md"))
        
        for template_file in template_files:
            self._validate_template_quality(template_file)
    
    def _validate_template_quality(self, template_path: Path):
        """Validate individual template quality"""
        content = template_path.read_text()
        
        # Check for placeholder variables
        placeholders = re.findall(r'\{\{(\w+)\}\}', content)
        
        if placeholders:
            # Check if placeholders are documented
            if "placeholders" not in content.lower() and "variables" not in content.lower():
                self.results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message=f"Template has undocumented placeholders: {', '.join(set(placeholders))}",
                    file_path=str(template_path),
                    suggestion="Document template placeholders and their usage"
                ))
        
        # Check for examples
        if "example" not in content.lower() and "usage" not in content.lower():
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="Template lacks usage examples",
                file_path=str(template_path),
                suggestion="Add usage examples to help users understand the template"
            ))
    
    def _validate_hook_dependencies(self):
        """Validate hook dependencies and circular references"""
        # Parse all hook files to build dependency graph
        dependency_graph = {}
        
        for subdir in self.hooks_dir.iterdir():
            if not subdir.is_dir():
                continue
                
            for hook_file in subdir.glob("*.md"):
                hook_name = hook_file.stem
                content = hook_file.read_text()
                
                # Look for hook references
                hook_refs = re.findall(r'@(\w+[-_]\w+)', content)
                dependency_graph[hook_name] = hook_refs
        
        # Check for circular dependencies
        for hook_name in dependency_graph:
            if self._has_circular_dependency(hook_name, dependency_graph, set()):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"Potential circular dependency detected involving {hook_name}",
                    suggestion="Review hook dependencies to avoid circular references"
                ))
    
    def _has_circular_dependency(self, hook_name: str, graph: Dict, visited: Set) -> bool:
        """Check for circular dependencies in hook graph"""
        if hook_name in visited:
            return True
        
        if hook_name not in graph:
            return False
        
        visited.add(hook_name)
        
        for dependency in graph[hook_name]:
            if self._has_circular_dependency(dependency, graph, visited.copy()):
                return True
        
        return False
    
    def _is_valid_glob_pattern(self, pattern: str) -> bool:
        """Check if string is a valid glob pattern"""
        # Basic validation for common glob patterns
        invalid_chars = ['<', '>', '|', '"']
        if any(char in pattern for char in invalid_chars):
            return False
        
        # Check for common valid patterns
        valid_patterns = [
            r'\*\.\w+',  # *.ext
            r'\*\*/\*\.\w+',  # **/*.ext
            r'\w+/\*\*',  # dir/**
            r'\w+/\*\.\w+',  # dir/*.ext
        ]
        
        return any(re.search(pat, pattern) for pat in valid_patterns) or pattern.isalnum()
    
    def _hook_exists(self, hook_name: str) -> bool:
        """Check if a hook file exists"""
        for subdir in self.hooks_dir.iterdir():
            if not subdir.is_dir():
                continue
            
            hook_file = subdir / f"{hook_name}.md"
            if hook_file.exists():
                return True
        
        return False
    
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
        """Generate hooks validation report"""
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
            "hooks_coverage": self._assess_hooks_coverage(),
            "issues": {
                "errors": [self._result_to_dict(r) for r in errors],
                "warnings": [self._result_to_dict(r) for r in warnings],
                "info": [self._result_to_dict(r) for r in info]
            },
            "recommendations": self._generate_recommendations()
        }
    
    def _assess_hooks_coverage(self) -> Dict:
        """Assess hooks system coverage"""
        expected_hooks = []
        for hook_type in self.config["required_hook_types"].values():
            expected_hooks.extend(hook_type)
        
        existing_hooks = []
        if self.hooks_dir.exists():
            for subdir in self.hooks_dir.iterdir():
                if subdir.is_dir():
                    existing_hooks.extend([f.name for f in subdir.glob("*.md")])
        
        coverage_score = len(existing_hooks) / len(expected_hooks) if expected_hooks else 0
        
        return {
            "score": round(coverage_score * 100, 1),
            "expected_hooks": len(expected_hooks),
            "existing_hooks": len(existing_hooks),
            "missing_hooks": [h for h in expected_hooks if h not in existing_hooks]
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
            recommendations.append(f"Address {error_count} critical hooks configuration issues")
        
        if warning_count > 2:
            recommendations.append("Improve hooks configuration and template quality")
        
        coverage = self._assess_hooks_coverage()
        if coverage["score"] < 70:
            recommendations.append("Create missing hook templates for better automation coverage")
        
        if not self.hooks_dir.exists():
            recommendations.append("Establish hooks framework with event-driven automation")
        
        # Check for configuration file
        config_path = self.project_root / ".claude" / "hooks-config.json"
        if not config_path.exists():
            recommendations.append("Create hooks configuration to define triggers and actions")
        
        if len(recommendations) == 0:
            recommendations.append("Hooks system is well-configured and complete")
        
        return recommendations

def main():
    """Main validation function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate agent hooks configuration')
    parser.add_argument('project_root', help='Project root directory')
    parser.add_argument('--output', help='Output file for validation report')
    parser.add_argument('--format', choices=['json', 'text'], default='text',
                      help='Output format')
    parser.add_argument('--fail-on-errors', action='store_true',
                      help='Exit with error code if validation errors found')
    
    args = parser.parse_args()
    
    validator = HooksValidator(args.project_root)
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
    coverage = report['hooks_coverage']
    
    lines.append("Hooks Configuration Validation Report")
    lines.append("=" * 50)
    lines.append(f"Total Issues: {summary['total_issues']}")
    lines.append(f"Errors: {summary['errors']}")
    lines.append(f"Warnings: {summary['warnings']}")
    lines.append(f"Info: {summary['info']}")
    lines.append(f"Validation Passed: {'✅ Yes' if summary['validation_passed'] else '❌ No'}")
    lines.append(f"Hooks Coverage: {coverage['score']}%")
    lines.append("")
    
    if coverage['missing_hooks']:
        lines.append(f"Missing Hooks: {', '.join(coverage['missing_hooks'])}")
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