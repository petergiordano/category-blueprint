# API Standards Steering Guide

**Purpose**: Define API design standards, security requirements, and integration patterns for consistent API development.

**Inclusion Mode**: `fileMatch` - Loaded when working with API-related files (*.api.*, *routes.*, *endpoints.*)

## API Design Principles

### RESTful Design Standards

#### Resource Naming
- **Collections**: Use plural nouns (`/api/v1/users`, `/api/v1/products`)
- **Specific Resources**: Use singular identifiers (`/api/v1/users/123`)
- **Nested Resources**: Show relationships (`/api/v1/users/123/orders`)
- **Actions**: Use HTTP verbs, not URL actions (POST `/api/v1/users` not `/api/v1/create-user`)

#### HTTP Methods Usage
```
GET    /api/v1/users          # List all users
GET    /api/v1/users/123      # Get specific user
POST   /api/v1/users          # Create new user
PUT    /api/v1/users/123      # Update entire user
PATCH  /api/v1/users/123      # Partial user update
DELETE /api/v1/users/123      # Delete user
```

#### Status Code Standards
```
# Success Codes
200 OK                   # Successful GET, PUT, PATCH
201 Created             # Successful POST
204 No Content          # Successful DELETE

# Client Error Codes
400 Bad Request         # Invalid request syntax
401 Unauthorized        # Authentication required
403 Forbidden          # Access denied
404 Not Found          # Resource not found
409 Conflict           # Resource conflict
422 Unprocessable Entity # Validation errors

# Server Error Codes
500 Internal Server Error # Unexpected server error
502 Bad Gateway         # Upstream service error
503 Service Unavailable # Temporary service issue
```

### API Versioning

#### Version Strategy
- **URL Versioning**: `/api/v1/`, `/api/v2/` (recommended)
- **Header Versioning**: `Accept: application/vnd.api+json;version=1`
- **Semantic Versioning**: Follow semver principles (major.minor.patch)

#### Version Management
```python
# Version routing example
from flask import Flask, Blueprint

app = Flask(__name__)

# Version 1 API
v1_api = Blueprint('v1', __name__, url_prefix='/api/v1')

@v1_api.route('/users', methods=['GET'])
def list_users_v1():
    # Version 1 implementation
    pass

# Version 2 API  
v2_api = Blueprint('v2', __name__, url_prefix='/api/v2')

@v2_api.route('/users', methods=['GET'])
def list_users_v2():
    # Version 2 implementation with new features
    pass

app.register_blueprint(v1_api)
app.register_blueprint(v2_api)
```

#### Deprecation Policy
- **Notice Period**: 6 months minimum before deprecation
- **Documentation**: Clear deprecation warnings in API docs
- **Headers**: Include deprecation headers in responses
```
Deprecation: true
Sunset: Wed, 11 Nov 2024 23:59:59 GMT
Link: </api/v2/users>; rel="successor-version"
```

## Request/Response Standards

### Request Format

#### Content Types
- **Primary**: `application/json` for data APIs
- **Forms**: `application/x-www-form-urlencoded` for simple forms
- **Files**: `multipart/form-data` for file uploads
- **Bulk**: `application/json` with arrays for batch operations

#### Request Structure
```json
{
  "data": {
    "type": "user",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "relationships": {
      "organization": {
        "data": { "type": "organization", "id": "123" }
      }
    }
  },
  "meta": {
    "client_version": "1.0.0",
    "request_id": "req-123"
  }
}
```

#### Query Parameters
```
# Filtering
GET /api/v1/users?filter[status]=active&filter[role]=admin

# Sorting
GET /api/v1/users?sort=name,-created_at

# Pagination
GET /api/v1/users?page[number]=2&page[size]=20

# Field Selection
GET /api/v1/users?fields[user]=name,email&fields[organization]=name

# Inclusion
GET /api/v1/users?include=organization,permissions
```

### Response Format

#### Success Response Structure
```json
{
  "data": {
    "type": "user",
    "id": "123",
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    },
    "relationships": {
      "organization": {
        "data": { "type": "organization", "id": "456" },
        "links": {
          "self": "/api/v1/users/123/relationships/organization",
          "related": "/api/v1/users/123/organization"
        }
      }
    },
    "links": {
      "self": "/api/v1/users/123"
    }
  },
  "included": [
    {
      "type": "organization",
      "id": "456",
      "attributes": {
        "name": "Example Corp"
      }
    }
  ],
  "meta": {
    "response_time": 0.045,
    "api_version": "1.0"
  }
}
```

#### Error Response Structure
```json
{
  "errors": [
    {
      "id": "error-123",
      "status": "422",
      "code": "VALIDATION_ERROR",
      "title": "Validation Failed",
      "detail": "Email address is already in use",
      "source": {
        "pointer": "/data/attributes/email"
      },
      "meta": {
        "timestamp": "2024-01-01T12:00:00Z",
        "request_id": "req-123"
      }
    }
  ]
}
```

#### Collection Response Structure
```json
{
  "data": [
    { /* user object */ },
    { /* user object */ }
  ],
  "meta": {
    "pagination": {
      "current_page": 2,
      "per_page": 20,
      "total_pages": 5,
      "total_count": 100
    }
  },
  "links": {
    "self": "/api/v1/users?page[number]=2",
    "first": "/api/v1/users?page[number]=1",
    "prev": "/api/v1/users?page[number]=1",
    "next": "/api/v1/users?page[number]=3",
    "last": "/api/v1/users?page[number]=5"
  }
}
```

## Authentication and Authorization

### Authentication Standards

#### API Key Authentication
```python
# API Key in header (recommended)
headers = {
    'Authorization': 'Bearer your-api-key-here',
    'Content-Type': 'application/json'
}

# API Key validation
def validate_api_key(api_key):
    # Validate API key format
    if not api_key or len(api_key) < 32:
        return False
    
    # Check against database/cache
    return is_valid_key(api_key)
```

#### JWT Token Authentication
```python
import jwt
from datetime import datetime, timedelta

def generate_jwt_token(user_id, role, expires_in=3600):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(seconds=expires_in),
        'iat': datetime.utcnow(),
        'iss': 'your-api-domain.com'
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def validate_jwt_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationError("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationError("Invalid token")
```

### Authorization Patterns

#### Role-Based Access Control (RBAC)
```python
from functools import wraps
from flask import request, jsonify

def require_role(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = extract_token_from_request(request)
            user_payload = validate_jwt_token(token)
            
            if user_payload['role'] != required_role:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/v1/admin/users', methods=['GET'])
@require_role('admin')
def list_all_users():
    # Admin-only endpoint
    pass
```

#### Resource-Level Permissions
```python
def require_resource_access(resource_type, permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = extract_token_from_request(request)
            user_payload = validate_jwt_token(token)
            resource_id = kwargs.get('id')
            
            if not user_has_permission(user_payload['user_id'], resource_type, resource_id, permission):
                return jsonify({'error': 'Access denied'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/v1/documents/<int:id>', methods=['PUT'])
@require_resource_access('document', 'write')
def update_document(id):
    # User must have write permission for this document
    pass
```

## Security Standards

### Input Validation

#### Request Validation
```python
from marshmallow import Schema, fields, validate, ValidationError

class UserCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    age = fields.Int(validate=validate.Range(min=18, max=120))
    role = fields.Str(validate=validate.OneOf(['user', 'admin', 'moderator']))

def validate_request(schema_class):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            schema = schema_class()
            try:
                validated_data = schema.load(request.json)
                request.validated_data = validated_data
                return f(*args, **kwargs)
            except ValidationError as err:
                return jsonify({'errors': err.messages}), 400
        return decorated_function
    return decorator

@app.route('/api/v1/users', methods=['POST'])
@validate_request(UserCreateSchema)
def create_user():
    data = request.validated_data
    # Process validated data
```

#### SQL Injection Prevention
```python
# Use parameterized queries
def get_user_by_email(email):
    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    return cursor.fetchone()

# Use ORM query builders
user = User.query.filter_by(email=email).first()

# Validate input types and formats
def validate_user_id(user_id):
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValidationError("Invalid user ID")
    return user_id
```

### Rate Limiting

#### Basic Rate Limiting
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per hour"]
)

@app.route('/api/v1/users', methods=['GET'])
@limiter.limit("100 per minute")
def list_users():
    # Rate-limited endpoint
    pass

@app.route('/api/v1/auth/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    # Strict rate limiting for authentication
    pass
```

#### Advanced Rate Limiting
```python
# User-based rate limiting
def get_user_id():
    token = extract_token_from_request(request)
    if token:
        payload = validate_jwt_token(token)
        return payload['user_id']
    return get_remote_address()

limiter = Limiter(
    app,
    key_func=get_user_id,
    default_limits=["1000 per hour"]
)

# Different limits for different user types
@app.route('/api/v1/data/export', methods=['POST'])
@limiter.limit("10 per hour", per_method=True, key_func=lambda: f"export:{get_user_id()}")
def export_data():
    # Limited data export
    pass
```

### CORS Configuration

#### CORS Setup
```python
from flask_cors import CORS

# Basic CORS configuration
CORS(app, origins=['https://yourdomain.com', 'https://app.yourdomain.com'])

# Advanced CORS configuration
CORS(app, 
     origins=['https://yourdomain.com'],
     methods=['GET', 'POST', 'PUT', 'DELETE'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True,
     max_age=86400)  # 24 hours
```

## Error Handling

### Error Classification
```python
class APIError(Exception):
    """Base API error class."""
    status_code = 500
    error_code = 'INTERNAL_ERROR'
    message = 'An internal error occurred'

class ValidationError(APIError):
    status_code = 422
    error_code = 'VALIDATION_ERROR'
    message = 'Request validation failed'

class AuthenticationError(APIError):
    status_code = 401
    error_code = 'AUTHENTICATION_ERROR'
    message = 'Authentication required'

class AuthorizationError(APIError):
    status_code = 403
    error_code = 'AUTHORIZATION_ERROR'
    message = 'Access denied'

class NotFoundError(APIError):
    status_code = 404
    error_code = 'NOT_FOUND'
    message = 'Resource not found'
```

### Global Error Handler
```python
@app.errorhandler(APIError)
def handle_api_error(error):
    response = {
        'errors': [{
            'status': str(error.status_code),
            'code': error.error_code,
            'title': error.__class__.__name__,
            'detail': str(error),
            'meta': {
                'timestamp': datetime.utcnow().isoformat(),
                'request_id': get_request_id()
            }
        }]
    }
    return jsonify(response), error.status_code

@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({
        'errors': [{
            'status': '404',
            'code': 'NOT_FOUND',
            'title': 'Not Found',
            'detail': 'The requested endpoint does not exist'
        }]
    }), 404
```

## Performance Standards

### Response Time Requirements
- **Simple Queries**: < 100ms (GET single resource)
- **Complex Queries**: < 500ms (GET with joins/filtering)
- **Data Creation**: < 200ms (POST operations)
- **Data Updates**: < 300ms (PUT/PATCH operations)
- **Bulk Operations**: < 2 seconds (batch processing)

### Optimization Strategies

#### Database Query Optimization
```python
# Use database indexes for frequent queries
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, index=True)  # Indexed
    status = db.Column(db.String(50), index=True)  # Indexed for filtering
    created_at = db.Column(db.DateTime, index=True)  # Indexed for sorting

# Use pagination for large datasets
def get_users_paginated(page=1, per_page=20):
    return User.query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )

# Use database-level filtering
def get_active_users():
    return User.query.filter_by(status='active').all()
```

#### Caching Strategies
```python
import redis
import json
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_response(timeout=300):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key = f"{f.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            
            # Execute function and cache result
            result = f(*args, **kwargs)
            redis_client.setex(cache_key, timeout, json.dumps(result))
            return result
        return decorated_function
    return decorator

@app.route('/api/v1/popular-users', methods=['GET'])
@cache_response(timeout=600)  # Cache for 10 minutes
def get_popular_users():
    # Expensive query that can be cached
    pass
```

## Documentation Standards

### OpenAPI/Swagger Specification
```yaml
openapi: 3.0.0
info:
  title: Project API
  version: 1.0.0
  description: API documentation for project components
  
paths:
  /api/v1/users:
    get:
      summary: List users
      description: Retrieve a paginated list of users
      parameters:
        - name: page
          in: query
          description: Page number
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: per_page
          in: query
          description: Items per page
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        200:
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
        400:
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: integer
          example: 123
        email:
          type: string
          format: email
          example: user@example.com
        name:
          type: string
          example: John Doe
        created_at:
          type: string
          format: date-time
          example: 2024-01-01T12:00:00Z
```

### API Documentation Guidelines
- **Clear Descriptions**: Explain what each endpoint does
- **Examples**: Provide request/response examples
- **Error Scenarios**: Document all possible error responses
- **Authentication**: Clearly explain authentication requirements
- **Rate Limits**: Document rate limiting policies
- **Deprecation**: Mark deprecated endpoints clearly

## Testing Standards

### API Testing Structure
```python
import unittest
import json
from app import create_app, db

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(testing=True)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_create_user_success(self):
        data = {
            'name': 'Test User',
            'email': 'test@example.com'
        }
        response = self.client.post('/api/v1/users',
                                  data=json.dumps(data),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.data)
        self.assertEqual(response_data['data']['attributes']['email'], 'test@example.com')
    
    def test_create_user_validation_error(self):
        data = {
            'name': '',  # Invalid empty name
            'email': 'invalid-email'  # Invalid email format
        }
        response = self.client.post('/api/v1/users',
                                  data=json.dumps(data),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 422)
        response_data = json.loads(response.data)
        self.assertIn('errors', response_data)
```

## AI Behavior Guidelines

### API Development Guidance
- **Follow Standards**: Always implement APIs according to these standards
- **Security First**: Include authentication, validation, and rate limiting
- **Error Handling**: Implement comprehensive error handling with proper status codes
- **Documentation**: Generate OpenAPI specs with all endpoint implementations

### Code Generation Patterns
- **Consistent Structure**: Use established patterns for route handlers
- **Validation Integration**: Include request validation in all endpoints
- **Response Formatting**: Format all responses according to standards
- **Testing Coverage**: Generate tests for all API endpoints

### Performance Considerations
- **Query Optimization**: Suggest database optimizations for API endpoints
- **Caching Opportunities**: Identify endpoints suitable for caching
- **Rate Limiting**: Apply appropriate rate limits based on endpoint sensitivity
- **Monitoring**: Include performance monitoring in API implementations

---

**These API standards ensure consistent, secure, and performant API development throughout the project lifecycle.**