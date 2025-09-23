# Master PRD: Technical Foundation Epic

**Version:** 1.0
**Date:** 2025-09-23
**Status:** Approved for Implementation
**Epic Branch:** `epic/technical-foundation`

## 1. Objective
To refactor the GTM Blueprint application from a single-file SPA into a modern, multi-file React project structure. This foundational work will improve scalability, maintainability, and collaboration, and will create a clear path for future features like persistent user storage and backend integration.

## 2. Core Strategic Principles
* **Maintainability:** Code for each component should be isolated in its own file, making it easier to find, debug, and update.
* **Scalability:** The new structure must support the addition of many new components and complex features without degrading performance or developer experience.
* **Collaboration:** A multi-file structure allows multiple AI agents or developers to work on different parts of the application simultaneously with fewer merge conflicts.
* **Future-Proofing:** The architecture must pave the way for a proper backend/API layer for user data persistence.

## 3. The New Project Structure
The refactoring will result in the following target file and directory structure, likely managed by the Vite build tool:

/category-blueprint
|-- index.html            (The new, simplified application shell)
|-- package.json          (New: for managing dependencies like React)
|-- vite.config.js        (New: for configuring the build tool)
|-- /src
|   |-- main.jsx            (New: The application's entry point)
|   |-- App.jsx             (New: The main component holding state and routing)
|   |-- /components
|   |   |-- HomeView.jsx
|   |   |-- SegmentFoundationTool.jsx
|   |   |-- ICPDefinitionTool.jsx
|   |   |-- PositioningTool.jsx
|   |   |-- CategoryDesignTool.jsx
|   |   |-- PositioningSimulator.jsx
|   |   |-- CompanySetupModal.jsx
|   |   |-- ExportModal.jsx
|   |   |-- InsightsPanel.jsx   (Placeholder for the AI Insights Epic)
|   |-- /styles
|   |   |-- index.css       (For any global or custom CSS)
|-- /docs
|   |-- ... (existing documentation)
|-- /public
|-- ... (for static assets like SVGs if needed)

## 4. Phased Migration Plan
This epic will be executed via a series of discrete, SLC-compliant tasks.

* **`TECH-TASK-001: Project Initialization`**: Set up the new project structure with Vite, install dependencies (React, ReactDOM, p5.js), and create the empty file structure outlined above.
* **`TECH-TASK-002: Migrate Core App Logic`**: Move the main `App` component's logic (state management with `useState` and `useEffect`, and the `renderCurrentView` routing logic) from the original `index.html` into `src/App.jsx`.
* **`TECH-TASK-003: Migrate Core Components`**: Migrate the `HomeView`, `CompanySetupModal`, and `SegmentFoundationTool` components from `index.html` into their own `.jsx` files inside `src/components/`, ensuring they are correctly imported and rendered by `App.jsx`.
* **`TECH-TASK-004: Migrate Tool Components`**: Migrate the `ICPDefinitionTool`, `PositioningTool`, and `CategoryDesignTool` into their own component files.
* **`TECH-TASK-005: Migrate Simulator & Modals`**: Migrate the `PositioningSimulator` and `ExportModal` components into their own files. This will require special attention to the p5.js integration.
* **`TECH-TASK-006: Final Cleanup & Validation`**: Clean up the original `index.html` file, removing all old script tags and component definitions. Validate that the fully refactored application has 100% feature parity with the original single-file version.

## 5. Acceptance Criteria
* The application is no longer a single `index.html` file.
* The codebase is organized into the new file structure as defined in Section 3.
* The refactored application runs locally via a development server (e.g., `npm run dev`).
* All existing functionality (navigation, data entry, state changes, `localStorage` persistence, positioning simulator) works exactly as it did before the refactor.
* The Vercel preview deployment for the `epic/technical-foundation` branch is fully functional.
