# Production Readiness Checker

Comprehensive validation of production deployment readiness across all critical dimensions.

## Usage
`@production-readiness [environment] [options]`

## Validation Categories
- **Infrastructure**: Containerization, scaling, load balancing
- **Security**: Headers, authentication, secret management
- **Performance**: Optimization, caching, monitoring
- **Quality**: Test coverage, documentation, compliance

## Examples
```
@production-readiness staging --fix-issues
@production-readiness production --report-only
@production-readiness development --quick-check
```
