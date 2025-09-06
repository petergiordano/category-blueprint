# On File Create Hook

**Purpose**: Automatic actions triggered when new files are created in the project.

**Trigger**: File creation events detected by the development environment.

## Hook Configuration

### File Pattern Matching
- **Source Files** (`src/*.py`, `src/*.js`, `src/*.ts`): Generate corresponding test files and documentation stubs
- **Component Files** (`components/*.jsx`, `components/*.vue`): Create test files and story files
- **API Files** (`*api*.py`, `*routes*.js`): Generate API documentation and integration tests
- **Configuration Files** (`*.config.js`, `*.json`): Validate configuration and update documentation

## Automation Actions

### Test File Generation
```bash
# For Python files
if [[ "$file_path" == src/*.py ]]; then
    test_file="tests/unit/${filename%.*}_test.py"
    # Generate test file with basic structure
    echo "Auto-generating test file: $test_file"
fi

# For JavaScript/TypeScript files
if [[ "$file_path" == src/*.{js,ts} ]]; then
    test_file="tests/unit/${filename%.*}.test.js"
    # Generate test file with Jest structure
    echo "Auto-generating test file: $test_file"
fi
```

### Documentation Stub Creation
```bash
# For new components or modules
if [[ "$file_path" == src/components/*.{jsx,vue,py} ]]; then
    doc_file="docs/components/${filename%.*}.md"
    # Generate documentation stub
    echo "Auto-generating documentation stub: $doc_file"
fi
```

### Code Quality Setup
```bash
# For source files, ensure quality tooling is configured
if [[ "$file_path" == src/*.{py,js,ts} ]]; then
    # Add file to linting configuration if needed
    # Ensure coverage tracking is enabled
    echo "Configuring quality tools for: $file_path"
fi
```

## Hook Templates to Execute

### Primary Templates
- `test-generator-hook.md` - Generate appropriate test file structure
- `doc-updater-hook.md` - Create documentation stub and update index
- `security-scanner-hook.md` - Scan new file for security patterns

### Conditional Templates
- **API Files**: Generate OpenAPI spec updates and integration tests
- **Component Files**: Generate story files for UI components
- **Database Files**: Generate migration tests and schema validation

## Integration with Steering System

### Context-Aware Actions
- **Data Processing Projects**: Generate data validation tests
- **Content Generation Projects**: Create content quality checks
- **API Integration Projects**: Generate service integration tests
- **Web Applications**: Create accessibility and UX tests

### Configuration Loading
```json
{
  "file_creation_hooks": {
    "src/*.py": {
      "templates": ["test-generator-hook", "doc-updater-hook"],
      "quality_gates": ["security-scanner-hook"],
      "context_specific": {
        "data_processing": ["data-validation-tests"],
        "api_integration": ["service-integration-tests"]
      }
    }
  }
}
```

## Quality Gates

### Mandatory Checks
- **Test Coverage**: Ensure new files have corresponding test files
- **Documentation**: Verify documentation stubs are created
- **Security**: Scan for common security anti-patterns

### Optional Enhancements
- **Code Style**: Apply project-specific formatting
- **Dependencies**: Check for unused or conflicting dependencies
- **Performance**: Add performance monitoring for critical files

## Error Handling

### Graceful Degradation
- If template generation fails, log error but don't block file creation
- Provide fallback templates for unknown file types
- Continue with partial automation if some hooks fail

### User Notification
```bash
# Success notification
echo "✅ File created successfully with automated setup"
echo "   - Test file: $test_file"
echo "   - Documentation: $doc_file"

# Warning notification  
echo "⚠️  Some automation steps failed:"
echo "   - Manual test file creation needed"
echo "   - Review security scanning results"
```

## AI Behavior Guidelines

### When to Trigger
- New file creation in source directories
- Component or module file creation
- Configuration file addition
- Documentation file creation

### What to Generate
- Appropriate test file structure based on file type and project patterns
- Documentation stub with standard template
- Security and quality scanning setup
- Integration with existing project structure

### Integration Points
- Respect existing project conventions
- Use established testing frameworks
- Follow project documentation patterns
- Maintain consistency with steering system guidance

---

**This hook ensures that new files are immediately integrated into the project's quality and documentation systems, maintaining consistency and reducing manual setup overhead.**