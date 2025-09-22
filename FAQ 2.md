# ❓ Frequently Asked Questions

Common questions about the AI Development Template and Gyro features.

## 🎯 Getting Started

### Q: What exactly is this template?
**A:** This is a production-ready template for building AI-assisted development workflows. It provides:
- **Component-based architecture** for systematic development
- **AI coordination system** with Claude Code integration
- **Gyro features** for spec-driven development and automated quality gates
- **Complete tooling** for testing, validation, and deployment

### Q: Do I need to know AI/ML to use this?
**A:** No! This template helps you **use AI** in your development process, not build AI systems. It's designed for any developer who wants AI assistance with coding, planning, and quality assurance.

### Q: What programming languages are supported?
**A:** Currently optimized for:
- **Python** (primary, best support)
- **JavaScript/Node.js** (good support)
- **Go** (basic support)
- **Others** (generic structure, manual setup required)

## 🤖 AI Features

### Q: What are these @commands I keep seeing?
**A:** These are AI workflow commands powered by Claude Code:
- `@orient` - Get project overview and next steps
- `@next-task` - Select and plan your next component
- `@finalize-task` - Complete work with validation
- `@update-prd` - Sync project progress

### Q: Do I need API keys for AI features?
**A:** Depends on your setup:
- **Claude Code extension**: Uses your Anthropic account/credits
- **Basic template features**: No API keys needed
- **Gyro features**: Work with any AI assistant, no keys required

### Q: What happens if I don't have Claude Code extension?
**A:** The template still works! You get:
- ✅ Complete project structure
- ✅ Component-based development approach
- ✅ Testing and validation frameworks
- ❌ AI workflow commands (@orient, @next-task, etc.)

## 🏗️ Gyro Features

### Q: What are "Gyro features" and do I need them?
**A:** Gyro features are enhanced AI development capabilities:
- **Spec-driven development**: Requirements → Design → Tasks workflow
- **Agent steering**: Persistent AI context through `.claude/steering/` files
- **Automated hooks**: Quality gates and validation triggers
- **Enhanced validation**: Comprehensive project health checks

**Recommendation**: Enable for production projects, skip for quick prototypes.

### Q: What's the difference between basic template and Gyro features?
| Feature | Basic Template | With Gyro Features |
|---------|----------------|-------------------|
| Project structure | ✅ | ✅ |
| Component workflow | ✅ | ✅ |
| AI commands | ✅ | ✅ Enhanced |
| Spec-driven development | ❌ | ✅ |
| AI steering system | ❌ | ✅ |
| Automated validation | Basic | ✅ Comprehensive |
| Production readiness | Manual | ✅ Automated |

### Q: Can I add Gyro features to an existing project?
**A:** Yes! Run the initialization script in your existing project:
```bash
./scripts/initialize-project.sh
# Choose "y" for Gyro features when prompted
```

## 🏗️ Architecture & Development

### Q: What's a "component-based pipeline"?
**A:** It's an approach where your project is built as a sequence of independent components:
```
Input → Component 1 → Component 2 → Component 3 → Output
```
Each component:
- Does one job well (Simple)
- Provides clear feedback (Lovable)
- Produces ready output (Complete)

### Q: How many components should my project have?
**A:** **4-8 components** is the sweet spot:
- **Fewer than 4**: Might be too simple for the template overhead
- **4-6 components**: Perfect for most projects
- **6-8 components**: Good for complex systems
- **More than 8**: Consider breaking into multiple projects

### Q: What if my project doesn't fit the pipeline model?
**A:** The template is flexible:
- **Web apps**: Authentication → Routes → Business Logic → Database → Frontend
- **APIs**: Input Validation → Processing → Data Access → Response Formatting
- **Data tools**: Ingestion → Cleaning → Analysis → Visualization → Export
- **Other**: Adapt the component concept to your domain

## 🧪 Testing & Quality

### Q: Do I have to write tests?
**A:** The template **strongly encourages** testing but doesn't force it:
- Test framework is configured and ready
- Validation scripts check for tests
- AI commands include testing reminders
- **But**: You can skip tests for prototypes

### Q: What testing frameworks are used?
**A:** Language-specific standards:
- **Python**: pytest + coverage
- **JavaScript**: Jest + coverage
- **Go**: go test + coverage
- **Others**: Configure in `config/test-config.json`

### Q: What's this validation system about?
**A:** Multi-layer quality assurance:
1. **Specification validation**: Requirements → Design → Tasks consistency
2. **Code quality**: Linting, formatting, standards
3. **Testing validation**: Coverage, test quality
4. **Production readiness**: Security, performance, deployment

## 📁 Project Structure

### Q: Can I modify the directory structure?
**A:** Yes, but some paths are expected by the tooling:
- **Flexible**: `src/`, `tests/`, `docs/` layout
- **Fixed**: `.claude/` structure for AI features
- **Configurable**: Most paths in `config/project-config.json`

### Q: What are all these .claude/ files?
**A:** AI coordination system:
```
.claude/
├── commands/           # AI workflow commands (@orient, @next-task)
├── steering/          # Persistent AI context (Gyro feature)
├── hooks/             # Automated quality gates (Gyro feature)
├── execution-modes/   # AI behavior settings (Gyro feature)
└── settings.json      # Claude Code configuration
```

### Q: Should I commit .claude/ to git?
**A:** **Yes!** These files are part of your development workflow:
- **Do commit**: Commands, steering files, hooks, configs
- **Don't commit**: API keys, personal settings, temporary files

## 🚀 Deployment & Production

### Q: How do I deploy projects built with this template?
**A:** The template prepares you for deployment but doesn't deploy:
- **Production readiness validation**: `@production-readiness` command
- **CI/CD integration**: JUnit XML, coverage reports ready
- **Docker support**: Add Dockerfile to your project
- **Platform agnostic**: Deploy to any platform

### Q: Is this suitable for production applications?
**A:** **Absolutely!** The template emphasizes production readiness:
- Comprehensive testing frameworks
- Security validation
- Performance monitoring
- Documentation standards
- Quality gates and validation

## 🔧 Customization

### Q: Can I use this with my existing tools?
**A:** Yes! The template integrates with:
- **IDEs**: VS Code (primary), others work
- **CI/CD**: GitHub Actions, Jenkins, etc.
- **Testing**: Your existing test runners
- **Deployment**: Any platform or service

### Q: How do I customize the AI behavior?
**A:** Multiple customization points:
1. **Steering files**: Edit `.claude/steering/` for project context
2. **Execution modes**: Configure AI autonomy level
3. **Hooks**: Customize automation triggers
4. **Commands**: Modify `.claude/commands/` behavior

### Q: Can I remove AI features entirely?
**A:** Yes! You get a solid development template:
- Delete `.claude/` directory
- Use standard testing/validation tools
- Keep the component-based architecture
- Manual development workflow

## 🆘 Troubleshooting

### Q: The setup script fails, what do I do?
**A:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions. Common fixes:
```bash
# Make script executable
chmod +x scripts/initialize-project.sh

# Run with bash
bash scripts/initialize-project.sh

# Check Python version
python3 --version  # Need 3.8+
```

### Q: AI commands don't work, help!
**A:** Check these in order:
1. **Claude Code extension installed** in VS Code
2. **VS Code restarted** after extension install
3. **Command files exist**: `ls .claude/commands/`
4. **Try manual command**: Press Ctrl+Shift+P, type "@orient"

### Q: Validation fails with errors, what now?
**A:** Run diagnostics:
```bash
# Basic setup validation
python scripts/validate-setup.py

# Comprehensive validation (if Gyro enabled)
python scripts/validation/run-all-validations.py . --verbose
```

## 💡 Best Practices

### Q: What's the recommended development workflow?
**A:**
1. **Plan**: `@orient` to see next steps
2. **Implement**: `@next-task` for guided development
3. **Validate**: `@finalize-task` with testing
4. **Track**: `@update-prd` for progress
5. **Repeat**: Continue cycle

### Q: How often should I run validation?
**A:**
- **During development**: Before each commit
- **Major changes**: After significant features
- **Production prep**: Full validation before deployment
- **Automated**: Set up hooks for continuous validation

### Q: Any tips for new users?
**A:**
1. **Start simple**: Basic template first, add Gyro features later
2. **Follow the workflow**: Use the AI commands as designed
3. **Read the steering files**: They guide AI behavior
4. **Update documentation**: Keep PRD and specs current
5. **Embrace iteration**: Template improves with use

---

**Don't see your question?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or create an issue in the template repository.