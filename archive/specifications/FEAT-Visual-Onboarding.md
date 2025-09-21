# Technical Specification: F-10 AI-Powered Value Matrix Integration

**Author:** Gemini
**Date:** 2025-09-21
**Issue:** [#76](https://github.com/petergiordano/category-blueprint/issues/76)

## 1. Overview

This document outlines the technical plan for integrating the AI-powered 2x2 Value Matrix simulator into the main Category Blueprint application (`index.html`). This corresponds to **Phase 2: The Integrated AI Analysis** of the Positioning Epic.

The goal is to embed the functionality of `positioning2x2sim.html` as a new "AI Positioning Analysis" section within the existing React-based application, creating a seamless user experience that leverages the existing company context and ICP data.

## 2. Integration Architecture

The integration will follow a component-based approach within the existing React application.

1.  **New React Component:** A new React component, `<PositioningSimulator />`, will be created. This component will encapsulate the logic and UI of the 2x2 matrix.
2.  **p5.js Integration:** The p5.js sketch from `positioning2x2sim.html` will be adapted to run within the `<PositioningSimulator />` component. The p5.js instance will be managed using a `ref` in the React component to ensure proper lifecycle management (setup, draw, cleanup).
3.  **New "Part" in Stepper:** A new part, "AI Analysis," will be added to the `ProgressStepper` component in `index.html`. This will render the `<PositioningSimulator />` component.
4.  **API Abstraction:** The Gemini API calls currently in `positioning2x2sim.html` will be moved to new serverless functions in the `/api` directory to abstract the logic from the frontend and protect API keys.
    *   `api/analyze-attributes.js`: Replaces `handleMarketAnalysis`.
    *   `api/generate-personas.js`: Replaces `handleAiSimulation`.

## 3. AI Scoring System Design

The core of this feature is the AI-powered scoring of value propositions.

1.  **Importance (to the ICP):**
    *   **Input:** The user's defined ICP (from `positioningData`) and a single value proposition.
    *   **AI Prompt:** A new prompt will be designed for a serverless function. The prompt will ask the Gemini model to rate the importance of the value proposition to the specified ICP on a scale of 0-10.
    *   **Output:** A numerical score for "importance."

2.  **Uniqueness (in the market):**
    *   **Input:** The user's value proposition and the list of competitors from `companyContext`.
    *   **AI Prompt & Search:** A new serverless function will use the Brave Search API to find information about the competitors' features. The Gemini model will then be prompted to compare the user's value proposition to the competitors' offerings and rate its uniqueness on a scale of 0-10.
    *   **Output:** A numerical score for "uniqueness."

## 4. Data Flow

1.  **Input Data:** The `<PositioningSimulator />` component will receive the `companyContext` and `positioningData` from the main application state as props.
2.  **User Interaction:** The user will trigger the analysis via a "Run AI Analysis" button within the new section.
3.  **API Calls:** The button click will trigger the new serverless functions (`api/analyze-attributes.js` and `api/generate-personas.js`), passing the necessary data.
4.  **State Update:** The results from the API (scores and persona data) will be stored in the main application's state, likely within a new object in `aiSuggestions`.
5.  **Visualization:** The p5.js sketch within the `<PositioningSimulator />` component will read the updated state and re-render the 2x2 matrix with the plotted data.

## 5. UI/UX Integration

1.  **New Stepper Part:** A new step, "AI Analysis," will be added to the `ProgressStepper`.
2.  **New Section:** A new section will be created in `index.html` that is displayed when the "AI Analysis" step is active. This section will contain:
    *   The 2x2 matrix visualization.
    *   The "Run AI Analysis" button.
    *   A display area for the generated personas and their descriptions, similar to the "AI-Powered Strategic Analysis" section in `positioning2x2sim.html`.
3.  **ICP Toggle:** A dropdown or a set of tabs will be implemented to allow the user to select from different ICPs (if multiple are defined), which will trigger a re-rendering of the matrix.

## 6. Implementation Roadmap

1.  **Task 1: Create `<PositioningSimulator />` Component**
    *   Create a new file for the React component.
    *   Integrate the p5.js sketch from `positioning2x2sim.html` into the component using `useEffect` and `useRef`.
2.  **Task 2: Add "AI Analysis" to Stepper**
    *   Modify the `ProgressStepper` in `index.html` to include the new part.
    *   Update the main application logic to render the `<PositioningSimulator />` component when the new part is active.
3.  **Task 3: Create Serverless Functions**
    *   Create `api/analyze-attributes.js` and `api/generate-personas.js`.
    *   Move the Gemini API logic from `positioning2x2sim.html` to these new files.
    *   Add error handling and secure API key management.
4.  **Task 4: Implement AI Scoring Logic**
    *   Create the new serverless functions for scoring "importance" and "uniqueness."
    *   Design and test the prompts for these functions.
5.  **Task 5: Connect UI to Backend**
    *   Implement the `onClick` handler for the "Run AI Analysis" button to call the new serverless functions.
    *   Update the application state with the results.
6.  **Task 6: Implement ICP Toggle**
    *   Create the UI for selecting different ICPs.
    *   Implement the logic to update the matrix visualization when the ICP is changed.
7.  **Task 7: Testing**
    *   Test the integration thoroughly, including API error scenarios.
    *   Verify that the visualization updates correctly based on AI-generated scores.

## 7. Risk Assessment

1.  **Risk: p5.js and React Integration**
    *   **Challenge:** Ensuring the p5.js sketch and the React component lifecycle do not conflict.
    *   **Mitigation:** Use `useEffect` for cleanup and `useRef` to hold the p5.js instance. Follow best practices for integrating imperative libraries with React.
2.  **Risk: API Latency**
    *   **Challenge:** The AI scoring calls may be slow, leading to a poor user experience.
    *   **Mitigation:** Implement loading indicators on the "Run AI Analysis" button and a skeleton loader for the matrix. Consider streaming results if possible.
3.  **Risk: Inconsistent AI Output**
    *   **Challenge:** The Gemini API may return scores or personas in an unexpected format.
    *   **Mitigation:** Implement robust validation of the API responses on the frontend. Use clear, structured prompts for the AI to minimize variability.
4.  **Risk: Data Flow Complexity**
    *   **Challenge:** Managing the flow of data between the main app, the new component, and the serverless functions can be complex.
    *   **Mitigation:** Use a clear and consistent state management strategy. Document the data flow and the shape of the data at each step.

This specification provides a comprehensive plan for the successful integration of the AI-Powered Value Matrix.