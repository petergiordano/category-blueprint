# Feature Specification: Strict & Simple Import/Export

**Version:** 1.0
**Status:** Proposed
**Author:** Gemini
**Date:** 2025-09-16

## 1. Overview

This document outlines the functional requirements for a strict, part-specific import and export feature. The primary goal is to provide a safe, simple, and unambiguous method for users to back up, restore, and share their work for individual sections of the Category Blueprint application.

This approach prioritizes data integrity and implementation simplicity over advanced flexibility.

## 2. User Stories

- **As a user,** I want to save my progress for a single, specific part of the blueprint to a file on my computer so that I can have a personal backup.
- **As a user,** I want to load my saved data file back into the application to restore my previous work for that specific part.
- **As a user,** I want to receive a clear warning if I am about to overwrite existing data so that I don't lose my work accidentally.
- **As a user,** I want the application to prevent me from importing a file into the wrong section to avoid data corruption.

## 3. Functional Requirements

### 3.1. Core Concepts

- **Blueprint ID (`blueprintId`):** Upon first use, the application will generate a unique UUID for the user's entire blueprint project and store it in `localStorage`. This ID helps differentiate between blueprint instances.
- **Data Nativism:** Each part of the application (e.g., "Part 1: Segment Foundation", "Part 2: ICP Definition") is considered to have "native" data fields. The import/export functionality for a given part will **only** act upon these native fields.

### 3.2. Export Functionality

1.  **Trigger:** Each application part will feature an "Export" button.
2.  **File Generation:** Clicking "Export" will generate and trigger the download of a JSON file (e.g., `category-blueprint-part-2-export.json`).
3.  **File Contents:** The JSON file will contain **only the data native to the current part**. Data inherited or summarized from previous parts will **not** be included in the export.
4.  **Data Structure:** The exported JSON will adhere to the following structure:

    ```json
    {
      "metadata": {
        "part": "Part 2: ICP Definition",
        "schemaVersion": "1.0",
        "blueprintId": "a-unique-uuid-string-from-localstorage",
        "exportedAt": "2025-09-16T10:00:00Z"
      },
      "data": {
        "icpName": "Example ICP",
        "icpDescription": "A detailed description of the ideal customer profile."
      }
    }
    ```

### 3.3. Import Functionality

1.  **Trigger:** Each application part will feature an "Import" button, which opens a system file picker limited to `.json` files.
2.  **Initial Validation (File Content):** The application must first validate that the selected file is valid JSON and contains the expected `metadata` and `data` keys. If not, an error is shown: "Invalid file format. Please select a valid blueprint export file."
3.  **Metadata Validation (Part Match):**
    - The application **MUST** read the `metadata.part` value from the imported file.
    - It **MUST** compare this value against the current part the user is viewing in the application.
    - If the values do not match, the import process is aborted, and an error message is displayed: **"Import failed. This file is for the '[metadata.part]' section. Please navigate to that section to import it."**
4.  **Overwrite Check & Confirmation:**
    - If the part metadata matches, the application **MUST** check if any native data for the current part already exists in `localStorage`.
    - If data exists, a confirmation modal **MUST** be displayed to the user.
    - **Modal Title:** "Warning: Overwrite Data?"
    - **Modal Body:** "Importing this file will permanently replace all current data for the '[current part name]' section. Are you sure you want to continue?"
    - **Actions:** "Confirm", "Cancel".
5.  **Execution:**
    - If the user clicks "Confirm" (or if no existing data was found), the application will proceed.
    - The application will iterate through the keys in the `data` object of the imported file.
    - For each key, it will update the corresponding value in `localStorage` for the current part.
    - After the data is saved, the UI **MUST** be re-rendered to reflect the newly imported data.
6.  **Cancellation:** If the user clicks "Cancel" in the confirmation modal, the modal will close, and no changes will be made.

## 4. Future Considerations

- This strict model does not support "full blueprint" import/export. A future enhancement could introduce a separate global feature for this purpose.
- The `schemaVersion` is included for future-proofing. While this initial spec does not require a schema migration system, its presence allows for one to be built later without breaking older files.
