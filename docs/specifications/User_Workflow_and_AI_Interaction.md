# User Workflow and AI Interaction Model

This document outlines the detailed user workflow for the Positioning Blueprint application, focusing on the intended interplay between user input, AI-powered research, and the iterative process of refining product positioning.

## Core Philosophy: Human-AI Partnership

The application is designed as a structured thinking tool that facilitates a partnership between the user's strategic insights and the analytical power of AI. The user provides the initial context and makes the final decisions, while the AI acts as a research and analysis assistant, accelerating the process and uncovering new insights.

## Detailed User Journey

**Persona:** A product marketer, founder, or strategist looking to define or refine their product's positioning.

**Goal:** To develop a comprehensive positioning strategy—from market segmentation to category design—by leveraging a hybrid workflow of manual input and AI-generated research.

---

### **Phase 1: Setup and Foundational Research**

1.  **Company & Product Definition (User Input):**
    *   The user starts by launching the application and is greeted with the `CompanySetupModal`.
    *   They provide the core context by entering:
        *   **Company Name**
        *   **Website URL**
        *   **Product/Service Name**
        *   A list of known **Competitors or Alternatives**.
    *   This initial context is crucial as it seeds all subsequent AI-powered features.

2.  **Generating the Deep Research Prompt (AI-Assisted):**
    *   From the home screen, the user clicks **"Generate Research Prompt"**.
    *   The application generates a detailed, structured prompt tailored to the user's company context.
    *   This prompt is specifically engineered to instruct a Large Language Model (LLM) like Claude, ChatGPT, or Gemini to act as a market research analyst. It requests a "deep research report" covering critical positioning elements:
        *   Market Overview & Trends
        *   Customer Segments & Needs
        *   Jobs to be Done (JTBD)
        *   Competitor Positioning & Messaging Analysis
        *   Identification of Unique Differentiators
        *   Potential Market Category Opportunities

3.  **Conducting Off-Platform Research (User Action):**
    *   The user copies the generated prompt and utilizes it with their preferred external AI tool.
    *   The LLM generates a comprehensive research report.
    *   The user saves this report as a Markdown (`.md`) or plain text (`.txt`) file.

---

### **Phase 2: Processing Research and Building the Blueprint**

4.  **Uploading and Processing the Research Report (AI-Powered):**
    *   Back in the application, the user clicks **"Process a Deep Research Report"**.
    *   The `AIResearchModal` opens, allowing the user to upload the newly created research report.
    *   The application's backend API (`gemini-analyze.js` or similar) parses the report, performing entity extraction and insight identification.

5.  **Part 1: Segment Foundation (Iterative Refinement):**
    *   The user navigates to the **Segment Foundation Tool**.
    *   The tool’s form fields may be pre-populated with **AI-generated suggestions** derived from the processed report (e.g., potential market segments, their characteristics, and needs).
    *   The user’s primary task is to **review, edit, and approve** these suggestions, blending the AI's analysis with their own domain expertise to define a clear set of targetable market segments.

6.  **Part 2: ICP Definition (Iterative Refinement):**
    *   The user proceeds to the **ICP Definition Tool**.
    *   Similar to the previous step, the tool presents AI-suggested attributes for the Ideal Customer Profile (demographics, psychographics, key pain points, etc.).
    *   The user refines these attributes to build a detailed and actionable ICP.

7.  **Part 3: Positioning (Iterative Refinement):**
    *   In the **Positioning Tool**, the user focuses on crafting their core positioning statement.
    *   The AI presents the extracted competitor positioning and messaging from the research report, providing a clear competitive landscape.
    *   The user leverages this analysis to define their product's **unique differentiators, value proposition, and competitive alternatives**.

8.  **Part 4: Category Design (Iterative Refinement):**
    *   In the final step, the **Category Design Tool**, the user works on designing or defining their market category.
    *   The AI may suggest potential category opportunities based on gaps identified in the research report.
    *   The user develops the **category narrative** and defines the "From-To" mental shift they aim to create for their customers.

---

### **Phase 3: Iteration, Export, and Collaboration**

9.  **Iterative Refinement Loop:**
    *   The workflow is non-linear. The user can—and is encouraged to—circle back to previous steps as new insights emerge. For example, an insight gained during the **Positioning** step might prompt them to revise their **ICP Definition**.
    *   The user can also upload new or updated research reports at any point to get fresh AI-powered suggestions, allowing for continuous refinement.

10. **Exporting and Sharing the Blueprint:**
    *   Once satisfied, the user can export each part of the blueprint as a structured **JSON file**.
    *   This feature enables them to:
        *   Save and back up their work.
        *   Share their progress with team members for collaboration.
        *   Import the data back into the tool at a later time to continue their work.
