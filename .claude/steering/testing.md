# Testing Steering Guide

**Purpose**: Define testing strategies, standards, and practices to ensure comprehensive quality assurance throughout development.

**Inclusion Mode**: `fileMatch` - Loaded when working with test files or implementing testable code.

## Testing Philosophy

### Quality First Approach
- **Test-Driven Development**: Tests guide implementation design
- **Comprehensive Coverage**: All code paths and edge cases tested
- **Automated Quality Gates**: Testing integrated into development workflow
- **Reference Test Validation**: All components tested against reference cases

### Testing Pyramid Strategy
```
                    /\
                   /  \
                  /E2E \     <- End-to-end tests (few, high-value)
                 /______\
                /        \
               /Integration\ <- Integration tests (some, critical paths)
              /__________\
             /            \
            /    Unit      \ <- Unit tests (many, fast feedback)
           /________________\
```

## Testing Standards

### Test Coverage Requirements

#### Minimum Coverage Thresholds
- **Unit Tests**: >80% code coverage for all components
- **Integration Tests**: 100% of component interfaces tested
- **End-to-End Tests**: All user journeys and reference cases tested
- **Performance Tests**: All performance-critical components tested

#### Coverage Measurement
```python
# Python coverage configuration (.coveragerc)
[run]
source = src/
omit = 
    */tests/*
    */test_*
    */conftest.py
    */setup.py

[report]
precision = 2
show_missing = True
skip_covered = False

[html]
directory = htmlcov/

# Coverage enforcement
fail_under = 80
```

```javascript
// JavaScript coverage configuration (jest.config.js)
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/tests/**',
    '!src/**/*.test.{js,jsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Test Organization

#### Test Directory Structure
```
tests/
├── unit/                      # Fast, isolated unit tests
│   ├── components/           # Component-specific unit tests
│   ├── shared/               # Shared utility tests
│   └── infrastructure/       # Infrastructure unit tests
├── integration/              # Component interaction tests
│   ├── component_flows/      # Multi-component workflows
│   ├── external_services/    # External service integration
│   └── database/             # Database integration tests
├── system/                   # End-to-end system tests
│   ├── user_journeys/        # Complete user scenarios
│   ├── performance/          # Performance and load tests
│   └── security/             # Security testing
├── reference/                # Reference test cases
│   ├── input/               # Reference input data
│   ├── expected/            # Expected output data
│   └── validation/          # Reference test validation
├── fixtures/                 # Test data and utilities
│   ├── data/                # Static test data
│   ├── factories/           # Test data generators
│   └── mocks/               # Mock objects and services
└── conftest.py              # Test configuration (Python)
```

#### Test File Naming Conventions
```python
# Python test naming
test_[module_name].py              # Unit tests
test_[module_name]_integration.py  # Integration tests
test_[feature_name]_system.py      # System tests

# Test function naming
def test_should_[expected_behavior]_when_[condition]():
    """Test that describes expected behavior clearly."""
    pass

def test_should_raise_error_when_invalid_input():
    """Test error handling with invalid input."""
    pass
```

```javascript
// JavaScript test naming
[module].test.js               // Unit tests
[module].integration.test.js   // Integration tests
[feature].system.test.js       // System tests

// Test function naming
describe('ComponentName', () => {
  describe('when valid input provided', () => {
    it('should process data successfully', () => {
      // Test implementation
    });
  });
  
  describe('when invalid input provided', () => {
    it('should throw validation error', () => {
      // Test implementation
    });
  });
});
```

## Unit Testing Standards

### Test Structure and Patterns

#### AAA Pattern (Arrange, Act, Assert)
```python
def test_should_calculate_total_when_valid_items():
    # Arrange - Set up test data and conditions
    calculator = PriceCalculator()
    items = [
        {'price': 10.00, 'quantity': 2},
        {'price': 5.50, 'quantity': 1}
    ]
    expected_total = 25.50
    
    # Act - Execute the functionality being tested
    actual_total = calculator.calculate_total(items)
    
    # Assert - Verify the expected outcome
    assert actual_total == expected_total
```

#### Test Data Factories
```python
# Factory pattern for test data generation
import factory
from datetime import datetime

class UserFactory(factory.Factory):
    class Meta:
        model = User
    
    id = factory.Sequence(lambda n: n)
    name = factory.Faker('name')
    email = factory.Faker('email')
    created_at = factory.LazyFunction(datetime.now)
    is_active = True

# Usage in tests
def test_should_create_user_when_valid_data():
    # Arrange
    user_data = UserFactory.build()
    service = UserService()
    
    # Act
    created_user = service.create_user(user_data)
    
    # Assert
    assert created_user.email == user_data.email
    assert created_user.is_active is True
```

#### Parameterized Tests
```python
import pytest

@pytest.mark.parametrize("input_value,expected_output", [
    (0, "zero"),
    (1, "one"),
    (5, "five"),
    (10, "ten"),
])
def test_number_to_word_conversion(input_value, expected_output):
    converter = NumberToWordConverter()
    result = converter.convert(input_value)
    assert result == expected_output

@pytest.mark.parametrize("invalid_input", [
    -1,
    11,
    None,
    "string",
])
def test_should_raise_error_for_invalid_input(invalid_input):
    converter = NumberToWordConverter()
    with pytest.raises(ValueError):
        converter.convert(invalid_input)
```

### Mocking and Test Doubles

#### External Service Mocking
```python
from unittest.mock import Mock, patch
import pytest

@patch('src.external_service.ApiClient')
def test_should_process_data_when_api_responds(mock_api_client):
    # Arrange
    mock_instance = Mock()
    mock_instance.fetch_data.return_value = {'status': 'success', 'data': [1, 2, 3]}
    mock_api_client.return_value = mock_instance
    
    processor = DataProcessor()
    
    # Act
    result = processor.process_external_data('test-id')
    
    # Assert
    assert result['status'] == 'processed'
    mock_instance.fetch_data.assert_called_once_with('test-id')

@patch('src.external_service.ApiClient')
def test_should_handle_api_failure_gracefully(mock_api_client):
    # Arrange
    mock_instance = Mock()
    mock_instance.fetch_data.side_effect = ConnectionError("API unavailable")
    mock_api_client.return_value = mock_instance
    
    processor = DataProcessor()
    
    # Act & Assert
    with pytest.raises(ProcessingError) as exc_info:
        processor.process_external_data('test-id')
    
    assert "External service unavailable" in str(exc_info.value)
```

#### Database Mocking
```python
@pytest.fixture
def mock_database():
    """Mock database for testing."""
    return Mock()

def test_should_save_user_when_valid_data(mock_database):
    # Arrange
    user_service = UserService(database=mock_database)
    user_data = {'name': 'Test User', 'email': 'test@example.com'}
    mock_database.save.return_value = {'id': 123, **user_data}
    
    # Act
    saved_user = user_service.create_user(user_data)
    
    # Assert
    assert saved_user['id'] == 123
    mock_database.save.assert_called_once()
```

## Integration Testing Standards

### Component Integration Testing

#### Interface Contract Testing
```python
class ComponentInterfaceTest:
    """Base class for testing component interfaces."""
    
    def setUp(self):
        self.component = self.create_component()
    
    def create_component(self):
        """Override in subclasses to create specific component."""
        raise NotImplementedError
    
    def test_component_implements_required_interface(self):
        """Verify component implements required interface methods."""
        required_methods = ['process', 'validate_input', 'validate_output', 'health_check']
        for method in required_methods:
            assert hasattr(self.component, method), f"Component missing {method} method"
            assert callable(getattr(self.component, method)), f"{method} is not callable"
    
    def test_process_method_signature(self):
        """Verify process method has correct signature."""
        import inspect
        sig = inspect.signature(self.component.process)
        params = list(sig.parameters.keys())
        assert 'input_data' in params, "process method must accept input_data parameter"
        assert 'config' in params, "process method must accept config parameter"
    
    def test_health_check_returns_status(self):
        """Verify health check returns proper status format."""
        health_status = self.component.health_check()
        assert isinstance(health_status, dict), "Health check must return dictionary"
        assert 'status' in health_status, "Health check must include status field"
        assert health_status['status'] in ['healthy', 'degraded', 'unhealthy']
```

#### Pipeline Integration Testing
```python
def test_component_pipeline_integration():
    """Test that components work together in pipeline."""
    # Arrange
    component1 = Component1()
    component2 = Component2()
    component3 = Component3()
    
    pipeline = Pipeline([component1, component2, component3])
    test_input = load_test_data('integration_test_input.json')
    
    # Act
    result = pipeline.execute(test_input)
    
    # Assert
    assert result['status'] == 'success'
    assert 'output' in result
    assert result['metrics']['components_executed'] == 3
    assert result['metrics']['total_processing_time'] < 30.0  # Performance requirement

def test_component_error_propagation():
    """Test error handling across component boundaries."""
    # Arrange
    failing_component = Mock()
    failing_component.process.side_effect = ProcessingError("Component failure")
    
    component1 = Component1()
    pipeline = Pipeline([component1, failing_component])
    
    # Act & Assert
    with pytest.raises(PipelineError) as exc_info:
        pipeline.execute({'test': 'data'})
    
    assert "Component failure" in str(exc_info.value)
    assert exc_info.value.failed_component == 'failing_component'
```

### External Service Integration

#### Database Integration Testing
```python
@pytest.fixture(scope="function")
def test_database():
    """Create clean test database for each test."""
    # Set up test database
    db_url = "sqlite:///:memory:"  # In-memory database for tests
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    yield session
    
    # Cleanup
    session.close()
    Base.metadata.drop_all(engine)

def test_user_repository_crud_operations(test_database):
    """Test complete CRUD operations for user repository."""
    repository = UserRepository(test_database)
    
    # Create
    user_data = {'name': 'Test User', 'email': 'test@example.com'}
    created_user = repository.create(user_data)
    assert created_user.id is not None
    
    # Read
    retrieved_user = repository.get_by_id(created_user.id)
    assert retrieved_user.email == user_data['email']
    
    # Update
    updated_data = {'name': 'Updated User'}
    updated_user = repository.update(created_user.id, updated_data)
    assert updated_user.name == 'Updated User'
    
    # Delete
    repository.delete(created_user.id)
    deleted_user = repository.get_by_id(created_user.id)
    assert deleted_user is None
```

## System/End-to-End Testing

### Reference Test Case Validation

#### Reference Test Framework
```python
class ReferenceTestCase:
    """Framework for validating components against reference test cases."""
    
    def __init__(self, test_case_name):
        self.test_case_name = test_case_name
        self.input_data = self.load_reference_input()
        self.expected_output = self.load_expected_output()
        self.performance_benchmarks = self.load_performance_benchmarks()
    
    def load_reference_input(self):
        """Load reference input data from file."""
        input_path = f"tests/reference/input/{self.test_case_name}_input.json"
        with open(input_path, 'r') as f:
            return json.load(f)
    
    def load_expected_output(self):
        """Load expected output data from file."""
        output_path = f"tests/reference/expected/{self.test_case_name}_output.json"
        with open(output_path, 'r') as f:
            return json.load(f)
    
    def load_performance_benchmarks(self):
        """Load performance benchmarks for test case."""
        bench_path = f"tests/reference/benchmarks/{self.test_case_name}_benchmarks.json"
        try:
            with open(bench_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def validate_component(self, component):
        """Validate component against reference test case."""
        start_time = time.time()
        
        # Execute component
        result = component.process(self.input_data)
        
        processing_time = time.time() - start_time
        
        # Validate output
        self.assert_output_matches(result, self.expected_output)
        
        # Validate performance
        if 'max_processing_time' in self.performance_benchmarks:
            assert processing_time <= self.performance_benchmarks['max_processing_time']
        
        return {
            'passed': True,
            'processing_time': processing_time,
            'output_validation': 'passed'
        }
    
    def assert_output_matches(self, actual, expected):
        """Assert that actual output matches expected output."""
        # Custom comparison logic for your domain
        if isinstance(expected, dict):
            for key, value in expected.items():
                assert key in actual, f"Missing key: {key}"
                if isinstance(value, (int, float)):
                    # Allow small floating point differences
                    assert abs(actual[key] - value) < 0.001
                else:
                    assert actual[key] == value
        else:
            assert actual == expected

# Usage in tests
def test_component1_reference_case():
    """Test Component 1 with primary reference case."""
    reference_test = ReferenceTestCase('primary_reference')
    component = Component1()
    
    result = reference_test.validate_component(component)
    assert result['passed']
    assert result['processing_time'] < 5.0  # Max 5 seconds
```

### Performance Testing

#### Load Testing Framework
```python
import concurrent.futures
import time
from statistics import mean, median

class PerformanceTestRunner:
    """Framework for running performance tests."""
    
    def __init__(self, component_or_system):
        self.target = component_or_system
        self.results = []
    
    def run_load_test(self, test_data, concurrent_users=10, duration_seconds=60):
        """Run load test with specified parameters."""
        start_time = time.time()
        end_time = start_time + duration_seconds
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = []
            
            while time.time() < end_time:
                future = executor.submit(self._execute_single_request, test_data)
                futures.append(future)
                time.sleep(0.1)  # 10 requests per second per user
            
            # Wait for all requests to complete
            for future in concurrent.futures.as_completed(futures, timeout=30):
                try:
                    result = future.result()
                    self.results.append(result)
                except Exception as e:
                    self.results.append({'error': str(e), 'processing_time': None})
    
    def _execute_single_request(self, test_data):
        """Execute single request and measure performance."""
        start_time = time.time()
        try:
            result = self.target.process(test_data)
            processing_time = time.time() - start_time
            return {
                'success': True,
                'processing_time': processing_time,
                'result_size': len(str(result))
            }
        except Exception as e:
            processing_time = time.time() - start_time
            return {
                'success': False,
                'error': str(e),
                'processing_time': processing_time
            }
    
    def get_performance_report(self):
        """Generate performance report from test results."""
        successful_results = [r for r in self.results if r.get('success', False)]
        failed_results = [r for r in self.results if not r.get('success', True)]
        
        if successful_results:
            processing_times = [r['processing_time'] for r in successful_results]
            return {
                'total_requests': len(self.results),
                'successful_requests': len(successful_results),
                'failed_requests': len(failed_results),
                'success_rate': len(successful_results) / len(self.results) * 100,
                'avg_processing_time': mean(processing_times),
                'median_processing_time': median(processing_times),
                'min_processing_time': min(processing_times),
                'max_processing_time': max(processing_times),
                'throughput_per_second': len(successful_results) / (max(processing_times) * len(successful_results))
            }
        else:
            return {
                'total_requests': len(self.results),
                'successful_requests': 0,
                'failed_requests': len(failed_results),
                'success_rate': 0,
                'errors': [r['error'] for r in failed_results]
            }

# Usage
def test_component_performance_under_load():
    """Test component performance under concurrent load."""
    component = Component1()
    performance_runner = PerformanceTestRunner(component)
    test_data = load_performance_test_data()
    
    # Run load test
    performance_runner.run_load_test(
        test_data, 
        concurrent_users=5, 
        duration_seconds=30
    )
    
    # Analyze results
    report = performance_runner.get_performance_report()
    
    # Assert performance requirements
    assert report['success_rate'] >= 95.0  # 95% success rate
    assert report['avg_processing_time'] <= 1.0  # Average under 1 second
    assert report['max_processing_time'] <= 5.0  # No request over 5 seconds
```

## Test Automation and CI/CD Integration

### Automated Test Execution

#### Pre-commit Testing
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit tests..."

# Run unit tests
python -m pytest tests/unit/ -v --tb=short
if [ $? -ne 0 ]; then
    echo "Unit tests failed. Commit aborted."
    exit 1
fi

# Run linting
flake8 src/ tests/
if [ $? -ne 0 ]; then
    echo "Code style checks failed. Commit aborted."
    exit 1
fi

# Run type checking
mypy src/
if [ $? -ne 0 ]; then
    echo "Type checking failed. Commit aborted."
    exit 1
fi

echo "All pre-commit checks passed."
```

#### CI/CD Pipeline Testing
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.8, 3.9, '3.10']
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v2
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
    
    - name: Run unit tests
      run: |
        pytest tests/unit/ --cov=src --cov-report=xml
    
    - name: Run integration tests
      run: |
        pytest tests/integration/ -v
    
    - name: Run system tests
      run: |
        pytest tests/system/ -v --timeout=300
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v1
      with:
        file: ./coverage.xml
```

### Test Reporting and Metrics

#### Test Result Reporting
```python
# Custom test reporter
import pytest
import json
from datetime import datetime

class CustomTestReporter:
    def __init__(self):
        self.test_results = []
        self.start_time = None
        self.end_time = None
    
    @pytest.hookimpl(hookwrapper=True)
    def pytest_runtest_protocol(self, item, nextitem):
        """Hook to capture test execution."""
        start = datetime.now()
        outcome = yield
        end = datetime.now()
        
        result = {
            'test_name': item.name,
            'test_file': str(item.fspath),
            'duration': (end - start).total_seconds(),
            'outcome': 'passed' if outcome.get_result() else 'failed',
            'timestamp': start.isoformat()
        }
        
        self.test_results.append(result)
    
    def pytest_sessionstart(self, session):
        """Mark session start time."""
        self.start_time = datetime.now()
    
    def pytest_sessionfinish(self, session, exitstatus):
        """Generate final test report."""
        self.end_time = datetime.now()
        
        report = {
            'session_start': self.start_time.isoformat(),
            'session_end': self.end_time.isoformat(),
            'total_duration': (self.end_time - self.start_time).total_seconds(),
            'exit_status': exitstatus,
            'test_results': self.test_results,
            'summary': {
                'total_tests': len(self.test_results),
                'passed': len([r for r in self.test_results if r['outcome'] == 'passed']),
                'failed': len([r for r in self.test_results if r['outcome'] == 'failed'])
            }
        }
        
        with open('test_report.json', 'w') as f:
            json.dump(report, f, indent=2)
```

## AI Behavior Guidelines

### Test Generation Standards
- **Comprehensive Coverage**: Generate tests for all code paths and edge cases
- **Clear Test Names**: Use descriptive test function names that explain behavior
- **AAA Pattern**: Structure tests with clear Arrange, Act, Assert sections
- **Mock External Dependencies**: Isolate units under test from external services

### Quality Assurance Integration
- **Test-First Development**: Generate tests before or alongside implementation
- **Reference Test Validation**: Ensure all components pass reference test cases
- **Performance Testing**: Include performance tests for critical components
- **Security Testing**: Add security-focused tests for sensitive operations

### Continuous Improvement
- **Test Maintenance**: Keep tests updated with code changes
- **Test Optimization**: Improve test performance and reliability
- **Coverage Analysis**: Monitor and improve test coverage metrics
- **Quality Metrics**: Track test quality and effectiveness over time

---

**This testing steering guide ensures comprehensive quality assurance through systematic testing practices, automated validation, and continuous quality monitoring.**