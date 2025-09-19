# Epic Specification: AI Research Assistant

**Version:** 1.0
**Status:** Draft
**Author:** Gemini & User
**Date:** 2025-09-16
**Branch:** feat/ai-research-assistant

## 1. Objective

To empower users by automating the extraction of structured insights from unstructured research reports (Markdown files) using AI, thereby significantly reducing manual data entry and accelerating the blueprint creation process. This feature aims to transform the application from a passive framework into an active, intelligent partner.

## 2. User Stories

*   **As a user,** I want to upload a comprehensive research report (e.g., from Gemini, Claude, or other AI tools) in Markdown format so that the application can automatically analyze it.
*   **As a user,** I want the application to "mine" the uploaded report for relevant information and generate structured data for each part of the blueprint (Segment Foundation, ICP Definition, Positioning, etc.).
*   **As a user,** I want to see AI-generated suggestions directly within the input fields of the application so I can quickly populate sections with relevant insights from the report.
*   **As a user,** I want to be able to accept or reject AI suggestions, or use them as a starting point for my own edits, ensuring I remain in control of the final content.
*   **As a user,** I want a clear indication of when the AI is processing my report, including estimated time, so I understand the system's activity.
*   **As a user,** I want to be able to continue using the existing "Import Part Data" functionality without confusion, as it serves a different purpose (loading pre-structured JSON).

## 3. UI/UX Design

### 3.1. "AI Research Assistant" Button

*   **Location:** Global header, prominently placed (e.g., next to the "Category Blueprint" title or near existing global actions).
*   **Label:** "AI Research Assistant" or "Generate from Report".
*   **Icon:** A "magic" or "sparkle" icon to visually differentiate it from standard import/export.
*   **Action:** Clicking this button opens the "Upload Research Report" modal.

### 3.2. "Upload Research Report" Modal

*   **Trigger:** Clicking the "AI Research Assistant" button.
*   **Content:**
    *   Clear title: "Upload Research Report for AI Analysis".
    *   Instructions: "Upload your research report in Markdown (.md) format. Our AI will analyze it to provide suggestions across your blueprint."
    *   File input/drop zone for `.md` files.
    *   "Analyze Report" button (disabled until a file is selected).
    *   "Cancel" button.
*   **Processing State:**
    *   After clicking "Analyze Report," the button becomes disabled, a loading spinner appears, and text changes to: "AI is analyzing your report... This may take 1-2 minutes."
    *   Progress indicator (optional, but good for long processes).
*   **Completion State:**
    *   On success: "Analysis complete! AI suggestions are now available throughout your blueprint." (with a success icon).
    *   On error: "Analysis failed. Please try again or check your report format." (with an error icon and details).

### 3.3. In-Context AI Suggestions

*   **Indicator:** Next to each relevant input field in the application, a small "magic" or "AI" icon will appear if a suggestion is available for that field.
*   **Popover/Tooltip:** Clicking the AI icon will open a small popover or tooltip.
    *   **Content:** Displays the AI-generated suggested text for that specific field.
    *   **Action:** A "Use this suggestion" button.
*   **"Use this suggestion" Action:** Clicking this button will populate the associated input field with the suggested text. The user can then edit it or accept it as is.

### 3.4. "Import Part Data" Button (Existing Functionality)

*   **Location:** Remains on each individual part page.
*   **Label:** Renamed to "Import Part Data" (from "Import Data").
*   **Functionality:** Unchanged. Loads a structured JSON file specifically for the current part, overwriting existing data after user confirmation.

## 4. Technical Requirements

### 4.1. Frontend

*   **New Components:**
    *   `AIResearchAssistantButton.jsx` (Global header button)
    *   `UploadReportModal.jsx` (Modal for file upload and processing)
    *   `AISuggestionIcon.jsx` (Small icon next to input fields)
    *   `AISuggestionPopover.jsx` (Popover displaying suggestions)
*   **State Management:**
    *   The application's global state (`appState`) will store the AI-generated suggestions (e.g., `appState.aiSuggestions: { part1Data: {...}, part2Data: {...} }`).
    *   This state will be accessed by `AISuggestionIcon` to determine if a suggestion exists for a given field.
*   **API Integration:**
    *   `UploadReportModal` will make a `POST` request to the new backend endpoint (`/api/mine-research-report`).
    *   Error handling, loading states, and success notifications for the API call.

### 4.2. Backend (New Serverless Function: `/api/mine-research-report.js`)

*   **Endpoint:** `POST /api/mine-research-report`
*   **Request:** Accepts the raw text content of a Markdown file in the request body.
*   **Authentication:** Securely access LLM API keys from environment variables (e.g., `GEMINI_API_KEY`).
*   **LLM Integration:**
    *   Utilize the Gemini API (or other configured LLM).
    *   **Master Prompt Engineering:** Develop a robust prompt that takes the full research report text and a target JSON schema for a specific application part. The prompt must instruct the LLM to extract relevant information and return *only* valid JSON.
*   **Processing Logic:**
    *   Loop through predefined JSON templates for each application part (Segment Foundation, ICP Definition, Positioning, etc.).
    *   For each part, construct a specific prompt and call the LLM.
    *   Implement retry mechanisms and robust JSON validation for LLM responses.
*   **Response:** Returns a single JSON object containing the structured data for all processed parts, keyed by part name.

### 4.3. Feature Flagging (My Blindspot Addition)

*   **Mechanism:** Implement a simple feature flag (e.g., `appState.features.aiAssistantEnabled` or an environment variable `VITE_AI_ASSISTANT_ENABLED`).
*   **Control:** All new UI components (button, modal, suggestion icons) will only render if this flag is `true`.
*   **Deployment:** The feature will be deployed with the flag `false` in production until ready for release.

## 5. Acceptance Criteria

*   [ ] The "AI Research Assistant" button is present in the global header.
*   [ ] Clicking the "AI Research Assistant" button opens the "Upload Research Report" modal.
*   [ ] The modal allows users to upload a Markdown file.
*   [ ] Upon uploading and clicking "Analyze Report," a loading state is displayed.
*   [ ] The backend API successfully processes the Markdown report using AI and returns structured JSON for all parts.
*   [ ] On successful analysis, AI suggestions are stored in `appState`.
*   [ ] Small AI icons appear next to relevant input fields where suggestions are available.
*   [ ] Clicking an AI icon displays a popover with the suggested text.
*   [ ] Clicking "Use this suggestion" populates the input field with the AI-generated text.
*   [ ] The existing "Import Data" button is renamed to "Import Part Data" and its functionality remains unchanged.
*   [ ] Error handling is robust for invalid file uploads, API failures, and LLM processing issues.
*   [ ] The feature is controlled by a feature flag, allowing it to be disabled in production until ready.

## 6. Agent Handoff & Context Preservation

*   **GitHub Issues:** All development tasks will be tracked via GitHub Issues, linked to this Epic PRD.
*   **Context File:** The `.aicontext/context.md` file will be updated with relevant summaries and status during agent handoffs.
*   **Claude Agents:** Specific Claude agents (e.g., `component-pipeline`, `specification-generator`) will be leveraged for their respective tasks as needed.
