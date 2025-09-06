# 🔧 Troubleshooting Guide

Common issues and solutions for getting started with the AI Development Template.

## 🚨 Setup Issues

### Initialize Script Fails
**Problem**: `./scripts/initialize-project.sh` fails or gives permission errors

**Solutions**:
```bash
# Make script executable
chmod +x ./scripts/initialize-project.sh

# Run with bash explicitly
bash scripts/initialize-project.sh

# Check if you're in the right directory
pwd  # Should show your project root
ls   # Should see scripts/ directory
```

### Python/Dependencies Issues
**Problem**: Validation scripts fail with import errors

**Solutions**:
```bash
# Check Python version (need 3.8+)
python3 --version

# Install required packages
pip install pytest coverage

# Use virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### VS Code Claude Extension Issues
**Problem**: AI commands (@orient, @next-task) don't work

**Solutions**:
1. **Install Claude Code extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search "Claude Code"
   - Install and reload VS Code

2. **Check extension activation**:
   - Press Ctrl+Shift+P
   - Type "Claude" - should see Claude commands
   - If not, restart VS Code

3. **Verify Claude settings**:
   - Check `.claude/settings.json` exists
   - Verify API key configuration if required

## 🎯 Gyro Features Issues

### Steering Files Not Working
**Problem**: AI doesn't seem to use project context

**Solutions**:
```bash
# Check steering files exist
ls .claude/steering/
# Should see: product.md, tech.md, structure.md, domain-specific.md

# Verify steering config
cat .claude/steering-config.json
# Should have valid JSON structure

# Re-run Gyro setup
./scripts/initialize-project.sh
# Choose "y" for Gyro features when prompted
```

### Validation Errors
**Problem**: `python scripts/validation/run-all-validations.py` fails

**Solutions**:
```bash
# Check validation scripts exist
ls scripts/validation/
# Should see multiple .py files

# Install validation dependencies
pip install jsonschema pathlib

# Run individual validations to isolate issue
python scripts/validation/validate-specifications.py .
python scripts/validation/validate-steering.py .
python scripts/validation/validate-hooks.py .
```

### Hooks Not Executing
**Problem**: Automated quality gates don't trigger

**Solutions**:
```bash
# Check hooks configuration
cat .claude/hooks-config.json
# Should have valid JSON

# Verify hooks directory structure
tree .claude/hooks/
# Should have file-events/, development-events/, templates/

# Test hook execution manually
python scripts/validation/validate-hooks.py .
```

## 📁 File Structure Issues

### Missing Directories
**Problem**: Expected directories don't exist

**Solutions**:
```bash
# Re-run initialization with force
./scripts/initialize-project.sh

# Manually create missing directories
mkdir -p src tests config docs/specifications
mkdir -p .claude/steering .claude/hooks .claude/commands
mkdir -p scripts/validation
```

### Permission Errors
**Problem**: Can't write to directories or execute scripts

**Solutions**:
```bash
# Fix script permissions
chmod +x scripts/*.sh
chmod +x scripts/validation/*.py

# Fix directory permissions
chmod -R u+w .claude/
chmod -R u+w docs/
chmod -R u+w config/
```

## 🤖 AI Command Issues

### @orient Command Not Found
**Problem**: AI commands don't respond or show errors

**Solutions**:
1. **Check Claude Code extension**:
   - Extension installed and activated
   - VS Code restarted after installation

2. **Verify command files**:
   ```bash
   ls .claude/commands/
   # Should see: orient.md, next-task.md, finalize-task.md, etc.
   ```

3. **Check file permissions**:
   ```bash
   chmod -R u+r .claude/commands/
   ```

### AI Responses Don't Use Project Context
**Problem**: AI doesn't understand your project specifics

**Solutions**:
1. **Update steering files**:
   ```bash
   # Edit project-specific context
   code .claude/steering/product.md      # Your project purpose
   code .claude/steering/tech.md         # Technology choices
   code .claude/steering/domain-specific.md  # Domain knowledge
   ```

2. **Verify steering system**:
   ```bash
   python scripts/validation/validate-steering.py .
   ```

3. **Check PRD file**:
   ```bash
   # Ensure PRD exists and is filled out
   code docs/specifications/PRD.md
   ```

## 🧪 Testing Issues

### Tests Won't Run
**Problem**: Test framework errors or no tests found

**Solutions**:
```bash
# Check test directory structure
ls tests/
# Should have unit/, integration/, etc. if created

# Install test dependencies
pip install pytest pytest-cov

# Run test framework directly
python scripts/test-framework.py . --types unit

# Check test configuration
cat config/test-config.json
```

### Coverage Reports Fail
**Problem**: Coverage analysis doesn't work

**Solutions**:
```bash
# Install coverage tools
pip install coverage pytest-cov

# Run with coverage manually
pytest --cov=src tests/

# Check if coverage.xml exists after test run
ls coverage.xml
```

## 🚀 Performance Issues

### Slow Initialization
**Problem**: Setup script takes too long

**Solutions**:
- Skip validation during setup: Add `--skip-validation` flag
- Use minimal Gyro features initially
- Check internet connection for any downloads

### Large File Issues
**Problem**: Git operations slow or fail

**Solutions**:
```bash
# Check for large files
find . -type f -size +10M

# Add large files to .gitignore
echo "*.log" >> .gitignore
echo "test-reports/" >> .gitignore
echo "coverage.xml" >> .gitignore
```

## 🔍 Diagnostic Commands

### Full System Check
```bash
# Run comprehensive diagnostics
python scripts/validate-setup.py

# If Gyro features enabled
python scripts/validation/run-all-validations.py . --verbose

# Check Git status
git status

# Verify directory structure
tree -L 3 .  # Or ls -la if tree not available
```

### Environment Information
```bash
# Check versions
python3 --version
git --version
code --version

# Check VS Code extensions
code --list-extensions | grep -i claude

# Check Python packages
pip list | grep -E "(pytest|coverage|jsonschema)"
```

## 🆘 Getting More Help

### Documentation Resources
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup guide
- [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md) - Detailed setup instructions
- [README.md](README.md) - Complete documentation
- [docs/specifications/dev-cycle.md](docs/specifications/dev-cycle.md) - Development workflow

### Common File Locations
```bash
# Configuration files
.claude/settings.json           # Claude Code settings
.claude/gyro-config.json       # Gyro features config
config/project-config.json     # Project settings

# Key documentation
docs/specifications/PRD.md     # Your project requirements
.claude/steering/product.md     # Project purpose and users

# Validation and testing
scripts/validate-setup.py      # Basic setup validation
scripts/validation/            # Comprehensive validation scripts
```

### Reset Options
If all else fails:

```bash
# Nuclear option: Start fresh
rm -rf .claude/ config/ scripts/validation/
./scripts/initialize-project.sh

# Or: Clone template again
cd ..
git clone [template-url] my-project-fresh
cd my-project-fresh
./scripts/initialize-project.sh
```

---

**Still stuck?** Create an issue in the template repository with:
1. Your operating system
2. Python version (`python3 --version`)
3. Error messages (full output)
4. Steps you've tried from this guide