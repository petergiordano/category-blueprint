
# Feature Specification: Import Positioning Data

**Version:** 1.0
**Status:** Proposed

## 1. Overview

This document outlines the requirements to add "Import Data" functionality to the "Part 3: Positioning" section of the application. This feature will allow users to upload a JSON file to populate the complex fields of the Positioning section, including dynamic lists and single-value fields.

## 2. User Story

As a user, I want to import my Positioning data from a JSON file so that I can restore my work on competitive alternatives, value propositions, and market trends without having to re-enter everything manually.

## 3. UI/UX Requirements

-   An "Import Data" button will be displayed in the header for "Part 3: Positioning."
-   The button style and import workflow (file picker, notifications) must be identical to the implementations in Part 1 and Part 2 to ensure a consistent user experience.

## 4. Technical Requirements

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
