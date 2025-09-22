# Feature Specification: Visual Onboarding Tour

**Issue Title:** FEAT: Implement Visual Onboarding Tour

---

## 1. User Story

As a new user, I want a quick visual tour of the application's 4 steps so that I can understand the core workflow and its value. As an existing user, I want to be able to re-launch this tour at any time to refresh my memory.

---

## 2. Concept: The "Welcome Tour" Modal

This feature will be an interactive, multi-step modal that guides the user through the application's core methodology. 

- **Trigger for New Users**: The modal will appear automatically upon a user's first visit.
- **Trigger for All Users**: A persistent help icon (e.g., a "?" button) will be added to the main UI header, allowing any user to launch the tour on demand.

---

## 3. Storyboard & Content

The tour will consist of four main steps, one for each part of the blueprint.

**Step 1: The Foundation**
- **Title**: Part 1: Segment Foundation
- **Text**: "Welcome to the Positioning Blueprint! Everything starts with the Foundation. Here, you will define the core market problems and customer motivations using the Jobs-to-be-Done framework. This is the 'why' behind any purchase."
- **Visual**: An icon representing a cornerstone or foundation.

**Step 2: The Customer**
- **Title**: Part 2: ICP Definition
- **Text**: "Next, you'll use the foundation to build a clear picture of your Ideal Customer Profile (ICP). This step focuses on the firmographic, technographic, and behavioral attributes of your best customers."
- **Visual**: An icon representing a user persona or target.

**Step 3: The Product**
- **Title**: Part 3: Positioning
- **Text**: "With a clear customer in mind, you can now define your product's unique positioning. This involves identifying competitive alternatives, unique attributes, and the value you deliver that no one else can."
- **Visual**: An icon representing a unique puzzle piece or a flag on a map.

**Step 4: The Narrative**
- **Title**: Part 4: Category Design
- **Text**: "Finally, you will craft the narrative. This is where you design a new market category or reframe an existing one, creating a powerful story that communicates your unique value and vision to the world."
- **Visual**: An icon representing a book or a speech bubble.

---

## 4. Acceptance Criteria

1.  A multi-step tour modal component shall be created.
2.  The tour must launch automatically for any user who does not have a completion flag in their `localStorage`.
3.  A persistent help icon/button shall be present in the main application header.
4.  Clicking the help button shall launch the tour modal.
5.  **Context-Aware Launch**: If the user clicks the help button while viewing a specific part of the blueprint (e.g., "Positioning"), the tour shall open directly to the corresponding step (e.g., Step 3).
6.  The modal must contain "Next" and "Back" buttons to navigate between steps.
7.  The modal must be dismissible at any time (e.g., via an "X" button or by pressing the Escape key).
8.  The tour must include a "Don't show this again" checkbox or a similar mechanism that, when checked, sets a flag in `localStorage` to prevent automatic pop-ups on subsequent visits.

---

## 5. Technical Approach

- **Component**: Create a new reusable React component (e.g., `OnboardingTour.js`).
- **State Management**: Use `localStorage` to store a flag (e.g., `hasCompletedTour: true`) to manage the tour's visibility for returning users.
- **Context-Awareness**: The tour component should accept a prop to define its starting step (e.g., `<OnboardingTour startStep={3} />`). The main application state should track the current view (`segment`, `icp`, etc.) and pass the relevant starting step to the tour component when the help button is clicked.
