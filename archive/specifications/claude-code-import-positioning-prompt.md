
# Prompt for Claude Code: Implement "Import Data" for Part 3: Positioning

**Objective:** Extend the "Import Data" functionality to "Part 3: Positioning". This is the most complex import yet and requires careful data mapping from the imported JSON structure to the application's state.

---

## Feature Specification: Import Positioning Data

**Version:** 1.0
**Status:** Proposed

### 1. Overview

This document outlines the requirements to add "Import Data" functionality to the "Part 3: Positioning" section of the application. This feature will allow users to upload a JSON file to populate the complex fields of the Positioning section, including dynamic lists and single-value fields.

### 2. User Story

As a user, I want to import my Positioning data from a JSON file so that I can restore my work on competitive alternatives, value propositions, and market trends without having to re-enter everything manually.

### 3. UI/UX Requirements

-   An "Import Data" button will be displayed in the header for "Part 3: Positioning."
-   The button style and import workflow (file picker, notifications) must be identical to the implementations in Part 1 and Part 2 to ensure a consistent user experience.

### 4. Technical Requirements

-   **File Handling:** Reuse the established pattern of creating a file input and using the `FileReader` API.
-   **Schema Validation:** The validation logic must be specific to the Part 3 data structure. It must:
    1.  Verify that `metadata.partName` in the JSON file is `"Positioning"`.
    2.  Confirm the presence of the `content` object.
    3.  Validate the structure of the nested objects within `content`, such as `competitiveAlternatives` (array of objects), `uniqueValueAndProof` (array of objects), `marketCategory` (string), and `relevantTrends` (object).
-   **State Management:** Upon successful validation, update the `appState.positioningData` object. This is the most critical part, as it requires a reverse mapping from the imported JSON structure back to the application's state structure.
    -   `content.competitiveAlternatives` -> `appState.positioningData.alternatives`
    -   `content.uniqueValueAndProof` -> `appState.positioningData.values`
    -   `content.marketCategory` -> `appState.positioningData['market-context']`
    -   `content.relevantTrends` -> `appState.positioningData.trend1_desc`, etc.
-   **Data Integrity:** The import should only affect the fields related to Positioning. It should not modify the ICP-related fields (those starting with `icp_`) that also exist within `appState.positioningData`.

---

## Implementation Plan & Instructions

### Step 1: Understand the Existing Codebase

Before you begin, you must analyze the `index.html` file, specifically the `PositioningTool` and `PrimaryActions` components.

1.  **Locate the `PositioningTool` component.** This is where your new import logic will reside.
2.  **Analyze the `PrimaryActions` component.** You will need to modify the condition to render the "Import Data" button when the `currentPart` is `'positioning'`.
3.  **Examine the `generatePart3SpecificData` function** inside `PositioningTool`. This function is the definitive source for the JSON structure you need to handle on import. Pay close attention to how it transforms the internal state (`alternatives`, `values`, `trend1_desc`) into the exported format (`competitiveAlternatives`, `uniqueValueAndProof`, `relevantTrends`). Your import logic must perform the reverse of this transformation.

### Step 2: Execute the Implementation

Follow this sequence to implement the feature:

1.  **Update `PrimaryActions` Component:** In `index.html`, find the `PrimaryActions` component. Modify the condition for rendering the `onImport` button to include `'positioning'`. The line should look like this:
    ```javascript
    {onImport && (currentPart === 'segment' || currentPart === 'icp' || currentPart === 'positioning') && (
    ```

2.  **Add State and Functions to `PositioningTool`:**
    -   Add the necessary state variables for handling import messages to the `PositioningTool` component, just as they were added to the previous tools:
        ```javascript
        const [importMessage, setImportMessage] = useState(null);
        const [importMessageType, setImportMessageType] = useState('');
        ```
    -   Add the UI for displaying the `importMessage` near the top of the component's returned JSX, mirroring the implementation in the other tools.

3.  **Implement `handleImportPositioning` and `validatePositioningImportData`:**
    -   Inside the `PositioningTool` component, create the `handleImportPositioning` and `validatePositioningImportData` functions. You should adapt the code from the previous import handlers.
    -   Pass the new `handleImportPositioning` function to the `PrimaryActions` component via the `onImport` prop.

4.  **Implement the State Update Logic (Critical Step):**
    -   The core of your `handleImportPositioning` function, after validation, will be to correctly map the data from the imported `content` object back to the `appState.positioningData` object.
    -   You must perform the following mappings:
        -   `content.competitiveAlternatives` (array of `{name, description}`) -> `appState.positioningData.alternatives` (array of `{val1, val2}`)
        -   `content.uniqueValueAndProof` (array of `{attribute, benefit, value}`) -> `appState.positioningData.values` (array of `{val1, val2, val3, val4}` - note the different structure)
        -   `content.marketCategory` (string) -> `appState.positioningData['market-context']`
        -   `content.relevantTrends` (object of `{trend1, trend2, ...}`) -> `appState.positioningData.trend1_desc`, `appState.positioningData.trend2_desc`, etc.
    -   Use an immutable update pattern to set the new state, ensuring you preserve the existing `icp_` fields within `positioningData`.

### Final Checklist

-   [ ] The "Import Data" button appears correctly on the "Part 3: Positioning" page.
-   [ ] A new `handleImportPositioning` function is created and correctly handles the file reading process.
-   [ ] A new `validatePositioningImportData` function correctly validates the specific schema for a Part 3 export file.
-   [ ] The state update logic correctly maps the complex, nested structures from the JSON file back to the application's state, preserving unrelated data.
-   [ ] A valid Part 3 JSON file correctly populates all fields, including the dynamic lists.
-   [ ] An invalid file triggers the correct error message.
