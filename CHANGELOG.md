# Changelog

All notable changes to the AI Development Template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Global rename from "Kiro" to "Gyro" for all features and documentation
- Comprehensive FAQ.md with common questions and answers
- QUICKSTART.md for 5-minute setup guide
- TROUBLESHOOTING.md for common issues and solutions
- Enhanced validation framework with comprehensive reporting
- Production readiness validation system
- Multi-tier testing framework integration

### Changed
- Updated README.md with improved Gyro feature descriptions
- Enhanced TEMPLATE_SETUP.md with Gyro features overview
- Improved initialization script with domain selection
- Updated all configuration templates for Gyro compatibility

### Fixed
- Resolved inconsistent naming between Kiro and Gyro references
- Fixed validation script paths and permissions
- Improved error handling in setup scripts

## [1.0.0] - 2025-07-19

### Added
- Initial release of AI Development Template
- Component-based development architecture
- Claude Code integration with AI workflow commands
- Gyro features for enhanced AI development:
  - Spec-driven development workflow
  - Agent steering system
  - Automated quality gates and hooks
  - Execution modes (autopilot, supervised, hybrid)
  - Comprehensive validation framework
- Complete project templates for multiple domains:
  - Data processing pipelines
  - Content generation systems
  - API integration projects
  - General development workflows
- Enhanced testing framework with multiple test types
- Production readiness validation
- MCP server integration support
- Comprehensive documentation and setup guides

### Core Features
- **AI Coordination**: Complete Claude Code integration
- **Development Workflow**: @orient, @next-task, @finalize-task, @update-prd commands
- **Quality Assurance**: Multi-layer validation and testing
- **Architecture**: SLC principles (Simple, Lovable, Complete)
- **Flexibility**: Support for Python, JavaScript, Go, and generic projects

### Documentation
- Complete README.md with architecture overview
- Detailed TEMPLATE_SETUP.md for customization
- TEST_PLAN.md for validation strategies
- Comprehensive AI workflow guides
- Architecture documentation and principles

### Configuration
- Project-specific configuration system
- Domain-specific templates and guidance
- Flexible directory structure
- Git integration and workflow
- VS Code and Claude Code optimization

### Validation & Testing
- Basic setup validation
- Specification consistency checking
- Code quality validation
- Production readiness assessment
- Comprehensive test framework support
- Coverage reporting and analysis

---

## Version History

### Release Naming Convention
- **Major versions (x.0.0)**: Significant architectural changes or new core features
- **Minor versions (x.y.0)**: New features, enhancements, or significant improvements
- **Patch versions (x.y.z)**: Bug fixes, documentation updates, minor improvements

### Compatibility Notes
- Template is designed to be backward compatible within major versions
- Gyro features can be enabled/disabled without breaking existing projects
- Migration guides provided for major version upgrades

### Support Policy
- **Current version**: Full support with regular updates
- **Previous minor version**: Security and critical bug fixes
- **Older versions**: Community support only

---

## Contributing to Changelog

When contributing changes:

1. **Add entry to [Unreleased]** section
2. **Use appropriate category**: Added, Changed, Deprecated, Removed, Fixed, Security
3. **Write clear, user-focused descriptions**
4. **Reference issues/PRs** where applicable
5. **Move to versioned section** upon release

### Example Entry Format
```markdown
### Added
- New feature description with benefits [#123]
- Another feature with link to documentation

### Changed  
- Updated behavior with migration notes [#456]

### Fixed
- Bug fix description with impact [#789]
```