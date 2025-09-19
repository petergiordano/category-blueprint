Claude Code,

This is a handoff for the initial implementation and testing phase of the "AI Research Assistant" feature.

**Your primary tasks are to:**

1.  **Review the Epic PRD:** Familiarize yourself with the overall feature by reviewing `docs/specifications/EPIC_SPEC_AI_Research_Assistant.md`.
2.  **Review Existing Code:** Examine the current state of the `feat/ai-research-assistant` branch, specifically the changes made for Issues #50, #51, and #55.
    *   `api/mine-research-report.js` (backend endpoint scaffolding)
    *   `tests/api/mine-research-report.test.js` (backend unit test scaffolding)
    *   `index.html` (frontend UI modifications: "Import Part Data" rename, `App` component state, `ProgressStepper` prop passing).
3.  **Complete Implementation & Testing:**
    *   **Issue #50 (Backend Endpoint):** Fully implement the `/api/mine-research-report.js` endpoint. This includes refining the JSON templates, ensuring robust error handling, and correctly integrating with the LLM (Gemini API).
    *   **Issue #51 (Frontend UI):** Complete the implementation of the "AI Research Assistant" button and the "Upload Research Report" modal in `index.html`. This involves adding the modal's HTML structure, styling, file upload logic, and making the API call to the new backend endpoint.
    *   **Issue #55 (Backend Unit Tests):** Complete the unit tests in `tests/api/mine-research-report.test.js` to thoroughly cover the backend endpoint's functionality. Ensure all tests pass.
4.  **Commit Strategy:** Commit changes related to each issue separately, referencing the issue number in the commit message (e.g., `FEAT-50: Implement backend mining endpoint`).
5.  **Update Issue Status:** Once the implementation and testing for Issues #50, #51, and #55 are complete and verified, update their respective statuses on GitHub to `status-complete`.

**Context Preservation:**
- The `GEMINI_API_KEY` needs to be set in `.env.local` for local development and in Vercel environment variables for deployment.
- `@google/generative-ai` is already installed via `npm`.

Please proceed with these tasks.
