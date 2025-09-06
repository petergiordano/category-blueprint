#!/usr/bin/env python3
"""
AI Development Cycle Template - Setup Validation Script

This script validates that the project template has been properly initialized
and all required components are in place for AI-assisted development.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional

class Color:
    """ANSI color codes for terminal output"""
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    BOLD = '\033[1m'
    NC = '\033[0m'  # No Color

def print_status(message: str) -> None:
    """Print status message in blue"""
    print(f"{Color.BLUE}[INFO]{Color.NC} {message}")

def print_success(message: str) -> None:
    """Print success message in green"""
    print(f"{Color.GREEN}[SUCCESS]{Color.NC} {message}")

def print_warning(message: str) -> None:
    """Print warning message in yellow"""
    print(f"{Color.YELLOW}[WARNING]{Color.NC} {message}")

def print_error(message: str) -> None:
    """Print error message in red"""
    print(f"{Color.RED}[ERROR]{Color.NC} {message}")

class ProjectValidator:
    """Validates AI development cycle project setup"""
    
    def __init__(self, project_root: Optional[Path] = None):
        self.project_root = project_root or Path.cwd()
        self.errors: List[str] = []
        self.warnings: List[str] = []
        
    def validate(self) -> bool:
        """Run all validation checks and return True if all pass"""
        print_status("Validating AI-powered development project setup...")
        print(f"Project root: {self.project_root}")
        print()
        
        # Run all validation checks
        checks = [
            self.check_directory_structure,
            self.check_required_files,
            self.check_template_customization,
            self.check_git_setup,
            self.check_configuration_files,
            self.check_ai_coordination_setup,
            self.check_development_environment,
        ]
        
        for check in checks:
            try:
                check()
            except Exception as e:
                self.errors.append(f"Check failed: {check.__name__}: {str(e)}")
        
        # Report results
        return self.report_results()
    
    def check_directory_structure(self) -> None:
        """Validate required directory structure exists"""
        print_status("Checking directory structure...")
        
        required_dirs = [
            "src",
            "tests", 
            "config",
            "docs",
            "docs/specifications",
            "docs/architecture",
            "scripts",
            ".claude",
            ".claude/commands",
            ".aicontext",
        ]
        
        missing_dirs = []
        for dir_path in required_dirs:
            full_path = self.project_root / dir_path
            if not full_path.exists() or not full_path.is_dir():
                missing_dirs.append(dir_path)
        
        if missing_dirs:
            self.errors.extend([f"Missing directory: {d}" for d in missing_dirs])
        else:
            print_success("Directory structure validation passed")
    
    def check_required_files(self) -> None:
        """Check that required template files exist"""
        print_status("Checking required files...")
        
        required_files = [
            "README.md",
            "docs/specifications/PRD.md",
            "docs/specifications/FEATURE_SPEC_TEMPLATE.md", 
            "docs/specifications/dev-cycle.md",
            "docs/architecture/SLC_Principles.md",
            "docs/architecture/Experience_Goals.md",
            "docs/architecture/ComponentLibrary.md",
            ".claude/persona.md",
            ".claude/commands/orient.md",
            ".claude/commands/next-task.md",
            ".claude/commands/finalize-task.md",
            ".claude/commands/update-prd.md",
            ".aicontext/context.md",
            ".aicontext/WORKFLOW_GUIDE.md",
            "scripts/initialize-project.sh",
            "scripts/validate-setup.py",
        ]
        
        missing_files = []
        for file_path in required_files:
            full_path = self.project_root / file_path
            if not full_path.exists() or not full_path.is_file():
                missing_files.append(file_path)
        
        if missing_files:
            self.errors.extend([f"Missing file: {f}" for f in missing_files])
        else:
            print_success("Required files validation passed")
    
    def check_template_customization(self) -> None:
        """Check if templates have been customized"""
        print_status("Checking template customization...")
        
        # Check PRD has been customized
        prd_path = self.project_root / "docs/specifications/PRD.md"
        if prd_path.exists():
            content = prd_path.read_text()
            if "[PROJECT NAME]" in content or "[CUSTOMIZE:" in content:
                self.warnings.append("PRD.md still contains template placeholders")
        
        # Check AI Context has been customized  
        context_path = self.project_root / ".aicontext/context.md"
        if context_path.exists():
            content = context_path.read_text()
            if "[PROJECT NAME]" in content or "[CUSTOMIZE:" in content:
                self.warnings.append("context.md still contains template placeholders")
        
        print_success("Template customization check completed")
    
    def check_git_setup(self) -> None:
        """Validate git repository setup"""
        print_status("Checking git setup...")
        
        git_dir = self.project_root / ".git"
        if not git_dir.exists():
            self.warnings.append("No git repository found - consider running 'git init'")
            return
        
        # Check for .gitignore
        gitignore_path = self.project_root / ".gitignore"
        if not gitignore_path.exists():
            self.warnings.append("No .gitignore file found")
        
        # Check if there are any commits
        try:
            result = subprocess.run(
                ["git", "rev-parse", "--verify", "HEAD"],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                self.warnings.append("No git commits found - consider making initial commit")
        except subprocess.SubprocessError:
            self.warnings.append("Could not check git status")
        
        print_success("Git setup check completed")
    
    def check_configuration_files(self) -> None:
        """Check configuration files are present and valid"""
        print_status("Checking configuration files...")
        
        # Check for project config
        config_path = self.project_root / "config/project-config.json"
        if config_path.exists():
            try:
                with open(config_path) as f:
                    config = json.load(f)
                    
                # Validate basic structure
                required_keys = ["project", "development", "ai_workflow"]
                missing_keys = [k for k in required_keys if k not in config]
                if missing_keys:
                    self.warnings.extend([f"Missing config key: {k}" for k in missing_keys])
                    
            except json.JSONDecodeError:
                self.errors.append("Invalid JSON in project-config.json")
            except Exception as e:
                self.warnings.append(f"Could not validate config file: {e}")
        else:
            self.warnings.append("No project-config.json found")
        
        # Check for Claude settings template
        claude_settings = self.project_root / ".claude/settings.template.json"
        if claude_settings.exists():
            try:
                with open(claude_settings) as f:
                    json.load(f)  # Just validate it's valid JSON
            except json.JSONDecodeError:
                self.errors.append("Invalid JSON in .claude/settings.template.json")
        
        print_success("Configuration files check completed")
    
    def check_ai_coordination_setup(self) -> None:
        """Validate AI coordination components"""
        print_status("Checking AI coordination setup...")
        
        # Check Claude commands exist and are readable
        command_files = [
            ".claude/commands/orient.md",
            ".claude/commands/next-task.md", 
            ".claude/commands/finalize-task.md",
            ".claude/commands/update-prd.md"
        ]
        
        for cmd_file in command_files:
            path = self.project_root / cmd_file
            if not path.exists():
                self.errors.append(f"Missing Claude command: {cmd_file}")
            elif path.stat().st_size == 0:
                self.warnings.append(f"Empty Claude command file: {cmd_file}")
        
        # Check persona file exists and has content
        persona_path = self.project_root / ".claude/persona.md"
        if persona_path.exists():
            if persona_path.stat().st_size == 0:
                self.warnings.append("Persona file is empty")
        else:
            self.errors.append("Missing persona.md file")
        
        print_success("AI coordination setup check completed")
    
    def check_development_environment(self) -> None:
        """Check development environment setup"""
        print_status("Checking development environment...")
        
        # Check for language-specific files
        language_files = {
            "python": ["requirements.txt", "pyproject.toml", "setup.py"],
            "javascript": ["package.json", "package-lock.json", "yarn.lock"],
            "go": ["go.mod", "go.sum"],
            "rust": ["Cargo.toml", "Cargo.lock"],
            "java": ["pom.xml", "build.gradle"],
        }
        
        detected_languages = []
        for lang, files in language_files.items():
            if any((self.project_root / f).exists() for f in files):
                detected_languages.append(lang)
        
        if not detected_languages:
            self.warnings.append("No language-specific configuration files detected")
        elif len(detected_languages) > 1:
            self.warnings.append(f"Multiple languages detected: {detected_languages}")
        else:
            print_success(f"Detected {detected_languages[0]} project")
        
        # Check for test directory structure
        test_dirs = ["tests", "test", "__tests__"]
        if not any((self.project_root / d).exists() for d in test_dirs):
            self.warnings.append("No test directory found")
        
        print_success("Development environment check completed")
    
    def report_results(self) -> bool:
        """Report validation results and return success status"""
        print()
        print(f"{Color.BOLD}Validation Results:{Color.NC}")
        print("=" * 50)
        
        if not self.errors and not self.warnings:
            print_success("All validation checks passed! 🎉")
            print_status("Your AI-powered development setup is ready to use.")
            print()
            print("Next steps:")
            print("1. Customize docs/specifications/PRD.md for your project")
            print("2. Install Claude Code extension in VS Code")
            print("3. Use @orient command to get started")
            return True
        
        if self.errors:
            print_error(f"Found {len(self.errors)} error(s):")
            for error in self.errors:
                print(f"  ❌ {error}")
            print()
        
        if self.warnings:
            print_warning(f"Found {len(self.warnings)} warning(s):")
            for warning in self.warnings:
                print(f"  ⚠️  {warning}")
            print()
        
        if self.errors:
            print_error("Validation failed. Please fix the errors above.")
            return False
        else:
            print_warning("Validation passed with warnings. Consider addressing the warnings above.")
            return True

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Validate AI-powered development project setup"
    )
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path.cwd(),
        help="Project root directory (default: current directory)"
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress informational output"
    )
    
    args = parser.parse_args()
    
    if not args.quiet:
        print("🤖 AI Development Cycle - Setup Validation")
        print("=" * 45)
        print()
    
    validator = ProjectValidator(args.project_root)
    success = validator.validate()
    
    if not args.quiet:
        print()
        if success:
            print_success("Setup validation completed successfully!")
        else:
            print_error("Setup validation failed!")
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()