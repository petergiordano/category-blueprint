import React, { useState } from 'react';

const SegmentFoundationTool = ({ appState, setAppState, onNavigate, markPartAsCompleted, openTourAtStep }) => {
    console.log('SegmentFoundationTool rendering, appState:', appState);

    // State for modals and UI
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportContent, setExportContent] = useState('');
    const [exportData, setExportData] = useState(null);
    const [validationState, setValidationState] = useState({});
    const [validationModalOpen, setValidationModalOpen] = useState(false);
    const [importMessage, setImportMessage] = useState(null);
    const [importMessageType, setImportMessageType] = useState('');

    // Helper function to save state
    const saveToLocalStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };

    // Main render - simplified placeholder for now
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen pb-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Segment Foundation Tool</h1>
                <p className="text-gray-600 mb-8">
                    This is a placeholder for the SegmentFoundationTool component migration.
                    The full implementation will be restored in the next step.
                </p>

                {/* Placeholder for navigation */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => onNavigate('home')}
                        className="scale-green-bg text-white px-4 py-2 rounded hover:bg-opacity-90"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Import message display */}
                {importMessage && (
                    <div className={`border rounded-lg p-4 mb-6 ${
                        importMessageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                        importMessageType === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                        'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    {importMessageType === 'success' && (
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                    )}
                                    {importMessageType === 'warning' && (
                                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                        </svg>
                                    )}
                                    {importMessageType === 'error' && (
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {importMessage}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setImportMessage(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Placeholder content */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Component Migration in Progress</h2>
                    <p className="text-gray-600">
                        The SegmentFoundationTool component is being migrated from index-main.html.
                        This is a temporary placeholder to ensure the component structure is syntactically correct.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SegmentFoundationTool;