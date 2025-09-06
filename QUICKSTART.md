# 🚀 5-Minute Quickstart Guide

Get your AI-powered development workflow running in 5 minutes.

## Prerequisites Check ✅
```bash
# Verify you have these installed:
git --version          # Any recent version
code --version         # VS Code
python3 --version      # Python 3.8+
```

## Step 1: Get the Template (1 min)
```bash
# Clone or download this template
git clone https://github.com/[your-username]/ai-dev-cycle-template my-ai-project
cd my-ai-project

# OR download ZIP from GitHub and extract
```

## Step 2: Initialize Your Project (2 min)
```bash
# Run the magic setup script
./scripts/initialize-project.sh

# Answer prompts (or just press Enter for defaults):
# - Project name: [your-project-name]
# - Description: [describe your project]
# - Language: python (or javascript/go)
# - Domain: general (or data-processing/content-generation/api-integration)
# - Enable Gyro features: y (recommended)
```

## Step 3: Validate Setup (1 min)
```bash
# Verify everything works
python scripts/validate-setup.py

# If you enabled Gyro features:
python scripts/validation/run-all-validations.py .
```

## Step 4: Start Developing (1 min)
```bash
# Open in VS Code
code .

# Install Claude Code extension if needed
# Use the starter prompt from CLAUDE_CODE_PROMPT.md for optimal AI assistance
# Or use these AI commands directly:
@orient                 # See project status
@next-task             # Get first task
```

## ✨ What You Just Got

### 🏗️ **Project Structure**
- Complete component-based architecture
- AI coordination system ready
- Testing framework configured

### 🤖 **AI Workflow Commands**
- **@orient**: Get project overview and next steps
- **@next-task**: Select and plan your next component
- **@finalize-task**: Complete current work with validation
- **@update-prd**: Sync project progress

### 🎯 **Gyro Features** (if enabled)
- **Spec-driven development**: Requirements → Design → Tasks
- **AI steering system**: Persistent context in `.claude/steering/`
- **Automated quality gates**: Validation and testing
- **Production readiness**: Comprehensive deployment checks

## 🔥 First Development Cycle

1. **Plan**: Use `@orient` to see recommended next steps
2. **Implement**: Use `@next-task` to work on first component
3. **Validate**: Use `@finalize-task` to complete with testing
4. **Repeat**: Use `@update-prd` to track progress

## 🆘 Need Help?

- **Setup Issues**: Check [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md)
- **Development Guide**: See [docs/specifications/dev-cycle.md](docs/specifications/dev-cycle.md)
- **Architecture**: Read [docs/architecture/SLC_Principles.md](docs/architecture/SLC_Principles.md)
- **Full Guide**: Complete [README.md](README.md)

## 🎯 Success Indicators

After 5 minutes you should have:
- ✅ Working project structure
- ✅ AI commands responding
- ✅ First component identified
- ✅ Development workflow active

**Next**: Start your first development cycle with `@orient` → `@next-task` → `@finalize-task`