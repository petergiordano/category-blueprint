
# Prompt for Claude Code: Implement "Import Data" Feature

**Objective:** Implement the "Import Data" feature as detailed in the specification below. The goal is to create a seamless and error-resistant user experience for importing Segment Foundation data.

---

## Feature Specification: Import Foundation Data

**Version:** 1.0
**Status:** Proposed
**Author:** Gemini

### 1. Overview

This document outlines the requirements for a new "Import Data" feature within the Category Blueprint application. This feature will allow users to import data for "Part 1: Segment Foundation" from a local JSON file, streamlining the process of populating the form and enabling users to save and reuse their work.

### 2. Objective

The primary objective is to provide users with a way to quickly populate the "Part 1: Segment Foundation" section by uploading a JSON file. This enhances usability by allowing users to work offline, share their foundation data, and easily switch between different foundation setups.

### 3. User Story

As a user, I want to be able to import my Segment Foundation data from a JSON file so that I can easily reuse my previous work, share it with my team, or load a template without having to manually re-enter all the information.

### 4. UI/UX Requirements

#### 4.1. "Import Data" Button

-   An "Import Data" button will be added to the main header navigation bar, next to the existing "Export Foundation" button.
-   The button should be styled consistently with the existing buttons in the application.

#### 4.2. Import Workflow

1.  **Click "Import Data"**: The user clicks the "Import Data" button.
2.  **File Picker**: The browser's native file picker dialog opens, prompting the user to select a `.json` file.
3.  **File Validation**:
    -   The application will read the selected file.
    -   It will parse the JSON and validate its schema to ensure it matches the data structure required for the Segment Foundation.
4.  **User Feedback**:
    -   **On Success**: If the file is valid, the data is loaded into the application state, and the "Part 1: Segment Foundation" form is populated with the imported values. A success notification (e.g., a toast message) will briefly appear, saying "Foundation data imported successfully."
    -   **On Error (Invalid Schema)**: If the JSON does not match the expected schema, an error message will be displayed. The message should be clear and helpful, for example: "Import failed: The selected file does not match the required data structure. Please check the file and try again."
    -   **On Error (Other)**: For other errors (e.g., file is not valid JSON, file read error), a generic but clear error message should be shown.

#### 4.3. User Guidance

To help users create a valid JSON file, the following should be considered:

-   When an import error occurs due to a schema mismatch, provide a modal or a link to a document that displays the expected JSON schema.
-   The existing "Export Foundation" button serves as a natural way for users to generate a correctly formatted JSON file that can be later used for import. The UI text around the import/export buttons should hint at this.

### 5. Technical Requirements

#### 5.1. File Handling

-   The application must use the browser's File API to read the content of the user-selected local `.json` file.

#### 5.2. Schema Validation

-   A robust validation mechanism must be implemented on the client-side.
-   This validation should check for the presence of all required keys and ensure their values are of the correct data type (e.g., `string`, `array`, `object`).
-   The validation logic should be centralized and easily updatable if the data schema for "Part 1" changes in the future.

#### 5.3. State Management

-   Upon successful import and validation, the application's central state (e.g., in a React context or a state management library) must be updated with the new data.
-   This state update must trigger a re-render of the "Part 1: Segment Foundation" component to display the imported data in the form fields.

---

## Implementation Plan & Instructions

### Step 1: Understand the Existing Codebase

Before you begin, you must analyze the existing code to understand how the "Part 1: Segment Foundation" page is structured and how the "Export Foundation" functionality works. This will provide you with the exact data schema and the state management context you need to work with.

1.  **Locate the main component** for the "Part 1: Segment Foundation" page. Based on the file structure, this is likely within `category_blueprint.html` or a related JavaScript file.
2.  **Identify the state management** system. Find where the data for the form is stored and how it is updated.
3.  **Analyze the `handleExport` function** (or similarly named function) to determine the precise JSON structure that is generated. This structure will be your schema for validation.

### Step 2: Plan Your Implementation

Based on your analysis, create a detailed, step-by-step plan for implementing the feature. Your plan should include:

-   Which files you will modify.
-   The new functions you will create (e.g., for file reading, validation, and state updates).
-   How you will modify the existing UI to add the "Import Data" button.
-   How you will handle user feedback (success and error messages).

### Step 3: Execute the Implementation

Follow your plan to implement the feature. Here is a recommended sequence:

1.  **Add the "Import Data" Button**: Add the new button to the UI. For now, it can be a placeholder without functionality.
2.  **Implement File Reading**: Create a hidden file input element (`<input type="file">`) and a function that programmatically clicks it when the "Import Data" button is pressed. This function should also handle the `onChange` event of the file input to get the selected file.
3.  **Implement the Core Import Logic**: Create a new function, e.g., `handleImport(file)`. This function should:
    a.  Use a `FileReader` to read the file content as text.
    b.  Use a `try...catch` block to parse the text as JSON (`JSON.parse()`).
    c.  Call a new validation function to check the parsed JSON against the schema you identified in Step 1.
4.  **Implement Schema Validation**: Create a dedicated function, e.g., `isFoundationDataValid(data)`, that takes the parsed JSON object and returns `true` if it matches the expected schema and `false` otherwise. Be thorough in checking keys and value types.
5.  **Update Application State**: If validation passes, update the application's state with the imported data. Ensure this correctly repopulates the form fields.
6.  **Add User Feedback**: Implement success and error notifications to inform the user of the outcome of the import process.

### Final Checklist

-   [ ] The "Import Data" button is present and correctly styled.
-   [ ] Clicking the button opens a file picker for `.json` files.
-   [ ] A valid JSON file populates the form correctly.
-   [ ] An invalid JSON file triggers a clear and helpful error message.
-   [ ] The code is clean, well-commented, and follows the existing project style.
