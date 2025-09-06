# Test Generator Hook Template

## Purpose
Automatically generate test files for new source code

## Placeholders
- {{FILE_PATH}}: Path to the source file
- {{CLASS_NAME}}: Name of the class being tested
- {{FUNCTION_NAMES}}: List of functions to test

## Usage Example
When a new Python file is created at `src/utils/parser.py`:
1. Generate `tests/unit/test_parser.py`
2. Create test stubs for all public functions
3. Add basic test structure and imports

## Test Template Structure
- Import statements
- Test class definition
- Test method stubs
- Fixture definitions if needed
