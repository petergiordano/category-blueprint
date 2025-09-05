# Interactive GTM Blueprint AI Quick Wins - Product Requirements Document

**Version**: 1.0  
**Last Updated**: 2025-08-28
**Development Philosophy**: High-impact, low-effort AI features that transform the tool into an intelligent partner

## 1. Objective

To enhance the Interactive GTM Blueprint SPA by integrating a series of high-impact, low-effort AI features that provide real-time strategic feedback to the user, turning the tool into an intelligent partner.

## 2. User Goals

**UG-1**: Overcome creative blocks when naming a new market category.

**UG-2**: Get instant, objective feedback on the strength and coherence of their value propositions.

**UG-3**: Quickly generate strategic talking points to use against known competitors.

**UG-4**: Reduce the friction and cognitive load of organizing granular features into high-level strategic themes.

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

**Description**: An AI-powered assistant that applies the "bottom-up breadcrumb approach" from the master GTM prompt to transform free-form text into structured JTBD analysis.

**UI**: 
- An "Analyze JTBD" button next to the "Common Needs" textarea in Section 1
- Modal window displays user's original text alongside 8 input fields for JTBD elements.

**Acceptance Criteria**:
- "Analyze JTBD" button exists for the Common Needs textarea
- Clicking triggers AI analysis using breadcrumb methodology
- Modal displays all 8 JTBD elements with editable fields
- AI successfully identifies and clusters breadcrumbs into structured fields

### F-5: Uniqueness Attribute Validation (Expert Mindset Integration)

**Description**: Advanced validation that performs a targeted web search to determine if a user's "Attribute" claims are genuinely novel.

**UI**:
- "Analyze Uniqueness" button next to each Attribute field in Section 4
- Results display a uniqueness score and links to competing pages.

**Acceptance Criteria**:
- "Analyze Uniqueness" button exists for each Attribute
- Clicking triggers web search API call with attribute text
- System displays uniqueness rating with competitive context.

### F-6: Trend Validation (Strategic Synthesis Framework)

**Description**: AI-powered validation that performs a web search to find recent, credible evidence for a user-defined market trend.

**UI**:
- "Analyze Trend" button next to each of four Industry Trend textareas in Section 7
- Returns 2-3 bullet points with supporting evidence and source links.

**Acceptance Criteria**:
- "Analyze Trend" button exists for each trend field
- Clicking triggers targeted web search
- UI displays at least 2 pieces of supporting evidence with source links.

### F-8: AI-Powered Pillar Generation (Glass Box)

- **Description:** This feature removes the friction of manually creating strategic pillars. It uses AI to analyze all of the user's value propositions, clusters them into logical themes, and proposes 2-3 high-level pillars. The process is transparent and collaborative, showing the user the AI's rationale and allowing for refinement.
- **UI Changes:**
    - A **"Generate Strategic Pillars"** button will be added to Section 5.
    - Clicking this button opens a **"Rationale & Refine" modal**.
    - The modal displays each suggested pillar with:
        1.  A one-sentence **rationale** explaining why the pillar was created.
        2.  A read-only list of the **supporting value props** that were grouped under it.
    - Each suggested pillar in the modal has two options:
        1.  **"Accept & Edit" Button:** Accepts the pillar and allows minor edits in the main UI.
        2.  **"Refine with AI" Input Field:** Allows the user to chat with the AI to adjust the pillar's name or theme.
- **Acceptance Criteria:**
    - A "Generate Strategic Pillars" button exists in Section 5.
    - Clicking it opens a modal displaying AI-suggested pillars.
    - Each suggestion in the modal includes a rationale and a list of supporting attributes.
    - The user can accept the suggestions as-is.
    - The user can provide text feedback to refine a suggestion, and the AI updates the pillar accordingly.
    - The final, approved pillars and their value prop assignments are correctly populated in the main UI.

## 4. Success Metrics

- All features (F-1 through F-6, and F-8) are successfully implemented.
- The UI for each feature is functional and intuitive.
- The brand-guardian agent confirms all new UI text and styling is compliant.
- The validation-specialist agent confirms that the implementation does not break existing functionality.

## 5. Technical Complexity Notes

### Effort Classification

- **Low Effort**: F-1, F-2, F-3 (simulated AI)
- **Medium Effort**: F-4 (complex UI, no external APIs)
- **High Effort**: F-5, F-6 (web search API integration)
- **High Effort**: F-8 (thematic analysis, modal UI, chat-like interaction)

### Implementation Phases

- **Phase 1**: F-1, F-2, F-3 (Complete)
- **Phase 2**: F-4, F-5, F-6 (Complete)
- **Phase 3**: F-8 (Value Prop Hierarchy & AI Generation)