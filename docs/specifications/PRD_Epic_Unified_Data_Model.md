# Master PRD: Unified Data Model Epic

**Version:** 1.0
**Date:** 2025-09-23
**Status:** Approved for Implementation
**Epic Branch:** `epic/unified-data-model`

## 1. Objective
To solve the "lossy compression" or "orphaned narrative" problem within the application. This epic will re-architect the application's data model to preserve and integrate the rich, strategic context from the narrative deep research report alongside the structured data. This ensures the "so what" behind the data is accessible to the user at all times and across all user journeys.

## 2. Core Strategic Principles
* **Data Integrity:** The narrative report and the structured data will be treated as a single, unified "Blueprint File." They will be generated together, imported together, and exported together.
* **Contextual Accessibility:** Users must have a simple, in-context way to access the deep-dive narrative that informed the structured data in any given section of the application.
* **Workflow Compatibility:** The new data model must be supported across all user journeys: initial AI processing, direct JSON import, and session export.

## 3. The New "Blueprint File" Data Structure
The application's core data object, currently a single JSON file, will be updated to a new "Unified Data Model." This model will be a JSON object with two top-level keys:

```json
{
  "structuredData": {
    "companyContext": {
      "companyName": "...",
      "productName": "...",
      "industry": "...",
      "competitors": "..."
    },
    "segmentData": {
      "Context": "...",
      "Struggling Moments": "...",
      "...(all 19 elements)": "..."
    },
    "icpData": { "...(all ICP elements)": "..." },
    "positioningData": { "...(all Positioning elements)": "..." },
    "categoryData": { "...(all Category Design elements)": "..." }
  },
  "narrativeReport": {
    "part1_segmentFoundation": "The full narrative text for the Segment Foundation...",
    "part2_icpAndPersonas": "The full narrative text for the ICP & Personas...",
    "part3_positioning": "The full narrative text for the Positioning...",
    "part4_categoryDesign": "The full narrative text for the Category Design..."
  }
}
4. Phased Implementation Plan
This epic will be executed via a series of discrete, SLC-compliant tasks.

* **`DATA-TASK-001: Implement Enhanced AI Processing Logic`**
    * **Description:** Modify the in-app AI processing functionality. When a user uploads a narrative research report, the AI must perform a deep analysis to generate a JSON object in the new "Unified Data Model" format.
    * **Implementation Details:** The AI's processing task is now twofold:
        1.  **Populate `structuredData` with Enhanced Analysis:** For each element (e.g., "Struggling Moments"), the AI must extract the synthesized finding and its supporting evidence. For each piece of evidence (especially quotes), it must also provide a `sentiment` tag (`Positive`, `Negative`, `Neutral`). For each synthesized finding, it must provide a `confidenceScore` (`High`, `Medium`, `Low`).
        2.  **Populate `narrativeReport` with Summaries:** For each of the four main parts, the AI must extract the full narrative text. It must also generate a new, one-sentence `keyInsight` summary for that section.
    * **Acceptance Criteria:** The generated JSON file contains the new `sentiment` and `confidenceScore` fields within the `structuredData` object, and the new `keyInsight` field within the `narrativeReport` object.


DATA-TASK-002: Update Import/Export Functionality: Refactor the "Import Blueprint" and "Export Blueprint" functions. The export function must now save the entire app state in the new unified format. The import function must be able to read the new format and correctly populate both the app's data fields (structuredData) and the state for the new insights panel (narrativeReport).

DATA-FEAT-001: Implement "AI Analysis Insights Panel": Implement the user-facing feature. 

Here is the background for the feature:
1. Sentiment Analysis on Evidence

When the AI extracts a customer quote or review as evidence, we can require it to also perform sentiment analysis and tag the evidence as Positive, Negative, or Neutral. This adds an immediate layer of qualitative data to the JSON.

2. Confidence Scoring for Findings

We can instruct the AI to assign a Confidence Score (High, Medium, Low) to its synthesized finding for each element. This score would be based on the quantity and quality of the public sources it found. A finding backed by multiple analyst reports and case studies would be "High," while one inferred from a single forum post would be "Low."

3. Source Triangulation

The AI can be tasked with identifying and flagging key findings that are supported by multiple types of sources (e.g., a finding supported by a customer review, a company blog post, and a news article). This highlights the most robust and verifiable insights.

4. Automated Insight Generation

In addition to populating the fields, we can have the AI generate a one-sentence "Key Insight" summary for each of the four main parts of the report. This would be a new piece of data stored in the narrativeReport section of our JSON, providing an at-a-glance summary for each panel.

This task includes:

Creating a new, reusable React component named InsightsPanel.

Adding a "View Full AI Analysis" button to the header of each of the four main tool components (SegmentFoundationTool, ICPDefinitionTool, etc.).

Wiring up the button's onClick handler to open the InsightsPanel and display the correct narrative text for the current section from the appState.

5. Acceptance Criteria
Processing a narrative report generates a JSON file with both structuredData and narrativeReport keys.

Exporting a session from the app generates a JSON file in the new unified format.

Importing a "Blueprint File" in the new format correctly populates all application fields AND makes the narrative text available.

The "View Full AI Analysis" button is present and functional in all four main parts of the app.

Clicking the button opens a panel and displays the correct narrative text for that section.

---

