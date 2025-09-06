#!/usr/bin/env python3
"""
Design Generator Script

This script generates detailed technical design documents from requirements specifications,
creating architecture diagrams, interfaces, and technical specifications.

Usage:
    python scripts/generate-design.py --from-requirements docs/specifications/requirements.md
    python scripts/generate-design.py --prompt "Design a data processing pipeline"
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple


class DesignGenerator:
    """Generate technical design documents from requirements specifications."""
    
    def __init__(self, project_config_path: str = "config/project-config.json"):
        """Initialize with project configuration."""
        self.config = self._load_project_config(project_config_path)
        self.template_path = "docs/specifications/design-template.md"
        self.output_path = "docs/specifications/design.md"
        
    def _load_project_config(self, config_path: str) -> Dict[str, Any]:
        """Load project configuration from JSON file."""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Project config not found at {config_path}")
            return self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Return default configuration structure."""
        return {
            "project": {
                "name": "[PROJECT_NAME]",
                "description": "[PROJECT_DESCRIPTION]",
                "language": "python",
                "component_count": "6"
            },
            "architecture": {
                "type": "component-pipeline",
                "principles": ["simple", "lovable", "complete"]
            }
        }
    
    def generate_from_requirements(self, requirements_path: str) -> str:
        """Generate design document from requirements specification."""
        print(f"Generating design from requirements: {requirements_path}")
        
        try:
            with open(requirements_path, 'r') as f:
                requirements_content = f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"Requirements file not found: {requirements_path}")
        
        # Analyze requirements to extract design information
        requirements_analysis = self._analyze_requirements(requirements_content)
        
        # Generate design components
        architecture_design = self._generate_architecture_design(requirements_analysis)
        component_specs = self._generate_component_specifications(requirements_analysis)
        data_architecture = self._generate_data_architecture(requirements_analysis)
        api_design = self._generate_api_design(requirements_analysis)
        infrastructure_design = self._generate_infrastructure_design(requirements_analysis)
        
        # Load template and populate with design
        template_content = self._load_template()
        design_content = self._populate_template(
            template_content,
            requirements_analysis,
            architecture_design,
            component_specs,
            data_architecture,
            api_design,
            infrastructure_design
        )
        
        return design_content
    
    def generate_from_prompt(self, prompt: str) -> str:
        """Generate design document from a high-level design prompt."""
        print(f"Generating design from prompt: {prompt}")
        
        # Create a minimal requirements analysis from the prompt
        prompt_analysis = self._analyze_design_prompt(prompt)
        
        # Generate design components
        architecture_design = self._generate_architecture_design(prompt_analysis)
        component_specs = self._generate_component_specifications(prompt_analysis)
        data_architecture = self._generate_data_architecture(prompt_analysis)
        
        # Load template and populate
        template_content = self._load_template()
        design_content = self._populate_template(
            template_content,
            prompt_analysis,
            architecture_design,
            component_specs,
            data_architecture
        )
        
        return design_content
    
    def _analyze_requirements(self, requirements_content: str) -> Dict[str, Any]:
        """Extract design-relevant information from requirements document."""
        analysis = {
            'components': self._extract_components(requirements_content),
            'technical_requirements': self._extract_technical_requirements(requirements_content),
            'user_stories': self._extract_user_stories(requirements_content),
            'quality_attributes': self._extract_quality_attributes(requirements_content),
            'domain': self._detect_domain(requirements_content),
            'interfaces': self._infer_interfaces(requirements_content),
            'data_entities': self._extract_data_entities(requirements_content)
        }
        
        return analysis
    
    def _analyze_design_prompt(self, prompt: str) -> Dict[str, Any]:
        """Analyze design prompt to extract key information."""
        return {
            'components': self._infer_components_from_prompt(prompt),
            'domain': self._detect_domain(prompt),
            'quality_attributes': self._infer_quality_from_prompt(prompt),
            'data_entities': self._infer_data_entities(prompt),
            'interfaces': self._infer_interfaces_from_prompt(prompt)
        }
    
    def _extract_components(self, content: str) -> List[Dict[str, str]]:
        """Extract component specifications from requirements."""
        component_pattern = r'### Component (\\d+): ([^\\n]*)[\\s\\S]*?\\*\\*Purpose\\*\\*: ([^\\n]*)[\\s\\S]*?\\*\\*Input\\*\\*: ([^\\n]*)[\\s\\S]*?\\*\\*Output\\*\\*: ([^\\n]*)'
        matches = re.findall(component_pattern, content)
        
        components = []
        for match in matches:
            component = {
                'id': match[0],
                'name': match[1].strip(),
                'purpose': match[2].strip(),
                'input': match[3].strip(),
                'output': match[4].strip()
            }
            components.append(component)
        
        # If no components found, create default based on project config
        if not components:
            component_count = int(self.config['project'].get('component_count', 4))
            components = self._generate_default_components(component_count)
        
        return components
    
    def _generate_default_components(self, count: int) -> List[Dict[str, str]]:
        """Generate default component structure."""
        domain = self.config.get('domain', 'general')
        
        if domain == 'data_processing':
            base_components = [
                {'name': 'Data Ingestion', 'purpose': 'Load and validate input data'},
                {'name': 'Data Processing', 'purpose': 'Process and transform data'},
                {'name': 'Data Analysis', 'purpose': 'Analyze processed data'},
                {'name': 'Output Generation', 'purpose': 'Generate final output'}
            ]
        elif domain == 'content_generation':
            base_components = [
                {'name': 'Content Planning', 'purpose': 'Plan content structure'},
                {'name': 'Content Generation', 'purpose': 'Generate content'},
                {'name': 'Quality Assurance', 'purpose': 'Validate content quality'},
                {'name': 'Publishing', 'purpose': 'Prepare for publication'}
            ]
        else:
            base_components = [
                {'name': 'Input Processing', 'purpose': 'Process user input'},
                {'name': 'Core Logic', 'purpose': 'Main business logic'},
                {'name': 'Data Processing', 'purpose': 'Process and validate data'},
                {'name': 'Output Generation', 'purpose': 'Generate system output'}
            ]
        
        # Adjust to requested count
        while len(base_components) < count:
            base_components.append({
                'name': f'Additional Component {len(base_components) + 1}',
                'purpose': 'Additional processing step'
            })
        
        # Add IDs and I/O
        components = []
        for i, comp in enumerate(base_components[:count], 1):
            component = {
                'id': str(i),
                'name': comp['name'],
                'purpose': comp['purpose'],
                'input': 'User input' if i == 1 else f'Output from Component {i-1}',
                'output': 'Final output' if i == count else f'Input for Component {i+1}'
            }
            components.append(component)
        
        return components
    
    def _extract_technical_requirements(self, content: str) -> List[Dict[str, Any]]:
        """Extract technical requirements for design consideration."""
        tr_pattern = r'### (TR\\d+): ([^\\n]*)[\\s\\S]*?\\*\\*EARS Format\\*\\*: ([^\\n]*)'
        matches = re.findall(tr_pattern, content)
        
        tech_reqs = []
        for match in matches:
            req = {
                'id': match[0],
                'title': match[1].strip(),
                'requirement': match[2].strip(),
                'type': self._classify_requirement_type(match[1])
            }
            tech_reqs.append(req)
        
        return tech_reqs
    
    def _classify_requirement_type(self, title: str) -> str:
        """Classify technical requirement type."""
        title_lower = title.lower()
        if 'performance' in title_lower:
            return 'performance'
        elif 'security' in title_lower:
            return 'security'
        elif 'reliability' in title_lower:
            return 'reliability'
        elif 'usability' in title_lower:
            return 'usability'
        else:
            return 'functional'
    
    def _extract_user_stories(self, content: str) -> List[Dict[str, str]]:
        """Extract user stories for interface design."""
        story_pattern = r'#### User Story ([\\d\\.]+): ([^\\n]*)[\\s\\S]*?\\*\\*As a\\*\\* ([^\\n]*)[\\s\\S]*?\\*\\*I want\\*\\* ([^\\n]*)[\\s\\S]*?\\*\\*So that\\*\\* ([^\\n]*)'
        matches = re.findall(story_pattern, content)
        
        stories = []
        for match in matches:
            story = {
                'id': match[0],
                'title': match[1].strip(),
                'user': match[2].strip(),
                'want': match[3].strip(),
                'benefit': match[4].strip()
            }
            stories.append(story)
        
        return stories
    
    def _extract_quality_attributes(self, content: str) -> List[str]:
        """Extract quality attributes that affect design."""
        qa_indicators = {
            'performance': ['performance', 'speed', 'fast', 'response time'],
            'security': ['security', 'secure', 'authentication', 'authorization'],
            'scalability': ['scalability', 'scale', 'concurrent', 'volume'],
            'reliability': ['reliability', 'available', 'fault tolerance', 'error handling'],
            'usability': ['usability', 'user-friendly', 'intuitive', 'accessible'],
            'maintainability': ['maintainability', 'modular', 'extensible', 'configurable']
        }
        
        content_lower = content.lower()
        attributes = []
        
        for attribute, indicators in qa_indicators.items():
            if any(indicator in content_lower for indicator in indicators):
                attributes.append(attribute)
        
        return list(set(attributes))
    
    def _detect_domain(self, content: str) -> str:
        """Detect application domain from content."""
        domains = {
            'data_processing': ['data', 'process', 'analyze', 'transform', 'etl', 'pipeline'],
            'content_generation': ['content', 'generate', 'create', 'publish', 'cms'],
            'api_integration': ['api', 'integrate', 'endpoint', 'rest', 'service'],
            'web_application': ['web', 'application', 'ui', 'frontend', 'backend'],
            'e_commerce': ['product', 'cart', 'order', 'payment', 'shop']
        }
        
        content_lower = content.lower()
        for domain, keywords in domains.items():
            if sum(keyword in content_lower for keyword in keywords) >= 2:
                return domain
        
        return 'general'
    
    def _infer_interfaces(self, content: str) -> List[Dict[str, str]]:
        """Infer system interfaces from requirements."""
        interfaces = []
        
        # Check for web interface indicators
        if any(term in content.lower() for term in ['web', 'browser', 'ui', 'frontend']):
            interfaces.append({
                'type': 'web',
                'description': 'Web-based user interface',
                'technology': 'HTML/CSS/JavaScript'
            })
        
        # Check for API interface indicators
        if any(term in content.lower() for term in ['api', 'rest', 'endpoint', 'service']):
            interfaces.append({
                'type': 'api',
                'description': 'RESTful API interface',
                'technology': 'HTTP/JSON'
            })
        
        # Check for CLI interface indicators
        if any(term in content.lower() for term in ['command', 'cli', 'script', 'terminal']):
            interfaces.append({
                'type': 'cli',
                'description': 'Command-line interface',
                'technology': 'Shell/Terminal'
            })
        
        # Default to CLI if no interfaces detected
        if not interfaces:
            interfaces.append({
                'type': 'cli',
                'description': 'Command-line interface',
                'technology': 'Shell/Terminal'
            })
        
        return interfaces
    
    def _extract_data_entities(self, content: str) -> List[str]:
        """Extract data entities from requirements."""
        # Look for common data entity patterns
        entity_patterns = [
            r'\\b(user|customer|client)s?\\b',
            r'\\b(product|item|resource)s?\\b',
            r'\\b(order|request|transaction)s?\\b',
            r'\\b(data|information|record)s?\\b',
            r'\\b(file|document|report)s?\\b'
        ]
        
        entities = set()
        for pattern in entity_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            entities.update([match.lower() for match in matches])
        
        return list(entities)
    
    def _infer_components_from_prompt(self, prompt: str) -> List[Dict[str, str]]:
        """Infer components from design prompt."""
        # Default to 4 components for prompt-based generation
        return self._generate_default_components(4)
    
    def _infer_quality_from_prompt(self, prompt: str) -> List[str]:
        """Infer quality attributes from prompt."""
        return ['performance', 'reliability', 'maintainability']
    
    def _infer_data_entities(self, prompt: str) -> List[str]:
        """Infer data entities from prompt."""
        return ['data', 'configuration', 'results']
    
    def _infer_interfaces_from_prompt(self, prompt: str) -> List[Dict[str, str]]:
        """Infer interfaces from prompt."""
        return [{
            'type': 'cli',
            'description': 'Command-line interface',
            'technology': 'Shell/Terminal'
        }]
    
    def _generate_architecture_design(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate high-level architecture design."""
        components = analysis.get('components', [])
        
        # Generate Mermaid diagram
        mermaid_diagram = self._generate_mermaid_diagram(components)
        
        # Generate architecture description
        arch_description = self._generate_architecture_description(components, analysis)
        
        return {
            'mermaid_diagram': mermaid_diagram,
            'description': arch_description,
            'patterns': self._get_architecture_patterns(analysis.get('domain', 'general')),
            'quality_attributes': analysis.get('quality_attributes', [])
        }
    
    def _generate_mermaid_diagram(self, components: List[Dict[str, str]]) -> str:
        """Generate Mermaid diagram for component architecture."""
        lines = ['graph TD']
        
        # Add input
        lines.append('    A[Input] --> B[Component 1: Data Ingestion]')
        
        # Add component chain
        for i, component in enumerate(components):
            current = chr(66 + i)  # B, C, D, etc.
            next_char = chr(67 + i)
            
            if i < len(components) - 1:
                next_component = components[i + 1]
                lines.append(f'    {current}[Component {component["id"]}: {component["name"]}] --> {next_char}[Component {next_component["id"]}: {next_component["name"]}]')
            else:
                lines.append(f'    {current}[Component {component["id"]}: {component["name"]}] --> F[Final Output]')
        
        # Add error handling
        error_char = chr(66 + len(components))
        lines.append(f'    B --> {error_char}[Error Handler]')
        for i in range(1, len(components)):
            comp_char = chr(67 + i)
            lines.append(f'    {comp_char} --> {error_char}')
        
        next_char = chr(66 + len(components) + 1)
        lines.append(f'    {error_char} --> {next_char}[Error Logs]')
        
        # Add configuration
        config_char = chr(66 + len(components) + 2)
        lines.append(f'    {config_char}[Configuration] --> B')
        for i in range(1, len(components)):
            comp_char = chr(67 + i)
            lines.append(f'    {config_char} --> {comp_char}')
        
        return '\\n'.join(lines)
    
    def _generate_architecture_description(self, components: List[Dict[str, str]], analysis: Dict[str, Any]) -> str:
        """Generate architecture description."""
        component_count = len(components)
        domain = analysis.get('domain', 'general')
        
        description = f"""The system follows a {component_count}-component pipeline architecture implementing the SLC (Simple, Lovable, Complete) methodology.

The system processes data through a sequential pipeline where each component:
1. Receives input from the previous component (or external source)
2. Transforms/processes the data according to its specific function
3. Validates output quality before passing to next component
4. Handles errors gracefully with logging and recovery

Key architectural principles:
- **Simple**: Minimize complexity while meeting requirements
- **Lovable**: Optimize for developer and user experience  
- **Complete**: Include all necessary functionality for production use"""
        
        return description
    
    def _get_architecture_patterns(self, domain: str) -> List[str]:
        """Get relevant architecture patterns for domain."""
        patterns = {
            'data_processing': ['Pipeline Pattern', 'ETL Pattern', 'Batch Processing'],
            'content_generation': ['Template Method', 'Strategy Pattern', 'Pipeline Pattern'],
            'api_integration': ['Adapter Pattern', 'Circuit Breaker', 'Retry Pattern'],
            'web_application': ['MVC Pattern', 'Repository Pattern', 'Dependency Injection']
        }
        
        return patterns.get(domain, ['Pipeline Pattern', 'Strategy Pattern', 'Observer Pattern'])
    
    def _generate_component_specifications(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate detailed component specifications."""
        components = analysis.get('components', [])
        specs = []
        
        for component in components:
            spec = {
                'id': component['id'],
                'name': component['name'],
                'purpose': component['purpose'],
                'input': component['input'],
                'output': component['output'],
                'interface': self._generate_component_interface(component),
                'processing_logic': self._generate_processing_logic(component),
                'performance_specs': self._generate_performance_specs(component),
                'error_handling': self._generate_error_handling(component)
            }
            specs.append(spec)
        
        return specs
    
    def _generate_component_interface(self, component: Dict[str, str]) -> str:
        """Generate TypeScript interface for component."""
        comp_id = component['id']
        name = component['name'].replace(' ', '')
        
        interface = f"""interface Component{comp_id}Input {{
  data: {name}InputType;
  config: ComponentConfig;
  metadata?: ProcessingMetadata;
}}

interface Component{comp_id}Output {{
  processedData: {name}OutputType;
  status: ProcessingStatus;
  metrics: ProcessingMetrics;
  errors?: ErrorDetails[];
}}

interface ComponentConfig {{
  // [CUSTOMIZE: Component-specific configuration options]
}}"""
        
        return interface
    
    def _generate_processing_logic(self, component: Dict[str, str]) -> str:
        """Generate processing logic description."""
        logic = f"""Input Validation:
1. Check data format and structure
2. Validate required fields
3. Check data quality thresholds

Processing:
1. [CUSTOMIZE: Step-by-step processing logic for {component['name']}]
2. Apply business rules
3. Transform data format

Output Validation:
1. Verify output format
2. Check processing quality metrics
3. Validate against success criteria

Error Handling:
1. Log errors with context
2. Attempt recovery if possible
3. Return partial results when appropriate"""
        
        return logic
    
    def _generate_performance_specs(self, component: Dict[str, str]) -> Dict[str, str]:
        """Generate performance specifications."""
        return {
            'processing_time': '[Maximum time per operation]',
            'throughput': '[Items processed per second/minute]',
            'memory_usage': '[Maximum memory consumption]',
            'scalability': '[Horizontal/vertical scaling approach]'
        }
    
    def _generate_error_handling(self, component: Dict[str, str]) -> List[str]:
        """Generate error handling strategies."""
        return [
            'Input validation errors with specific error messages',
            'Processing errors with rollback capabilities',
            'Resource exhaustion handling with graceful degradation',
            'External dependency failures with retry logic'
        ]
    
    def _generate_data_architecture(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate data architecture specification."""
        entities = analysis.get('data_entities', [])
        
        # Generate data flow diagram
        data_flow = self._generate_data_flow_diagram()
        
        # Generate data models
        data_models = self._generate_data_models(entities)
        
        # Generate database schema if needed
        database_schema = self._generate_database_schema(entities)
        
        return {
            'data_flow_diagram': data_flow,
            'data_models': data_models,
            'database_schema': database_schema
        }
    
    def _generate_data_flow_diagram(self) -> str:
        """Generate Mermaid data flow diagram."""
        diagram = """flowchart LR
    subgraph "Input Layer"
        A[Raw Input Data]
        B[Configuration Files]
        C[User Parameters]
    end
    
    subgraph "Processing Layer"
        D[Validation Engine]
        E[Processing Pipeline]
        F[Quality Assurance]
    end
    
    subgraph "Storage Layer"
        G[Processed Data Store]
        H[Metadata Store]
        I[Error Logs]
    end
    
    subgraph "Output Layer"
        J[Formatted Output]
        K[Reports & Analytics]
        L[Status Dashboard]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> J
    E --> H
    H --> K
    D --> I
    E --> I
    F --> I
    I --> L"""
        
        return diagram
    
    def _generate_data_models(self, entities: List[str]) -> str:
        """Generate TypeScript data models."""
        models = """// Primary data entity
interface ProcessingItem {
  id: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  status: ProcessingStatus;
  data: any; // Component-specific data structure
  metadata: ProcessingMetadata;
}

// Processing metadata
interface ProcessingMetadata {
  sourceComponent: string;
  processingStartTime: Date;
  processingEndTime?: Date;
  qualityMetrics: QualityMetrics;
  errorCount: number;
  warningCount: number;
}

// Quality assessment
interface QualityMetrics {
  accuracy: number;        // 0-1 scale
  completeness: number;    // 0-1 scale
  consistency: number;     // 0-1 scale
  relevance: number;       // 0-1 scale
  overall: number;         // Calculated overall score
}"""
        
        return models
    
    def _generate_database_schema(self, entities: List[str]) -> str:
        """Generate database schema if applicable."""
        schema = """-- [CUSTOMIZE: Add database schema if using persistent storage]
CREATE TABLE processing_items (
    id UUID PRIMARY KEY,
    version INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    metadata JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_processing_items_status ON processing_items(status);
CREATE INDEX idx_processing_items_created ON processing_items(created_at);"""
        
        return schema
    
    def _generate_api_design(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate API design specification."""
        interfaces = analysis.get('interfaces', [])
        
        api_design = {
            'interfaces': interfaces,
            'component_api': self._generate_component_api(),
            'error_handling': self._generate_api_error_handling()
        }
        
        # Add REST API if web interface detected
        if any(iface['type'] == 'web' for iface in interfaces):
            api_design['rest_api'] = self._generate_rest_api_spec()
        
        return api_design
    
    def _generate_component_api(self) -> str:
        """Generate internal component API specification."""
        api = """// Standardized component interface
interface Component {
  name: string;
  version: string;
  
  // Main processing method
  process(input: ComponentInput): Promise<ComponentOutput>;
  
  // Health check
  healthCheck(): Promise<HealthStatus>;
  
  // Configuration validation
  validateConfig(config: ComponentConfig): ValidationResult;
  
  // Cleanup and shutdown
  cleanup(): Promise<void>;
}

// Error handling interface
interface ErrorHandler {
  handleError(error: ProcessingError, context: ErrorContext): ErrorResponse;
  isRetryable(error: ProcessingError): boolean;
  getRetryStrategy(error: ProcessingError): RetryStrategy;
}"""
        
        return api
    
    def _generate_api_error_handling(self) -> List[str]:
        """Generate API error handling strategies."""
        return [
            "Standardized error response format with error codes",
            "Input validation with detailed error messages",
            "Rate limiting with appropriate HTTP status codes",
            "Authentication and authorization error handling",
            "Internal server error handling with logging"
        ]
    
    def _generate_rest_api_spec(self) -> str:
        """Generate OpenAPI specification."""
        spec = """openapi: 3.0.0
info:
  title: [PROJECT_NAME] API
  version: 1.0.0
paths:
  /api/v1/process:
    post:
      summary: Submit data for processing
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProcessingRequest'
      responses:
        200:
          description: Processing initiated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProcessingResponse'"""
        
        return spec
    
    def _generate_infrastructure_design(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate infrastructure design specification."""
        language = self.config['project'].get('language', 'python')
        
        return {
            'deployment_architecture': self._generate_deployment_architecture(),
            'technology_stack': self._generate_technology_stack(language),
            'file_organization': self._generate_file_organization(language)
        }
    
    def _generate_deployment_architecture(self) -> str:
        """Generate deployment architecture diagram."""
        arch = """[CUSTOMIZE: Choose appropriate deployment model]

Option 1: Single-Machine Deployment
┌─────────────────────────────────┐
│         Application Host         │
├─────────────────────────────────┤
│  Component 1  │  Component 2    │
│  Component 3  │  Component 4    │
├─────────────────────────────────┤
│       Configuration Store       │
│         Log Storage            │
└─────────────────────────────────┘

Option 2: Microservices Deployment
┌───────────┐  ┌───────────┐  ┌───────────┐
│Component 1│  │Component 2│  │Component 3│
│ Service   │→ │ Service   │→ │ Service   │
└───────────┘  └───────────┘  └───────────┘
      │              │              │
      └──────────────┼──────────────┘
                     │
           ┌─────────────────┐
           │ Message Queue/  │
           │ Event Bus       │
           └─────────────────┘"""
        
        return arch
    
    def _generate_technology_stack(self, language: str) -> str:
        """Generate technology stack specification."""
        stacks = {
            'python': """language: Python
version: 3.8+
runtime: Python interpreter

Dependencies:
  core_libraries:
    - pydantic: latest # Data validation
    - click: latest # CLI interface
  
  development_tools:
    - pytest: latest # Testing framework
    - black: latest # Code formatting
    - flake8: latest # Linting""",
            
            'javascript': """language: JavaScript
version: ES2020+
runtime: Node.js 16+

Dependencies:
  core_libraries:
    - express: latest # Web framework
    - joi: latest # Data validation
  
  development_tools:
    - jest: latest # Testing framework
    - eslint: latest # Linting
    - prettier: latest # Code formatting""",
            
            'go': """language: Go
version: 1.19+
runtime: Go runtime

Dependencies:
  core_libraries:
    - gorilla/mux: latest # HTTP router
    - go-playground/validator: latest # Validation
  
  development_tools:
    - go test: built-in # Testing
    - golangci-lint: latest # Linting
    - gofmt: built-in # Formatting"""
        }
        
        return stacks.get(language, stacks['python'])
    
    def _generate_file_organization(self, language: str) -> str:
        """Generate file system organization."""
        organizations = {
            'python': """project-root/
├── src/
│   ├── components/
│   │   ├── component1/
│   │   │   ├── __init__.py
│   │   │   ├── processor.py
│   │   │   ├── validator.py
│   │   │   └── config.py
│   │   └── component2/
│   │       └── [similar structure]
│   ├── shared/
│   │   ├── interfaces.py
│   │   ├── error_handling.py
│   │   └── utils.py
│   └── pipeline/
│       ├── orchestrator.py
│       └── monitor.py""",
            
            'javascript': """project-root/
├── src/
│   ├── components/
│   │   ├── component1/
│   │   │   ├── index.js
│   │   │   ├── processor.js
│   │   │   ├── validator.js
│   │   │   └── config.js
│   │   └── component2/
│   │       └── [similar structure]
│   ├── shared/
│   │   ├── interfaces.js
│   │   ├── errorHandling.js
│   │   └── utils.js
│   └── pipeline/
│       ├── orchestrator.js
│       └── monitor.js""",
            
            'go': """project-root/
├── cmd/
│   └── main.go
├── internal/
│   ├── components/
│   │   ├── component1/
│   │   │   ├── processor.go
│   │   │   ├── validator.go
│   │   │   └── config.go
│   │   └── component2/
│   │       └── [similar structure]
│   ├── shared/
│   │   ├── interfaces.go
│   │   ├── errors.go
│   │   └── utils.go
│   └── pipeline/
│       ├── orchestrator.go
│       └── monitor.go"""
        }
        
        base_structure = """├── config/
│   ├── default.json
│   ├── development.json
│   └── production.json
├── tests/
│   ├── unit/
│   ├── integration/
│   └── reference/
└── docs/
    ├── api/
    └── deployment/"""
        
        return organizations.get(language, organizations['python']) + base_structure
    
    def _load_template(self) -> str:
        """Load the design template."""
        try:
            with open(self.template_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"Design template not found: {self.template_path}")
    
    def _populate_template(self, template: str, analysis: Dict[str, Any], 
                          architecture: Dict[str, Any], components: List[Dict[str, Any]],
                          data_arch: Dict[str, Any], api_design: Dict[str, Any] = None,
                          infrastructure: Dict[str, Any] = None) -> str:
        """Populate template with generated design content."""
        # Basic template substitutions
        content = template.replace('[PROJECT_NAME]', self.config['project']['name'])
        content = content.replace('[DATE]', datetime.now().strftime('%Y-%m-%d'))
        content = content.replace('[COMPONENT_COUNT]', str(self.config['project']['component_count']))
        
        # Replace architecture diagram
        if 'mermaid_diagram' in architecture:
            mermaid_placeholder = r'```mermaid[\\s\\S]*?```'
            new_mermaid = f"```mermaid\\n{architecture['mermaid_diagram']}\\n```"
            content = re.sub(mermaid_placeholder, new_mermaid, content, count=1)
        
        # Replace component specifications
        if components:
            comp_section = self._format_component_sections(components)
            # Replace first component section
            comp_pattern = r'### Component 1:.*?(?=### Component 2:|## 💾 Data Architecture)'
            content = re.sub(comp_pattern, comp_section, content, flags=re.DOTALL)
        
        # Replace data flow diagram
        if 'data_flow_diagram' in data_arch:
            data_flow_pattern = r'```mermaid[\\s\\S]*?(?=```)'
            # Find the second mermaid block (data flow)
            mermaid_blocks = re.finditer(r'```mermaid[\\s\\S]*?```', content)
            blocks = list(mermaid_blocks)
            if len(blocks) > 1:
                start, end = blocks[1].span()
                new_data_flow = f"```mermaid\\n{data_arch['data_flow_diagram']}\\n```"
                content = content[:start] + new_data_flow + content[end:]
        
        # Replace technology stack
        if infrastructure and 'technology_stack' in infrastructure:
            tech_pattern = r'```yaml[\\s\\S]*?```'
            new_tech = f"```yaml\\n{infrastructure['technology_stack']}\\n```"
            content = re.sub(tech_pattern, new_tech, content, count=1)
        
        return content
    
    def _format_component_sections(self, components: List[Dict[str, Any]]) -> str:
        """Format component specifications into template sections."""
        sections = []
        
        for i, comp in enumerate(components):
            section = f"""### Component {comp['id']}: {comp['name']}
**Purpose**: {comp['purpose']}  
**Input**: {comp['input']}  
**Output**: {comp['output']}

#### Interface Design
```typescript
{comp['interface']}
```

#### Processing Logic
```
{comp['processing_logic']}
```

#### Performance Specifications
- **Processing Time**: {comp['performance_specs']['processing_time']}
- **Throughput**: {comp['performance_specs']['throughput']}
- **Memory Usage**: {comp['performance_specs']['memory_usage']}
- **Scalability**: {comp['performance_specs']['scalability']}"""
            
            sections.append(section)
            
            # Add separator between components
            if i < len(components) - 1:
                sections.append("")
        
        return "\\n\\n".join(sections)
    
    def save_design(self, content: str, output_path: str = None) -> str:
        """Save generated design to file."""
        if output_path is None:
            output_path = self.output_path
            
        # Ensure output directory exists
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            f.write(content)
            
        return output_path


def main():
    """Main function for command line usage."""
    parser = argparse.ArgumentParser(description='Generate technical design from requirements or prompts')
    parser.add_argument('--from-requirements', type=str, help='Path to requirements file to generate design from')
    parser.add_argument('--prompt', type=str, help='High-level design prompt')
    parser.add_argument('--output', type=str, help='Output file path (default: docs/specifications/design.md)')
    parser.add_argument('--config', type=str, default='config/project-config.json', 
                       help='Path to project configuration file')
    
    args = parser.parse_args()
    
    if not args.from_requirements and not args.prompt:
        print("Error: Either --from-requirements or --prompt must be provided")
        sys.exit(1)
    
    try:
        generator = DesignGenerator(args.config)
        
        if args.from_requirements:
            content = generator.generate_from_requirements(args.from_requirements)
        else:
            content = generator.generate_from_prompt(args.prompt)
        
        output_path = generator.save_design(content, args.output)
        print(f"Design document generated successfully: {output_path}")
        
    except Exception as e:
        print(f"Error generating design: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()