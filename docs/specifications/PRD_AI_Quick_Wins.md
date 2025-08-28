# Interactive GTM Blueprint AI Quick Wins - Product Requirements Document

**Version**: 1.0  
**Last Updated**: 2025-01-27  
**Development Philosophy**: High-impact, low-effort AI features that transform the tool into an intelligent partner

## 1. Objective

To enhance the Interactive GTM Blueprint SPA by integrating three high-impact, low-effort AI features that provide real-time strategic feedback to the user, turning the tool into an intelligent partner.

## 2. User Goals

**UG-1**: Overcome creative blocks when naming a new market category.

**UG-2**: Get instant, objective feedback on the strength and coherence of their value propositions.

**UG-3**: Quickly generate strategic talking points to use against known competitors.

## 3. Feature Specifications

### F-1: AI Category Name Brainstormer

**Description**: A button within the "Category Name" section that, when clicked, uses the project's core strategic inputs (ICP, value props, From/To shift) to generate a list of 8-10 potential category names.

**UI**: The generated names will appear as a clickable list, allowing the user to select one to populate the input field.

**Acceptance Criteria**:
- A button "Brainstorm with AI" exists in Section 10
- Clicking the button triggers an AI call
- A list of at least 5 relevant names is displayed to the user
- Clicking a name populates the input field

### F-2: Value Proposition Grader

**Description**: A button next to each "Value and Proof" trio that analyzes the logical flow and impact of the user's Attribute, Benefit, and Value statements.

**UI**: The feature will return a score (1-10) and 2-3 bullet points of constructive feedback, displayed inline next to the proposition being graded.

**Acceptance Criteria**:
- A "Grade Proposition" button exists for each value trio in Section 4
- Clicking it triggers an AI call with the correct context
- A score and actionable feedback are displayed in the UI

### F-3: Competitive Weakness Analysis

**Description**: A button next to each "Competitive Alternative" that expands on the user's stated weakness of that competitor.

**UI**: The AI will generate 3-4 strategic angles or talking points, which will be displayed in a modal or an expandable section.

**Acceptance Criteria**:
- An "Analyze Weakness" button exists for each competitor in Section 2
- Clicking it triggers an AI call
- A list of at least 3 distinct strategic angles is displayed to the user

### F-4: AI-Assisted JTBD Structuring (Bottom-Up Breadcrumb Approach)

**Description**: An AI-powered assistant that applies the "bottom-up breadcrumb approach" from the master GTM prompt (see `docs/specifications/prompt_segment_positioning.md`) to transform free-form text into structured JTBD analysis. The AI identifies "breadcrumbs" - signals pointing to underlying Jobs to be Done, value measurement, and willingness to pay - then clusters them into the 8 formal JTBD elements.

**UI**: 
- An "Analyze JTBD" button next to the "Common Needs" textarea in Section 1
- Modal window displays user's original text alongside 8 input fields for JTBD elements:
  - Context (When does this job arise?)
  - Struggling Moments (What triggers action?)
  - Desired Outcomes (What does success look like?)
  - Current Solutions (What are they using now?)
  - Constraints (What limitations exist?)
  - Success Criteria (How is progress measured?)
  - Emotional Drivers (What feelings are involved?)
  - Social Dimensions (Who else is affected?)
- AI pre-populates fields using breadcrumb analysis methodology
- "Save Structured JTBD" button updates the main field

**Acceptance Criteria**:
- "Analyze JTBD" button exists for the Common Needs textarea
- Clicking triggers AI analysis using breadcrumb methodology
- Modal displays all 8 JTBD elements with editable fields
- AI successfully identifies and clusters breadcrumbs into structured fields
- User can edit AI suggestions before saving
- Saved content properly formats and updates original field with clear JTBD structure

### F-5: Uniqueness Attribute Validation (Expert Mindset Integration)

**Description**: Advanced validation combining the strategic mindsets of positioning expert April Dunford and monetization expert Madhavan Ramanujam. Performs targeted web search to determine if user's "Attribute" claims are genuinely novel, while analyzing competitive context through Dunford's positioning lens and value measurement through Ramanujam's willingness-to-pay framework.

**UI**:
- "Analyze Uniqueness" button next to each Attribute field in Section 4
- Loading state shows "Analyzing market positioning..."
- Results display:
  - Uniqueness score: "Highly Unique," "Moderately Unique," or "Common Claim"
  - Positioning context: How this attribute fits in competitive landscape
  - Value measurement insight: Customer metrics likely to drive willingness to pay
  - Summary includes links to top 2-3 competing pages found
- Inline display below each attribute field

**Acceptance Criteria**:
- "Analyze Uniqueness" button exists for each Attribute
- Clicking triggers web search API call with attribute text
- System displays uniqueness rating with positioning context
- Results include competitive analysis through Dunford framework
- Value measurement insights align with Ramanujam principles
- Results include at least one relevant external link if competing claims found
- Graceful error handling if web search fails

**Technical Note**: Requires web search API integration (Brave Search or similar) with GTM expert prompt templates

### F-6: Trend Validation (Strategic Synthesis Framework)

**Description**: AI-powered validation that combines Bob Moesta's customer theory approach with Michael Porter's strategic analysis to validate industry trends. Performs web search to find recent evidence while analyzing trends through the lens of customer "struggling moments" and competitive forces that drive market evolution.

**UI**:
- "Analyze Trend" button next to each of four Industry Trend textareas in Section 7
- Loading indicator shows "Analyzing market forces..."
- Returns 2-3 bullet points with supporting evidence including:
  - Customer struggle validation: Evidence of customer pain driving this trend
  - Competitive force analysis: How this trend affects industry structure
  - Supporting data with direct source links
- Results appear inline below each trend field

**Acceptance Criteria**:
- "Analyze Trend" button exists for each trend field
- Clicking triggers targeted web search with strategic analysis framework
- UI displays at least 2 pieces of supporting evidence
- Evidence includes customer struggle and competitive force context
- Each evidence item includes direct source link
- Results are recent and relevant (within last 12 months preferred)
- Analysis connects trends to underlying customer jobs and market dynamics

**Technical Note**: Requires web search API integration (Brave Search or similar) with strategic synthesis prompt templates

## 4. Success Metrics

### Phase 1 (F-1, F-2, F-3) - Initial AI Quick Wins

- All three initial features are successfully implemented
- The UI for each feature is functional and intuitive
- The brand-guardian agent confirms all new UI text and styling is compliant
- The validation-specialist agent confirms that the implementation does not break existing functionality

### Phase 2 (F-4, F-5, F-6) - Advanced AI Intelligence

- F-4 JTBD Structuring successfully parses and structures free-form text
- F-5 and F-6 successfully integrate web search API capabilities
- All new features maintain Scale brand compliance
- No performance degradation from web search integrations
- Graceful error handling when external APIs are unavailable

## 5. Technical Complexity Notes

### Effort Classification

- **Low Effort**: F-1, F-2, F-3 (simulated AI, no external dependencies)
- **Medium Effort**: F-4 (complex UI with modal, but no external APIs)
- **High Effort**: F-5, F-6 (require web search API integration and intelligent parsing)

### Implementation Phases

- **Phase 1**: F-1, F-2, F-3 (can be implemented immediately with simulated AI)
- **Phase 2**: F-4 (requires modal system development)
- **Phase 3**: F-5, F-6 (requires web search API setup and integration)
