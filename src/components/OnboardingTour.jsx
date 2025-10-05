import React, { useState, useEffect } from 'react';
import SegmentFunnelDiagram from './SegmentFunnelDiagram';
import ICPFlowDiagram from './ICPFlowDiagram';

// OnboardingTour Component - Enhanced Version with Visual Improvements
const OnboardingTour = ({ isOpen, onClose, startStep = 1 }) => {
    const [currentStep, setCurrentStep] = useState(startStep);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [subStep, setSubStep] = useState(0);
    const [visualMode, setVisualMode] = useState(true);

    const tourSteps = [
        {
            title: "Part 1: Segment Foundation",
            icon: "🏗️",
            hasInteractive: true,
            subSteps: [
                { highlight: null, title: "The Filtering Funnel", description: "See how we narrow down from Total Market to Market Segment through strategic filtering." },
                { highlight: "total-market", title: "Total Market", description: "Start with everyone who could potentially buy any solution." },
                { highlight: "jtbd-filter", title: "Jobs-to-be-Done", description: "Filter to those with specific jobs they need to get done." },
                { highlight: "value-filter", title: "Value Recognition", description: "Narrow to those who recognize the value of solving the problem." },
                { highlight: "wtp-filter", title: "Willingness to Pay", description: "Focus on those willing to pay for a solution." },
                { highlight: "segment-result", title: "Market Segment", description: "Your refined, actionable market segment." }
            ],
            content: "Welcome to the Positioning Blueprint! Everything starts with the Foundation. Here, you will define the core market problems and customer motivations using the Jobs-to-be-Done framework."
        },
        {
            title: "Part 2: ICP Definition",
            icon: "🎯",
            hasInteractive: true,
            subSteps: [
                { highlight: null, title: "ICP Development Flow", description: "Transform your Market Segment into an Actionable ICP with strategic insights." },
                { highlight: "market-segment", title: "Market Segment", description: "Start with your refined market segment from Part 1." },
                { highlight: "bridge", title: "Product/Business Model Fit", description: "Align your offering with customer needs and business model." },
                { highlight: "strategic-why", title: "Strategic Why", description: "Understand the deeper motivations and strategic value." },
                { highlight: "operational-where", title: "Operational Where", description: "Define the tactical attributes and characteristics." },
                { highlight: "actionable-icp", title: "Actionable ICP", description: "Your complete, actionable Ideal Customer Profile." }
            ],
            content: "Next, you'll use the foundation to build a clear picture of your Ideal Customer Profile (ICP). This step focuses on the firmographic, technographic, and behavioral attributes of your best customers."
        },
        {
            title: "Part 3: Positioning",
            icon: "🧩",
            hasInteractive: false,
            content: "With a clear customer in mind, you can now define your product's unique positioning. This involves identifying competitive alternatives, unique attributes, and the value you deliver that no one else can."
        },
        {
            title: "Part 4: Category Design",
            icon: "📖",
            hasInteractive: false,
            content: "Finally, you will craft the narrative. This is where you design a new market category or reframe an existing one, creating a powerful story that communicates your unique value and vision to the world."
        }
    ];

    const handleNext = () => {
        const currentStepData = tourSteps[currentStep - 1];
        if (currentStepData.hasInteractive && subStep < currentStepData.subSteps.length - 1) {
            setSubStep(subStep + 1);
        } else if (currentStep < tourSteps.length) {
            setCurrentStep(currentStep + 1);
            setSubStep(0);
        }
    };

    const handleBack = () => {
        const currentStepData = tourSteps[currentStep - 1];
        if (currentStepData.hasInteractive && subStep > 0) {
            setSubStep(subStep - 1);
        } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            const prevStepData = tourSteps[currentStep - 2];
            setSubStep(prevStepData.hasInteractive ? prevStepData.subSteps.length - 1 : 0);
        }
    };

    const handleStepClick = (stepIndex) => {
        setCurrentStep(stepIndex + 1);
        setSubStep(0);
    };

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('hasCompletedTour', 'true');
        }
        onClose();
    };

    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            handleClose();
        }
        if (e.key === 'ArrowLeft') {
            handleBack();
        }
        if (e.key === 'ArrowRight') {
            handleNext();
        }
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(startStep);
            setSubStep(0);
            document.addEventListener('keydown', handleEscapeKey);
            return () => document.removeEventListener('keydown', handleEscapeKey);
        }
    }, [isOpen, startStep]);

    if (!isOpen) return null;

    const currentStepData = tourSteps[currentStep - 1];
    const currentSubStepData = currentStepData.hasInteractive ? currentStepData.subSteps[subStep] : null;

    // Calculate progress for progress bar
    let totalSteps = 0;
    let completedSteps = 0;

    tourSteps.forEach((step, index) => {
        if (step.hasInteractive) {
            totalSteps += step.subSteps.length;
            if (index + 1 < currentStep) {
                completedSteps += step.subSteps.length;
            } else if (index + 1 === currentStep) {
                completedSteps += subStep;
            }
        } else {
            totalSteps += 1;
            if (index + 1 < currentStep) {
                completedSteps += 1;
            }
        }
    });

    const progress = Math.round((completedSteps / totalSteps) * 100);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Enhanced Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Visual Tour</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Discover the power of strategic positioning
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-blue-200 transition-colors p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-blue-100">Progress</span>
                            <span className="text-sm text-blue-100">{progress}%</span>
                        </div>
                        <div className="bg-white bg-opacity-20 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-white h-2 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6 flex flex-col lg:flex-row">
                    {/* Visualization Panel */}
                    <div className="flex-1 lg:pr-6 mb-6 lg:mb-0">
                        {/* Interactive Content for Parts 1 and 2 */}
                        {currentStepData.hasInteractive ? (
                            <div>
                                {/* Visual Mode Toggle */}
                                <div className="flex justify-center mb-4">
                                    <button
                                        onClick={() => setVisualMode(!visualMode)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                        <span className="text-sm">{visualMode ? 'Hide' : 'Show'} Visualization</span>
                                    </button>
                                </div>

                                {/* Interactive SVG Diagrams */}
                                {visualMode && (
                                    <div className="flex justify-center mb-6">
                                        {currentStep === 1 && (
                                            <SegmentFunnelDiagram
                                                highlightedSection={currentSubStepData?.highlight}
                                                subStep={subStep}
                                            />
                                        )}
                                        {currentStep === 2 && (
                                            <ICPFlowDiagram
                                                highlightedSection={currentSubStepData?.highlight}
                                                subStep={subStep}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Interactive Step Progress */}
                                <div className="flex justify-center">
                                    <div className="flex items-center space-x-2">
                                        {currentStepData.subSteps.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                    index <= subStep ? 'bg-blue-600 scale-110' : 'bg-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Static Content for Parts 3 and 4 */
                            <div className="text-center">
                                <div className="text-6xl mb-6">{currentStepData.icon}</div>
                                <div className="max-w-md mx-auto">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentStepData.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{currentStepData.content}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Explanation Panel */}
                    <div className="w-full lg:w-80 flex flex-col">
                        <div className="bg-gray-50 rounded-lg p-6 flex-1">
                            {/* Step Header */}
                            <div className="flex items-center mb-4">
                                <div className="text-2xl mr-3">{currentStepData.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{currentStepData.title}</h3>
                                    <div className="text-sm text-gray-500">
                                        Part {currentStep} of {tourSteps.length}
                                    </div>
                                </div>
                            </div>

                            {/* Current SubStep Info */}
                            {currentStepData.hasInteractive && currentSubStepData ? (
                                <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                                    <h4 className="font-medium text-gray-900 mb-2">{currentSubStepData.title}</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">{currentSubStepData.description}</p>
                                    <div className="mt-3 text-xs text-gray-500">
                                        Step {subStep + 1} of {currentStepData.subSteps.length}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-4 mb-4">
                                    <p className="text-gray-700 leading-relaxed">{currentStepData.content}</p>
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
                        <div className="flex justify-center space-x-2 mt-4">
                            {tourSteps.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleStepClick(index)}
                                    className={`w-4 h-4 rounded-full transition-all duration-200 hover:scale-110 ${
                                        index + 1 === currentStep
                                            ? 'bg-blue-600 shadow-lg'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Don't show again checkbox - only on last step */}
                        {currentStep === tourSteps.length && (
                            <div className="flex items-center justify-center mt-4">
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
                </div>

                {/* Enhanced Footer */}
                <div className="flex justify-between items-center px-6 py-4 border-t bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="text-sm text-gray-600">
                        {currentStepData.hasInteractive ? (
                            <span>Part {currentStep} • Step {subStep + 1} of {currentStepData.subSteps.length}</span>
                        ) : (
                            <span>Part {currentStep} of {tourSteps.length}</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {(currentStep > 1 || subStep > 0) && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
                            >
                                ← Back
                            </button>
                        )}
                        {(() => {
                            const isLastStep = currentStep === tourSteps.length;
                            const isLastSubStep = currentStepData.hasInteractive ? (subStep === currentStepData.subSteps.length - 1) : true;
                            const canContinue = !isLastStep || !isLastSubStep;

                            if (canContinue) {
                                return (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                                    >
                                        {currentStepData.hasInteractive && subStep < currentStepData.subSteps.length - 1 ? 'Continue →' : 'Next Part →'}
                                    </button>
                                );
                            } else {
                                return (
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                                    >
                                        Get Started! 🚀
                                    </button>
                                );
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingTour;
