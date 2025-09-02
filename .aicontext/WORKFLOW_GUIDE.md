# AI-Powered Development Workflow Guide

This document outlines the stable and reliable development workflow for AI-assisted project development. It is intended to be a persistent guide that does not change frequently.

**Note:** This document focuses on implementation details and AI coordination. For the high-level component development cycle (PRD → Feature Spec → Implementation → PR), see [dev-cycle.md](../docs/specifications/dev-cycle.md).

---

## 🎯 Core Principles

This workflow is designed around a few core principles:

* **Component-Based Architecture:** The system is built as a series of independent, interoperable components.
* **AI-Assisted Implementation:** AI assistants are leveraged for various tasks, from planning to implementation and testing.
* **PRD-Driven Development:** The Product Requirements Document serves as the single source of truth.
* **User-Controlled Oversight:** All major decisions require user approval and guidance.
* **Continuous Validation:** A multi-layered validation process ensures code quality and correctness.

---

## 🤖 AI Assistant Roles

This project utilizes AI assistants with specific roles and capabilities:

* **Claude Code:** Primary AI for complex problem-solving, architecture decisions, and implementation coordination
* **Domain-Specific AIs:** Specialized assistants for specific technologies or tasks (e.g., Codex for code generation)
* **Quality Assurance:** Automated testing and validation to ensure reliability

---

## 📊 High-Level Development Cycle

For major component development, the project follows a structured cycle:

1. **PRD Review** → Identify next component from `docs/specifications/PRD.md`
2. **Feature Spec Generation** → Create detailed specification using template
3. **Implementation** → AI-assisted development with human oversight
4. **Review & Integration** → Code review and component integration
5. **PRD Update** → Mark component complete and loop back

See [dev-cycle.md](../docs/specifications/dev-cycle.md) for the complete high-level workflow.

---

## 🔄 Development Process

The development process follows a consistent, repeatable cycle:

### 1. Task Selection
Use `@orient` command to understand current project state and available work.
Use `@next-task` command to select and plan the next logical component/task.

**Selection Criteria:**
- Dependencies are resolved (prerequisite components complete)
- Feature specification is complete and clear
- Success criteria are well-defined
- Implementation approach is understood

### 2. Implementation Setup
- Create appropriate development branch
- Review feature specification and success criteria
- Set up development environment and dependencies
- Prepare test data and validation materials

### 3. AI-Assisted Development
- Break down feature spec into implementable tasks
- Use AI assistance for code generation and problem-solving
- Maintain focus on SLC principles (Simple, Lovable, Complete)
- Test frequently during development

### 4. Validation & Quality Assurance
- Run component-specific tests
- Validate against reference test case
- Check integration with adjacent components
- Verify performance and quality requirements

### 5. Completion & Integration
Use `@finalize-task` command to complete the development cycle.
Update project documentation and prepare for next iteration.

---

## 🏗️ Component Development Standards

### Component Requirements
Each component must be:
- **Functionally Complete:** Implements all requirements from feature specification
- **Well-Tested:** Comprehensive unit and integration tests
- **Documented:** Clear interface documentation and usage examples
- **Integrated:** Works seamlessly with adjacent components
- **Performant:** Meets speed and resource requirements

### Development Checklist
- [ ] Feature specification reviewed and understood
- [ ] Development environment configured
- [ ] Implementation completed according to spec
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Reference test case validates successfully
- [ ] Code quality checks passed
- [ ] Documentation updated
- [ ] Performance requirements met

### Quality Gates
**Functional Testing:**
- All feature requirements implemented
- Edge cases handled appropriately
- Error conditions managed gracefully

**Integration Testing:**
- Component interfaces work as specified
- Data flow between components is correct
- No regressions in existing functionality

**Performance Testing:**
- Speed requirements met
- Resource usage within acceptable limits
- Scalability considerations addressed

---

## 🧪 Testing Strategy

### Test Hierarchy
1. **Unit Tests:** Test individual functions and methods
2. **Component Tests:** Test component behavior in isolation
3. **Integration Tests:** Test component interactions
4. **End-to-End Tests:** Test complete workflows
5. **Reference Case Validation:** Test against primary use case

### Validation Approach
- **Reference Test Case:** Primary validation scenario that all components must support
- **Performance Benchmarks:** Speed and resource usage targets
- **Quality Metrics:** Code coverage, error rates, user satisfaction indicators

### Test Data Management
- Use realistic test data that represents actual use cases
- Maintain test data versioning and consistency
- Ensure test data covers edge cases and error conditions

---

## 📝 Documentation Standards

### Required Documentation
- **PRD:** High-level project requirements and component status
- **Feature Specifications:** Detailed component requirements and design
- **API Documentation:** Component interfaces and usage
- **Implementation Logs:** Development decisions and lessons learned

### Documentation Maintenance
- Update PRD status after each component completion
- Maintain feature specifications as implementation evolves
- Record architectural decisions and their rationale
- Document lessons learned and best practices

---

## 🔧 Tool Integration

### Development Tools
- **Version Control:** Git with feature branch workflow
- **AI Coordination:** Claude Code for complex tasks, specialized AIs for specific domains
- **Testing:** Automated test suites for each component
- **Quality Assurance:** Linting, formatting, and static analysis

### Workflow Automation
- **Commands:** Use `@orient`, `@next-task`, `@finalize-task`, `@update-prd` for workflow automation
- **CI/CD:** Automated testing and quality checks
- **Documentation:** Automated status updates and progress tracking

---

## 🚀 Best Practices

### Component Development
- **Start Simple:** Implement core functionality first, add features incrementally
- **Test Early:** Write tests as you develop, not after
- **Document Decisions:** Record why choices were made, not just what was built
- **Validate Frequently:** Test against reference case throughout development

### AI Coordination
- **Clear Instructions:** Provide specific, actionable guidance to AI assistants
- **Context Management:** Ensure AI has access to relevant project context
- **Human Oversight:** Review AI-generated code and decisions carefully
- **Iterative Refinement:** Use feedback to improve AI assistance over time

### Quality Management
- **Definition of Done:** Clear criteria for when work is complete
- **Continuous Improvement:** Learn from each iteration and adjust approach
- **Technical Debt Management:** Address issues before they become blockers
- **Performance Monitoring:** Track and optimize system performance

---

## 📈 Progress Tracking

### Status Indicators
- **📝 PLANNED:** Component defined but not started
- **🚧 IN PROGRESS:** Active development underway
- **✅ COMPLETE:** Development finished and validated

### Metrics Tracking
- **Completion Rate:** Percentage of planned components finished
- **Development Velocity:** Time required per component
- **Quality Metrics:** Test coverage, defect rates, performance benchmarks
- **User Satisfaction:** Feedback on completed functionality

### Milestone Management
- **Component Milestones:** Completion of individual components
- **Integration Milestones:** Successful integration of multiple components
- **Feature Milestones:** Complete user workflows implemented
- **Project Milestones:** Major project objectives achieved

---

## 🎓 Learning & Improvement

### Continuous Learning
- Record lessons learned after each component
- Identify patterns that work well and those that don't
- Adjust workflow based on what is discovered during development
- Share insights across the development team

### Process Improvement
- Regular retrospectives on workflow effectiveness
- Refinement of AI coordination strategies
- Updates to quality standards and testing approaches
- Evolution of documentation and communication practices

---

## Template Customization Guide

### Adapting to Your Project

1. **Define Your Components:** Identify the 4-8 core components that make up your system
2. **Set Quality Standards:** Define what "good enough" means for your domain
3. **Configure Tools:** Set up development, testing, and AI tools for your stack
4. **Establish Workflows:** Customize commands and processes for your team
5. **Create Reference Cases:** Define primary validation scenarios for your project

### Domain-Specific Adaptations

**Data Processing Projects:**
- Focus on data quality and transformation accuracy
- Emphasize performance and scalability testing
- Include data validation and error handling patterns

**Content Generation Projects:**
- Prioritize output quality and consistency
- Include cost monitoring and optimization
- Focus on user experience and content standards

**API Integration Projects:**
- Emphasize reliability and error handling
- Include rate limiting and authentication testing
- Focus on data mapping and transformation accuracy

---

*This workflow guide should be adapted to match your specific project needs while maintaining the core principles of AI-assisted development and component-based architecture.*