# Pre-Commit Hook

## Trigger
Before git commit is executed

## Conditions
- when staged_files contain source code
- unless commit_message contains "[skip-hooks]"

## Actions
1. **Run Tests**: Execute test suite for changed components
2. **Quality Check**: Run linting and formatting checks
3. **Security Scan**: Check for potential security issues
4. **Documentation Check**: Ensure docs are up to date

## Error Handling
- Block commit if critical tests fail
- Show detailed error messages
- Allow override with --no-verify flag
