
# Prompt for Claude Code: Implement "Import Data" for Part 2: ICP Definition

**Objective:** Extend the existing "Import Data" functionality to "Part 2: ICP Definition". The goal is to reuse the established import pattern, adapting it for the specific data schema of the ICP Definition section.

---

## Feature Specification: Import ICP Definition Data

**Version:** 1.0
**Status:** Proposed

### 1. Overview

This document outlines the requirements to add "Import Data" functionality to the "Part 2: ICP Definition" section of the application. This feature will allow users to upload a JSON file to populate the ICP fields, mirroring the functionality already present in "Part 1: Segment Foundation."

### 2. User Story

As a user, I want to import my ICP Definition data from a JSON file so that I can quickly load my previously defined customer profile without manual data entry.

### 3. UI/UX Requirements

-   An "Import Data" button will be displayed in the header for "Part 2: ICP Definition", next to the "Export ICP" button.
-   The button style and import workflow (file picker, notifications) should be identical to the Part 1 implementation to ensure a consistent user experience.

### 4. Technical Requirements

-   **File Handling:** Reuse the existing pattern of creating a file input and using the `FileReader` API.
-   **Schema Validation:** The validation logic must be specific to Part 2. It must:
    1.  Verify that the `metadata.partName` in the JSON file is `"ICP Definition"`.
    2.  Confirm the presence of a `content.icpDefinition` object.
    3.  Check for the expected fields within the `icpDefinition` object (e.g., `quickDecisionMaking`, `prioritizedRequirements`, etc.).
-   **State Management:** Upon successful validation, update the `appState.positioningData` object with the values from the imported `icpDefinition` object. The import should **only** affect fields related to the ICP definition.

---

## Implementation Plan & Instructions

### Step 1: Understand the Existing Codebase

Before you begin, you must analyze the `index.html` file, specifically the `ICPDefinitionTool` and `PrimaryActions` components.

1.  **Locate the `ICPDefinitionTool` component.** This is where your new import logic will reside.
2.  **Analyze the `PrimaryActions` component.** You will need to modify this to conditionally render the "Import Data" button when the `currentPart` is `'icp'`. The existing logic for `currentPart === 'segment'` provides a perfect template.
3.  **Examine the `generatePart2SpecificData` function** inside `ICPDefinitionTool`. This function reveals the exact data structure you need to validate against. The target for the import is the `content.icpDefinition` object.

### Step 2: Plan Your Implementation

Your plan should focus on adapting the existing import functionality from `SegmentFoundationTool` for `ICPDefinitionTool`.

-   **File to Modify:** `index.html`.
-   **Component to Modify:** `PrimaryActions` (to show the button) and `ICPDefinitionTool` (to add the logic).
-   **New Functions:** You will create `handleImportICP` and `validateICPImportData` functions inside `ICPDefinitionTool`.

### Step 3: Execute the Implementation

Follow this sequence to implement the feature:

1.  **Update `PrimaryActions` Component:** Modify the component to render the "Import Data" button when `currentPart` is `'icp'`. It should look similar to the condition for `'segment'`. The `onImport` prop will be passed down from `ICPDefinitionTool`.

2.  **Implement `handleImportICP` in `ICPDefinitionTool`:**
    -   Copy the `handleImport` function from the `SegmentFoundationTool` component and rename it to `handleImportICP`.
    -   In the `PrimaryActions` element within `ICPDefinitionTool`'s render method, add the `onImport={handleImportICP}` prop.
    -   In your new `handleImportICP` function, change the call from `validateImportData` to `validateICPImportData`.
    -   Update the state update logic to target `appState.positioningData` with the fields from the imported `content.icpDefinition` object.

3.  **Implement `validateICPImportData` in `ICPDefinitionTool`:**
    -   Create a new validation function named `validateICPImportData`.
    -   This function should be tailored to the Part 2 data structure. It must check that `data.metadata.partName === "ICP Definition"`.
    -   It must validate the existence and structure of `data.content.icpDefinition`.
    -   It should return a similar object to the original validation function: `{ isValid, errors, warnings, stats }`.

4.  **Add User Feedback:** Ensure the success, warning, and error messages are displayed correctly, reusing the existing `importMessage` and `importMessageType` state variables and UI elements from `SegmentFoundationTool`.

### Final Checklist

-   [ ] The "Import Data" button appears correctly on the "Part 2: ICP Definition" page.
-   [ ] The import logic from Part 1 is successfully adapted for Part 2.
-   [ ] The new schema validation for Part 2 is implemented and correctly checks the JSON structure.
-   [ ] A valid Part 2 JSON file correctly populates the ICP Definition form fields.
-   [ ] An invalid file (e.g., a Part 1 file or malformed JSON) triggers the correct error message.
-   [ ] The implementation is clean and reuses existing patterns and components effectively.
