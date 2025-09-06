# On Save Hook

## Trigger
File save events for source code files

## Conditions
- if file_type == "python": Run Python-specific checks
- if file_type == "javascript": Run JS-specific checks
- if path_matches("src/**"): Run source code validation

## Actions
1. **Code Formatting**: Auto-format saved files
2. **Lint Check**: Run language-specific linting
3. **Test Generation**: Create/update test files if needed
4. **Documentation Update**: Update docs if API changes detected

## Error Handling
- Log formatting errors but don't block save
- Show lint warnings in editor
- Create TODO items for failed test generation
