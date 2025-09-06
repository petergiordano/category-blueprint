# Template Setup Guide

This document provides detailed instructions for setting up and customizing the AI-Powered Development Cycle Template for your specific project.

## 🎯 Setup Overview

The setup process transforms the generic template into a customized development environment for your specific project domain. This involves:

1. **Project Initialization**: Configure basic project settings and structure
2. **Domain Customization**: Adapt templates for your specific use case
3. **AI Integration**: Set up Claude Code and other AI tools
4. **Validation**: Ensure everything is working correctly

## 📋 Prerequisites

### Required Tools
- **Git**: For version control and template management
- **VS Code**: Primary development environment
- **Python 3.8+**: For setup and validation scripts
- **Claude Code Extension**: AI coordination (install after setup)

### Optional Tools
- **Node.js**: If building JavaScript/TypeScript projects
- **Go**: If building Go projects
- **Docker**: If using containerized development

### Account Requirements
- **Claude Account**: For Claude Code extension access
- **GitHub Account**: For version control and collaboration

## 🚀 Quick Setup (Automated)

### 1. Get the Template
```bash
# Option 1: Clone from repository
git clone [TEMPLATE_REPO_URL] my-project-name
cd my-project-name

# Option 2: Download and extract ZIP
# Download from GitHub releases, extract, and navigate to directory
```

### 2. Run Setup Script
```bash
# Make script executable (if needed)
chmod +x scripts/initialize-project.sh

# Run initialization
./scripts/initialize-project.sh
```

The script will prompt you for:
- **Project name**: Human-readable name for your project
- **Project description**: Brief description of what it does
- **Primary language**: Python, JavaScript, Go, etc.
- **Component count**: Number of pipeline components (4-8 recommended)
- **Project domain**: data-processing, content-generation, api-integration, or general
- **Enable Gyro features**: Enhanced AI development capabilities (recommended: yes)

### 3. Validate Setup
```bash
# Basic validation
python scripts/validate-setup.py

# If you enabled Gyro features, run comprehensive validation:
python scripts/validation/run-all-validations.py .
```

If validation passes, proceed to [AI Integration](#-ai-integration-setup). If not, see [Manual Setup](#-manual-setup-detailed) below.

## 🚀 Gyro Features Overview

If you enabled Gyro features during setup, you get these enhanced capabilities:

### 🎯 Spec-Driven Development
- **Requirements → Design → Tasks** workflow
- Automated specification generation and validation
- Requirements traceability throughout development

### 🧭 Agent Steering System
- **Persistent AI context** through `.claude/steering/` files
- **Domain-specific guidance** for data processing, content generation, API integration
- **Project-specific patterns** that improve with use

### 🪝 Automated Quality Gates
- **Event-driven validation** through hooks framework
- **Pre-commit checks** for code quality and consistency
- **Production readiness** automated assessment

### ⚙️ Execution Modes
- **Autopilot**: Autonomous AI assistance for routine tasks
- **Supervised**: Step-by-step approval for complex changes
- **Hybrid**: Intelligent mode switching based on risk assessment

### 📊 Enhanced Validation
- **Specification consistency** checking
- **Architecture compliance** validation
- **Security and performance** automated assessment
- **Comprehensive reporting** for project health

## 🔧 Manual Setup (Detailed)

If the automated setup doesn't work or you need more control, follow these manual steps:

### Step 1: Project Structure Setup

Create the required directory structure:
```bash
mkdir -p src tests config docs/implementation-logs
mkdir -p docs/specifications docs/architecture
mkdir -p .claude/commands .aicontext scripts
```

### Step 2: Customize Core Templates

#### PRD Template Customization
```bash
# Copy and customize PRD template
cp docs/specifications/PRD_TEMPLATE.md docs/specifications/PRD.md

# Edit PRD.md and replace:
# [PROJECT NAME] → Your actual project name
# [DATE] → Current date
# [CUSTOMIZE: ...] → Your specific content
```

Key sections to customize in PRD.md:
- **Vision**: What your system does and what manual work it eliminates
- **Business Goals**: Specific, measurable objectives
- **Component Pipeline**: Define your 4-8 components
- **Success Metrics**: Quantifiable targets
- **Validation Standards**: Your reference test case

#### AI Context Template Customization
```bash
# Copy and customize AI context template
cp .aicontext/AI_CONTEXT_TEMPLATE.md .aicontext/context.md

# Edit context.md and replace:
# [PROJECT NAME] → Your project name
# [CUSTOMIZE: ...] → Your domain-specific content
```

### Step 3: Language-Specific Setup

#### Python Projects
```bash
# Create Python-specific files
cat > requirements.txt << EOF
# Add your dependencies here
pytest>=7.0.0
black>=22.0.0
flake8>=4.0.0
mypy>=0.990
EOF

cat > pyproject.toml << EOF
[build-system]
requires = ["setuptools>=45", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "your-project-name"
version = "0.1.0"
description = "Your project description"
requires-python = ">=3.8"

[tool.black]
line-length = 88
target-version = ['py38']

[tool.pytest.ini_options]
testpaths = ["tests"]
EOF
```

#### JavaScript/Node.js Projects
```bash
# Create package.json
cat > package.json << EOF
{
  "name": "your-project-name",
  "version": "0.1.0",
  "description": "Your project description",
  "main": "src/index.js",
  "scripts": {
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.0.0"
  }
}
EOF
```

#### Go Projects
```bash
# Initialize Go module
go mod init your-project-name

# Create basic directory structure
mkdir -p cmd pkg internal
```

### Step 4: Configuration Files

#### Project Configuration
```bash
cat > config/project-config.json << EOF
{
  "project": {
    "name": "Your Project Name",
    "id": "your_project_id",
    "description": "Your project description",
    "language": "python",
    "component_count": 6
  },
  "development": {
    "test_command": "pytest tests/ -v",
    "lint_command": "flake8 src/",
    "format_command": "black src/"
  },
  "ai_workflow": {
    "enabled": true,
    "reference_test_case": "tests/reference/",
    "validation_required": true
  }
}
EOF
```

#### Claude Settings Template
```bash
cat > .claude/settings.template.json << EOF
{
  "name": "Your Project Name",
  "description": "Your project description",
  "claude": {
    "contextFiles": [
      ".aicontext/context.md",
      "docs/specifications/PRD.md",
      ".aicontext/WORKFLOW_GUIDE.md"
    ],
    "persona": ".claude/persona.md",
    "commands": [
      ".claude/commands/orient.md",
      ".claude/commands/next-task.md",
      ".claude/commands/finalize-task.md",
      ".claude/commands/update-prd.md"
    ]
  }
}
EOF
```

### Step 5: Git Setup

```bash
# Initialize git repository (if not already done)
git init

# Create .gitignore
cat > .gitignore << EOF
# Language-specific (add patterns for your language)
__pycache__/
*.pyc
node_modules/
*.log

# Development tools
.vscode/
.env
.env.local

# OS files
.DS_Store
Thumbs.db
EOF

# Initial commit
git add .
git commit -m "Initial commit: AI-powered development workflow setup"
```

## 🤖 AI Integration Setup

### Claude Code Extension

1. **Install Extension**
   ```bash
   # Open VS Code
   code .
   
   # Install Claude Code extension from marketplace
   # Or use command palette: Extensions: Install Extensions
   ```

2. **Configure Settings**
   - Copy `.claude/settings.template.json` to `.claude/settings.json`
   - Customize for your project specifics
   - Authenticate with your Claude account

3. **Test AI Commands**
   ```bash
   # In Claude Code, test these commands:
   @orient          # Should show project status
   @next-task       # Should suggest first component to build
   ```

### Additional AI Tools (Optional)

#### Gemini CLI Integration
```bash
# Install Gemini CLI (if using)
# Follow installation instructions for your platform

# Test integration
gemini --version
```

#### GitHub Copilot Integration
```bash
# Install in VS Code if desired
# Configure for your project type
```

## 🎨 Domain Customization

### Data Processing Projects

Update these files for data processing focus:

**PRD Components Example:**
```markdown
1. **Data Ingestion**: Load and validate input data
2. **Data Cleaning**: Handle missing values and outliers  
3. **Data Transformation**: Apply business logic and formatting
4. **Data Analysis**: Generate insights and statistics
5. **Report Generation**: Create output reports and visualizations
6. **Data Export**: Save results in required formats
```

**Architecture Focus:**
- Data quality and validation
- Processing speed and efficiency
- Error handling for malformed data
- Memory usage for large datasets

### Content Generation Projects

**PRD Components Example:**
```markdown
1. **Content Planning**: Define content structure and requirements
2. **Template Processing**: Apply templates and formatting rules
3. **Content Generation**: Create text, images, or media
4. **Quality Assurance**: Validate output quality and standards
5. **Format Optimization**: Optimize for target platforms
6. **Publishing Preparation**: Final formatting and export
```

**Architecture Focus:**
- Output quality and consistency
- API cost monitoring and optimization
- User experience and feedback
- Content versioning and management

### API Integration Projects

**PRD Components Example:**
```markdown
1. **Authentication Setup**: Handle API keys and auth flows
2. **Data Mapping**: Transform between internal and external formats
3. **Request Processing**: Handle API calls with retry logic
4. **Response Validation**: Verify and process API responses
5. **Error Handling**: Manage timeouts, rate limits, and failures
6. **Data Synchronization**: Keep systems in sync
```

**Architecture Focus:**
- Reliability and error recovery
- Rate limiting and throttling
- Data consistency and validation
- Monitoring and alerting

## 🧪 Testing Setup

### Reference Test Case

Create a representative test case that validates your entire pipeline:

```bash
# Create reference test directory
mkdir -p tests/reference

# Add your reference test case
# This should be real data that represents your primary use case
```

**Examples by Domain:**
- **Data Processing**: Sample dataset with known expected outputs
- **Content Generation**: Input templates with expected content
- **API Integration**: Sample requests with expected responses

### Test Structure

```bash
tests/
├── reference/                 # Reference test cases
├── unit/                     # Unit tests for individual components
├── integration/              # Integration tests between components
└── end_to_end/              # Full pipeline tests
```

### Test Commands

Update your project configuration with appropriate test commands:

```json
{
  "development": {
    "test_command": "pytest tests/ -v",
    "test_unit": "pytest tests/unit/ -v",
    "test_integration": "pytest tests/integration/ -v",
    "test_reference": "pytest tests/reference/ -v"
  }
}
```

## 📝 Documentation Customization

### Update Architecture Documents

Customize the architecture documents for your domain:

1. **SLC_Principles.md**: Replace examples with your domain examples
2. **Experience_Goals.md**: Update emotional targets for your users
3. **ComponentLibrary.md**: Define patterns specific to your domain

### Create Implementation Logs Directory

```bash
mkdir -p docs/implementation-logs
echo "# Implementation Logs\n\nThis directory contains detailed logs of component development." > docs/implementation-logs/README.md
```

## ✅ Validation and Testing

### Automated Validation

Run the validation script to check your setup:

```bash
python scripts/validate-setup.py

# For detailed output:
python scripts/validate-setup.py --verbose

# To check specific directory:
python scripts/validate-setup.py --project-root /path/to/project
```

### Manual Validation Checklist

- [ ] All required directories exist
- [ ] PRD.md is customized for your project
- [ ] context.md contains your project information
- [ ] Configuration files are valid JSON
- [ ] Language-specific files are created
- [ ] Git repository is initialized
- [ ] Claude Code extension is installed and working
- [ ] @orient command works in Claude Code
- [ ] Reference test case is defined

### Test AI Workflow

1. **Orient Command**: `@orient` should show your project status
2. **Task Selection**: `@next-task` should suggest first component
3. **Documentation**: PRD should reflect your project structure
4. **Integration**: All templates should reference your project name

## 🚨 Troubleshooting

### Common Issues

#### "Template placeholders still exist"
- Search for `[CUSTOMIZE:` in all files
- Replace all placeholders with your content
- Re-run validation script

#### "Claude Code commands not working"
- Check `.claude/settings.json` exists and is valid
- Verify Claude Code extension is installed
- Check file paths in settings match your structure

#### "Git repository issues"
- Ensure `.git` directory exists
- Check that initial commit was created
- Verify `.gitignore` is appropriate for your language

#### "Language-specific setup missing"
- Check that language-specific files were created
- Verify test commands work for your language
- Update configuration with correct commands

### Getting Help

1. **Run Validation**: `python scripts/validate-setup.py` for specific issues
2. **Check Documentation**: Review relevant docs in `docs/` directory
3. **Test Components**: Ensure each part works independently
4. **Start Simple**: Begin with basic customization, add complexity later

## 🔄 Next Steps

After successful setup:

1. **Start Development**: Use `@orient` to begin your first component
2. **Iterate on PRD**: Refine requirements as you learn more
3. **Build Components**: Use the AI workflow to implement your pipeline
4. **Document Learnings**: Update context.md with discoveries
5. **Share Experience**: Contribute improvements back to the template

---

**Your AI-powered development environment is ready! Time to build something amazing.** 🚀