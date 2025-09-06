# PRD_Positioning_Epic.md
This document will be the "source of truth" for this entire body of work. It will not just be a list of features; it will be a strategic brief that captures the *why* behind the what. It will be designed to give any AI agent (or human) the full context and nuance of our plan.

Here is a proposed outline and content for this new PRD. This captures all of our thinking and sets us up for a phased implementation.

### **Proposed Content for `docs/specifications/PRD_Positioning_Epic.md`**

#### **1. Objective: The "Klarity" Mandate**

Our objective is to transform the GTM Blueprint application from a strategic canvas into an intelligent GTM collaborator. The goal is to build a tool that helps successful, post-product-market-fit companies like **Klarity** uncover their latent, most powerful positioning.

We will achieve this by moving beyond a company's *stated* positioning and using AI to discover the true **Job to be Done (JTBD)** of their best customers. The tool must be able to synthesize real-world signals (customer interviews, usage data, public statements) to reveal *why* customers truly buy, how they measure value, and what drives their willingness to pay.

The core insight we are building around is the difference between "Company A" (the best customer, who uses a product for a strategic, revenue-generating job) and "Company B" (the average customer, who may use it for a tactical, cost-avoidance job). Our tool must help users find more "Company A's" and build a business case around them.

#### **2. User Goals**

* **UG-1:** As a CEO, I want to move beyond my team's gut feel and use a data-driven approach to understand our best customers.
* **UG-2:** As a GTM leader, I want to clearly see the difference in perceived value between different customer segments.
* **UG-3:** As a product marketer, I want to simulate how different value propositions will land with different ICPs to find our "Winning Zone."
* **UG-4:** As a strategist, I want to uncover the true, underlying JTBD of our target market to build a foundation for durable category leadership.

#### **3. Phased Feature Specifications**

This epic will be built in three distinct, value-adding phases.

**Phase 1: The Workshop Accelerator (Standalone Simulator)**
* **Feature:** F-9: Interactive Positioning Simulator
* **Description:** A standalone, enhanced version of the `positioning2x2sim.html` file, specifically designed for live, facilitated workshops like the one with Klarity. It will be a tool for manually plotting and visualizing the value disparity between different customer profiles ("Company A" vs. "Company B") to generate a strategic insight in real-time. This phase will **not** use live AI calls, prioritizing speed, reliability, and guided facilitation.
* **Acceptance Criteria:**
    * A standalone HTML file exists, separate from `index.html`.
    * The UI allows a facilitator to define two customer profiles (e.g., "Best Customer" and "Surprising Customer").
    * The UI allows for manually inputting and plotting value propositions on the 2x2 Value/Uniqueness matrix.
    * The tool visually demonstrates how the same benefit is valued differently by each customer profile.

**Phase 2: The Integrated AI Analysis (AI-Powered `index.html`)**
* **Feature:** F-10: AI-Powered Value Matrix
* **Description:** This phase integrates the 2x2 simulator directly into the main `index.html` application as a new "AI Positioning Analysis" section. This feature will automate the analysis by using AI to score and plot the user's value propositions based on their ICP. It brings the power of the simulator to all users of the main app.
* **Acceptance Criteria:**
    * A new section in `index.html` displays the 2x2 matrix.
    * A "Run AI Analysis" button triggers AI calls to score each value proposition on "Importance (to the ICP)" and "Uniqueness (in the market)."
    * The results are dynamically plotted on the matrix.
    * The feature allows users to toggle between different ICPs and see the value propositions shift on the matrix in real-time.

**Phase 3: The AI Research Engine (The Grand Vision)**
* **Feature:** F-11: Outside-In JTBD Discovery Agent
* **Description:** This is the long-term vision. A powerful AI agent that takes a list of target companies and personas as input. It will perform deep, outside-in research on the public internet, analyzing everything from financial reports to LinkedIn posts to find "breadcrumbs." The goal is to synthesize these signals into a data-driven hypothesis for the target's true Job to be Done, their value drivers, and their willingness to pay.
* **Acceptance Criteria (High-Level):**
    * The system can ingest a list of target companies.
    * An AI agent performs automated research on those companies from public sources.
    * The system produces a "Signal Report" that qualifies sources and categorizes findings (e.g., Pains vs. Gains).
    * The report culminates in a generated JTBD hypothesis for the target company.

---