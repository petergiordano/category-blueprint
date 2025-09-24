import React, { useState } from 'react';
import PrimaryActions from './PrimaryActions.jsx';
import ExportModal from './ExportModal.jsx';

const SegmentFoundationTool = ({ appState, setAppState, onNavigate, markPartAsCompleted, openTourAtStep }) => {
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportContent, setExportContent] = useState('');
    const [exportData, setExportData] = useState(null);

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all segment data? This action cannot be undone.')) {
            setAppState(prev => ({ ...prev, segmentData: {} }));
        }
    };

    const generatePartSpecificData = () => {
        const formatFieldValue = (fieldValue) => fieldValue && fieldValue.toString().trim() || null;
        const companyData = {};
        if (appState.companyContext?.companyName) companyData.name = appState.companyContext.companyName;
        // ... more fields
        return {
            metadata: {
                exportDate: new Date().toISOString(),
                partName: "Segment Foundation",
                partNumber: 1,
                company: companyData
            },
            content: {
                jobsToBeDone: {
                    "Context": formatFieldValue(appState.segmentData?.['Context']),
                    "Struggling Moments": formatFieldValue(appState.segmentData?.['Struggling Moments']),
                    "Pushes & Pulls": formatFieldValue(appState.segmentData?.['Pushes & Pulls']),
                    "Anxieties & Habits": formatFieldValue(appState.segmentData?.['Anxieties & Habits']),
                    "Desired Outcomes": formatFieldValue(appState.segmentData?.['Desired Outcomes']),
                    "Basic Quality (Table Stakes)": formatFieldValue(appState.segmentData?.['Basic Quality (Table Stakes)']),
                    "Hiring Criteria": formatFieldValue(appState.segmentData?.['Hiring Criteria']),
                    "Firing Criteria": formatFieldValue(appState.segmentData?.['Firing Criteria']),
                    "Key Trade-offs": formatFieldValue(appState.segmentData?.['Key Trade-offs'])
                },
                customerValue: {
                    "Table Stakes": formatFieldValue(appState.segmentData?.['Table Stakes']),
                    "Functional Value": formatFieldValue(appState.segmentData?.['Functional Value']),
                    "Ease of Doing Business": formatFieldValue(appState.segmentData?.['Ease of Doing Business']),
                    "Individual Value": formatFieldValue(appState.segmentData?.['Individual Value']),
                    "Aspirational Value": formatFieldValue(appState.segmentData?.['Aspirational Value'])
                },
                willingnessToPay: {
                    "Ability to Pay": formatFieldValue(appState.segmentData?.['Ability to Pay']),
                    "Economic Justification": formatFieldValue(appState.segmentData?.['Economic Justification']),
                    "Relative Value vs. Alternatives": formatFieldValue(appState.segmentData?.['Relative Value vs. Alternatives']),
                    "Risk & Switching Costs": formatFieldValue(appState.segmentData?.['Risk & Switching Costs']),
                    "Market Reference Points": formatFieldValue(appState.segmentData?.['Market Reference Points'])
                }
            }
        };
    };

    const generateMarkdownFromData = (data) => {
        // ... markdown generation logic
        return "Markdown content";
    };

    const handleExport = () => {
        const partData = generatePartSpecificData();
        const markdownContent = generateMarkdownFromData(partData);

        setExportData(partData);
        setExportContent(markdownContent);
        setExportModalOpen(true);
    };

    const handleImport = () => {
        // ... import logic
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
                    <h1 className="text-xl sm:text-2xl font-bold scale-green-text">Part 1: Segment Foundation</h1>
                    <PrimaryActions
                        currentPart='segment'
                        onReset={handleReset}
                        onImport={handleImport}
                        onExport={handleExport}
                        onContinue={() => {
                            markPartAsCompleted('segment');
                            onNavigate('icp');
                            window.scrollTo(0, 0);
                        }}
                    />
                </div>
            </header>

            {/* The rest of the JSX for the component */}
            <div className="mt-8">
                {/* ... full component JSX ... */}
            </div>

            <ExportModal
                isOpen={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                title="Segment Foundation Summary"
                content={exportContent}
                appState={appState}
                filename="segment-foundation-export"
                partData={exportData}
            />
        </div>
    );
};

export default SegmentFoundationTool;
