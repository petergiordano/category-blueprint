# AI-Powered Development Cycle Template

A complete, production-ready template for implementing AI-assisted development workflows with **Amazon Gyro IDE capabilities**. Transform your development process with structured AI assistance, automated quality gates, and enterprise-grade governance.

## 🎯 What This Template Provides

This template bridges the gap between **"vibe coding"** (rapid prototyping) and **"viable code"** (production-ready systems):

### 🧠 **Gyro-Enhanced AI Development**
- **Spec-Driven Development**: Requirements → Design → Tasks workflow with automated generation
- **Agent Steering System**: Persistent AI context through domain-specific guidance files
- **Agent Hooks Framework**: Event-driven automation for quality gates and workflows
- **Execution Modes**: Autopilot, supervised, and hybrid AI assistance levels
- **Advanced Validation**: Comprehensive production readiness assessment

### 🏗️ **Production-Ready Architecture**
- **Component-Based Pipeline**: Break complex projects into manageable, testable components  
- **SLC Principles**: Simple, Lovable, Complete design framework for quality outcomes
- **Multi-Tier Testing**: Unit, integration, performance, and acceptance testing
- **Quality Gates**: Automated validation before deployment

### 🤖 **AI Coordination**
- **Claude Code Integration**: Complex problem-solving, architecture decisions, code review
- **Domain-Specific Intelligence**: Data processing, content generation, API integration patterns
- **Workflow Orchestration**: Multi-step development automation with intelligent coordination

## ⚡ Quick Start

> **New here?** Start with [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.

### 1. Clone and Initialize
```bash
# Clone the template (or download as ZIP)
git clone https://github.com/[your-username]/ai-dev-cycle-template my-project
cd my-project

# Run the enhanced setup script (includes Gyro features)
./scripts/initialize-project.sh
# Choose your project domain: data-processing, content-generation, api-integration, or general
# Enable Gyro features: steering system, hooks, validation (recommended: yes)

# Validate setup
python scripts/validate-setup.py
```

### 2. Customize for Your Project  
```bash
# Review generated steering files for your domain
code .claude/steering/

# Edit the PRD template for your specific project
code docs/specifications/PRD.md

# Configure your development environment
code config/project-config.json
```

### 3. Start Developing with AI
```bash
# Open in VS Code with Claude Code extension
code .

# Use enhanced AI workflow commands:
@orient                    # Get project status and next steps
@next-task                 # Select and plan next component  
@finalize-task             # Complete current work with validation
@update-prd                # Sync project progress

# Gyro-enhanced commands:
@workflow-orchestrator     # Automate multi-step workflows
@production-readiness      # Check deployment readiness
@validate-all              # Run comprehensive validation
```

## 🏗️ Architecture

### 🎯 **Gyro-Style Development Workflow**
**Spec-Driven Development** with formal requirements → design → tasks phases:
```
Requirements Generation → Technical Design → Task Breakdown → Implementation → Validation
```

### 🔄 **Component Pipeline Approach**
Every project is structured as a sequential pipeline of 4-8 components:
```
Input → Component 1 → Component 2 → Component 3 → ... → Final Output
```

Each component follows **SLC principles**:
- **Simple**: Does one job exceptionally well
- **Lovable**: Provides clear feedback and user confidence
- **Complete**: Produces output ready for the next component

### 🧭 **Agent Steering System**
**Persistent AI context** through domain-specific guidance:
```
.claude/steering/
├── product.md           # Product purpose and target users
├── tech.md             # Technology stack and constraints
├── structure.md        # File organization and patterns
└── domain-specific.md  # Specialized guidance for your domain
```

### 🪝 **Agent Hooks Framework**
**Event-driven automation** for quality gates:
```
.claude/hooks/
├── file-events/         # On save, create, delete triggers
├── development-events/  # Pre-commit, post-implementation
└── templates/          # Reusable automation templates
```

### ⚙️ **Execution Modes**
**Adaptive AI assistance** based on task complexity:
- **Autopilot**: Autonomous execution for routine tasks
- **Supervised**: Step-by-step approval for complex changes
- **Hybrid**: Intelligent mode switching based on risk assessment

### 🎛️ **AI Coordination Framework**
- **Claude Code**: Complex problem-solving, architecture decisions, code review
- **Steering System**: Contextual guidance for domain-specific patterns
- **Hooks Framework**: Automated quality gates and workflow triggers
- **Human Oversight**: Strategic decisions, quality gates, final approval

## 📁 Template Structure

```
ai-dev-cycle-template/
├── .aicontext/
│   ├── AI_CONTEXT_TEMPLATE.md
│   └── WORKFLOW_GUIDE.md
├── .claude/
│   ├── commands/
│   │   ├── advanced/
│   │   │   ├── context-analyzer.md
│   │   │   ├── dependency-mapper.md
│   │   │   ├── production-readiness.md
│   │   │   ├── quality-assessor.md
│   │   │   └── workflow-orchestrator.md
│   │   ├── finalize-task.md
│   │   ├── generate-tasks.md
│   │   ├── next-task.md
│   │   ├── orient.md
│   │   └── update-prd.md
│   ├── execution-modes/
│   │   ├── autopilot-config.md
│   │   ├── hybrid-config.md
│   │   └── supervised-config.md
│   ├── hooks/
│   │   ├── development-events/
│   │   ├── file-events/
│   │   └── templates/
│   ├── steering/
│   │   ├── domain-specific/
│   │   ├── api-standards.md
│   │   ├── product.md
│   │   ├── structure.md
│   │   ├── tech.md
│   │   └── testing.md
│   ├── hooks-config.json
│   ├── persona.md
│   ├── settings.template.json
│   ├── steering-config.json
│   └── validation-config.json
├── .github/
│   └── REPOSITORY_INFO.md
├── config/
│   ├── api-integration-templates/
│   │   ├── graphql-template.json
│   │   ├── rest-api-template.json
│   │   └── websocket-template.json
│   ├── mcp-servers.json
│   ├── private-knowledge-config.json
│   ├── project-config.template.json
│   └── test-config-template.json
├── docs/
│   ├── architecture/
│   │   ├── ComponentLibrary.md
│   │   ├── Experience_Goals.md
│   │   └── SLC_Principles.md
│   └── specifications/
│       ├── design-template.md
│       ├── dev-cycle.md
│       ├── FEATURE_SPEC_TEMPLATE.md
│       ├── PRD_TEMPLATE.md
│       ├── requirements-template.md
│       └── tasks-template.md
├── scripts/
│   ├── validation/
│   │   ├── run-all-validations.py
│   │   ├── validate-hooks.py
│   │   ├── validate-production-ready.py
│   │   ├── validate-specifications.py
│   │   └── validate-steering.py
│   ├── copy-validation-scripts.sh
│   ├── generate-design.py
│   ├── generate-requirements.py
│   ├── initialize-project.sh
│   ├── test-framework.py
│   └── validate-setup.py
├── src/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
├── CHANGELOG.md
├── CLAUDE_CODE_PROMPT.md
├── FAQ.md
├── LICENSE
├── QUICKSTART.md
├── README.md
├── TEMPLATE_SETUP.md
├── TEST_PLAN.md
└── TROUBLESHOOTING.md
```

## 🎛️ Key Features

### 🤖 **Enhanced AI Workflow Commands**
**Core Commands:**
- **@orient**: Get project status and recommended next actions
- **@next-task**: Automatically select and plan the highest priority component
- **@finalize-task**: Complete current work with testing and documentation
- **@update-prd**: Synchronize project progress and status

**Gyro Advanced Commands:**
- **@workflow-orchestrator**: Automate complex multi-step development workflows
- **@production-readiness**: Comprehensive deployment readiness validation
- **@validate-all**: Run complete project validation (specs, steering, hooks, production)
- **@context-analyzer**: Deep project state analysis and insights
- **@dependency-mapper**: Visualize and optimize component dependencies

### 🔍 **Quality Assurance & Validation**
- **Multi-Tier Testing**: Unit, integration, performance, acceptance, smoke tests
- **Validation Framework**: Specifications, steering, hooks, production readiness
- **Reference Test Cases**: Validate every component against real-world scenarios
- **Performance Monitoring**: Track speed, resource usage, and user satisfaction
- **Code Quality Gates**: Automated linting, formatting, and style checking
- **Production Readiness**: Infrastructure, security, performance, monitoring validation

### 🧭 **Intelligent Development Guidance**
- **Agent Steering**: Persistent AI context through domain-specific guidance files
- **Spec-Driven Development**: Formal requirements → design → tasks workflow
- **Event-Driven Automation**: Hooks framework for quality gates and workflows
- **Execution Modes**: Autopilot, supervised, hybrid AI assistance levels
- **Domain Intelligence**: Specialized patterns for data processing, content generation, API integration

### 📊 **Documentation & Reporting**
- **Living Documentation**: PRD updates automatically with development progress
- **Implementation Logs**: Detailed records of development decisions and learnings
- **Architecture Decision Records**: Persistent record of design choices
- **AI Context Management**: Knowledge base that grows with your project
- **Comprehensive Reports**: JSON, JUnit XML, HTML formats for CI/CD integration

## 🚀 **Getting Started with Gyro Features**

### **First-Time Setup**
1. **Run Enhanced Initialization:**
   ```bash
   ./scripts/initialize-project.sh
   # Select your domain when prompted
   # Enable Gyro features (recommended: yes)
   ```

2. **Review Generated Steering Files:**
   ```bash
   # Check your domain-specific guidance
   code .claude/steering/domain-specific.md
   
   # Review product and technical constraints
   code .claude/steering/product.md
   code .claude/steering/tech.md
   ```

3. **Configure Execution Mode:**
   ```bash
   # Choose your preferred AI assistance level
   code .claude/execution-modes/hybrid-config.md  # Recommended for new users
   ```

### **Development Workflow**
```bash
# 1. Generate specifications (Gyro-style)
@workflow-orchestrator feature --spec="requirements" --component="Component 1"

# 2. Validate before implementation
@validate-all

# 3. Implement with guided assistance
@next-task

# 4. Comprehensive testing
python scripts/test-framework.py . --save-reports

# 5. Production readiness check
@production-readiness staging
```

### **Validation & Quality Gates**
```bash
# Run all validations
python scripts/validation/run-all-validations.py .

# Specific validations
python scripts/validation/validate-specifications.py .
python scripts/validation/validate-hooks.py .
python scripts/validation/validate-production-ready.py . --environment production

# Enhanced testing with validation integration
python scripts/test-framework.py . --types unit integration
```

## 🌟 Domain Examples

### Data Processing Pipeline
```
Raw Data → Validation → Transformation → Analysis → Visualization → Export
```
- Focus on data accuracy and processing speed
- Emphasize error handling and data quality
- Include cost monitoring for cloud processing

### Content Generation System
```
Input → Parsing → Generation → Quality Check → Formatting → Output
```
- Prioritize output quality and consistency
- Include API cost tracking and optimization
- Focus on user experience and content standards

### API Integration Project
```
Config → Authentication → Data Mapping → Processing → Validation → Response
```
- Emphasize reliability and error handling
- Include rate limiting and timeout management
- Focus on data transformation accuracy

## 🚀 Getting Started

### Prerequisites
- **Git**: Version control and template management
- **VS Code**: Primary development environment  
- **Claude Code Extension**: AI coordination and assistance (supports Gyro features)
- **Python 3.8+**: Required for validation framework and enhanced testing
- **Programming Language**: Python, JavaScript, Go, or your preferred language
- **Optional**: Docker for containerization validation

### Installation Steps

1. **Get the Template**
   ```bash
   # Option 1: Clone from repository
   git clone [template-repo-url] my-new-project
   
   # Option 2: Download as ZIP and extract
   # Download from GitHub releases page
   ```

2. **Initialize Your Project**
   ```bash
   cd my-new-project
   ./scripts/initialize-project.sh
   # Follow prompts to:
   # - Set project name and description
   # - Choose domain (data-processing, content-generation, api-integration, general)  
   # - Enable Gyro features (recommended: yes)
   ```

3. **Validate Setup**
   ```bash
   python scripts/validate-setup.py
   
   # If Gyro features enabled, run comprehensive validation:
   python scripts/validation/run-all-validations.py .
   ```

4. **Customize for Your Domain**
   - Review generated steering files: `.claude/steering/`
   - Edit `docs/specifications/PRD.md` with your project requirements
   - Configure execution mode: `.claude/execution-modes/hybrid-config.md`
   - Set up hooks for your workflow: `.claude/hooks-config.json`

5. **Start AI-Assisted Development**
   ```bash
   code .
   # Install Claude Code extension if needed
   # Use the starter prompt from CLAUDE_CODE_PROMPT.md for optimal AI assistance
   ```

## 📖 Documentation

### Essential Reading
- **[TEMPLATE_SETUP.md](TEMPLATE_SETUP.md)**: Detailed setup and customization guide
- **[PRD Template](docs/specifications/PRD_TEMPLATE.md)**: Project requirements structure
- **[SLC Principles](docs/architecture/SLC_Principles.md)**: Core design philosophy
- **[Development Workflow](docs/specifications/dev-cycle.md)**: AI-assisted development process

### Reference Documentation
- **[Feature Spec Template](docs/specifications/FEATURE_SPEC_TEMPLATE.md)**: Component specification format
- **[Component Library](docs/architecture/ComponentLibrary.md)**: Design patterns and standards
- **[Experience Goals](docs/architecture/Experience_Goals.md)**: User experience guidelines
- **[Workflow Guide](.aicontext/WORKFLOW_GUIDE.md)**: AI coordination details

## 🤝 Contributing

This template is designed to evolve based on real-world usage:

1. **Use the template** in your own projects
2. **Document learnings** and improvements
3. **Share feedback** on what works and what doesn't
4. **Contribute improvements** back to the template

### Template Development
- Keep the core principles intact
- Make customization easy and obvious
- Provide clear examples for different domains
- Maintain compatibility with AI tools

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

This template is open source and free to use for any purpose.

## 🆘 Support

### Quick Help Navigation
- 🚀 **Getting Started**: [QUICKSTART.md](QUICKSTART.md) - 5-minute setup
- 🤖 **Claude Code**: [CLAUDE_CODE_PROMPT.md](CLAUDE_CODE_PROMPT.md) - AI assistance starter
- ❓ **Common Questions**: [FAQ.md](FAQ.md) - Frequently asked questions  
- 🔧 **Issues & Solutions**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Problem resolution
- 📖 **Detailed Setup**: [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md) - Comprehensive guide
- 📝 **Changes**: [CHANGELOG.md](CHANGELOG.md) - Version history and updates

### Getting Help
- Start with [FAQ.md](FAQ.md) for common questions
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for specific issues
- Run `python scripts/validate-setup.py` for setup diagnostics
- See [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md) for detailed configuration
- Create issues in the template repository for bugs or feature requests

---

**Transform your development workflow with AI assistance. Build faster, build better, build with confidence.** 🤖✨