# 🤖 Claude Code Starter Prompt

Use this prompt when opening your new project in VS Code with Claude Code to get optimal AI assistance with the template workflow.

## 📋 How to Use

1. **After initializing your project** with `./scripts/initialize-project.sh`
2. **Open the project in VS Code** with Claude Code extension
3. **Copy and customize the prompt below** with your project details
4. **Paste it into Claude Code** to start your AI-assisted development session

---

## 🚀 **Copy This Prompt (Customize the Bracketed Parts):**

```
I'm starting a new project using the AI Development Template with Gyro features. This template provides:

🏗️ **Template Structure:**
- Component-based architecture with 4-8 sequential pipeline components
- Gyro features: spec-driven development, agent steering, automated quality gates
- AI workflow commands: @orient, @next-task, @finalize-task, @update-prd
- Multi-language support: Python (primary), JavaScript, Go

🎯 **Current Status:**
- Fresh template clone, need to initialize for my specific project
- Planning to build: [DESCRIBE YOUR PROJECT - e.g., "a data processing pipeline that analyzes customer feedback"]
- Target domain: [data-processing/content-generation/api-integration/general]
- Primary language: [python/javascript/go]

🚀 **Immediate Goals:**
1. Run initialization script and configure for my project
2. Set up the development environment properly
3. Start first component implementation using the AI workflow

📋 **What I Need Help With:**
- Guide me through the template setup process
- Help me understand and leverage the Gyro features effectively
- Assist with component architecture planning for my specific use case
- Use the AI workflow commands to coordinate our development process

🔧 **Template Features to Leverage:**
- Spec-driven development (requirements → design → tasks)
- Agent steering system for persistent project context
- Automated validation and quality gates
- Production readiness assessment

Please start by helping me orient in this template and guide me through the initialization process. Use the @orient command if available, or help me understand the next best steps for getting started with this AI-powered development workflow.

My project goal: [DESCRIBE YOUR SPECIFIC PROJECT GOAL AND REQUIREMENTS]
```

---

## 🎯 **Customization Guide**

Replace these bracketed placeholders with your actual details:

### **[DESCRIBE YOUR PROJECT]**
Examples:
- "a data processing pipeline that analyzes customer feedback"
- "a content generation system for social media posts"
- "an API integration platform for e-commerce data"
- "a web application for project management"

### **[data-processing/content-generation/api-integration/general]**
Choose the domain that best fits your project:
- **data-processing**: ETL pipelines, analytics, data transformation
- **content-generation**: Writing, media creation, content management
- **api-integration**: Service connections, data synchronization
- **general**: Web apps, tools, or mixed-purpose projects

### **[python/javascript/go]**
Select your primary programming language:
- **python**: Best template support, recommended for data/AI projects
- **javascript**: Good for web applications and APIs
- **go**: Basic support, good for performance-critical applications

### **[DESCRIBE YOUR SPECIFIC PROJECT GOAL]**
Provide detailed context:
- What problem you're solving
- Who the users are
- Key features you need
- Any specific requirements or constraints

---

## 💡 **Pro Tips**

### **Before Using This Prompt:**
1. ✅ Run `./scripts/initialize-project.sh` to set up your project
2. ✅ Validate setup with `python scripts/validate-setup.py`
3. ✅ Open project in VS Code with Claude Code extension installed

### **What Claude Will Help With:**
- **Project setup guidance** using template best practices
- **Component architecture design** for your specific domain
- **Gyro features utilization** for enhanced development workflow
- **AI workflow coordination** using the built-in commands
- **Code generation** following template patterns
- **Quality assurance** using validation frameworks

### **Expected Next Steps:**
1. Claude will likely start with `@orient` to assess project state
2. Guide you through any remaining setup steps
3. Help plan your component architecture
4. Begin first component implementation with `@next-task`

### **During Development:**
- Use `@orient` when you need project overview
- Use `@next-task` to plan and implement next component
- Use `@finalize-task` to complete work with proper validation
- Use `@update-prd` to track progress and update documentation

---

## 🔄 **Alternative Quick Start**

If you just want to get oriented quickly, use this shorter version:

```
I'm using the AI Development Template with Gyro features for a new [PROJECT TYPE] project. Please help me get oriented and start using the AI workflow commands effectively. Use @orient to begin, or guide me through the next steps.

My project: [BRIEF DESCRIPTION]
```

---

**This prompt is designed to give Claude Code the perfect context to help you maximize the template's AI-powered development workflow!** 🚀