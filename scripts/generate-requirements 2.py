#!/usr/bin/env python3
"""
Requirements Generator Script

This script generates detailed requirements.md from high-level PRD prompts using
EARS (Easy Approach to Requirements Syntax) notation and structured user stories.

Usage:
    python scripts/generate-requirements.py --prompt "Add a review system for products"
    python scripts/generate-requirements.py --from-prd docs/specifications/PRD.md
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any


class RequirementsGenerator:
    """Generate detailed requirements from high-level prompts using EARS notation."""
    
    def __init__(self, project_config_path: str = "config/project-config.json"):
        """Initialize with project configuration."""
        self.config = self._load_project_config(project_config_path)
        self.template_path = "docs/specifications/requirements-template.md"
        self.output_path = "docs/specifications/requirements.md"
        
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
                "component_count": "6"
            },
            "development": {
                "test_command": "pytest tests/ -v",
                "lint_command": "flake8 src/",
                "format_command": "black src/"
            }
        }
    
    def generate_from_prompt(self, prompt: str) -> str:
        """Generate requirements from a high-level prompt."""
        print(f"Generating requirements from prompt: {prompt}")
        
        # Parse the prompt to extract key information
        prompt_analysis = self._analyze_prompt(prompt)
        
        # Generate EARS-formatted requirements
        business_requirements = self._generate_business_requirements(prompt_analysis)
        user_stories = self._generate_user_stories(prompt_analysis)
        technical_requirements = self._generate_technical_requirements(prompt_analysis)
        
        # Load template and populate with generated content
        template_content = self._load_template()
        requirements_content = self._populate_template(
            template_content,
            business_requirements,
            user_stories,
            technical_requirements,
            prompt_analysis
        )
        
        return requirements_content
    
    def generate_from_prd(self, prd_path: str) -> str:
        """Generate requirements from existing PRD document."""
        print(f"Generating requirements from PRD: {prd_path}")
        
        try:
            with open(prd_path, 'r') as f:
                prd_content = f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"PRD file not found: {prd_path}")
        
        # Extract information from PRD
        prd_analysis = self._analyze_prd(prd_content)
        
        # Generate requirements using PRD information
        return self.generate_from_prompt(prd_analysis['main_goal'])
    
    def _analyze_prompt(self, prompt: str) -> Dict[str, Any]:
        """Analyze prompt to extract key information for requirements generation."""
        analysis = {
            'main_goal': prompt,
            'domain': self._detect_domain(prompt),
            'user_types': self._extract_user_types(prompt),
            'actions': self._extract_actions(prompt),
            'objects': self._extract_objects(prompt),
            'quality_attributes': self._infer_quality_attributes(prompt)
        }
        
        # Add domain-specific considerations
        analysis['domain_specific'] = self._get_domain_specific_requirements(analysis['domain'])
        
        return analysis
    
    def _detect_domain(self, prompt: str) -> str:
        """Detect the application domain from the prompt."""
        domains = {
            'data_processing': ['data', 'process', 'analyze', 'transform', 'clean', 'pipeline'],
            'content_generation': ['content', 'generate', 'create', 'write', 'produce'],
            'api_integration': ['api', 'integrate', 'connect', 'sync', 'endpoint'],
            'user_interface': ['ui', 'interface', 'dashboard', 'form', 'display'],
            'e_commerce': ['product', 'cart', 'order', 'payment', 'review'],
            'workflow': ['workflow', 'process', 'automation', 'task', 'approval']
        }
        
        prompt_lower = prompt.lower()
        for domain, keywords in domains.items():
            if any(keyword in prompt_lower for keyword in keywords):
                return domain
        
        return 'general'
    
    def _extract_user_types(self, prompt: str) -> List[str]:
        """Extract potential user types from the prompt."""
        # Basic user type detection - can be enhanced with NLP
        user_patterns = [
            r'\\b(admin|administrator)s?\\b',
            r'\\b(user|customer|client)s?\\b',
            r'\\b(manager|supervisor)s?\\b',
            r'\\b(developer|programmer)s?\\b',
            r'\\b(analyst|researcher)s?\\b'
        ]
        
        users = set()
        for pattern in user_patterns:
            matches = re.findall(pattern, prompt, re.IGNORECASE)
            users.update(matches)
        
        if not users:
            users.add('user')  # Default user type
            
        return list(users)
    
    def _extract_actions(self, prompt: str) -> List[str]:
        """Extract actions/verbs from the prompt."""
        action_patterns = [
            r'\\b(add|create|build|implement)\\b',
            r'\\b(update|modify|change|edit)\\b',
            r'\\b(delete|remove|eliminate)\\b',
            r'\\b(view|display|show|list)\\b',
            r'\\b(search|find|filter|sort)\\b',
            r'\\b(process|analyze|transform)\\b'
        ]
        
        actions = set()
        for pattern in action_patterns:
            matches = re.findall(pattern, prompt, re.IGNORECASE)
            actions.update(matches)
            
        return list(actions)
    
    def _extract_objects(self, prompt: str) -> List[str]:
        """Extract objects/nouns from the prompt."""
        # Simple noun extraction - can be enhanced with NLP
        object_patterns = [
            r'\\b(system|application|platform)\\b',
            r'\\b(data|information|content)\\b',
            r'\\b(user|customer|client)\\b',
            r'\\b(product|item|resource)\\b',
            r'\\b(report|document|file)\\b'
        ]
        
        objects = set()
        for pattern in object_patterns:
            matches = re.findall(pattern, prompt, re.IGNORECASE)
            objects.update(matches)
            
        return list(objects)
    
    def _infer_quality_attributes(self, prompt: str) -> List[str]:
        """Infer quality attributes (NFRs) from the prompt."""
        quality_indicators = {
            'performance': ['fast', 'quick', 'real-time', 'efficient'],
            'security': ['secure', 'safe', 'protected', 'encrypted'],
            'usability': ['easy', 'simple', 'intuitive', 'user-friendly'],
            'reliability': ['reliable', 'stable', 'consistent', 'available'],
            'scalability': ['scale', 'growth', 'volume', 'concurrent']
        }
        
        prompt_lower = prompt.lower()
        attributes = []
        
        for attribute, indicators in quality_indicators.items():
            if any(indicator in prompt_lower for indicator in indicators):
                attributes.append(attribute)
        
        # Add default quality attributes
        if not attributes:
            attributes = ['performance', 'usability', 'reliability']
            
        return attributes
    
    def _get_domain_specific_requirements(self, domain: str) -> Dict[str, Any]:
        """Get domain-specific requirement patterns."""
        domain_requirements = {
            'data_processing': {
                'quality_attributes': ['accuracy', 'performance', 'scalability'],
                'typical_components': ['Data Ingestion', 'Data Validation', 'Data Processing', 'Output Generation'],
                'technical_considerations': ['data quality', 'error handling', 'memory usage']
            },
            'content_generation': {
                'quality_attributes': ['quality', 'consistency', 'cost_efficiency'],
                'typical_components': ['Content Planning', 'Generation Engine', 'Quality Assurance', 'Publishing'],
                'technical_considerations': ['API costs', 'content quality', 'brand compliance']
            },
            'api_integration': {
                'quality_attributes': ['reliability', 'security', 'performance'],
                'typical_components': ['Authentication', 'Data Mapping', 'Request Processing', 'Error Handling'],
                'technical_considerations': ['rate limiting', 'error recovery', 'data consistency']
            }
        }
        
        return domain_requirements.get(domain, {
            'quality_attributes': ['performance', 'usability', 'reliability'],
            'typical_components': ['Input Processing', 'Core Logic', 'Output Generation'],
            'technical_considerations': ['error handling', 'performance', 'maintainability']
        })
    
    def _generate_business_requirements(self, analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate EARS-formatted business requirements."""
        requirements = []
        
        # Primary business requirement
        req1 = {
            'id': 'BR1',
            'title': 'Primary Business Goal',
            'ears_format': f"WHEN a user needs to {analysis['main_goal'].lower()} THE SYSTEM SHALL provide the functionality within acceptable time limits SO THAT users can accomplish their goals efficiently",
            'business_value': f"Enable users to {analysis['main_goal'].lower()} without manual effort",
            'metrics': "Processing time < 30 seconds, Success rate > 95%",
            'priority': 'High'
        }
        requirements.append(req1)
        
        # Quality-based requirements
        for qa in analysis['quality_attributes']:
            req = {
                'id': f'BR{len(requirements) + 1}',
                'title': f'{qa.title()} Requirement',
                'ears_format': f"THE SYSTEM SHALL maintain {qa} standards WHEN processing user requests SO THAT user experience meets quality expectations",
                'business_value': f"Ensure {qa} meets user expectations",
                'metrics': f"{qa} metrics within defined thresholds",
                'priority': 'Medium'
            }
            requirements.append(req)
        
        return requirements
    
    def _generate_user_stories(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate user stories with acceptance criteria."""
        stories = []
        
        # Primary user story
        primary_user = analysis['user_types'][0] if analysis['user_types'] else 'user'
        main_action = analysis['actions'][0] if analysis['actions'] else 'use'
        main_object = analysis['objects'][0] if analysis['objects'] else 'system'
        
        story1 = {
            'epic': '1',
            'story_id': '1.1',
            'title': f'Primary {main_action.title()} Functionality',
            'as_a': primary_user,
            'i_want': f"to {main_action} {main_object}",
            'so_that': f"I can accomplish my goals efficiently",
            'acceptance_criteria': [
                f"GIVEN valid input WHEN I {main_action} {main_object} THEN the system processes successfully",
                f"GIVEN invalid input WHEN I {main_action} {main_object} THEN I receive clear error messages",
                f"GIVEN normal conditions WHEN I {main_action} {main_object} THEN response time is acceptable"
            ],
            'definition_of_done': [
                "Functional implementation complete",
                "Unit tests written and passing",
                "Integration tests written and passing",
                "Documentation updated",
                "Performance requirements met",
                "Accessibility requirements met"
            ]
        }
        stories.append(story1)
        
        # Additional stories based on extracted actions
        for i, action in enumerate(analysis['actions'][1:], 2):
            story = {
                'epic': '1',
                'story_id': f'1.{i}',
                'title': f'{action.title()} Functionality',
                'as_a': primary_user,
                'i_want': f"to {action} items in the system",
                'so_that': f"I can manage my work effectively",
                'acceptance_criteria': [
                    f"GIVEN appropriate permissions WHEN I {action} an item THEN the action completes successfully",
                    f"GIVEN validation errors WHEN I {action} an item THEN I receive helpful feedback"
                ],
                'definition_of_done': [
                    "Feature implemented and tested",
                    "Error handling implemented",
                    "Documentation updated"
                ]
            }
            stories.append(story)
        
        return stories
    
    def _generate_technical_requirements(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate technical requirements based on analysis."""
        tech_reqs = []
        
        # Performance requirements
        perf_req = {
            'id': 'TR1',
            'title': 'Performance Requirements',
            'ears_format': f"THE SYSTEM SHALL respond within 30 seconds WHEN processing typical user requests",
            'details': {
                'response_time': '< 30 seconds for 95% of requests',
                'throughput': '> 100 requests per hour',
                'concurrent_users': '10 simultaneous users',
                'resource_usage': 'Memory < 2GB, CPU < 80%'
            }
        }
        tech_reqs.append(perf_req)
        
        # Security requirements (if applicable)
        if 'security' in analysis['quality_attributes']:
            sec_req = {
                'id': 'TR2',
                'title': 'Security Requirements',
                'ears_format': f"THE SYSTEM SHALL validate all inputs TO PREVENT security vulnerabilities",
                'details': {
                    'authentication': 'User authentication required',
                    'authorization': 'Role-based access control',
                    'data_protection': 'Sensitive data encrypted',
                    'audit_trail': 'All actions logged'
                }
            }
            tech_reqs.append(sec_req)
        
        # Reliability requirements
        rel_req = {
            'id': f'TR{len(tech_reqs) + 1}',
            'title': 'Reliability Requirements',
            'ears_format': f"THE SYSTEM SHALL handle errors gracefully UNDER normal operating conditions",
            'details': {
                'availability': '99% uptime during business hours',
                'error_handling': 'Graceful degradation for failures',
                'data_integrity': 'Data consistency maintained',
                'fault_tolerance': 'System continues with partial failures'
            }
        }
        tech_reqs.append(rel_req)
        
        return tech_reqs
    
    def _analyze_prd(self, prd_content: str) -> Dict[str, Any]:
        """Extract key information from PRD content."""
        # Extract vision/goal from PRD
        vision_match = re.search(r'##[^#]*Vision[^#]*\\n([^#]*)', prd_content, re.IGNORECASE | re.DOTALL)
        vision = vision_match.group(1).strip() if vision_match else ""
        
        # Extract component information
        component_matches = re.findall(r'Component \\d+:([^\\n]*)', prd_content)
        
        return {
            'main_goal': vision or "Implement the system described in the PRD",
            'components': component_matches,
            'domain': self._detect_domain(prd_content)
        }
    
    def _load_template(self) -> str:
        """Load the requirements template."""
        try:
            with open(self.template_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"Requirements template not found: {self.template_path}")
    
    def _populate_template(self, template: str, business_reqs: List[Dict], user_stories: List[Dict], 
                          tech_reqs: List[Dict], analysis: Dict[str, Any]) -> str:
        """Populate template with generated content."""
        # Basic template substitutions
        content = template.replace('[PROJECT_NAME]', self.config['project']['name'])
        content = content.replace('[DATE]', datetime.now().strftime('%Y-%m-%d'))
        content = content.replace('[COMPONENT_COUNT]', str(self.config['project']['component_count']))
        
        # Replace business requirements section
        br_section = self._format_business_requirements(business_reqs)
        content = re.sub(r'### BR1:.*?\\*\\[CUSTOMIZE.*?\\*', br_section, content, flags=re.DOTALL)
        
        # Replace user stories section
        us_section = self._format_user_stories(user_stories)
        content = re.sub(r'### Epic 1:.*?\\*\\[CUSTOMIZE.*?\\*', us_section, content, flags=re.DOTALL)
        
        # Replace technical requirements
        tr_section = self._format_technical_requirements(tech_reqs)
        content = re.sub(r'### TR1:.*?### TR4:', tr_section + '\\n\\n### TR4:', content, flags=re.DOTALL)
        
        # Add domain-specific component suggestions
        if 'domain_specific' in analysis and 'typical_components' in analysis['domain_specific']:
            components_section = self._format_component_pipeline(analysis['domain_specific']['typical_components'])
            content = re.sub(r'### Component 1:.*?\\*\\[CUSTOMIZE.*?\\*', components_section, content, flags=re.DOTALL)
        
        return content
    
    def _format_business_requirements(self, requirements: List[Dict]) -> str:
        """Format business requirements section."""
        sections = []
        for req in requirements:
            section = f"""### {req['id']}: {req['title']}
**EARS Format**: {req['ears_format']}

- **Business Value**: {req['business_value']}
- **Success Metrics**: {req['metrics']}
- **Priority**: {req['priority']}"""
            sections.append(section)
        
        return '\\n\\n'.join(sections)
    
    def _format_user_stories(self, stories: List[Dict]) -> str:
        """Format user stories section."""
        sections = []
        current_epic = None
        
        for story in stories:
            if story['epic'] != current_epic:
                sections.append(f"### Epic {story['epic']}: Primary User Journey")
                current_epic = story['epic']
            
            criteria = '\\n'.join([f"- [ ] {criterion}" for criterion in story['acceptance_criteria']])
            dod = '\\n'.join([f"- [ ] {item}" for item in story['definition_of_done']])
            
            section = f"""#### User Story {story['story_id']}: {story['title']}
**As a** {story['as_a']}  
**I want** {story['i_want']}  
**So that** {story['so_that']}

**Acceptance Criteria**:
{criteria}

**Definition of Done**:
{dod}"""
            sections.append(section)
        
        return '\\n\\n'.join(sections)
    
    def _format_technical_requirements(self, tech_reqs: List[Dict]) -> str:
        """Format technical requirements section."""
        sections = []
        for req in tech_reqs:
            details = '\\n'.join([f"- **{key.replace('_', ' ').title()}**: {value}" 
                                 for key, value in req['details'].items()])
            
            section = f"""### {req['id']}: {req['title']}
**EARS Format**: {req['ears_format']}

{details}"""
            sections.append(section)
        
        return '\\n\\n'.join(sections)
    
    def _format_component_pipeline(self, components: List[str]) -> str:
        """Format component pipeline section."""
        sections = []
        for i, component in enumerate(components, 1):
            section = f"""### Component {i}: {component}
**Purpose**: {component} functionality  
**Input**: {"User input" if i == 1 else f"Output from Component {i-1}"}  
**Output**: {"Final output" if i == len(components) else f"Input for Component {i+1}"}

**Functional Requirements**:
- **FR{i}.1**: WHEN {component.lower()} receives input THE COMPONENT SHALL process it correctly PRODUCING valid output
- **FR{i}.2**: IF processing errors occur THE COMPONENT SHALL handle them gracefully
- **FR{i}.3**: THE COMPONENT SHALL validate output quality before passing to next stage

**Non-Functional Requirements**:
- **Performance**: Processing completed within acceptable time limits
- **Quality**: Output meets quality standards for next component
- **Integration**: Clean interface with pipeline components"""
            sections.append(section)
        
        return '\\n\\n'.join(sections)
    
    def save_requirements(self, content: str, output_path: str = None) -> str:
        """Save generated requirements to file."""
        if output_path is None:
            output_path = self.output_path
            
        # Ensure output directory exists
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            f.write(content)
            
        return output_path


def main():
    """Main function for command line usage."""
    parser = argparse.ArgumentParser(description='Generate detailed requirements from prompts or PRD')
    parser.add_argument('--prompt', type=str, help='High-level prompt to expand into requirements')
    parser.add_argument('--from-prd', type=str, help='Path to PRD file to extract requirements from')
    parser.add_argument('--output', type=str, help='Output file path (default: docs/specifications/requirements.md)')
    parser.add_argument('--config', type=str, default='config/project-config.json', 
                       help='Path to project configuration file')
    
    args = parser.parse_args()
    
    if not args.prompt and not args.from_prd:
        print("Error: Either --prompt or --from-prd must be provided")
        sys.exit(1)
    
    try:
        generator = RequirementsGenerator(args.config)
        
        if args.prompt:
            content = generator.generate_from_prompt(args.prompt)
        else:
            content = generator.generate_from_prd(args.from_prd)
        
        output_path = generator.save_requirements(content, args.output)
        print(f"Requirements generated successfully: {output_path}")
        
    except Exception as e:
        print(f"Error generating requirements: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()