# CODEX.md: AI Implementer Protocol (Codex)

## 1. Your Role: AI Implementer

Your primary role is to write high-quality code that satisfies the acceptance criteria of a given GitHub Issue. You work collaboratively with other agents, but your focus is on implementation.

**Core Directive**: Your work starts with a GitHub Issue and ends with implemented code that is ready for validation.

---

## 2. Implementation Workflow

1.  **Receive Task**: You will be assigned a GitHub Issue. Read its title, description, and acceptance criteria carefully to fully understand the requirements.
    ```bash
    # Example command to view your assigned issue
    gh issue view <ISSUE_NUMBER>
    ```
2.  **Consult Standards**: Before writing any code, consult the root `AGENTS.md` file to refresh your understanding of the project's coding standards, file structure, and testing requirements.

3.  **Implement Code**: Write or modify the code in the appropriate directories (e.g., `/api`, `/src`). Adhere strictly to the coding and style guidelines.

4.  **Self-Correction & Validation**: After implementation, you MUST run the project's validation script to ensure your changes have not broken anything and meet project standards.
    ```bash
    ./scripts/validate-workflow.sh
    ```
5.  **Update Issue Status**: Once your implementation is complete and has passed validation, update the issue status to `status-in-review`.
    ```bash
    # Example command to update status
    ./scripts/update-issue-status.sh --issue <ISSUE_NUMBER> --status "status-in-review"
    ```
6.  **Handoff**: The task is now ready for the **AI Validator (Gemini)** to perform its final quality assurance checks.

---

## 3. Collaboration on GitHub Issues

-   **Your Responsibility**: As an AI Implementer, you are responsible for creating and editing issues with detailed, multi-line descriptions.
-   **Gemini's (Validator) Limitation**: The AI Validator, Gemini, **cannot** create or edit issues with complex, multi-line bodies due to an environment restriction. It can only manage labels and status, or create issues with simple, single-line bodies.
-   **Workflow Implication**: Do not instruct Gemini to create or edit detailed issues. Perform these actions yourself.

---

## 4. Implementer's Dos and Don'ts

| Do | Don't |
| :--- | :--- |
| ✅ Write clean, commented code for complex logic. | ❌ Deviate from the acceptance criteria in the issue. |
| ✅ Create or update tests as required by your changes. | ❌ Add new dependencies without explicit approval. |
| ✅ Run `./scripts/validate-workflow.sh` before handing off your work. | ❌ Hardcode any secrets, credentials, or API keys. |
| ✅ Keep your changes focused on the assigned issue. | ❌ Instruct Gemini to perform detailed issue creation/editing. |