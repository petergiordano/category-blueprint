import React, { useState } from 'react';
import PrimaryActions from './PrimaryActions.jsx';
import ExportModal from './ExportModal.jsx';
import ICPFlowVisualization from './ICPFlowVisualization.jsx';

const ICPDefinitionTool = ({ appState, setAppState, onNavigate, markPartAsCompleted, openTourAtStep }) => {
    const [exportModal, setExportModal] = useState({ isOpen: false, content: '', title: '' });

    const handleExport = () => {
        const partData = {
            metadata: { exportDate: new Date().toISOString(), partName: "ICP Definition" },
            content: { icpDefinition: appState.positioningData }
        };
        const markdownContent = JSON.stringify(partData, null, 2);

        setExportModal({
            isOpen: true,
            content: markdownContent,
            title: 'ICP Definition Summary',
            partData: partData,
            filename: 'icp-definition-export'
        });
    };

    const handleImportICP = () => {
        alert("Import functionality for this component will be restored later.");
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen pb-16">
            <header style={{
                position: 'sticky',
                top: '73px',
                zIndex: 40,
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '1rem 0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <div className="flex justify-between items-center">
                    <h1 className="text-xl sm:text-2xl font-bold scale-green-text">Part 2: ICP Definition</h1>
                    <PrimaryActions
                        currentPart='icp'
                        onReset={() => {
                            if (window.confirm("Are you sure you want to reset all data for Part 2?")) {
                                setAppState(prev => ({
                                    ...prev,
                                    positioningData: getInitialState().positioningData
                                }));
                            }
                        }}
                        onImport={handleImportICP}
                        onExport={handleExport}
                        onContinue={() => {
                            markPartAsCompleted('icp');
                            onNavigate('positioning');
                            window.scrollTo(0, 0);
                        }}
                    />
                </div>
            </header>

            <div className="mt-8">
                <div className="lg:flex lg:space-x-8">
                    <main className="w-full">
                        <div className="space-y-8">
                            <ICPFlowVisualization appState={appState} onNavigate={onNavigate} openTourAtStep={openTourAtStep} />
                            {/* Rest of the component JSX will be restored later */}
                        </div>
                    </main>
                </div>
            </div>

            <ExportModal
                isOpen={exportModal.isOpen}
                onClose={() => setExportModal(prev => ({ ...prev, isOpen: false }))}
                title={exportModal.title}
                content={exportModal.content}
                appState={appState}
                filename={exportModal.filename || "icp-definition-export"}
                partData={exportModal.partData}
            />
        </div>
    );
};

export default ICPDefinitionTool;
