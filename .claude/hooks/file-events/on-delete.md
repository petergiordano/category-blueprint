# On File Delete Hook

**Purpose**: Cleanup and dependency management triggered when files are deleted from the project.

**Trigger**: File deletion events detected by the development environment.

## Hook Configuration

### File Pattern Matching
- **Source Files** (`src/*.py`, `src/*.js`, `src/*.ts`): Clean up tests, docs, and dependencies
- **Component Files** (`components/*.jsx`, `components/*.vue`): Remove related stories and tests
- **API Files** (`*api*.py`, `*routes*.js`): Update API documentation and remove integration tests
- **Configuration Files** (`*.config.js`, `*.json`): Validate remaining configuration integrity

## Cleanup Actions

### Related File Removal
```bash
# Remove corresponding test files
if [[ "$deleted_file" == src/*.py ]]; then
    test_file="tests/unit/${filename%.*}_test.py"
    if [ -f "$test_file" ]; then
        echo "🗑️  Removing related test file: $test_file"
        rm "$test_file"
    fi
fi

# Remove documentation files
if [[ "$deleted_file" == src/components/*.{jsx,vue} ]]; then
    doc_file="docs/components/${filename%.*}.md"
    story_file="stories/${filename%.*}.stories.js"
    
    [ -f "$doc_file" ] && rm "$doc_file" && echo "📖 Removed documentation: $doc_file"
    [ -f "$story_file" ] && rm "$story_file" && echo "📚 Removed story file: $story_file"
fi
```

### Dependency Analysis
```bash
# Check for orphaned imports and references
check_dependencies() {
    local deleted_file="$1"
    local module_name="${filename%.*}"
    
    # Search for imports of the deleted module
    echo "🔍 Checking for references to deleted file..."
    grep -r "import.*$module_name" src/ && \
        echo "⚠️  Found references to deleted module: $module_name"
    
    # Search for function calls or class usage
    grep -r "$module_name\." src/ && \
        echo "⚠️  Found usage of deleted module: $module_name"
}
```

### Configuration Updates
```bash
# Update configuration files that reference the deleted file
update_configurations() {
    local deleted_file="$1"
    
    # Update package.json if JavaScript file
    if [[ "$deleted_file" == *.{js,ts,jsx,tsx} ]]; then
        # Check if file was referenced in package.json scripts
        grep -q "$deleted_file" package.json && \
            echo "⚠️  Update package.json scripts for deleted file"
    fi
    
    # Update Python setup files
    if [[ "$deleted_file" == *.py ]]; then
        # Check setup.py, pyproject.toml for references
        grep -q "${filename%.*}" setup.py pyproject.toml 2>/dev/null && \
            echo "⚠️  Update setup files for deleted module"
    fi
}
```

## Dependency Validation

### Import Analysis
```bash
# Scan remaining files for broken imports
validate_imports() {
    echo "🔍 Validating imports after file deletion..."
    
    # Python import validation
    if [[ "$deleted_file" == *.py ]]; then
        # Use Python to check for import errors
        python -c "
import ast
import os
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.py'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r') as f:
                    ast.parse(f.read())
            except SyntaxError as e:
                print(f'❌ Syntax error in {filepath}: {e}')
"
    fi
    
    # JavaScript/TypeScript import validation
    if [[ "$deleted_file" == *.{js,ts,jsx,tsx} ]]; then
        # Check for TypeScript compilation errors
        if command -v tsc >/dev/null 2>&1; then
            tsc --noEmit --skipLibCheck || \
                echo "❌ TypeScript compilation errors after deletion"
        fi
    fi
}
```

### Test Suite Integrity
```bash
# Verify test suite still passes after deletion
validate_test_suite() {
    echo "🧪 Validating test suite integrity..."
    
    # Run tests to ensure no broken references
    if command -v pytest >/dev/null 2>&1; then
        pytest --collect-only -q || \
            echo "❌ Test collection failed after file deletion"
    fi
    
    if command -v npm >/dev/null 2>&1; then
        npm test -- --passWithNoTests --watchAll=false || \
            echo "❌ JavaScript test suite failed after deletion"
    fi
}
```

## Documentation Updates

### Index File Maintenance
```bash
# Update documentation indexes and tables of contents
update_documentation_index() {
    local deleted_file="$1"
    
    # Update README.md if it references the deleted file
    if grep -q "$deleted_file" README.md; then
        echo "📖 README.md references deleted file - manual update needed"
    fi
    
    # Update API documentation index
    if [[ "$deleted_file" == *api*.py ]]; then
        echo "📖 API documentation may need updates for deleted endpoints"
    fi
    
    # Update component documentation index
    if [[ "$deleted_file" == components/*.{jsx,vue} ]]; then
        echo "📖 Component documentation index needs update"
    fi
}
```

### Changelog Updates
```bash
# Suggest changelog entries for significant deletions
suggest_changelog_entry() {
    local deleted_file="$1"
    
    echo "📝 Consider adding changelog entry:"
    echo "   - REMOVED: ${filename%.*} component/module"
    echo "   - BREAKING: API changes if public interface"
    echo "   - DEPRECATED: Related functionality"
}
```

## Hook Templates to Execute

### Always Execute
- `doc-updater-hook.md` - Update documentation indexes and references
- `security-scanner-hook.md` - Validate no security issues introduced by deletion

### Conditional Based on File Type
- **Source Files**: Dependency analysis, import validation
- **Test Files**: Test suite integrity validation
- **Component Files**: Story and documentation cleanup
- **API Files**: API documentation and contract updates

## Quality Gates

### Mandatory Validations
- **Import Integrity**: Ensure no broken imports remain
- **Test Suite**: Verify tests still pass
- **Configuration**: Check for orphaned references
- **Documentation**: Update indexes and cross-references

### Warning Conditions
```bash
# Warn about potential issues
check_warning_conditions() {
    local deleted_file="$1"
    
    # Large or complex file deletion
    if [ "$line_count" -gt 200 ]; then
        echo "⚠️  Large file deleted - review for missing functionality"
    fi
    
    # Core component deletion
    if [[ "$deleted_file" == src/core/* ]]; then
        echo "⚠️  Core component deleted - extensive testing recommended"
    fi
    
    # Public API deletion
    if [[ "$deleted_file" == *api*.py ]] || [[ "$deleted_file" == *routes*.js ]]; then
        echo "⚠️  API component deleted - breaking changes possible"
    fi
}
```

## Error Handling

### Cleanup Failures
```bash
# Handle failed cleanup operations
handle_cleanup_errors() {
    if [ $? -ne 0 ]; then
        echo "❌ Cleanup operation failed"
        echo "   - Some related files may still exist"
        echo "   - Manual cleanup may be required"
        echo "   - Check file permissions and dependencies"
    fi
}
```

### Recovery Actions
```bash
# Provide recovery guidance
provide_recovery_guidance() {
    echo "🔧 Recovery actions:"
    echo "   1. Review and fix broken imports"
    echo "   2. Update configuration files"
    echo "   3. Run full test suite: pytest / npm test"
    echo "   4. Update documentation indexes"
    echo "   5. Consider API versioning if breaking changes"
}
```

## Integration with Version Control

### Git Integration
```bash
# Check if file is tracked by git
if git ls-files --error-unmatch "$deleted_file" 2>/dev/null; then
    echo "📁 File was tracked by Git - commit deletion with descriptive message"
    echo "   Suggested: git add -A && git commit -m 'Remove $deleted_file and related files'"
fi
```

### Branch Analysis
```bash
# Check if deletion affects multiple branches
check_branch_impact() {
    echo "🌿 Checking branch impact..."
    
    # List branches that contain the file
    git branch --contains $(git log -n 1 --pretty=format:"%H" -- "$deleted_file") 2>/dev/null | \
        echo "   Branches affected by this deletion"
}
```

## AI Behavior Guidelines

### Deletion Safety
- Confirm related file cleanup is desired
- Warn about potential breaking changes
- Suggest testing before finalizing deletion
- Provide rollback guidance if needed

### Impact Assessment
- Analyze scope of deletion impact
- Identify affected components and dependencies
- Suggest migration or replacement strategies
- Document reasons for deletion

### Communication
- Clear feedback about cleanup actions taken
- Warnings about manual steps required
- Guidance for testing and validation
- Suggestions for documentation updates

---

**This hook ensures clean deletion of files with proper cleanup of dependencies, tests, and documentation while preventing broken references and maintaining project integrity.**