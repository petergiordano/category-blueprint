# EPIC Specification: Resilient Session Import & Export

This document outlines the three-phase development plan for a comprehensive session import and export feature, designed following SLC (Simple, Lovable, Complete) principles.

---

## Phase 1: The Core Round-Trip

**Goal**: A user can reliably save their entire session to a versioned file and safely load it back in. This phase delivers a complete, foundational import/export loop.

### 1.1. Canonical Data Schema (v1.0.0)

The exported JSON file must adhere to the following structure. The `formatVersion` is critical for future compatibility.

```json
{
  "formatVersion": "1.0.0",
  "appVersion": "1.0.0", 
  "exportTimestamp": "2025-09-20T12:00:00Z",
  "data": {
    "companyContext": {},
    "segmentData": {},
    "positioningData": {},
    "categoryData": {},
    "aiSuggestions": {},
    "navigationProgress": {}
  }
}
```

### 1.2. The `SessionManager` Module

A new central module, `SessionManager`, will be created to handle all data transformations.

-   `serializeSession(state)`: Takes the entire application state object as input. It gathers all required data points (company context, all four parts, AI suggestions, progress) and formats them into the canonical JSON structure shown above. This will be used by the new global export function.
-   `hydrateSession(jsonData)`: Takes a parsed JSON object as input. It is responsible for validating the data and overwriting the application's current state. 

### 1.3. UI & UX Workflow

1.  **New "Session" Menu**: A "Session" menu will be added to the main application header.
2.  **Export**: The menu will contain an "Export Blueprint to File..." option. When clicked, it will trigger `serializeSession()` and initiate a download of the resulting `.json` file.
3.  **Import**: The menu will contain an "Import Blueprint from File..." option, which opens a file picker.
4.  **Confirmation Modal**: After a user selects a file, a modal must appear with the following:
    *   **Title**: `Overwrite Current Blueprint?`
    *   **Body**: `Importing this file will overwrite all current progress in your session. This action cannot be undone directly, though a temporary backup will be made.`
    *   **Buttons**: `Cancel` and `Confirm & Import`.

### 1.4. Safety-First Import Logic

-   **Automatic Backup**: Before calling `hydrateSession`, the current application state **must** be serialized and saved to `localStorage` under a key like `session_backup`.
-   **Validation**: The `hydrateSession` function must first check if `formatVersion` exists and is `"1.0.0"`. If not, it must reject the import with an error.
-   **State Overwrite**: Upon user confirmation, the `hydrateSession` function is called, the application state is completely replaced, and the UI re-renders.

---

## Phase 2: The Resilient & Lovable Importer

**Goal**: A user can now import files created with older versions of the app and has a more delightful, informative import experience.

### 2.1. The Migration Engine

-   The `SessionManager` will be enhanced with a `MIGRATIONS` map object.
-   **Example Logic**:
    ```javascript
    const MIGRATIONS = {
      '1.0.0': (data) => {
        // If a new field was added in 1.1.0, add it with a default value
        data.newField = 'default';
        return data;
      },
      '1.1.0': (data) => { /* migrate from 1.1.0 to 1.2.0 */ return data; }
    };
    ```
-   The `hydrateSession` function will be updated. If an imported file has an older `formatVersion`, the function will apply migrations sequentially until the data structure matches the current version before proceeding.

### 2.2. Enhanced Import UX

1.  **Import Preview Modal**: The confirmation modal from Phase 1 will be upgraded. Before asking for confirmation, it will display key information from the file, such as:
    *   `Company Name:`
    *   `Product Name:`
    *   `File Version:`
    *   `Last Saved:`
2.  **Drag-and-Drop**: A designated area on the home screen will be created to allow users to drag and drop their `.json` file to start the import process.
3.  **Undo Import**: After a successful import, a toast notification will appear for 10 seconds with an "Undo" button. Clicking it will restore the session from the `localStorage` backup created in Phase 1.

---

## Phase 3: The Smart Session Assistant

**Goal**: The application proactively helps the user manage their files and sessions, making the workflow faster and more efficient.

### 3.1. Smart File & Session Management

1.  **Intelligent Filenaming**: The "Export Blueprint to File..." function will be updated to generate descriptive filenames, using the format: `positioning-blueprint-[companyName]-[YYYY-MM-DD].json`.
2.  **Recent Blueprints**: The home screen will feature a new section titled "Recent Blueprints". This list will display the last 3-5 imported/exported sessions (managed via `localStorage`), allowing for one-click reloading.
