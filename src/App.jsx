import React, { useState, useEffect, useRef } from 'react';

import Home from './components/Home.jsx';
import ProgressStepper from './components/ProgressStepper.jsx';
import SegmentFoundationTool from './components/SegmentFoundationTool.jsx';
import ICPDefinitionTool from './components/ICPDefinitionTool.jsx';
import PositioningTool from './components/PositioningTool.jsx';
import CategoryDesignTool from './components/CategoryDesignTool.jsx';
import AIResearchModal from './components/AIResearchModal.jsx';
import SessionNotice from './components/SessionNotice.jsx';
import SessionImportModal from './components/SessionImportModal.jsx';
import OnboardingTour from './components/OnboardingTour.jsx';

import { getInitialState, saveAppState, loadAppState } from './utils/helpers.js';
import { triggerDownload, pickJsonFile } from './utils/sessionFileIO.js';

const App = () => {
    const [appState, setAppState] = useState(() => {
        const savedState = loadAppState();
        return savedState || getInitialState();
    });

    const [showAIResearchModal, setShowAIResearchModal] = useState(false);
    const [sessionNotice, setSessionNotice] = useState(null);
    const [pendingImport, setPendingImport] = useState(null);
    const [isProcessingImport, setIsProcessingImport] = useState(false);
    const [showOnboardingTour, setShowOnboardingTour] = useState(false);
    const [tourStartStep, setTourStartStep] = useState(1);

    useEffect(() => {
        saveAppState(appState);
    }, [appState]);

    const dismissNotice = () => setSessionNotice(null);

    const showNotice = (message, type = 'success') => {
        setSessionNotice({ message, type, createdAt: Date.now() });
    };

    const openTourAtStep = (step) => {
        setTourStartStep(step);
        setShowOnboardingTour(true);
    };

    const handleExportSession = () => {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `positioning-blueprint-${timestamp}.json`;
            const exportData = JSON.stringify(appState, null, 2);
            triggerDownload(filename, exportData);
            showNotice('Session exported successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            showNotice('Failed to export session', 'error');
        }
    };

    const handleStartImport = async () => {
        try {
            const { json, fileName } = await pickJsonFile();
            setPendingImport({ data: json, fileName });
        } catch (error) {
            if (error.message !== 'NO_FILE_SELECTED') {
                console.error('Import failed:', error);
                showNotice(error.message || 'Failed to read file', 'error');
            }
        }
    };

    const handleConfirmImport = async () => {
        if (!pendingImport) return;

        try {
            setIsProcessingImport(true);

            // Handle both old and new export formats
            let importedData = pendingImport.data;

            // Check if this is the old format with wrapper
            if (importedData.data && importedData.formatVersion) {
                importedData = importedData.data;
            }

            // Merge with initial state to ensure all required properties exist
            const mergedState = {
                ...getInitialState(),
                ...importedData,
                // Ensure navigationProgress exists
                navigationProgress: {
                    ...getInitialState().navigationProgress,
                    ...(importedData.navigationProgress || {})
                }
            };

            setAppState(mergedState);
            saveAppState(mergedState);
            setPendingImport(null);
            showNotice('Session imported successfully!', 'success');
        } catch (error) {
            console.error('Import confirmation failed:', error);
            showNotice('Failed to import session', 'error');
        } finally {
            setIsProcessingImport(false);
        }
    };

    const handleCancelImport = () => {
        setPendingImport(null);
    };

    const markPartAsCompleted = (partId) => {
        setAppState(prev => {
            const updatedCompletedParts = prev.navigationProgress.completedParts.includes(partId)
                ? prev.navigationProgress.completedParts
                : [...prev.navigationProgress.completedParts, partId];

            return {
                ...prev,
                navigationProgress: {
                    ...prev.navigationProgress,
                    completedParts: updatedCompletedParts,
                    partCompletionData: {
                        ...prev.navigationProgress.partCompletionData,
                        [partId]: {
                            completed: true,
                            completedAt: new Date().toISOString()
                        }
                    }
                }
            };
        });
    };

    const navigate = (view) => {
        setAppState(prev => {
            const newState = { ...prev, currentView: view };

            if (['segment', 'icp', 'positioning', 'category'].includes(view)) {
                newState.navigationProgress = {
                    ...prev.navigationProgress,
                    currentPart: view
                };
            }

            return newState;
        });
    };

    const renderCurrentView = () => {
        switch (appState.currentView) {
            case 'segment':
                return <SegmentFoundationTool appState={appState} setAppState={setAppState} onNavigate={navigate} markPartAsCompleted={markPartAsCompleted} openTourAtStep={openTourAtStep} />;
            case 'icp':
                return <ICPDefinitionTool appState={appState} setAppState={setAppState} onNavigate={navigate} markPartAsCompleted={markPartAsCompleted} openTourAtStep={openTourAtStep} />;
            case 'positioning':
                return <PositioningTool appState={appState} setAppState={setAppState} onNavigate={navigate} markPartAsCompleted={markPartAsCompleted} />;
            case 'category':
                return <CategoryDesignTool appState={appState} setAppState={setAppState} onNavigate={navigate} markPartAsCompleted={markPartAsCompleted} />;
            case 'home':
            default:
                return <Home appState={appState} setAppState={setAppState} onNavigate={navigate} setShowAIResearchModal={setShowAIResearchModal} openTourAtStep={openTourAtStep} onImport={handleStartImport} onExport={handleExportSession} disabled={isProcessingImport} />;
        }
    };

    const showProgressStepper = ['segment', 'icp', 'positioning', 'category'].includes(appState.currentView);

    return (
        <div>
            {showProgressStepper && (
                <ProgressStepper
                    currentPart={appState.currentView}
                    completedParts={appState.navigationProgress.completedParts}
                    onNavigate={navigate}
                    appState={appState}
                    saveAppState={saveAppState}
                    onImport={handleStartImport}
                    onExport={handleExportSession}
                    disabled={isProcessingImport}
                />
            )}
            {renderCurrentView()}
            {showAIResearchModal && (
                <AIResearchModal
                    isOpen={showAIResearchModal}
                    onClose={() => setShowAIResearchModal(false)}
                    appState={appState}
                    setAppState={setAppState}
                />
            )}
            <SessionNotice notice={sessionNotice} onDismiss={dismissNotice} />
            <SessionImportModal
                isOpen={Boolean(pendingImport)}
                fileName={pendingImport?.fileName}
                onCancel={handleCancelImport}
                onConfirm={handleConfirmImport}
                isProcessing={isProcessingImport}
            />
            <OnboardingTour
                isOpen={showOnboardingTour}
                onClose={() => setShowOnboardingTour(false)}
                startStep={tourStartStep}
            />
        </div>
    );
};

export default App;
