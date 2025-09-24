import React, { useState, useEffect } from 'react';
import { CompanySetupModal } from './CompanySetupModal';
import { PromptDisplayModal } from './PromptDisplayModal';
import { SessionMenu } from './SessionMenu';
import { generateDeepResearchPrompt } from '../utils/helpers';

const Home = ({ appState, setAppState, onNavigate, setShowAIResearchModal, openTourAtStep, onImport, onExport, disabled }) => {
    console.log('HomeView props:', { appState, setAppState, onNavigate });

    const [showCompanySetupModal, setShowCompanySetupModal] = useState(() => {
        // Initialize modal state based on setup completion
        return !appState.companyContext?.isSetupComplete;
    });

    // State for the user guide accordion
    const [showUserGuide, setShowUserGuide] = useState(false);

    // State for the prompt display modal
    const [promptModalData, setPromptModalData] = useState({
        isOpen: false,
        title: '',
        promptText: ''
    });


    // Separate useEffect for debugging
    useEffect(() => {
        console.log('CompanyContext:', appState.companyContext);
        console.log('Should show modal:', !appState.companyContext?.isSetupComplete);
        console.log('Modal state:', showCompanySetupModal);
    });

    // useEffect to sync modal state with company context changes
    useEffect(() => {
        const shouldShowModal = !appState.companyContext?.isSetupComplete;
        if (shouldShowModal !== showCompanySetupModal) {
            setShowCompanySetupModal(shouldShowModal);
        }
    }, [appState.companyContext?.isSetupComplete]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Existing welcome content */}
                <h1 className="text-4xl font-bold text-center mb-8 scale-green-text">Welcome to Positioning Blueprint</h1>

                {/* Company Context Display */}
                {appState.companyContext?.isSetupComplete && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-3">Current Company Context</h3>
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div>
                                <span className="font-medium">Company:</span> {appState.companyContext.companyName || 'Not specified'}
                            </div>
                            <div>
                                <span className="font-medium">Product:</span> {appState.companyContext.productName || 'Not specified'}
                            </div>
                        </div>

                        {/* Reset Company Setup Button */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 items-start">
                            <button
                                onClick={() => {
                                    // Reset company context to trigger modal
                                    setAppState(prev => ({
                                        ...prev,
                                        companyContext: {
                                            ...prev.companyContext,
                                            isSetupComplete: false
                                        }
                                    }));
                                    // This will trigger the CompanySetupModal to show again
                                }}
                                className="text-sm text-gray-600 hover:text-blue-600 underline"
                            >
                                Change Company Setup
                            </button>


                        </div>
                    </div>
                )}

                {/* Action Buttons Grid - Enhanced UX Layout */}
                {/* 2x2 responsive grid with left-to-right, top-to-bottom flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                    {/* Top-Left: Generate Research Prompt */}
                    <button
                        onClick={() => {
                            try {
                                const promptText = generateDeepResearchPrompt(appState.companyContext);

                                if (promptText && promptText.startsWith('Error generating prompt')) {
                                    alert(promptText);
                                    return;
                                }

                                setPromptModalData({
                                    isOpen: true,
                                    title: `Deep Research Prompt for ${appState.companyContext?.companyName || 'Your Company'}`,
                                    promptText: promptText
                                });
                            } catch (error) {
                                console.error('Failed to generate prompt:', error);
                                alert('Failed to generate research prompt. Please try again.');
                            }
                        }}
                        className="p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl order-1"
                    >
                        Generate Research Prompt
                    </button>

                    {/* Top-Right: Primary Action Button - Conditional Green Button */}
                    {appState.navigationProgress.completedParts.length > 0 ? (
                        <button
                            onClick={() => {
                                // Find the last incomplete part
                                const parts = ['segment', 'icp', 'positioning', 'category'];
                                const nextPart = parts.find(p => !appState.navigationProgress.completedParts.includes(p));
                                onNavigate(nextPart || 'segment');
                            }}
                            className="p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl order-2"
                        >
                            Continue Where You Left Off
                        </button>
                    ) : (
                        <button
                            onClick={() => onNavigate('segment')}
                            className="p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl order-2"
                        >
                            Start Blueprint Process
                        </button>
                    )}

                    {/* Bottom-Left: AI Research Assistant */}
                    <button
                        onClick={() => setShowAIResearchModal(true)}
                        className="p-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2 order-3"
                        title="Upload and analyze research reports to automatically populate form fields across the Positioning Blueprint"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Process a Deep Research Report
                    </button>

                    {/* Bottom-Right: Start Fresh Button - Show conditionally */}
                    {(appState.navigationProgress.completedParts.length > 0 ||
                      Object.keys(appState.segmentData || {}).length > 0 ||
                      Object.keys(appState.positioningData || {}).length > 0 ||
                      Object.keys(appState.categoryData || {}).length > 0) && (
                        <button
                            onClick={() => {
                                if (window.confirm('This will clear all your progress and form data. Are you sure?')) {
                                    // Clear all progress
                                    localStorage.removeItem('categoryBlueprintState');
                                    window.location.reload();
                                }
                            }}
                            className="p-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold text-lg shadow-md transition-all duration-200 hover:shadow-lg order-4"
                        >
                            Start Fresh
                        </button>
                    )}
                </div>

                {/* User Guide and Visual Tour Buttons */}
                <div className="text-center mb-8 mt-12">
                    <div className="inline-flex gap-4">
                        <button
                            onClick={() => setShowUserGuide(!showUserGuide)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 inline-flex items-center gap-2"
                        >
                            <span>📚</span>
                            User Guide
                            <span className={`transform transition-transform duration-200 ${showUserGuide ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        <button
                            onClick={() => openTourAtStep(1)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 inline-flex items-center gap-2"
                        >
                            <span>🎯</span>
                            Visual Tour
                        </button>

                        <SessionMenu
                            onImport={onImport}
                            onExport={onExport}
                            disabled={disabled}
                        />
                    </div>
                </div>

                {/* User Guide Accordion */}
                {showUserGuide && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-600">
                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Getting Started</h2>

                            <div className="space-y-6">
                                {/* Step 1: Company Setup */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Company Setup</h3>
                                    <div className="ml-4 space-y-2">
                                        <p className="text-gray-700">1. Enter your company information in the welcome screen:</p>
                                        <ul className="ml-6 list-disc space-y-1 text-gray-600">
                                            <li>Company name</li>
                                            <li>Website URL</li>
                                            <li>Product/service name</li>
                                            <li>Competitors or Alternatives</li>
                                        </ul>
                                        <p className="text-gray-700">2. Click "Continue" to proceed to the main application</p>
                                    </div>
                                </div>

                                {/* Step 2: AI-Powered Research Features */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 2: AI-Powered Research Features</h3>
                                    <div className="ml-4 space-y-2">
                                        <p className="text-gray-700">Positioning Blueprint offers several AI-powered tools to accelerate your research and analysis:</p>

                                        <div className="bg-blue-50 p-3 rounded-lg mt-3">
                                            <h4 className="font-semibold text-blue-800 mb-2">📝 Generate Research Prompt</h4>
                                            <p className="text-blue-700 text-sm mb-2">Creates a customized AI research prompt based on your company information.</p>
                                            <ul className="ml-4 list-disc space-y-1 text-blue-700 text-sm">
                                                <li>Available on the home screen after company setup</li>
                                                <li>Generates prompts tailored to your company, product, and competitors</li>
                                                <li>Copy to use with external AI assistants like ChatGPT or Claude</li>
                                                <li>Download as text file for future reference</li>
                                            </ul>
                                        </div>

                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-purple-800 mb-2">🔬 Process a Deep Research Report</h4>
                                            <p className="text-purple-700 text-sm mb-2">Upload research reports and let AI extract insights for your Positioning Blueprint.</p>
                                            <ul className="ml-4 list-disc space-y-1 text-purple-700 text-sm">
                                                <li>Available via the purple button on home screen</li>
                                                <li>Supports markdown (.md) and text (.txt) files</li>
                                                <li>AI analyzes content and suggests form field inputs</li>
                                                <li>Apply suggestions directly to your blueprint sections</li>
                                                <li>Process multiple reports to build comprehensive data</li>
                                            </ul>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">✨ AI Research Assistant</h4>
                                            <p className="text-gray-700 text-sm mb-2">Available during blueprint process via navigation bar.</p>
                                            <ul className="ml-4 list-disc space-y-1 text-gray-700 text-sm">
                                                <li>Sparkle icon in top navigation while working on sections</li>
                                                <li>Upload research documents for context-aware suggestions</li>
                                                <li>Get AI recommendations for current section you're working on</li>
                                                <li>Tooltip guidance: "Upload a research report to get AI suggestions"</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Import/Export Features */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 3: Import/Export Features</h3>
                                    <div className="ml-4 space-y-2">
                                        <p className="text-gray-700">Save and restore your work using the built-in import/export functionality:</p>

                                        <div className="bg-indigo-50 p-3 rounded-lg mt-3">
                                            <h4 className="font-semibold text-indigo-800 mb-2">📤 Export Your Work</h4>
                                            <p className="text-indigo-700 text-sm mb-2">Save your progress as downloadable files:</p>
                                            <ul className="ml-4 list-disc space-y-1 text-indigo-700 text-sm">
                                                <li>Each section has an "Export" button in the top-right</li>
                                                <li>Download as JSON files for easy backup and sharing</li>
                                                <li>Export individual sections or entire completed parts</li>
                                                <li>Files include metadata with company info and export date</li>
                                            </ul>
                                        </div>

                                        <div className="bg-orange-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-orange-800 mb-2">📥 Import Previous Work</h4>
                                            <p className="text-orange-700 text-sm mb-2">Restore data from previous sessions or template files:</p>
                                            <ul className="ml-4 list-disc space-y-1 text-orange-700 text-sm">
                                                <li>Use "Import Data" button in each section header</li>
                                                <li>Supports JSON files exported from previous sessions</li>
                                                <li>Template files from consultants or previous projects</li>
                                                <li>Each part has its own specific import file format</li>
                                                <li>Data validation ensures compatibility and accuracy</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Navigation & Workflow Management */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 4: Navigation & Workflow Management</h3>
                                    <div className="ml-4 space-y-2">
                                        <p className="text-gray-700">Understanding how to navigate and manage your progress in the Positioning Blueprint:</p>

                                        <div className="bg-green-50 p-3 rounded-lg mt-3">
                                            <h4 className="font-semibold text-green-800 mb-2">📋 Four-Part Blueprint Process</h4>
                                            <p className="text-green-700 text-sm mb-2">Complete your category positioning through these sequential parts:</p>
                                            <ol className="ml-4 list-decimal space-y-1 text-green-700 text-sm">
                                                <li><strong>Part 1: Segment Foundation</strong> - Define market segments and target characteristics</li>
                                                <li><strong>Part 2: ICP Definition</strong> - Create your Ideal Customer Profile</li>
                                                <li><strong>Part 3: Positioning</strong> - Develop your positioning strategy and competitive alternatives</li>
                                                <li><strong>Part 4: Category Design</strong> - Design your category narrative and market opportunity</li>
                                            </ol>
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-blue-800 mb-2">🧭 Navigation Options</h4>
                                            <p className="text-blue-700 text-sm mb-2">Control your workflow with these navigation features:</p>
                                            <ul className="ml-4 list-disc space-y-1 text-blue-700 text-sm">
                                                <li><strong>Continue Where You Left Off:</strong> Resume from your last incomplete section</li>
                                                <li><strong>Start Fresh:</strong> Clear all progress and form data to begin anew</li>
                                                <li><strong>Change Company Setup:</strong> Reset company context while preserving section progress</li>
                                                <li><strong>Progress Tracking:</strong> App automatically tracks completed parts and saves progress</li>
                                            </ul>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-yellow-800 mb-2">💾 Auto-Save & Data Management</h4>
                                            <p className="text-yellow-700 text-sm mb-2">Your work is automatically preserved:</p>
                                            <ul className="ml-4 list-disc space-y-1 text-yellow-700 text-sm">
                                                <li><strong>Auto-Save:</strong> Progress automatically saved in your browser as you type</li>
                                                <li><strong>Local Storage:</strong> All data stays on your device - nothing sent to servers</li>
                                                <li><strong>Browser-Based:</strong> Data persists in your browser's local storage</li>
                                                <li><strong>AI Processing:</strong> Research analysis happens through secure API calls</li>
                                                <li><strong>File Control:</strong> You control all exports and imports manually</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 5: Quick Import Process */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 5: Quick Import Process</h3>
                                    <div className="ml-4 space-y-2">
                                        <p className="text-gray-700">Fast-track your work by importing existing data:</p>
                                        <ol className="ml-6 list-decimal space-y-1 text-gray-600">
                                            <li>Navigate to the section where you want to import data</li>
                                            <li>Click the "Import Data" button in the section header</li>
                                            <li>Select your JSON file (from exports or templates)</li>
                                            <li>Verify the imported data and customize as needed</li>
                                            <li>Continue with your blueprint process</li>
                                        </ol>
                                        <p className="text-gray-700 text-sm mt-2 italic">💡 Each section supports its own import format - exported files from the same section will work perfectly.</p>
                                    </div>
                                </div>

                                {/* Step 6: Manual Entry */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 6: Manual Entry (Alternative)</h3>
                                    <div className="ml-4 space-y-2">
                                        <p className="text-gray-700">If you prefer to fill out the forms manually or want to customize beyond the imported templates:</p>
                                        <ul className="ml-6 list-disc space-y-1 text-gray-600">
                                            <li><strong>Part 1:</strong> Define your market segments and target characteristics</li>
                                            <li><strong>Part 2:</strong> Create your Ideal Customer Profile (ICP)</li>
                                            <li><strong>Part 3:</strong> Develop your positioning strategy</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Step 7: Tips, Privacy & Best Practices */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 7: Tips, Privacy & Best Practices</h3>
                                    <div className="ml-4 space-y-3">

                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-green-800 mb-2">💡 Pro Tips</h4>
                                            <ul className="list-disc ml-4 space-y-1 text-green-700 text-sm">
                                                <li>Use AI features early - generate research prompts before starting manual work</li>
                                                <li>Export your work frequently as backup files</li>
                                                <li>Complete sections in order for best results - each part builds on the previous</li>
                                                <li>Use "Change Company Setup" instead of "Start Fresh" to preserve section progress</li>
                                                <li>Process multiple research reports to get comprehensive AI suggestions</li>
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-blue-800 mb-2">🔐 Privacy & Data Security</h4>
                                            <ul className="list-disc ml-4 space-y-1 text-blue-700 text-sm">
                                                <li><strong>Local Storage Only:</strong> All your data stays on your device</li>
                                                <li><strong>No Server Uploads:</strong> Nothing is sent to external servers</li>
                                                <li><strong>Browser-Based:</strong> Data persists in your browser's local storage</li>
                                                <li><strong>AI Processing:</strong> Research analysis happens through secure API calls</li>
                                                <li><strong>File Control:</strong> You control all exports and imports manually</li>
                                            </ul>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <h4 className="font-semibold text-yellow-800 mb-2">🎯 Best Practices</h4>
                                            <ul className="list-disc ml-4 space-y-1 text-yellow-700 text-sm">
                                                <li>Start with comprehensive company setup - quality inputs lead to better AI suggestions</li>
                                                <li>Use research prompts to gather external data before filling forms manually</li>
                                                <li>Take advantage of auto-save - your progress is preserved as you work</li>
                                                <li>Export completed sections immediately for backup and sharing</li>
                                                <li>Review and customize AI suggestions - they're starting points, not final answers</li>
                                                <li>Keep the same browser/device for consistent access to your saved work</li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-500 mt-8 text-center max-w-2xl mx-auto">
                    Your progress is saved automatically in your browser. This data is private and is not sent to any server.
                </p>

                <footer className="text-center text-sm text-gray-500 py-8 mt-12">
                    Scale Venture Partners
                </footer>
            </div>

            <CompanySetupModal
                isOpen={showCompanySetupModal}
                onComplete={() => {
                    console.log('Modal onComplete called');
                    setShowCompanySetupModal(false);
                    saveAppState(appState);
                }}
                companyData={appState.companyContext || {}}
                setCompanyData={(updater) => {
                    console.log('setCompanyData called with:', updater);
                    setAppState(prev => {
                        console.log('Previous state:', prev);
                        const updatedContext = typeof updater === 'function'
                            ? updater(prev.companyContext || {})
                            : updater;
                        const newState = { ...prev, companyContext: updatedContext };
                        console.log('New state:', newState);
                        return newState;
                    });
                }}
            />

            <PromptDisplayModal
                isOpen={promptModalData.isOpen}
                onClose={() => setPromptModalData(prev => ({ ...prev, isOpen: false }))}
                promptText={promptModalData.promptText}
                title={promptModalData.title}
            />
        </div>
    );
};

export default Home;
