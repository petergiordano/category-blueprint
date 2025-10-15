/**
 * VISUAL TOUR TEMPLATE
 *
 * A minimal, reusable implementation of the visual tour pattern.
 * Customize styling, content, and behavior to match your application.
 *
 * Key Features:
 * - Two-level navigation (main steps + substeps)
 * - Visual highlighting support
 * - Progress tracking
 * - Keyboard navigation
 * - Persistence
 */

import React, { useState, useEffect } from 'react';

// =============================================================================
// CONFIGURATION
// =============================================================================

const TOUR_CONFIG = [
    {
        id: 'step-1',
        title: 'Introduction',
        icon: '👋',
        hasInteractive: false,
        content: 'Welcome! This is a simple step with static content.'
    },
    {
        id: 'step-2',
        title: 'Interactive Feature',
        icon: '⚡',
        hasInteractive: true,
        subSteps: [
            {
                highlight: null,
                title: 'Overview',
                description: 'See the big picture of this feature.'
            },
            {
                highlight: 'element-1',
                title: 'First Element',
                description: 'This is the first component you should know about.'
            },
            {
                highlight: 'element-2',
                title: 'Second Element',
                description: 'This builds on the first element.'
            },
            {
                highlight: 'element-3',
                title: 'Third Element',
                description: 'The final piece that ties it all together.'
            }
        ]
    },
    {
        id: 'step-3',
        title: 'Conclusion',
        icon: '🎉',
        hasInteractive: false,
        content: 'You\'re all set! Start exploring on your own.'
    }
];

// =============================================================================
// MAIN TOUR COMPONENT
// =============================================================================

const VisualTour = ({ isOpen, onClose, startStep = 1 }) => {
    const [currentStep, setCurrentStep] = useState(startStep);
    const [subStep, setSubStep] = useState(0);
    const [visualMode, setVisualMode] = useState(true);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Navigation handlers
    const handleNext = () => {
        const stepData = TOUR_CONFIG[currentStep - 1];

        if (stepData.hasInteractive && subStep < stepData.subSteps.length - 1) {
            setSubStep(subStep + 1);
        } else if (currentStep < TOUR_CONFIG.length) {
            setCurrentStep(currentStep + 1);
            setSubStep(0);
        }
    };

    const handleBack = () => {
        const stepData = TOUR_CONFIG[currentStep - 1];

        if (stepData.hasInteractive && subStep > 0) {
            setSubStep(subStep - 1);
        } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            const prevStep = TOUR_CONFIG[currentStep - 2];
            setSubStep(prevStep.hasInteractive ? prevStep.subSteps.length - 1 : 0);
        }
    };

    const handleStepClick = (stepIndex) => {
        setCurrentStep(stepIndex + 1);
        setSubStep(0);
    };

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('tourCompleted', 'true');
        }
        onClose();
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isOpen) return;

            switch(e.key) {
                case 'Escape':
                    handleClose();
                    break;
                case 'ArrowLeft':
                    handleBack();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, currentStep, subStep]);

    // Progress calculation
    const calculateProgress = () => {
        let total = 0;
        let completed = 0;

        TOUR_CONFIG.forEach((step, idx) => {
            const stepCount = step.hasInteractive ? step.subSteps.length : 1;
            total += stepCount;

            if (idx + 1 < currentStep) {
                completed += stepCount;
            } else if (idx + 1 === currentStep) {
                completed += step.hasInteractive ? subStep : 0;
            }
        });

        return Math.round((completed / total) * 100);
    };

    if (!isOpen) return null;

    const stepData = TOUR_CONFIG[currentStep - 1];
    const subStepData = stepData.hasInteractive ? stepData.subSteps[subStep] : null;
    const progress = calculateProgress();
    const isLastStep = currentStep === TOUR_CONFIG.length;
    const isLastSubStep = stepData.hasInteractive ? subStep === stepData.subSteps.length - 1 : true;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">

                {/* HEADER */}
                <TourHeader
                    progress={progress}
                    onClose={handleClose}
                />

                {/* BODY */}
                <div className="p-6 flex flex-col lg:flex-row gap-6">

                    {/* Visualization Panel */}
                    <VisualizationPanel
                        stepData={stepData}
                        subStepData={subStepData}
                        visualMode={visualMode}
                        onToggleVisual={() => setVisualMode(!visualMode)}
                        currentStep={currentStep}
                        subStep={subStep}
                    />

                    {/* Explanation Panel */}
                    <ExplanationPanel
                        stepData={stepData}
                        subStepData={subStepData}
                        currentStep={currentStep}
                        totalSteps={TOUR_CONFIG.length}
                        subStep={subStep}
                        onStepClick={handleStepClick}
                    />
                </div>

                {/* FOOTER */}
                <TourFooter
                    stepData={stepData}
                    currentStep={currentStep}
                    subStep={subStep}
                    totalSteps={TOUR_CONFIG.length}
                    isLastStep={isLastStep}
                    isLastSubStep={isLastSubStep}
                    onBack={handleBack}
                    onNext={handleNext}
                    onClose={handleClose}
                    dontShowAgain={dontShowAgain}
                    setDontShowAgain={setDontShowAgain}
                />
            </div>
        </div>
    );
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const TourHeader = ({ progress, onClose }) => (
    <div className="header-gradient text-white px-6 py-4">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold">Product Tour</h2>
                <p className="text-sm mt-1 opacity-90">
                    Discover the key features
                </p>
            </div>
            <button
                onClick={onClose}
                className="hover:opacity-80 transition-opacity p-1"
                aria-label="Close tour"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm opacity-90">Progress</span>
                <span className="text-sm opacity-90">{progress}%</span>
            </div>
            <div className="bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-white h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    </div>
);

const VisualizationPanel = ({ stepData, subStepData, visualMode, onToggleVisual, currentStep, subStep }) => (
    <div className="flex-1">
        {stepData.hasInteractive ? (
            <>
                {/* Toggle Button */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={onToggleVisual}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm">{visualMode ? 'Hide' : 'Show'} Visualization</span>
                    </button>
                </div>

                {/* Interactive Diagram */}
                {visualMode && (
                    <div className="flex justify-center mb-6">
                        <InteractiveDiagram
                            highlightElement={subStepData?.highlight}
                            stepIndex={currentStep}
                        />
                    </div>
                )}

                {/* Substep Indicators */}
                <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                        {stepData.subSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index <= subStep
                                        ? 'bg-primary scale-110'
                                        : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </>
        ) : (
            /* Static Content */
            <div className="text-center">
                <div className="text-6xl mb-6">{stepData.icon}</div>
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {stepData.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        {stepData.content}
                    </p>
                </div>
            </div>
        )}
    </div>
);

const ExplanationPanel = ({ stepData, subStepData, currentStep, totalSteps, subStep, onStepClick }) => (
    <div className="w-full lg:w-80 flex flex-col">
        <div className="bg-gray-50 rounded-lg p-6 flex-1">

            {/* Step Header */}
            <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">{stepData.icon}</div>
                <div>
                    <h3 className="font-semibold text-gray-800">{stepData.title}</h3>
                    <div className="text-sm text-gray-500">
                        Part {currentStep} of {totalSteps}
                    </div>
                </div>
            </div>

            {/* Content Card */}
            {stepData.hasInteractive && subStepData ? (
                <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-primary">
                    <h4 className="font-medium text-gray-900 mb-2">
                        {subStepData.title}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {subStepData.description}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                        Step {subStep + 1} of {stepData.subSteps.length}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-gray-700 leading-relaxed">
                        {stepData.content}
                    </p>
                </div>
            )}

            {/* Navigation Info */}
            <div className="text-xs text-gray-500 bg-white rounded p-3">
                <div className="font-medium mb-1">Navigation:</div>
                <div>• Arrow keys: Navigate steps</div>
                <div>• Escape: Close tour</div>
                <div>• Click dots: Jump to step</div>
            </div>
        </div>

        {/* Main Step Indicators */}
        <div className="flex justify-center gap-2 mt-4">
            {TOUR_CONFIG.map((_, index) => (
                <button
                    key={index}
                    onClick={() => onStepClick(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-200 hover:scale-110 ${
                        index + 1 === currentStep
                            ? 'bg-primary shadow-lg'
                            : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                />
            ))}
        </div>
    </div>
);

const TourFooter = ({
    stepData,
    currentStep,
    subStep,
    totalSteps,
    isLastStep,
    isLastSubStep,
    onBack,
    onNext,
    onClose,
    dontShowAgain,
    setDontShowAgain
}) => (
    <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
        <div className="flex justify-between items-center">

            {/* Step Counter */}
            <div className="text-sm text-gray-600">
                {stepData.hasInteractive ? (
                    <span>Part {currentStep} • Step {subStep + 1} of {stepData.subSteps.length}</span>
                ) : (
                    <span>Part {currentStep} of {totalSteps}</span>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
                {(currentStep > 1 || subStep > 0) && (
                    <button
                        onClick={onBack}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-medium"
                    >
                        ← Back
                    </button>
                )}

                {!(isLastStep && isLastSubStep) ? (
                    <button
                        onClick={onNext}
                        className="px-6 py-2 button-gradient text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                        {stepData.hasInteractive && subStep < stepData.subSteps.length - 1
                            ? 'Continue →'
                            : 'Next Part →'}
                    </button>
                ) : (
                    <button
                        onClick={onClose}
                        className="px-6 py-2 button-gradient text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                        Get Started! 🚀
                    </button>
                )}
            </div>
        </div>

        {/* Don't Show Again - Only on last step */}
        {isLastStep && (
            <div className="flex justify-center mt-3">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="mr-2 rounded"
                    />
                    Don't show this tour again
                </label>
            </div>
        )}
    </div>
);

// =============================================================================
// INTERACTIVE DIAGRAM COMPONENT
// =============================================================================

const InteractiveDiagram = ({ highlightElement, stepIndex }) => {
    const getOpacity = (elementId) => {
        if (!highlightElement) return 1;
        return highlightElement === elementId ? 1 : 0.3;
    };

    const getFilter = (elementId) => {
        if (!highlightElement) return '';
        return highlightElement === elementId ? 'drop-shadow(0 0 8px currentColor)' : '';
    };

    // Replace this with your own visualization
    return (
        <svg width="600" height="400" viewBox="0 0 600 400" className="max-w-full h-auto">
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
                </marker>
            </defs>

            {/* Example elements - customize for your needs */}

            {/* Element 1 */}
            <g style={{
                opacity: getOpacity('element-1'),
                filter: getFilter('element-1'),
                transition: 'all 0.3s ease'
            }}>
                <rect x="50" y="50" width="150" height="80" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" rx="8" />
                <text x="125" y="95" textAnchor="middle" fill="#4f46e5" fontSize="16" fontWeight="600">
                    Element 1
                </text>
            </g>

            {/* Arrow */}
            <line
                x1="200"
                y1="90"
                x2="250"
                y2="90"
                stroke="#333"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                style={{ opacity: getOpacity('arrow1'), transition: 'all 0.3s ease' }}
            />

            {/* Element 2 */}
            <g style={{
                opacity: getOpacity('element-2'),
                filter: getFilter('element-2'),
                transition: 'all 0.3s ease'
            }}>
                <rect x="250" y="50" width="150" height="80" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="8" />
                <text x="325" y="95" textAnchor="middle" fill="#2563eb" fontSize="16" fontWeight="600">
                    Element 2
                </text>
            </g>

            {/* Arrow */}
            <line
                x1="400"
                y1="90"
                x2="450"
                y2="90"
                stroke="#333"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                style={{ opacity: getOpacity('arrow2'), transition: 'all 0.3s ease' }}
            />

            {/* Element 3 */}
            <g style={{
                opacity: getOpacity('element-3'),
                filter: getFilter('element-3'),
                transition: 'all 0.3s ease'
            }}>
                <rect x="450" y="50" width="100" height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="8" />
                <text x="500" y="95" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="600">
                    Result
                </text>
            </g>
        </svg>
    );
};

// =============================================================================
// CSS (Add to your stylesheet or use CSS-in-JS)
// =============================================================================

const styles = `
/* Customize these to match your brand */

.header-gradient {
    background: linear-gradient(to right, var(--brand-primary), var(--brand-secondary));
}

.button-gradient {
    background: linear-gradient(to right, var(--brand-primary), var(--brand-secondary));
}

.bg-primary {
    background-color: var(--brand-primary);
}

.border-primary {
    border-color: var(--brand-primary);
}

/* Example brand colors - replace with yours */
:root {
    --brand-primary: #3b82f6;
    --brand-secondary: #8b5cf6;
}
`;

// =============================================================================
// EXPORT
// =============================================================================

export default VisualTour;

// Usage example:
/*
function App() {
    const [showTour, setShowTour] = useState(() => {
        return !localStorage.getItem('tourCompleted');
    });

    return (
        <>
            <YourMainApp />

            <VisualTour
                isOpen={showTour}
                onClose={() => setShowTour(false)}
                startStep={1}
            />

            <button onClick={() => setShowTour(true)}>
                Show Tour
            </button>
        </>
    );
}
*/
