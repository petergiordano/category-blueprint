# AI Quick Wins Implementation Task List

**Based on**: docs/PRD_AI_Quick_Wins.md  
**Generated**: 2025-01-27  
**Updated**: 2025-08-28
**Status**: Phase 1 & 2 Complete, Phase 3 Ready for implementation

## Overview

This task list covers the implementation of all AI features for the Interactive GTM Blueprint SPA:

### Phase 1 - Initial AI Quick Wins (Complete)
- **F-1**: AI Category Name Brainstormer
- **F-2**: Value Proposition Grader
- **F-3**: Competitive Weakness Analysis

### Phase 2 - Advanced AI Intelligence (Complete)
- **F-4**: AI-Assisted JTBD Structuring
- **F-5**: Uniqueness Attribute Validation
- **F-6**: Trend Validation

### Phase 3 - Strategic Pillar Implementation (New)
- **F-8**: AI-Powered Pillar Generation (Glass Box)

## Feature F-1: AI Category Name Brainstormer

...

## Feature F-6: Trend Validation

...

## Feature F-8: AI-Powered Pillar Generation (Glass Box)

### AI Backend Logic
- [ ] Create a new AI service function `generatePillarsFromValueProps`.
- [ ] This function should take an array of all "Value and Proof" trios as input.
- [ ] Implement logic to perform thematic analysis/clustering on the input value props.
- [ ] The AI prompt should instruct the model to identify 2-3 distinct themes and create a pillar for each.
- [ ] For each pillar, the AI must return:
    - A short, compelling `pillarName`.
    - A one-sentence `benefitStatement` that summarizes the theme.
    - A `rationale` explaining why the pillar was created, referencing the common themes it identified.
    - An array of `supportingAttributeIds`, containing the indices of the value props that belong to this cluster.

### Modal UI Component Scaffolding
- [ ] Create a new reusable modal component: `PillarGenerationModal`.
- [ ] Add a "Generate Strategic Pillars" button to Section 5.
- [ ] On click, this button should trigger the AI analysis and show the modal.
- [ ] The modal should display a loading state while the AI is processing.
- [ ] Once results are available, the modal should list each AI-suggested pillar.

### Pillar Suggestion Display
- [ ] For each suggested pillar, display the `pillarName` and `benefitStatement`.
- [ ] Display the AI-generated `rationale` clearly for the user.
- [ ] Below the rationale, list the `supportingAttributeIds` (i.e., the text of the value props) so the user can see the evidence.

### Interactive Refinement UI
- [ ] For each pillar suggestion, add an "Accept & Edit" button.
- [ ] Add a "Refine with AI" text input field and a corresponding "Update" button.
- [ ] Implement the frontend logic for the refinement loop:
    - When a user types in the "Refine" field and clicks "Update", send a new AI call.
    - The new call should include the original value props AND the user's refinement text.
    - The AI should regenerate only the specific pillar based on the new instructions.
    - The modal UI should update that one pillar with the new suggestion.

### State Management & Integration
- [ ] When the user clicks "Accept & Edit", the pillar should be added to the main application state.
- [ ] The `pillarId` for all supporting value props should be automatically updated in the state.
- [ ] The main UI (Section 3 and Section 5) should dynamically re-render to show the new pillar and the updated value prop groupings.

### Validation and Testing
- [ ] Test the end-to-end flow: clicking generate, viewing the modal, and accepting the pillars.
- [ ] Test the refinement loop: ensure that providing feedback updates a single pillar correctly.
- [ ] Verify that accepting the pillars correctly populates the main UI and updates all state.
- [ ] Test edge cases: What happens if there are no value props? What if there is only one?

## Cross-Feature Integration

...