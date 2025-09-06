# Documentation Updater Hook Template

**Purpose**: Automatically maintain and synchronize documentation with code changes.

**Trigger**: File creation, modification, or deletion events that affect documentation requirements.

## Documentation Update Strategy

### Documentation Types and Triggers

#### API Documentation Updates
```bash
# Update API documentation when API files change
update_api_documentation() {
    local changed_file="$1"
    local change_type="$2"  # create, modify, delete
    
    echo "📚 Updating API documentation for: $changed_file"
    
    # Detect API file types
    if [[ "$changed_file" == *api*.py ]] || [[ "$changed_file" == *routes*.js ]] || [[ "$changed_file" == *endpoints*.go ]]; then
        echo "   🌐 API file detected - updating API documentation"
        
        case $change_type in
            "create")
                generate_api_documentation "$changed_file"
                update_api_index "$changed_file" "add"
                ;;
            "modify")
                regenerate_api_documentation "$changed_file"
                ;;
            "delete")
                remove_api_documentation "$changed_file"
                update_api_index "$changed_file" "remove"
                ;;
        esac
    fi
}

# Generate API documentation from source
generate_api_documentation() {
    local api_file="$1"
    local doc_file="docs/api/$(basename "${api_file%.*}").md"
    
    echo "   📝 Generating API documentation: $doc_file"
    
    # Create documentation directory if it doesn't exist
    mkdir -p "$(dirname "$doc_file")"
    
    # Python API documentation
    if [[ "$api_file" == *.py ]]; then
        generate_python_api_docs "$api_file" "$doc_file"
    fi
    
    # JavaScript API documentation
    if [[ "$api_file" == *.js ]] || [[ "$api_file" == *.ts ]]; then
        generate_javascript_api_docs "$api_file" "$doc_file"
    fi
    
    # Go API documentation
    if [[ "$api_file" == *.go ]]; then
        generate_go_api_docs "$api_file" "$doc_file"
    fi
}

# Python API documentation generation
generate_python_api_docs() {
    local api_file="$1"
    local doc_file="$2"
    
    python << EOF
import ast
import inspect
import importlib.util
import os
import sys

def extract_api_info(file_path):
    """Extract API information from Python file."""
    with open(file_path, 'r') as f:
        tree = ast.parse(f.read())
    
    api_info = {
        'endpoints': [],
        'classes': [],
        'functions': []
    }
    
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            # Check for Flask/FastAPI decorators
            decorators = [d.id for d in node.decorator_list if hasattr(d, 'id')]
            if any(dec in ['route', 'get', 'post', 'put', 'delete'] for dec in decorators):
                api_info['endpoints'].append({
                    'name': node.name,
                    'line': node.lineno,
                    'docstring': ast.get_docstring(node) or '',
                    'decorators': decorators
                })
            else:
                api_info['functions'].append({
                    'name': node.name,
                    'line': node.lineno,
                    'docstring': ast.get_docstring(node) or ''
                })
        elif isinstance(node, ast.ClassDef):
            api_info['classes'].append({
                'name': node.name,
                'line': node.lineno,
                'docstring': ast.get_docstring(node) or ''
            })
    
    return api_info

# Generate documentation
api_info = extract_api_info('$api_file')

doc_content = f"""# API Documentation: {os.path.basename('$api_file')}

Generated on: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Overview

This document describes the API endpoints and functionality in \`{os.path.basename('$api_file')}\`.

"""

# Add endpoints documentation
if api_info['endpoints']:
    doc_content += "## Endpoints\n\n"
    for endpoint in api_info['endpoints']:
        doc_content += f"### {endpoint['name']}\n\n"
        if endpoint['docstring']:
            doc_content += f"{endpoint['docstring']}\n\n"
        doc_content += f"**Location**: Line {endpoint['line']}\n"
        doc_content += f"**Decorators**: {', '.join(endpoint['decorators'])}\n\n"

# Add classes documentation
if api_info['classes']:
    doc_content += "## Classes\n\n"
    for cls in api_info['classes']:
        doc_content += f"### {cls['name']}\n\n"
        if cls['docstring']:
            doc_content += f"{cls['docstring']}\n\n"

# Add functions documentation
if api_info['functions']:
    doc_content += "## Functions\n\n"
    for func in api_info['functions']:
        doc_content += f"### {func['name']}\n\n"
        if func['docstring']:
            doc_content += f"{func['docstring']}\n\n"

# Write documentation file
with open('$doc_file', 'w') as f:
    f.write(doc_content)

print(f"   ✅ API documentation generated: $doc_file")
EOF
}
```

#### Code Documentation Updates
```bash
# Update code documentation and comments
update_code_documentation() {
    local source_file="$1"
    
    echo "📖 Updating code documentation for: $source_file"
    
    # Extract and update inline documentation
    extract_inline_docs() {
        local file="$1"
        local docs_dir="docs/code/$(dirname "${file#src/}")"
        local doc_file="$docs_dir/$(basename "${file%.*}").md"
        
        mkdir -p "$docs_dir"
        
        echo "   📋 Extracting inline documentation to: $doc_file"
        
        # Python docstring extraction
        if [[ "$file" == *.py ]]; then
            python << EOF
import ast
import os

def extract_docstrings(file_path):
    """Extract all docstrings from a Python file."""
    with open(file_path, 'r') as f:
        tree = ast.parse(f.read())
    
    docstrings = []
    
    # Module docstring
    module_doc = ast.get_docstring(tree)
    if module_doc:
        docstrings.append({
            'type': 'module',
            'name': os.path.basename(file_path),
            'docstring': module_doc,
            'line': 1
        })
    
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
            docstring = ast.get_docstring(node)
            if docstring:
                docstrings.append({
                    'type': 'class' if isinstance(node, ast.ClassDef) else 'function',
                    'name': node.name,
                    'docstring': docstring,
                    'line': node.lineno
                })
    
    return docstrings

# Generate documentation
docstrings = extract_docstrings('$file')

if docstrings:
    doc_content = f"""# Code Documentation: {os.path.basename('$file')}

Generated from inline documentation on: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

"""
    
    for doc in docstrings:
        doc_content += f"## {doc['type'].title()}: {doc['name']}\n\n"
        doc_content += f"**Line**: {doc['line']}\n\n"
        doc_content += f"{doc['docstring']}\n\n"
        doc_content += "---\n\n"
    
    with open('$doc_file', 'w') as f:
        f.write(doc_content)
    
    print(f"   ✅ Code documentation extracted: $doc_file")
else:
    print(f"   ⚠️  No docstrings found in $file")
EOF
        fi
        
        # JavaScript/TypeScript JSDoc extraction
        if [[ "$file" == *.js ]] || [[ "$file" == *.ts ]]; then
            extract_jsdoc_comments "$file" "$doc_file"
        fi
    }
    
    extract_inline_docs "$source_file"
}

# Extract JSDoc comments
extract_jsdoc_comments() {
    local js_file="$1"
    local doc_file="$2"
    
    echo "   📋 Extracting JSDoc comments from: $js_file"
    
    # Simple JSDoc extraction using grep and sed
    local jsdoc_blocks=$(grep -n "\/\*\*" "$js_file" | wc -l)
    
    if [ "$jsdoc_blocks" -gt 0 ]; then
        cat > "$doc_file" << EOF
# Code Documentation: $(basename "$js_file")

Generated from JSDoc comments on: $(date)

## Functions and Classes

EOF
        
        # Extract JSDoc blocks and associated function/class names
        awk '
        /\/\*\*/ { in_jsdoc = 1; jsdoc = ""; next }
        in_jsdoc && /\*\// { in_jsdoc = 0; next_is_func = 1; next }
        in_jsdoc { gsub(/^ *\* ?/, ""); jsdoc = jsdoc $0 "\n"; next }
        next_is_func && /^(function|class|const.*=|let.*=)/ {
            gsub(/^[ \t]+/, "");
            print "### " $0 "\n"
            print jsdoc "\n---\n"
            next_is_func = 0
        }
        ' "$js_file" >> "$doc_file"
        
        echo "   ✅ JSDoc documentation extracted: $doc_file"
    else
        echo "   ⚠️  No JSDoc comments found in $js_file"
    fi
}
```

#### README and Index Updates
```bash
# Update README and index files
update_readme_and_indexes() {
    local changed_file="$1"
    local change_type="$2"
    
    echo "📄 Updating README and index files..."
    
    # Update main README.md
    update_main_readme() {
        echo "   📝 Updating main README.md"
        
        # Update project structure section if it exists
        if grep -q "## Project Structure" README.md; then
            generate_project_structure_section
        fi
        
        # Update API section if API files changed
        if [[ "$changed_file" == *api* ]] && grep -q "## API" README.md; then
            update_api_section_in_readme
        fi
        
        # Update table of contents if it exists
        if grep -q "<!-- TOC -->" README.md; then
            regenerate_table_of_contents
        fi
    }
    
    # Generate project structure for README
    generate_project_structure_section() {
        echo "   🏗️  Updating project structure section"
        
        # Generate tree structure
        local structure=$(tree -I 'node_modules|__pycache__|*.pyc|.git|.DS_Store' -a || find . -type d -name .git -prune -o -type f -print | head -20)
        
        # Replace project structure section in README
        awk '
        BEGIN { in_structure = 0; print_structure = 0 }
        /^## Project Structure/ { in_structure = 1; print; next }
        in_structure && /^##/ && !/^## Project Structure/ { in_structure = 0 }
        in_structure && /^```/ && !print_structure { 
            print_structure = 1
            print
            system("tree -I '\''node_modules|__pycache__|*.pyc|.git|.DS_Store'\'' -a 2>/dev/null || echo '\''Tree command not available'\''")
            next
        }
        in_structure && /^```/ && print_structure { print_structure = 0; in_structure = 0 }
        !print_structure { print }
        ' README.md > README.md.tmp && mv README.md.tmp README.md
    }
    
    # Update documentation index
    update_documentation_index() {
        local docs_index="docs/README.md"
        
        echo "   📚 Updating documentation index: $docs_index"
        
        if [ ! -f "$docs_index" ]; then
            create_documentation_index "$docs_index"
        else
            regenerate_documentation_index "$docs_index"
        fi
    }
    
    # Create initial documentation index
    create_documentation_index() {
        local index_file="$1"
        
        mkdir -p "$(dirname "$index_file")"
        
        cat > "$index_file" << EOF
# Documentation Index

Generated on: $(date)

## Overview

This directory contains comprehensive documentation for the project.

## Documentation Structure

EOF
        
        # Add existing documentation structure
        find docs/ -name "*.md" -not -path "docs/README.md" | sort | while read -r doc_file; do
            local rel_path="${doc_file#docs/}"
            local title=$(head -1 "$doc_file" | sed 's/^# //' || basename "${doc_file%.*}")
            echo "- [$title]($rel_path)" >> "$index_file"
        done
        
        cat >> "$index_file" << EOF

## Quick Links

- [API Documentation](api/)
- [Code Documentation](code/)
- [User Guides](guides/)
- [Technical Specifications](specs/)

## Contributing

When adding new documentation:
1. Follow the existing structure
2. Include clear headings and examples
3. Update this index file
4. Add links in the main README if relevant

EOF
        
        echo "   ✅ Documentation index created: $index_file"
    }
    
    update_main_readme
    update_documentation_index
}
```

### Changelog and Version Updates

#### Automated Changelog Updates
```bash
# Update CHANGELOG.md based on changes
update_changelog() {
    local changed_files=("$@")
    
    echo "📝 Updating CHANGELOG.md..."
    
    # Analyze changes to determine changelog entry type
    analyze_change_type() {
        local files=("$@")
        local change_types=()
        
        for file in "${files[@]}"; do
            case "$file" in
                *api*|*routes*|*endpoints*)
                    change_types+=("API")
                    ;;
                *component*|*ui*)
                    change_types+=("UI")
                    ;;
                *test*)
                    change_types+=("Testing")
                    ;;
                *doc*|*.md)
                    change_types+=("Documentation")
                    ;;
                *config*|*.json|*.yaml)
                    change_types+=("Configuration")
                    ;;
                *)
                    change_types+=("Core")
                    ;;
            esac
        done
        
        echo "${change_types[@]}" | tr ' ' '\n' | sort | uniq
    }
    
    # Generate changelog entry
    generate_changelog_entry() {
        local change_types=($(analyze_change_type "${changed_files[@]}"))
        local timestamp=$(date +"%Y-%m-%d")
        
        echo "   📋 Generating changelog entry for: ${change_types[*]}"
        
        # Create temporary changelog entry
        cat > changelog-entry.tmp << EOF

### [$timestamp] - Automated Update

#### Changed
$(for file in "${changed_files[@]}"; do
    echo "- Updated $(basename "$file")"
done)

#### Documentation
- Auto-generated documentation updates
- Updated API documentation
- Refreshed code documentation

EOF
        
        # Insert entry into CHANGELOG.md
        if [ -f "CHANGELOG.md" ]; then
            # Insert after the "## [Unreleased]" section
            awk '
            /^## \[Unreleased\]/ { 
                print
                getline
                print
                while ((getline line < "changelog-entry.tmp") > 0) {
                    print line
                }
                close("changelog-entry.tmp")
            }
            { print }
            ' CHANGELOG.md > CHANGELOG.md.tmp && mv CHANGELOG.md.tmp CHANGELOG.md
            
            rm changelog-entry.tmp
            echo "   ✅ CHANGELOG.md updated"
        else
            echo "   ⚠️  CHANGELOG.md not found - consider creating one"
        fi
    }
    
    generate_changelog_entry
}
```

### Documentation Quality Assurance

#### Link Validation
```bash
# Validate and fix documentation links
validate_documentation_links() {
    echo "🔗 Validating documentation links..."
    
    # Find all markdown files
    local md_files=($(find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*"))
    local broken_links=()
    local fixed_links=()
    
    for md_file in "${md_files[@]}"; do
        echo "   🔍 Checking links in: $md_file"
        
        # Extract links using grep
        local links=$(grep -o '\[.*\]([^)]*)' "$md_file" | sed 's/.*(\([^)]*\)).*/\1/')
        
        while IFS= read -r link; do
            [ -z "$link" ] && continue
            
            # Skip external links (http/https)
            [[ "$link" =~ ^https?:// ]] && continue
            
            # Check if internal link exists
            if [[ "$link" =~ ^# ]]; then
                # Anchor link - check if header exists
                local anchor="${link#\#}"
                if ! grep -q "^#.*$anchor" "$md_file"; then
                    broken_links+=("$md_file: $link (missing anchor)")
                fi
            else
                # File link - check if file exists
                local linked_file
                if [[ "$link" =~ ^/ ]]; then
                    linked_file=".$link"
                else
                    linked_file="$(dirname "$md_file")/$link"
                fi
                
                if [ ! -f "$linked_file" ]; then
                    # Try to fix the link
                    local fixed_link=$(find_correct_link "$link")
                    if [ -n "$fixed_link" ]; then
                        fix_link_in_file "$md_file" "$link" "$fixed_link"
                        fixed_links+=("$md_file: $link → $fixed_link")
                    else
                        broken_links+=("$md_file: $link (file not found)")
                    fi
                fi
            fi
        done <<< "$links"
    done
    
    # Report results
    if [ ${#broken_links[@]} -gt 0 ]; then
        echo "   ❌ Broken links found:"
        printf '      %s\n' "${broken_links[@]}"
    fi
    
    if [ ${#fixed_links[@]} -gt 0 ]; then
        echo "   ✅ Fixed links:"
        printf '      %s\n' "${fixed_links[@]}"
    fi
    
    if [ ${#broken_links[@]} -eq 0 ] && [ ${#fixed_links[@]} -eq 0 ]; then
        echo "   ✅ All documentation links are valid"
    fi
}

# Find correct link for broken links
find_correct_link() {
    local broken_link="$1"
    local filename=$(basename "$broken_link")
    
    # Search for files with similar names
    local candidates=($(find . -name "*$filename*" -type f))
    
    if [ ${#candidates[@]} -eq 1 ]; then
        echo "${candidates[0]#./}"
    fi
    # If multiple candidates, return empty (manual review needed)
}

# Fix link in file
fix_link_in_file() {
    local file="$1"
    local old_link="$2"
    local new_link="$3"
    
    sed -i.bak "s|($old_link)|($new_link)|g" "$file"
    rm "$file.bak"
}
```

### Documentation Metrics and Reporting

#### Documentation Coverage Analysis
```bash
# Analyze documentation coverage
analyze_documentation_coverage() {
    echo "📊 Analyzing documentation coverage..."
    
    # Count source files vs documentation files
    local source_files=$(find src/ -type f \( -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.go" \) 2>/dev/null | wc -l)
    local doc_files=$(find docs/ -name "*.md" 2>/dev/null | wc -l)
    local api_files=$(find src/ -type f \( -name "*api*" -o -name "*routes*" -o -name "*endpoint*" \) 2>/dev/null | wc -l)
    local api_docs=$(find docs/api/ -name "*.md" 2>/dev/null | wc -l)
    
    # Calculate coverage percentages
    local doc_coverage=0
    local api_doc_coverage=0
    
    if [ "$source_files" -gt 0 ]; then
        doc_coverage=$((doc_files * 100 / source_files))
    fi
    
    if [ "$api_files" -gt 0 ]; then
        api_doc_coverage=$((api_docs * 100 / api_files))
    fi
    
    # Generate coverage report
    cat > docs/documentation-coverage-report.md << EOF
# Documentation Coverage Report

Generated on: $(date)

## Coverage Statistics

- **Source Files**: $source_files
- **Documentation Files**: $doc_files
- **Documentation Coverage**: $doc_coverage%

- **API Files**: $api_files  
- **API Documentation Files**: $api_docs
- **API Documentation Coverage**: $api_doc_coverage%

## Coverage Analysis

$(if [ "$doc_coverage" -lt 50 ]; then
    echo "⚠️  **Low documentation coverage** - Consider adding more documentation"
elif [ "$doc_coverage" -lt 80 ]; then
    echo "📈 **Moderate documentation coverage** - Good progress, room for improvement"
else
    echo "✅ **Good documentation coverage** - Well documented project"
fi)

$(if [ "$api_doc_coverage" -lt 80 ]; then
    echo "⚠️  **API documentation needs attention** - Ensure all APIs are documented"
else
    echo "✅ **Good API documentation coverage**"
fi)

## Recommendations

$(if [ "$doc_coverage" -lt 80 ]; then
    echo "- Add documentation for undocumented source files"
    echo "- Create user guides and tutorials"
    echo "- Document configuration and setup procedures"
fi)

$(if [ "$api_doc_coverage" -lt 100 ]; then
    echo "- Document all API endpoints"
    echo "- Add request/response examples"
    echo "- Include authentication and error handling docs"
fi)

## Files Needing Documentation

### Source Files Without Documentation
$(find src/ -type f \( -name "*.py" -o -name "*.js" -o -name "*.ts" \) | while read -r src_file; do
    local doc_file="docs/code/${src_file#src/}"
    doc_file="${doc_file%.*}.md"
    if [ ! -f "$doc_file" ]; then
        echo "- $src_file"
    fi
done)

### API Files Without Documentation  
$(find src/ -type f \( -name "*api*" -o -name "*routes*" \) | while read -r api_file; do
    local doc_file="docs/api/$(basename "${api_file%.*}").md"
    if [ ! -f "$doc_file" ]; then
        echo "- $api_file"
    fi
done)

EOF
    
    echo "   ✅ Documentation coverage report generated: docs/documentation-coverage-report.md"
    echo "   📊 Coverage: $doc_coverage% overall, $api_doc_coverage% API"
}
```

## Integration with Version Control

### Git Hook Integration
```bash
# Generate git commit information for documentation
generate_git_context() {
    local commit_hash=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    local branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    local author=$(git log -1 --pretty=format:"%an" 2>/dev/null || echo "unknown")
    local commit_msg=$(git log -1 --pretty=format:"%s" 2>/dev/null || echo "unknown")
    
    echo "📊 Git context for documentation:"
    echo "   Commit: $commit_hash"
    echo "   Branch: $branch"
    echo "   Author: $author"
    echo "   Message: $commit_msg"
    
    # Add git context to generated documentation
    cat > git-context.md << EOF
---
git_commit: $commit_hash
git_branch: $branch
git_author: $author
git_message: "$commit_msg"
generated_at: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
---
EOF
}
```

## AI Behavior Guidelines

### Documentation Maintenance Strategy
- Automatically update documentation when source code changes
- Maintain consistency between code and documentation
- Generate comprehensive API documentation from source
- Validate and fix broken documentation links

### Quality Standards
- Ensure documentation follows project conventions
- Generate meaningful and accurate documentation
- Maintain proper structure and organization
- Include examples and usage information where appropriate

### Integration Approach
- Seamlessly integrate with development workflow
- Respect existing documentation structure and style
- Provide clear feedback on documentation updates
- Support multiple documentation formats and tools

---

**This documentation updater hook template ensures that project documentation stays synchronized with code changes, maintains high quality standards, and provides comprehensive coverage of all project components.**