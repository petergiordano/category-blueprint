#!/usr/bin/env python3
"""
Production Readiness Validation Script
Comprehensive validation of production deployment readiness
"""

import os
import json
import yaml
import re
import sys
import subprocess
import requests
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
from enum import Enum
import socket
from urllib.parse import urlparse

class ValidationLevel(Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"

@dataclass
class ValidationResult:
    level: ValidationLevel
    message: str
    category: str = ""
    details: str = ""
    suggestion: str = ""

class ProductionReadinessValidator:
    """Validates comprehensive production deployment readiness"""
    
    def __init__(self, project_root: str, environment: str = "production"):
        self.project_root = Path(project_root)
        self.environment = environment
        self.results: List[ValidationResult] = []
        self.config = self._load_production_config()
        
    def _load_production_config(self) -> Dict:
        """Load production readiness configuration"""
        config_path = self.project_root / ".claude" / "production-config.json"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return self._default_config()
    
    def _default_config(self) -> Dict:
        """Default production readiness configuration"""
        return {
            "infrastructure": {
                "required_checks": ["load_balancer", "auto_scaling", "ssl_certificates", "backup_system"],
                "health_check_timeout": 30,
                "ssl_cert_min_days": 30
            },
            "security": {
                "required_headers": ["X-Content-Type-Options", "X-Frame-Options", "X-XSS-Protection"],
                "max_vulnerability_score": 7.0,
                "require_https": True,
                "min_password_strength": 8
            },
            "performance": {
                "max_response_time_ms": 2000,
                "min_lighthouse_score": 80,
                "max_bundle_size_mb": 5,
                "min_cache_hit_ratio": 0.8
            },
            "monitoring": {
                "required_metrics": ["response_time", "error_rate", "throughput", "availability"],
                "log_retention_days": 90,
                "alert_channels": ["email", "slack"]
            },
            "quality_gates": {
                "min_test_coverage": 80,
                "max_critical_issues": 0,
                "max_high_issues": 3,
                "require_documentation": True
            }
        }
    
    def validate_all(self) -> List[ValidationResult]:
        """Run all production readiness validations"""
        self.results = []
        
        print(f"🔍 Running production readiness validation for {self.environment} environment...")
        
        # Core validation categories
        self._validate_infrastructure()
        self._validate_security()
        self._validate_performance()
        self._validate_monitoring()
        self._validate_data_and_backup()
        self._validate_documentation()
        self._validate_deployment_process()
        
        return self.results
    
    def _validate_infrastructure(self):
        """Validate infrastructure readiness"""
        print("🏗️  Validating infrastructure...")
        
        # Check containerization
        self._check_docker_configuration()
        self._check_kubernetes_configuration()
        
        # Check cloud infrastructure
        self._check_load_balancer_config()
        self._check_auto_scaling_config()
        self._check_ssl_certificates()
        
        # Check database setup
        self._check_database_configuration()
        self._check_backup_system()
    
    def _check_docker_configuration(self):
        """Check Docker configuration for production"""
        dockerfile_path = self.project_root / "Dockerfile"
        
        if not dockerfile_path.exists():
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message="Dockerfile not found",
                category="infrastructure",
                suggestion="Create Dockerfile for containerized deployment"
            ))
            return
        
        dockerfile_content = dockerfile_path.read_text()
        
        # Check for production best practices
        if "USER root" in dockerfile_content and "USER " not in dockerfile_content.split("USER root")[-1]:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="Dockerfile runs as root user",
                category="infrastructure",
                suggestion="Add non-root user for security"
            ))
        
        if "EXPOSE" not in dockerfile_content:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No exposed ports defined in Dockerfile",
                category="infrastructure",
                suggestion="Add EXPOSE directive for application port"
            ))
        
        # Check for multi-stage build
        if "FROM" in dockerfile_content and dockerfile_content.count("FROM") == 1:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="Consider using multi-stage Docker build for smaller images",
                category="infrastructure",
                suggestion="Use multi-stage build to reduce image size"
            ))
    
    def _check_kubernetes_configuration(self):
        """Check Kubernetes configuration files"""
        k8s_dirs = [
            self.project_root / "k8s",
            self.project_root / "kubernetes", 
            self.project_root / "deployment"
        ]
        
        k8s_files = []
        for k8s_dir in k8s_dirs:
            if k8s_dir.exists():
                k8s_files.extend(list(k8s_dir.glob("*.yaml")) + list(k8s_dir.glob("*.yml")))
        
        if not k8s_files:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No Kubernetes configuration files found",
                category="infrastructure",
                suggestion="Add Kubernetes manifests for container orchestration"
            ))
            return
        
        for k8s_file in k8s_files:
            self._validate_kubernetes_manifest(k8s_file)
    
    def _validate_kubernetes_manifest(self, manifest_path: Path):
        """Validate individual Kubernetes manifest"""
        try:
            with open(manifest_path, 'r') as f:
                manifest = yaml.safe_load(f)
            
            if not manifest:
                return
            
            kind = manifest.get("kind", "")
            
            if kind == "Deployment":
                self._validate_deployment_manifest(manifest, manifest_path)
            elif kind == "Service":
                self._validate_service_manifest(manifest, manifest_path)
                
        except yaml.YAMLError as e:
            self.results.append(ValidationResult(
                level=ValidationLevel.ERROR,
                message=f"Invalid YAML in {manifest_path.name}: {e}",
                category="infrastructure",
                suggestion="Fix YAML syntax errors"
            ))
    
    def _validate_deployment_manifest(self, manifest: Dict, file_path: Path):
        """Validate Kubernetes Deployment manifest"""
        spec = manifest.get("spec", {})
        template_spec = spec.get("template", {}).get("spec", {})
        
        # Check resource limits
        containers = template_spec.get("containers", [])
        for container in containers:
            resources = container.get("resources", {})
            if not resources.get("limits"):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"No resource limits defined in {file_path.name}",
                    category="infrastructure",
                    suggestion="Add CPU and memory limits for production stability"
                ))
            
            if not resources.get("requests"):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"No resource requests defined in {file_path.name}",
                    category="infrastructure",
                    suggestion="Add CPU and memory requests for proper scheduling"
                ))
        
        # Check readiness and liveness probes
        for container in containers:
            if not container.get("readinessProbe"):
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=f"No readiness probe in {file_path.name}",
                    category="infrastructure",
                    suggestion="Add readiness probe for proper load balancing"
                ))
            
            if not container.get("livenessProbe"):
                self.results.append(ValidationResult(
                    level=ValidationLevel.INFO,
                    message=f"No liveness probe in {file_path.name}",
                    category="infrastructure",
                    suggestion="Add liveness probe for automatic recovery"
                ))
    
    def _check_load_balancer_config(self):
        """Check load balancer configuration"""
        # This would typically check cloud provider configs
        # For now, check for common LB configuration files
        
        lb_configs = [
            self.project_root / "nginx.conf",
            self.project_root / "haproxy.cfg",
            self.project_root / "traefik.yml"
        ]
        
        has_lb_config = any(config.exists() for config in lb_configs)
        
        if not has_lb_config:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No load balancer configuration found",
                category="infrastructure",
                suggestion="Configure load balancer for high availability"
            ))
    
    def _check_ssl_certificates(self):
        """Check SSL certificate configuration"""
        # Check for SSL/TLS configuration
        ssl_configs = [
            self.project_root / "ssl",
            self.project_root / "certs",
            self.project_root / "tls"
        ]
        
        has_ssl_config = any(config.exists() for config in ssl_configs)
        
        # Check for cert-manager or similar
        cert_manager_files = list(self.project_root.rglob("*cert-manager*"))
        
        if not has_ssl_config and not cert_manager_files:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No SSL certificate configuration found",
                category="infrastructure",
                suggestion="Configure SSL certificates for secure communication"
            ))
    
    def _check_database_configuration(self):
        """Check database configuration"""
        # Look for database configuration files
        db_configs = [
            self.project_root / "database.yml",
            self.project_root / "db.json",
            self.project_root / "config" / "database.json"
        ]
        
        env_files = list(self.project_root.glob(".env*"))
        
        has_db_config = any(config.exists() for config in db_configs)
        has_db_env = any("DATABASE" in env_file.read_text() for env_file in env_files if env_file.exists())
        
        if not has_db_config and not has_db_env:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No database configuration detected",
                category="infrastructure",
                suggestion="Ensure database configuration is properly set up"
            ))
        
        # Check for connection pooling
        if has_db_env:
            for env_file in env_files:
                content = env_file.read_text()
                if "POOL" not in content and "CONNECTION" in content:
                    self.results.append(ValidationResult(
                        level=ValidationLevel.INFO,
                        message="Database connection pooling not configured",
                        category="infrastructure",
                        suggestion="Configure connection pooling for better performance"
                    ))
    
    def _check_backup_system(self):
        """Check backup system configuration"""
        backup_files = [
            self.project_root / "backup.sh",
            self.project_root / "scripts" / "backup.py",
            self.project_root / ".github" / "workflows" / "backup.yml"
        ]
        
        has_backup = any(backup_file.exists() for backup_file in backup_files)
        
        if not has_backup:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No backup system configuration found",
                category="infrastructure",
                suggestion="Implement automated backup procedures"
            ))
    
    def _validate_security(self):
        """Validate security readiness"""
        print("🔒 Validating security...")
        
        self._check_security_headers()
        self._check_authentication_config()
        self._check_secret_management()
        self._check_vulnerability_scan()
        self._check_security_policies()
    
    def _check_security_headers(self):
        """Check security headers configuration"""
        # Look for security header configuration
        security_configs = [
            self.project_root / "security.json",
            self.project_root / "helmet.js",
            self.project_root / "security_headers.py"
        ]
        
        has_security_config = any(config.exists() for config in security_configs)
        
        if not has_security_config:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No security headers configuration found",
                category="security",
                suggestion="Configure security headers (CSP, HSTS, etc.)"
            ))
    
    def _check_authentication_config(self):
        """Check authentication configuration"""
        auth_files = [
            self.project_root / "auth.py",
            self.project_root / "authentication.js",
            self.project_root / "config" / "auth.json"
        ]
        
        has_auth_config = any(auth_file.exists() for auth_file in auth_files)
        
        # Check for JWT or session configuration
        env_files = list(self.project_root.glob(".env*"))
        has_auth_env = False
        
        for env_file in env_files:
            if env_file.exists():
                content = env_file.read_text()
                if any(term in content for term in ["JWT", "SESSION", "AUTH", "SECRET"]):
                    has_auth_env = True
                    break
        
        if not has_auth_config and not has_auth_env:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No authentication configuration detected",
                category="security",
                suggestion="Ensure authentication is properly configured"
            ))
    
    def _check_secret_management(self):
        """Check secret management practices"""
        # Check for hardcoded secrets
        source_files = list(self.project_root.rglob("*.py")) + \
                      list(self.project_root.rglob("*.js")) + \
                      list(self.project_root.rglob("*.ts"))
        
        potential_secrets = []
        secret_patterns = [
            r'password\s*=\s*["\'][^"\']+["\']',
            r'api_key\s*=\s*["\'][^"\']+["\']',
            r'secret\s*=\s*["\'][^"\']+["\']',
            r'token\s*=\s*["\'][^"\']+["\']'
        ]
        
        for source_file in source_files[:20]:  # Limit to first 20 files for performance
            try:
                content = source_file.read_text()
                for pattern in secret_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        potential_secrets.append(str(source_file))
                        break
            except:
                continue
        
        if potential_secrets:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message=f"Potential hardcoded secrets found in {len(potential_secrets)} files",
                category="security",
                suggestion="Use environment variables or secret management systems"
            ))
        
        # Check for .env files in version control
        gitignore_path = self.project_root / ".gitignore"
        if gitignore_path.exists():
            gitignore_content = gitignore_path.read_text()
            if ".env" not in gitignore_content:
                self.results.append(ValidationResult(
                    level=ValidationLevel.WARNING,
                    message=".env files may not be properly ignored by git",
                    category="security",
                    suggestion="Add .env* to .gitignore to prevent secret exposure"
                ))
    
    def _check_vulnerability_scan(self):
        """Check for vulnerability scanning setup"""
        # Check for security scanning configuration
        security_scan_files = [
            self.project_root / ".github" / "workflows" / "security.yml",
            self.project_root / "security-scan.yml",
            self.project_root / "snyk.json"
        ]
        
        has_security_scan = any(scan_file.exists() for scan_file in security_scan_files)
        
        if not has_security_scan:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No automated security scanning configured",
                category="security",
                suggestion="Set up automated vulnerability scanning (Snyk, OWASP, etc.)"
            ))
    
    def _validate_performance(self):
        """Validate performance readiness"""
        print("⚡ Validating performance...")
        
        self._check_build_optimization()
        self._check_caching_strategy()
        self._check_cdn_configuration()
        self._check_performance_monitoring()
    
    def _check_build_optimization(self):
        """Check build optimization"""
        # Check for build configuration
        build_files = [
            self.project_root / "webpack.config.js",
            self.project_root / "vite.config.js",
            self.project_root / "rollup.config.js",
            self.project_root / "esbuild.config.js"
        ]
        
        has_build_config = any(build_file.exists() for build_file in build_files)
        
        if has_build_config:
            # Check for production optimizations
            for build_file in build_files:
                if build_file.exists():
                    content = build_file.read_text()
                    
                    # Check for minification
                    if "minify" not in content.lower() and "uglify" not in content.lower():
                        self.results.append(ValidationResult(
                            level=ValidationLevel.INFO,
                            message="Build minification not explicitly configured",
                            category="performance",
                            suggestion="Enable minification for production builds"
                        ))
                    
                    # Check for code splitting
                    if "split" not in content.lower() and "chunk" not in content.lower():
                        self.results.append(ValidationResult(
                            level=ValidationLevel.INFO,
                            message="Code splitting not configured",
                            category="performance",
                            suggestion="Enable code splitting for better loading performance"
                        ))
    
    def _check_caching_strategy(self):
        """Check caching strategy"""
        # Look for caching configuration
        cache_configs = [
            self.project_root / "redis.conf",
            self.project_root / "memcached.conf",
            self.project_root / "cache.json"
        ]
        
        has_cache_config = any(cache_config.exists() for cache_config in cache_configs)
        
        # Check for HTTP caching headers
        server_configs = [
            self.project_root / "nginx.conf",
            self.project_root / "apache.conf",
            self.project_root / "server.js"
        ]
        
        has_http_cache = False
        for server_config in server_configs:
            if server_config.exists():
                content = server_config.read_text()
                if any(term in content.lower() for term in ["cache-control", "expires", "etag"]):
                    has_http_cache = True
                    break
        
        if not has_cache_config and not has_http_cache:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No caching strategy configured",
                category="performance",
                suggestion="Implement caching for better performance (Redis, HTTP headers)"
            ))
    
    def _validate_monitoring(self):
        """Validate monitoring and observability"""
        print("📊 Validating monitoring...")
        
        self._check_logging_configuration()
        self._check_metrics_collection()
        self._check_alerting_setup()
        self._check_health_endpoints()
    
    def _check_logging_configuration(self):
        """Check logging configuration"""
        # Look for logging configuration
        log_configs = [
            self.project_root / "logging.json",
            self.project_root / "log4j.properties",
            self.project_root / "winston.js",
            self.project_root / "config" / "logging.py"
        ]
        
        has_log_config = any(log_config.exists() for log_config in log_configs)
        
        if not has_log_config:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No structured logging configuration found",
                category="monitoring",
                suggestion="Configure structured logging for better observability"
            ))
    
    def _check_metrics_collection(self):
        """Check metrics collection setup"""
        # Look for metrics configuration
        metrics_configs = [
            self.project_root / "prometheus.yml",
            self.project_root / "grafana",
            self.project_root / "datadog.yaml",
            self.project_root / "newrelic.yml"
        ]
        
        has_metrics_config = any(config.exists() if config.is_file() else any(config.iterdir()) 
                               for config in metrics_configs if config.exists())
        
        if not has_metrics_config:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No metrics collection configured",
                category="monitoring",
                suggestion="Set up metrics collection (Prometheus, DataDog, etc.)"
            ))
    
    def _check_alerting_setup(self):
        """Check alerting configuration"""
        # Look for alerting configuration
        alert_configs = [
            self.project_root / "alerts.yml",
            self.project_root / "pagerduty.json",
            self.project_root / "slack-alerts.json"
        ]
        
        has_alert_config = any(alert_config.exists() for alert_config in alert_configs)
        
        if not has_alert_config:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No alerting configuration found",
                category="monitoring",
                suggestion="Configure alerting for critical issues (PagerDuty, Slack)"
            ))
    
    def _check_health_endpoints(self):
        """Check health check endpoints"""
        # Look for health check implementation
        health_files = [
            self.project_root / "health.py",
            self.project_root / "health.js",
            self.project_root / "healthcheck.py"
        ]
        
        has_health_check = any(health_file.exists() for health_file in health_files)
        
        # Check for health endpoints in API files
        api_files = list(self.project_root.rglob("*api*")) + \
                   list(self.project_root.rglob("*server*")) + \
                   list(self.project_root.rglob("*app*"))
        
        health_endpoint_found = False
        for api_file in api_files[:10]:  # Limit for performance
            if api_file.is_file() and api_file.suffix in ['.py', '.js', '.ts']:
                try:
                    content = api_file.read_text()
                    if any(endpoint in content.lower() for endpoint in ["/health", "/ping", "/status"]):
                        health_endpoint_found = True
                        break
                except:
                    continue
        
        if not has_health_check and not health_endpoint_found:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No health check endpoints found",
                category="monitoring",
                suggestion="Implement health check endpoints for load balancer probes"
            ))
    
    def _validate_data_and_backup(self):
        """Validate data management and backup readiness"""
        print("💾 Validating data and backup...")
        
        self._check_data_migration_scripts()
        self._check_backup_procedures()
        self._check_disaster_recovery()
    
    def _check_data_migration_scripts(self):
        """Check database migration scripts"""
        migration_dirs = [
            self.project_root / "migrations",
            self.project_root / "db" / "migrations",
            self.project_root / "database" / "migrations"
        ]
        
        has_migrations = any(migration_dir.exists() and any(migration_dir.iterdir()) 
                           for migration_dir in migration_dirs)
        
        if not has_migrations:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No database migration scripts found",
                category="data",
                suggestion="Implement database migration scripts for schema changes"
            ))
    
    def _check_backup_procedures(self):
        """Check backup procedures"""
        backup_files = [
            self.project_root / "backup.sh",
            self.project_root / "scripts" / "backup.py",
            self.project_root / "backup-procedure.md"
        ]
        
        has_backup_procedure = any(backup_file.exists() for backup_file in backup_files)
        
        if not has_backup_procedure:
            self.results.append(ValidationResult(
                level=ValidationLevel.WARNING,
                message="No backup procedures documented or automated",
                category="data",
                suggestion="Document and automate backup procedures"
            ))
    
    def _validate_documentation(self):
        """Validate documentation readiness"""
        print("📚 Validating documentation...")
        
        required_docs = {
            "README.md": "Project overview and setup instructions",
            "docs/deployment.md": "Deployment procedures",
            "docs/troubleshooting.md": "Troubleshooting guide",
            "docs/api.md": "API documentation"
        }
        
        missing_docs = []
        for doc_path, description in required_docs.items():
            full_path = self.project_root / doc_path
            if not full_path.exists():
                missing_docs.append(f"{doc_path} ({description})")
        
        if missing_docs:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message=f"Missing documentation: {', '.join([doc.split(' (')[0] for doc in missing_docs])}",
                category="documentation",
                suggestion="Create missing documentation for operations team"
            ))
    
    def _validate_deployment_process(self):
        """Validate deployment process"""
        print("🚀 Validating deployment process...")
        
        # Check for CI/CD configuration
        ci_configs = [
            self.project_root / ".github" / "workflows",
            self.project_root / ".gitlab-ci.yml",
            self.project_root / "Jenkinsfile",
            self.project_root / ".circleci" / "config.yml"
        ]
        
        has_ci_cd = any(config.exists() for config in ci_configs)
        
        if not has_ci_cd:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No CI/CD configuration found",
                category="deployment",
                suggestion="Set up automated CI/CD pipeline for consistent deployments"
            ))
        
        # Check for deployment scripts
        deployment_files = [
            self.project_root / "deploy.sh",
            self.project_root / "scripts" / "deploy.py",
            self.project_root / "Makefile"
        ]
        
        has_deployment_script = any(deploy_file.exists() for deploy_file in deployment_files)
        
        if not has_deployment_script:
            self.results.append(ValidationResult(
                level=ValidationLevel.INFO,
                message="No deployment scripts found",
                category="deployment",
                suggestion="Create deployment scripts for consistent deployments"
            ))
    
    def generate_report(self) -> Dict:
        """Generate comprehensive production readiness report"""
        # Categorize results
        categories = {}
        for result in self.results:
            category = result.category or "general"
            if category not in categories:
                categories[category] = {"errors": [], "warnings": [], "info": []}
            
            categories[category][result.level.value + "s"].append(self._result_to_dict(result))
        
        # Calculate readiness score
        readiness_score = self._calculate_readiness_score()
        
        # Generate recommendations
        recommendations = self._generate_recommendations()
        
        # Determine overall readiness
        error_count = len([r for r in self.results if r.level == ValidationLevel.ERROR])
        critical_warning_count = len([r for r in self.results 
                                    if r.level == ValidationLevel.WARNING 
                                    and r.category in ["security", "infrastructure"]])
        
        overall_ready = error_count == 0 and critical_warning_count <= 2 and readiness_score >= 75
        
        return {
            "summary": {
                "overall_ready": overall_ready,
                "readiness_score": readiness_score,
                "environment": self.environment,
                "total_issues": len(self.results),
                "errors": len([r for r in self.results if r.level == ValidationLevel.ERROR]),
                "warnings": len([r for r in self.results if r.level == ValidationLevel.WARNING]),
                "info": len([r for r in self.results if r.level == ValidationLevel.INFO])
            },
            "categories": categories,
            "recommendations": recommendations,
            "next_steps": self._generate_next_steps(overall_ready)
        }
    
    def _calculate_readiness_score(self) -> float:
        """Calculate overall readiness score"""
        category_weights = {
            "infrastructure": 0.25,
            "security": 0.25,
            "performance": 0.15,
            "monitoring": 0.15,
            "data": 0.10,
            "documentation": 0.05,
            "deployment": 0.05
        }
        
        category_scores = {}
        
        for category, weight in category_weights.items():
            category_results = [r for r in self.results if r.category == category]
            
            if not category_results:
                category_scores[category] = 100  # No issues found
            else:
                errors = len([r for r in category_results if r.level == ValidationLevel.ERROR])
                warnings = len([r for r in category_results if r.level == ValidationLevel.WARNING])
                
                # Score calculation: start at 100, deduct points for issues
                score = 100 - (errors * 20) - (warnings * 10)
                category_scores[category] = max(0, score)
        
        # Calculate weighted average
        total_score = sum(score * category_weights[category] 
                         for category, score in category_scores.items())
        
        return round(total_score, 1)
    
    def _generate_recommendations(self) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # High-priority recommendations based on errors
        errors = [r for r in self.results if r.level == ValidationLevel.ERROR]
        if errors:
            recommendations.append(f"🚨 Address {len(errors)} critical issues before deployment")
        
        # Category-specific recommendations
        categories = {}
        for result in self.results:
            category = result.category or "general"
            categories[category] = categories.get(category, 0) + 1
        
        if categories.get("security", 0) > 2:
            recommendations.append("🔒 Strengthen security configuration and practices")
        
        if categories.get("infrastructure", 0) > 2:
            recommendations.append("🏗️ Improve infrastructure setup and configuration")
        
        if categories.get("monitoring", 0) > 2:
            recommendations.append("📊 Enhance monitoring and observability")
        
        # General recommendations
        total_issues = len(self.results)
        if total_issues > 10:
            recommendations.append("📋 Create action plan to systematically address all issues")
        elif total_issues > 5:
            recommendations.append("🎯 Prioritize fixing warnings in critical categories")
        elif total_issues == 0:
            recommendations.append("✅ Production ready! Consider setting up monitoring for ongoing health")
        
        return recommendations
    
    def _generate_next_steps(self, overall_ready: bool) -> List[str]:
        """Generate next steps based on readiness status"""
        if overall_ready:
            return [
                "✅ Production deployment approved",
                "📋 Schedule deployment window", 
                "👥 Notify stakeholders of deployment plan",
                "📊 Monitor systems closely during initial deployment",
                "📝 Document any deployment issues for future reference"
            ]
        else:
            next_steps = []
            
            errors = [r for r in self.results if r.level == ValidationLevel.ERROR]
            if errors:
                next_steps.append(f"🔧 Fix {len(errors)} critical errors")
            
            critical_warnings = [r for r in self.results 
                                if r.level == ValidationLevel.WARNING 
                                and r.category in ["security", "infrastructure"]]
            if critical_warnings:
                next_steps.append(f"⚠️ Address {len(critical_warnings)} critical warnings")
            
            next_steps.extend([
                "🧪 Re-run validation after fixes",
                "👥 Review fixes with team",
                "📅 Reschedule deployment after validation passes"
            ])
            
            return next_steps
    
    def _result_to_dict(self, result: ValidationResult) -> Dict:
        """Convert validation result to dictionary"""
        return {
            "level": result.level.value,
            "message": result.message,
            "category": result.category,
            "details": result.details,
            "suggestion": result.suggestion
        }

def main():
    """Main validation function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate production readiness')
    parser.add_argument('project_root', help='Project root directory')
    parser.add_argument('--environment', default='production', 
                      help='Target environment (default: production)')
    parser.add_argument('--output', help='Output file for validation report')
    parser.add_argument('--format', choices=['json', 'text'], default='text',
                      help='Output format')
    parser.add_argument('--fail-on-errors', action='store_true',
                      help='Exit with error code if critical issues found')
    parser.add_argument('--fail-on-warnings', action='store_true',
                      help='Exit with error code if warnings found')
    
    args = parser.parse_args()
    
    validator = ProductionReadinessValidator(args.project_root, args.environment)
    validator.validate_all()
    report = validator.generate_report()
    
    if args.format == 'json':
        output = json.dumps(report, indent=2)
    else:
        output = format_text_report(report)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
    else:
        print(output)
    
    # Exit with appropriate code
    if args.fail_on_errors and report['summary']['errors'] > 0:
        sys.exit(1)
    elif args.fail_on_warnings and report['summary']['warnings'] > 0:
        sys.exit(1)
    elif not report['summary']['overall_ready']:
        sys.exit(2)  # Not ready for production

def format_text_report(report: Dict) -> str:
    """Format report as human-readable text"""
    lines = []
    summary = report['summary']
    
    lines.append("Production Readiness Assessment")
    lines.append("=" * 50)
    lines.append(f"Environment: {summary['environment']}")
    lines.append(f"Overall Ready: {'✅ YES' if summary['overall_ready'] else '❌ NO'}")
    lines.append(f"Readiness Score: {summary['readiness_score']}/100")
    lines.append(f"Total Issues: {summary['total_issues']}")
    lines.append(f"  Errors: {summary['errors']}")
    lines.append(f"  Warnings: {summary['warnings']}")
    lines.append(f"  Info: {summary['info']}")
    lines.append("")
    
    # Category breakdown
    for category, issues in report['categories'].items():
        if any(issues.values()):
            lines.append(f"📊 {category.title()} Issues:")
            
            for level in ['errors', 'warnings', 'info']:
                if issues[level]:
                    icon = "🚨" if level == "errors" else "⚠️" if level == "warnings" else "ℹ️"
                    lines.append(f"  {icon} {level.title()}:")
                    for issue in issues[level]:
                        lines.append(f"    - {issue['message']}")
                        if issue['suggestion']:
                            lines.append(f"      💡 {issue['suggestion']}")
            lines.append("")
    
    # Recommendations
    if report['recommendations']:
        lines.append("💡 Recommendations:")
        for rec in report['recommendations']:
            lines.append(f"  {rec}")
        lines.append("")
    
    # Next steps
    if report['next_steps']:
        lines.append("🎯 Next Steps:")
        for step in report['next_steps']:
            lines.append(f"  {step}")
    
    return "\n".join(lines)

if __name__ == "__main__":
    main()