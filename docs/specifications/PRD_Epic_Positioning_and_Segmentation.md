# Master PRD: Positioning & Segmentation Epic

| Version | Date       | Author        | Changes                                                                    |
|---------|------------|---------------|----------------------------------------------------------------------------|
| 1.0     | 2025-09-03 | Gemini/Pete   | Initial draft of the four-phase roadmap.                                   |
| 1.1     | 2025-09-03 | Gemini/Pete   | Added SEG-FEAT-003 ("Golden Thread") specification.                        |
| 1.2     | 2025-09-03 | Gemini/Pete   | Replaced `SEG-FEAT-003` with a generative AI workflow (`SEG-FEAT-004` to `006`). |
| 1.3     | 2025-09-03 | Gemini/Pete   | Inserted NAV-FIX-001 and ICP-REFACTOR-001 to address UX/UI issues.        |
| 1.4     | 2025-09-03 | Gemini/Pete   | Completed NAV-FIX-001, SEG-FEAT-006, and added SEG-FEAT-007.             |
| 1.5     | 2025-09-03 | Gemini/Pete   | Added ICP-VIS-001 feature definition.                                    |
| 1.6     | 2025-09-03 | Gemini/Pete   | Completed SEG-FEAT-007 and UX fix for Part 2 placeholder text.           |
| 1.7     | 2025-09-03 | Gemini/Pete   | Completed SEG-TASK-001 and SEG-FEAT-001.                                 |
| 1.8     | 2025-09-04 | Claude/Pete   | Completed ICP-REFACTOR-001 - removed redundant fields and added segment summary to Part 2. |
| 1.9     | 2025-09-04 | Claude/Pete   | Added Phase 4 specifications for Company Context Setup (CC-FEAT-001) and JTBD Validation (VAL-FEAT-001). |
| 2.0     | 2025-09-04 | Claude/Pete   | Added detailed specifications for CC-FEAT-001 and VAL-FEAT-001 with complete implementation details. |
| 2.1     | 2025-09-04 | Claude/Pete   | Reorganized phases for logical implementation flow - CC-FEAT-001 moved to Phase 4, VAL-FEAT-001 to Phase 5. |

**Version:** 2.1
**Date:** 2025-09-04
**Status:** Approved for Implementation

## 1. Objective: The "Klarity" Mandate

Our objective is to transform the GTM Blueprint application from a strategic canvas into an intelligent GTM collaborator. The goal is to build a tool that helps successful, post-product-market-fit companies uncover their latent, most powerful positioning.

We will achieve this by moving beyond a company's *stated* positioning and using AI to discover the true **Job to be Done (JTBD)** of their best customers. The core insight we are building around is the difference between "Company A" (the best customer, who uses a product for a strategic job) and "Company B" (the average customer, who may use it for a tactical job). Our tool must help users find more "Company A's".

## 2. Core Strategic Principles

This epic is governed by the following strategic decisions:

* **A. The GTM Progression Model:** The application will be re-architected to follow a simplified **Segment → ICP → Category Design** progression. The "Early Customer Profile (ECP)" concept will be omitted to reduce cognitive load for growth-stage companies.
* **B. Single Segment Focus:** For this implementation, the tool will focus on defining one primary target segment at a time to enforce strategic discipline and clarity.
* **C. SLC Framework:** All features will be developed as **Simple, Lovable, and Complete** deliverables to provide incremental value.
* **D. Feature Naming Standard:** All work will be tracked using the `[EPIC]-[TYPE]-[SEQ]` naming standard (e.g., `SEG-TASK-001`).

## 3. User Goals

* **UG-1:** As a CEO, I want to move beyond my team's gut feel and use a data-driven approach to understand our best customers.
* **UG-2:** As a GTM leader, I want to clearly see the difference in perceived value between different customer segments.
* **UG-3:** As a product marketer, I want to simulate how different value propositions will land with different ICPs to find our "Winning Zone".
* **UG-4:** As a strategist, I want to uncover the true, underlying JTBD of our target market to build a foundation for durable category leadership.

## 4. Phased Implementation Roadmap

### Phase 1: The Segment Foundation ✅ COMPLETE
* **Goal:** Provide an immediate, high-value tool for facilitated workshops.
* **`POS-FEAT-001: Standalone Positioning Simulator`**
    * **Status:** ✅ **COMPLETE**
    * **Deliverable:** The existing `positioning2x2sim.html` file, which allows for manual and AI-driven 2x2 value plotting.

### Phase 2: AI Quick Wins for Positioning ✅ COMPLETE  
* **Goal:** Re-architect the main `index.html` SPA to be Segment-first, creating the foundation for all future positioning work.
* **`SEG-TASK-001: Refactor index.html to a Three-Part Structure`**
    * **Status:** ✅ **COMPLETE**
    * **Description:** Restructure the application's navigation and components to support a `Home -> Part 1 (Segment) -> Part 2 (ICP) -> Part 3 (Category)` flow.
* **`SEG-FEAT-001: Build the "Segment Foundation" UI`**
    * **Status:** ✅ **COMPLETE**
    * **Description:** Implement the new "Part 1" component with detailed input fields for the 19 core elements of a market segment (JTBD, Customer Value, and WTP).
* **`SEG-FEAT-004: Enhance Part 1 Usability`**
    * **Status:** ✅ **COMPLETE**
    * **Description:** Add key usability features to the Segment Foundation page, including header buttons, a sticky side-nav, and improved helper text.
* **`SEG-FEAT-005: Implement AI-Powered Value Drafter`**
    * **Status:** ✅ **COMPLETE**
    * **Description:** Transform the "Customer Value" section from a manual form into an AI-powered assistant that drafts the 5 value elements based on the user's JTBD inputs.
    * **Implementation:** New `api/draft-customer-value.js` serverless function with Brave Search API integration for real-time industry intelligence.
* **`SEG-FEAT-006: Implement AI-Powered WTP Drafter`**
    * **Status:** ✅ **COMPLETE**
    * **Description:** Transform the "Willingness to Pay" section into an AI-powered assistant that drafts the 5 WTP drivers based on the user's refined Customer Value propositions.
* **`SEG-FEAT-007: Implement AI-Powered Category Drafter`**
    * **Status:** ✅ **COMPLETE**
    * **Description:** Transform the "Category Design" section into an AI-powered assistant that drafts category names and definitions based on the user's Point of View inputs.
* **`NAV-FIX-001: Correct Segment to ICP Navigation`**
    * **Status:** ✅ **COMPLETE**
    * **Description:** A high-priority bug fix to ensure the "Continue to Part 2" button navigates the user to the top of the ICP Definition page.

### Phase 3: Integrated Positioning Analysis 🚧 IN PROGRESS
* **Goal:** Transform scattered insights into cohesive positioning strategy.
* **`ICP-REFACTOR-001: Overhaul ICP Definition Page`** ✅ **COMPLETE**
    * **Description:** A strategic refactor to remove redundant ICP fields from Part 2 and replace them with a read-only summary of the data from the Segment Foundation (Part 1).
* **`ICP-VIS-001: Interactive ICP Visualizer`** 📝 **PLANNED**
    * **Description:** Visual representation mapping ICP characteristics to value propositions.

### Phase 4: Company Context Foundation
* **Goal:** Establish company context for enhanced AI capabilities.
* **`CC-FEAT-001: Company Context Setup Modal`** ✅ **COMPLETE**
    * **Description:** One-time welcome modal that captures essential company information for enhanced AI searches and validations.

### Phase 5: Market Intelligence & Validation
* **Goal:** Add market validation capabilities using real-world data.
* **`VAL-FEAT-001: JTBD Element Market Validation`** 📝 **PLANNED**
    * **Description:** Individual validation buttons for each JTBD element that perform intelligent market searches.

### Phase 6: The AI Research Engine (Future Vision)
* **Goal:** Evolve the tool into a proactive, generative research engine.
* **`RES-FEAT-001: Outside-In JTBD Discovery Agent`** 📝 **FUTURE**
    * **Description:** Automated research on target companies to generate data-driven JTBD hypotheses.

## 5. Detailed Feature Specifications

### SEG-FEAT-004: Enhance Part 1 Usability
* **Description:** This feature adds critical usability and quality-of-life improvements to the `SegmentFoundationTool` component to make it easier to navigate and use during a workshop.
* **Implementation Details:**
    * **Header Buttons:** Add the "Reset" and "Export" buttons to the sticky header, mirroring the functionality from the `ICPDefinitionTool`. The export function should be scoped to `appState.segmentData`.
    * **Sticky Navigation:** Add a new link to the top of the sticky side-nav titled "0. How Segments are Designed" that scrolls the user to the SVG graphic.
    * **Helper Text:** Update the descriptive text for the "Desired Outcomes" field in the JTBD section to: "We will refine this outcome into specific types of value in the **Customer Value** section".
* **Acceptance Criteria:**
    * The Reset/Export buttons are functional in Part 1.
    * The new "0. How Segments are Designed" link is present in the sticky nav and scrolls to the top.
    * The "Desired Outcomes" helper text is updated.

### SEG-FEAT-005: Implement AI-Powered Value Drafter
* **Status:** ✅ **COMPLETE** (2025-09-03)
* **Description:** This feature transforms the "Customer Value" section into an AI-powered assistant. It replaces the five empty textareas with a button that generates a first draft of the value elements for the user to refine.
* **Implementation Details:**
    * ✅ **Conditional UI:** Replaced static textareas with intelligent 3-state rendering (Pre-analysis → Loading → Success/Error states)
    * ✅ **AI Button:** Added "Analyze JTBD & Draft Customer Value" button with proper validation (requires 3+ JTBD fields)
    * ✅ **Serverless Function:** Created new `api/draft-customer-value.js` serverless function with Brave Search API integration for real-time industry intelligence.
    * ✅ **Context-Aware Generation:** AI analyzes all 9 JTBD fields to generate tailored Customer Value drafts
    * ✅ **Editable Drafts:** All AI-generated content displayed in fully editable textareas with state persistence.
    * ✅ **Error Recovery:** Comprehensive error handling with retry options and manual fallback.
* **Technical Architecture:**
    * **New File:** `api/draft-customer-value.js` - Serverless function with Brave Search API integration
    * **Modified:** `index.html` - Customer Value section (lines 1178-1364) with complete AI integration
    * **API Calls:** Multiple Brave Search queries for industry research and value proposition patterns
    * **State Management:** `aiDraftLoading`, `aiDraftsAvailable`, `aiDraftError` with existing localStorage persistence
* **Acceptance Criteria:** ✅ **ALL PASSED**
    * ✅ The five textareas in the "Customer Value" section are replaced by a single button when the section is empty
    * ✅ Clicking the button triggers real AI calls with loading states and displays AI-generated drafts in five textareas
    * ✅ User can edit all AI suggestions, and changes are saved to `appState.segmentData`
    * ✅ Golden Thread connections remain functional between JTBD → Customer Value → WTP
    * ✅ Export functionality includes AI-generated content

### SEG-FEAT-006: Implement AI-Powered WTP Drafter
* **Description:** This feature transforms the "Willingness to Pay" section into an AI-powered assistant, mirroring the functionality of the Value Drafter.
* **Implementation Details:**
    * Remove the five empty textareas from the "Willing-to-Pay" section.
    * In their place, add a single button: **"Analyze Value & Draft WTP Drivers"**.
    * When clicked, this button will trigger an AI call. The prompt will use the user's refined content from the "Customer Value" section as context.
    * The AI will return a JSON object with drafts for the five WTP elements, using the logical mappings from our strategy.
    * The UI will display these five drafts as editable textareas for the user to review and refine.
* **Acceptance Criteria:**
    * The five textareas in the "Willingness to Pay" section are replaced by a single button when the section is empty.
    * Clicking the button triggers an AI call and displays the AI-generated drafts in the five textareas.
    * The user can then edit the AI's suggestions.

### NAV-FIX-001: Correct Segment to ICP Navigation
* **Description:** This is a high-priority usability fix. The "Continue to Part 2: ICP Definition" buttons in the `SegmentFoundationTool` currently navigate the user to an incorrect scroll position within the `ICPDefinitionTool`. This task will correct the navigation behavior.
* **Implementation Details:**
    * Modify the `onClick` handler for all buttons that execute `onNavigate('icp')` within the `SegmentFoundationTool` component.
    * Ensure that upon navigation, the browser window is scrolled to the top (0, 0) of the page.
* **Acceptance Criteria:**
    * Clicking the "Continue to Part 2: ICP Definition" button in the header of Part 1 navigates to Part 2 and the view is at the top of the page.
    * Clicking the "Continue to Part 2: ICP Definition" link in the sticky side-nav of Part 1 navigates to Part 2 and the view is at the top of the page.

### ICP-REFACTOR-001: Overhaul ICP Definition Page
* **Description:** This task addresses the strategic redundancy created by the new `SegmentFoundationTool`. It transforms the top of the `ICPDefinitionTool` from a data-entry form into a read-only summary of the richer data captured in Part 1.
* **Implementation Details:**
    * **Remove Redundant Fields:** In `ICPDefinitionTool`, remove the `<textarea>` inputs for "Common Needs (Job-to-be-Done)", "Desired Customer Value", "Problem Urgency", "Willingness to Pay", and other fields now covered in Part 1.
    * **Create Summary Component:** At the top of the `ICPDefinitionTool`, add a new read-only summary section titled "Segment Foundation Summary".
    * **Display Key Data:** This section should display key data points from `appState.segmentData` (e.g., "Desired Outcomes", "Functional Value", "Economic Justification") to provide context for the subsequent sections.
    * **Add Navigation Link:** The summary section must include a button or link (e.g., "Edit Segment Foundation") that navigates the user back to the `segment` view.
* **Acceptance Criteria:**
    * The old ICP input fields in Part 2 are removed.
    * A new read-only summary section is present at the top of Part 2, displaying data from Part 1.
    * The summary section contains a functioning link that takes the user back to the Part 1 `SegmentFoundationTool`.

### ICP-VIS-001: Segment-to-ICP Strategic Flow Visualization
*   **Feature Overview:** ICP-VIS-001 will implement a custom SVG visualization that educates users on the strategic progression from foundational market segments to actionable ICPs, while visually connecting Part 1 (Positioning) to Part 2 (Category Design) in a way that reinforces the core GTM methodology.

*   **Strategic Purpose & Educational Value:** This visualization serves three critical functions:
    *   **Educational:** Teaches users the proper GTM progression model (Segment → ECP → ICP)
    *   **Contextual:** Shows where they are in the strategic journey and what comes next
    *   **Connective:** Visually links the completed positioning work to the upcoming category design work

*   **Placement & Integration:**
    *   **Primary Location:** Top of the `CategoryDesignTool` component, directly above the existing "Positioning Foundation" summary box
    *   **Secondary Consideration:** Could also appear as a smaller version in the `PositioningTool` to show the complete journey

*   **Visual Design Specifications:**
    *   **Overall Layout:** Horizontal Flow (Left → Center → Right)
    *   **1. Starting Foundation (Left)**
        *   **Visual:** Solid green rounded rectangle
        *   **Label:** "Market Segment"
        *   **Subtext:** "JTBD • Value • WTP"
        *   **Purpose:** Represents the foundational customer understanding from Part 1
    *   **2. The Strategic Bridge (Center)**
        *   **Visual:** Large directional arrow with internal content
        *   **Top Label:** "Add Product & Business Model Fit"
        *   **Internal Content:** Two smaller text elements:
            *   "Product-Problem Fit" (smaller text)
            *   "Scalable Business Model" (smaller text)
        *   **Purpose:** Shows the analytical work required to progress from segment to ICP
    *   **3. The Actionable Outcome (Right)**
        *   **Visual:** Larger composite box with visual split
        *   **Main Label:** "Actionable ICP"
        *   **Visual Split:** Two distinct but connected sections:
            *   **Left Half - Strategic ICP ("The Why")**
                *   **Background:** Light green
                *   **Label:** "Strategic Why"
                *   **Bullet points:**
                    *   • Jobs to be Done
                    *   • Value Drivers
                    *   • Buyer Motivations
                *   **Purpose text:** "For messaging & positioning"
            *   **Right Half - Operational ICP ("The Where")**
                *   **Background:** Light gold/yellow
                *   **Label:** "Operational Where"
                *   **Bullet points:**
                    *   • Firmographics
                    *   • Technographics
                    *   • Behavioral Signals
                *   **Purpose text:** "For targeting & campaigns"

*   **Technical Implementation:**
    *   **SVG Construction:**
        *   **Custom SVG:** Hand-coded for crisp rendering and brand consistency
        *   **Dimensions:** ~800px wide × 300px tall (responsive scaling)
        *   **Embedded:** Directly in the React component (not external file)
    *   **Brand Consistency:**
        *   **Colors:**
            *   Primary green (#059669) for segment box
            *   Scale gold (#F59E0B) for operational ICP section
            *   Medium gray (#6B7280) for bridge text
            *   Light backgrounds for readability
        *   **Typography:**
            *   Work Sans (bold) for main labels
            *   Outfit (regular) for bullet points and subtext
        *   **Visual Style:** Clean, professional, consistent with existing funnel graphic
    *   **Interactive Elements (Future Enhancement):**
        *   Hover states for educational tooltips
        *   Click-through to relevant sections
        *   Progress indication based on user's completion status

*   **User Experience Flow:**
    *   User completes Part 1 (Positioning) with segment definition
    *   User navigates to Part 2 (Category Design)
    *   User immediately sees the progression visualization showing:
        *   Where they've been (Market Segment - completed)
        *   Where they are (The Bridge - current work)
        *   Where they're going (Actionable ICP - the goal)
    *   **Educational impact:** User understands they're not just filling out forms, but following a strategic methodology
    *   **Contextual clarity:** User sees how their Part 1 work feeds into Part 2 objectives

*   **Implementation Details:**
    *   **File Structure:**
        *   **Modified File:** `index.html` (`CategoryDesignTool` component)
        *   **New Component:** `<ICPFlowVisualization />` embedded within `CategoryDesignTool`
        *   **No External Dependencies:** Pure SVG + React, no additional libraries
    *   **Data Integration:**
        *   **Conditional Styling:** Different visual states based on:
            *   Completion status of Part 1 (full color vs. muted)
            *   Progress through Part 2 (highlight current stage)
            *   Quality of data inputs (validated vs. incomplete)
    *   **Responsive Design:**
        *   **Desktop:** Full horizontal layout as described
        *   **Mobile:** Stacked vertical layout with same content
        *   **Tablet:** Compressed horizontal with adjusted text sizes

*   **Success Criteria & Validation:**
    *   **Educational Effectiveness:**
        *   Users understand the Segment → ECP → ICP progression
        *   Clear distinction between Strategic "Why" and Operational "Where"
        *   Visual reinforcement of the value of completing both Parts 1 & 2
    *   **Visual Integration:**
        *   Seamless integration with existing UI components
        *   Brand consistency with current design system
        *   Professional, polished appearance matching existing funnel graphic
    *   **Technical Quality:**
        *   Crisp rendering across all screen sizes and browsers
        *   Fast loading with no impact on application performance
        *   Accessible with proper ARIA labels and descriptions

*   **Current Project Status:** Enhanced Feature Definition Complete
*   **Next Required Action for Project Director:** This refined feature definition provides a comprehensive blueprint that balances strategic education with elegant visual design. The specification is ready for Gemini to convert into detailed implementation steps, ensuring the visualization effectively communicates the GTM methodology while seamlessly integrating into our existing SPA architecture.
The design emphasizes the strategic insight that an ICP isn't just demographics—it's the layered result of combining market understanding with product-market fit and business model validation. This educational component will significantly enhance user comprehension of the GTM Blueprint methodology.

### CC-FEAT-001: Company Context Setup Modal
* **Description:** A one-time welcome modal that captures essential company information on first visit, storing it for use throughout the application, particularly for AI-powered searches and validations.
* **Implementation Details:**
    * **Modal Trigger:** Appears automatically on first visit when `companyContext.isSetupComplete` is false
    * **Required Fields:**
        - Company Name (2-100 characters)
        - Company Website (valid URL with http:// or https://)
        - Industry (dropdown: SaaS/Software, Financial Services, Healthcare, E-commerce, Manufacturing, Professional Services, Other)
        - Product/Service Name (2-100 characters)
        - Target Market (radio buttons: B2B/B2C)
    * **Optional Fields:**
        - Case Study URLs (dynamic list with add/remove buttons)
        - Documentation URLs (dynamic list with add/remove buttons)
        - Top 3 Competitors (3 text input fields)
    * **Data Storage:** All data saved to `appState.companyContext` in localStorage
    * **UI Requirements:**
        - Fixed position overlay covering entire screen
        - Cannot be dismissed without completing required fields
        - Clean professional design matching green theme
        - Form validation with error messages
        - Progress indicator showing required vs optional fields
* **Acceptance Criteria:**
    * Modal appears on first visit and blocks access until completed
    * All required field validations work correctly
    * Data persists to localStorage
    * "Edit Company Info" button added to HomeView header
    * Modal can be reopened via Edit button
    * Company context accessible throughout application

### VAL-FEAT-001: JTBD Element Market Validation
* **Description:** Add individual "Validate Against Market" buttons next to each of the 9 JTBD elements that perform intelligent web searches to compare user input against market reality.
* **Implementation Details:**
    * **UI Changes:**
        - Add validation button next to each JTBD field in modal
        - Button states: gray (default), blue (validating), green/yellow/orange (results)
        - Results display below each field with collapsible insights
    * **Search Strategy:**
        - Uses company context + field-specific templates + user input
        - 3 query variations per field (primary, secondary, tertiary)
        - Searches include: product reviews, forums, case studies, competitor comparisons
    * **Query Templates:** Field-specific patterns for each JTBD element
        - Context: operational challenges, workflow bottlenecks
        - Struggling Moments: customer complaints, issues, problems
        - Pushes & Pulls: migration stories, switching announcements
        - Anxieties & Habits: implementation concerns, change resistance
        - Desired Outcomes: ROI metrics, success stories
        - Basic Quality: RFP requirements, compliance standards
        - Hiring Criteria: vendor selection, decision factors
        - Firing Criteria: switching reasons, deal breakers
        - Key Trade-offs: limitations, compromises accepted
    * **Results Analysis:**
        - Extract signals from search results
        - Calculate alignment score (0-100%)
        - Identify market language patterns
        - Generate refinement suggestions
* **Acceptance Criteria:**
    * Each JTBD field has working validation button
    * Searches use company context effectively
    * Results show alignment score and insights
    * Visual feedback indicates validation status
    * No impact on existing JTBD analysis functionality
    * API calls handle errors gracefully