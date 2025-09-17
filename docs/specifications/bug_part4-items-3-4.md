### Prompt for Claude Code: Fix Part 4 Summary Display Bugs

**Objective:** Fix two bugs in the "Positioning Foundation" summary view within the "Part 4: Category Design" component. The "Market Category" and "Target Market Characteristics" sections are not displaying the correct inherited data.

**Instructions:**
You must modify the JSX rendering logic within the `CategoryDesignTool` component in `index.html` to correctly display the data from the application's state.

**1. Locate the `CategoryDesignTool` component** in `index.html`. All changes will be inside the `return` statement of this component.

**2. Fix the "Market Category" Display:**
*   Find the `div` that renders "3. Market Category".
*   **Replace** the entire `div` with the following corrected code. This version displays both the context and the specific name, making it accurate.

    ```javascript
    {/* --- START of Market Category replacement --- */}
    <div>
        <h4 className="font-bold text-gray-800 mb-2">3. Market Category</h4>
        <div className="text-sm text-gray-600">
            {appState.positioningData['market-context'] ? (
                <p>
                    <strong>Context:</strong> {appState.positioningData['market-context'] === 'Other'
                        ? appState.positioningData['market-context-other']
                        : appState.positioningData['market-context']}
                    <br />
                    <strong>Name:</strong> {appState.positioningData['category-name'] || <span className="italic">Not provided</span>}
                </p>
            ) : (
                <span className="italic">Complete Part 3 first</span>
            )}
        </div>
    </div>
    {/* --- END of Market Category replacement --- */}
    ```

**3. Fix the "Target Market Characteristics" Display:**
*   Find the `div` that renders "4. Target Market Characteristics".
*   **Replace** the entire `div` with the following corrected code. This version checks for the correct data fields instead of the obsolete `icp_summary` field.

    ```javascript
    {/* --- START of Target Market Characteristics replacement --- */}
    <div>
        <h4 className="font-bold text-gray-800 mb-2">4. Target Market Characteristics</h4>
        <div className="text-sm text-gray-600">
            {(appState.positioningData.icp_firmographic || appState.positioningData.icp_technographic || appState.positioningData.icp_behavioral) ? (
                <div className="space-y-2 ml-4">
                    {appState.positioningData.icp_firmographic && (
                        <div><strong>Firmographic:</strong> {appState.positioningData.icp_firmographic}</div>
                    )}
                    {appState.positioningData.icp_technographic && (
                        <div><strong>Technographic:</strong> {appState.positioningData.icp_technographic}</div>
                    )}
                    {appState.positioningData.icp_behavioral && (
                        <div><strong>Behavioral:</strong> {appState.positioningData.icp_behavioral}</div>
                    )}
                    {appState.positioningData.icp_implementation_readiness && (
                        <div><strong>Implementation Readiness:</strong> {appState.positioningData.icp_implementation_readiness}</div>
                    )}
                </div>
            ) : (
                <span className="italic">Complete Part 3 first</span>
            )}
        </div>
    </div>
    {/* --- END of Target Market Characteristics replacement --- */}
    ```

**Final Checklist:**
- [ ] The "Market Category" summary in Part 4 now correctly displays both the context and the name from Part 3.
- [ ] The "Target Market Characteristics" summary in Part 4 now correctly displays the individual Firmographic, Technographic, and other fields from the state.
- [ ] The "Complete Part 3 first" message only appears if the relevant data is truly missing.
