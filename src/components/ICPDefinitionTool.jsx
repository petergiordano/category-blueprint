import React, { useState } from 'react';
import PrimaryActions from './PrimaryActions.jsx';
import ExportModal from './ExportModal.jsx';
import ICPFlowDiagram from './ICPFlowDiagram.jsx';

const ICPDefinitionTool = ({ appState, setAppState, onNavigate, markPartAsCompleted, openTourAtStep }) => {
    const [exportModal, setExportModal] = useState({ isOpen: false, content: '', title: '' });
    const [importMessage, setImportMessage] = useState(null);
    const [importMessageType, setImportMessageType] = useState('');

    // Helper to get initial state for reset
    const getInitialState = () => ({
        positioningData: {
            icp_quick_decision_making: '',
            icp_prioritized_requirements: '',
            icp_implementation_readiness: '',
            icp_firmographic: '',
            icp_technographic: '',
            icp_behavioral: ''
        }
    });

    const formatFieldValue = (fieldValue) => {
        if (!fieldValue) return null;
        return fieldValue.toString().trim() || null;
    };

    const generatePart2SpecificData = () => {
        const segmentSummary = {
            desiredOutcomes: formatFieldValue(appState.segmentData?.['Desired Outcomes']),
            functionalValue: formatFieldValue(appState.segmentData?.['Functional Value']),
            economicJustification: formatFieldValue(appState.segmentData?.['Economic Justification']),
            tableStakes: formatFieldValue(appState.segmentData?.['Table Stakes']),
            easeOfDoingBusiness: formatFieldValue(appState.segmentData?.['Ease of Doing Business']),
            businessContext: `Context: ${formatFieldValue(appState.segmentData?.['Context']) || 'N/A'}\nStruggling Moments: ${formatFieldValue(appState.segmentData?.['Struggling Moments']) || 'N/A'}`
        };

        const icpData = {
            quickDecisionMaking: formatFieldValue(appState.positioningData?.icp_quick_decision_making),
            prioritizedRequirements: formatFieldValue(appState.positioningData?.icp_prioritized_requirements),
            implementationReadiness: formatFieldValue(appState.positioningData?.icp_implementation_readiness),
            firmographic: formatFieldValue(appState.positioningData?.icp_firmographic),
            technographic: formatFieldValue(appState.positioningData?.icp_technographic),
            behavioral: formatFieldValue(appState.positioningData?.icp_behavioral)
        };

        return {
            metadata: {
                exportDate: new Date().toISOString(),
                partName: "ICP Definition",
                company: {
                    name: appState.companyContext?.companyName || null,
                    url: appState.companyContext?.companyWebsite || null,
                    industry: appState.companyContext?.industry || null
                }
            },
            content: {
                segmentFoundationSummary: segmentSummary,
                icpDefinition: icpData
            }
        };
    };

    const generatePart2Markdown = (partData) => {
        let markdown = `# ICP Definition Summary\n\n`;

        if (partData.metadata.company.name) {
            markdown += `**Company:** ${partData.metadata.company.name}\n`;
            if (partData.metadata.company.url) {
                markdown += `**URL:** ${partData.metadata.company.url}\n`;
            }
            markdown += `\n`;
        }

        markdown += `---\n\n`;
        markdown += `## Segment Foundation Summary\n\n`;

        const summary = partData.content.segmentFoundationSummary;
        if (summary) {
            markdown += `**Desired Outcomes:** ${summary.desiredOutcomes || 'Not provided'}\n\n`;
            markdown += `**Functional Value:** ${summary.functionalValue || 'Not provided'}\n\n`;
            markdown += `**Economic Justification:** ${summary.economicJustification || 'Not provided'}\n\n`;
            markdown += `**Table Stakes:** ${summary.tableStakes || 'Not provided'}\n\n`;
            markdown += `**Ease of Doing Business:** ${summary.easeOfDoingBusiness || 'Not provided'}\n\n`;
            markdown += `**Business Context:**\n${summary.businessContext || 'Not provided'}\n\n`;
        }

        markdown += `---\n\n`;
        markdown += `## ICP Definition\n\n`;

        const icp = partData.content.icpDefinition;
        if (icp) {
            markdown += `**Quick Decision Making:** ${icp.quickDecisionMaking || 'Not provided'}\n\n`;
            markdown += `**Prioritized Requirements:** ${icp.prioritizedRequirements || 'Not provided'}\n\n`;
            markdown += `**Implementation Readiness:** ${icp.implementationReadiness || 'Not provided'}\n\n`;
            markdown += `**Firmographic:** ${icp.firmographic || 'Not provided'}\n\n`;
            markdown += `**Technographic:** ${icp.technographic || 'Not provided'}\n\n`;
            markdown += `**Behavioral:** ${icp.behavioral || 'Not provided'}\n\n`;
        }

        markdown += `*Export generated on ${new Date(partData.metadata.exportDate).toLocaleString()}*`;
        return markdown;
    };

    const handleExport = () => {
        const partData = generatePart2SpecificData();
        const markdownContent = generatePart2Markdown(partData);

        setExportModal({
            isOpen: true,
            content: markdownContent,
            title: 'ICP Definition Summary',
            partData: partData,
            filename: 'icp-definition-export'
        });
    };

    const validateICPImportData = (data) => {
        const errors = [];
        const warnings = [];

        if (!data || typeof data !== 'object') {
            errors.push('Invalid file format. Expected JSON object.');
            return { isValid: false, errors, warnings };
        }

        if (!data.metadata || typeof data.metadata !== 'object') {
            errors.push('Missing or invalid metadata section.');
        }

        if (!data.content || typeof data.content !== 'object') {
            errors.push('Missing or invalid content section.');
        }

        if (errors.length > 0) {
            return { isValid: false, errors, warnings };
        }

        const { metadata } = data;
        if (!metadata.partName || metadata.partName !== 'ICP Definition') {
            const detectedType = metadata?.partName || 'Unknown';
            errors.push(`Wrong data type: Found "${detectedType}" data, but expected "ICP Definition" data. Please select an ICP Definition export file.`);
        }

        if (!metadata.company || typeof metadata.company !== 'object') {
            warnings.push('Company information is missing or invalid.');
        }

        const { content } = data;
        if (!content.icpDefinition || typeof content.icpDefinition !== 'object') {
            errors.push('Missing or invalid icpDefinition section.');
            return { isValid: false, errors, warnings };
        }

        const icpFields = [
            'quickDecisionMaking', 'prioritizedRequirements', 'implementationReadiness',
            'firmographic', 'technographic', 'behavioral'
        ];

        const populatedFields = icpFields.filter(field =>
            content.icpDefinition[field] && content.icpDefinition[field].trim()
        ).length;

        if (populatedFields < 3) {
            warnings.push(`Only ${populatedFields} of ${icpFields.length} ICP fields are populated.`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            stats: {
                populatedFields,
                totalFields: icpFields.length
            }
        };
    };

    const handleImportICP = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            setImportMessage(null);
            setImportMessageType('');

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    const validation = validateICPImportData(importedData);

                    if (!validation.isValid) {
                        setImportMessage(`Import failed: ${validation.errors.join('; ')}`);
                        setImportMessageType('error');
                        return;
                    }

                    const { content } = importedData;
                    const { icpDefinition } = content;

                    const fieldMapping = {
                        quickDecisionMaking: 'icp_quick_decision_making',
                        prioritizedRequirements: 'icp_prioritized_requirements',
                        implementationReadiness: 'icp_implementation_readiness',
                        firmographic: 'icp_firmographic',
                        technographic: 'icp_technographic',
                        behavioral: 'icp_behavioral'
                    };

                    const updates = {};
                    Object.keys(fieldMapping).forEach(importField => {
                        if (icpDefinition[importField] !== undefined && icpDefinition[importField] !== null) {
                            const stateField = fieldMapping[importField];
                            updates[stateField] = icpDefinition[importField];
                        }
                    });

                    setAppState(prev => ({
                        ...prev,
                        positioningData: {
                            ...prev.positioningData,
                            ...updates
                        }
                    }));

                    const { stats, warnings } = validation;
                    let message = `Successfully imported ${stats.populatedFields} fields from ${stats.totalFields} total ICP fields.`;

                    if (warnings.length > 0) {
                        message += ` Warnings: ${warnings.join('; ')}`;
                        setImportMessageType('warning');
                    } else {
                        setImportMessageType('success');
                    }

                    setImportMessage(message);

                    setTimeout(() => {
                        setImportMessage(null);
                        setImportMessageType('');
                    }, 10000);

                } catch (error) {
                    setImportMessage(`Failed to parse JSON file: ${error.message}`);
                    setImportMessageType('error');
                }
            };

            reader.onerror = () => {
                setImportMessage('Failed to read file. Please try again.');
                setImportMessageType('error');
            };

            reader.readAsText(file);
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
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
                            if (window.confirm("Are you sure you want to reset all data for Part 2? This will clear all ICP and Positioning fields.")) {
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

            {/* Import Status Message */}
            {importMessage && (
                <div className={`mt-4 p-4 rounded-lg border ${
                    importMessageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                    importMessageType === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-red-50 border-red-200 text-red-800'
                }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {importMessageType === 'success' && (
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            {importMessageType === 'warning' && (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            {importMessageType === 'error' && (
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">{importMessage}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <button
                                onClick={() => {
                                    setImportMessage(null);
                                    setImportMessageType('');
                                }}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <div className="lg:flex lg:space-x-8">
                    <main className="w-full">
                        <div className="space-y-8">
                            {/* ICP Definition Process */}
                            <div className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                                <div className="mb-8">
                                    <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-4xl mx-auto">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3">ICP Definition Process:</h3>
                                            <p className="text-gray-600 mb-4">
                                                To determine an <strong>Actionable ICP</strong>, we enhance the Market Segment with additional targeting characteristics:
                                            </p>
                                            <ul className="text-gray-700 mb-4 space-y-2 ml-6">
                                                <li><strong>Firmographics</strong></li>
                                                <li><strong>Technographics</strong></li>
                                                <li><strong>Behavioral Signals</strong></li>
                                            </ul>
                                            <button
                                                onClick={() => openTourAtStep(2)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                </svg>
                                                View Interactive Diagram
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-4 max-w-3xl mx-auto">
                                        The input sections below help you define the enhanced targeting characteristics.
                                    </p>
                                </div>
                            </div>

                            <div id="section-1" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                                <h2 className="text-2xl font-bold scale-green-text mb-2">Define Your Ideal Customer Profile (ICP)</h2>
                                <p className="text-gray-600 mb-6">This is the foundation. A precise ICP provides the lens through which all other positioning elements are viewed. Be specific and use data where possible.</p>

                                {/* Segment Foundation Summary */}
                                <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold scale-green-text">Segment Foundation Summary</h3>
                                        <button
                                            onClick={() => onNavigate('segment')}
                                            className="text-sm text-green-600 hover:text-green-800 font-semibold flex items-center gap-1"
                                        >
                                            ← Edit Segment Foundation
                                        </button>
                                    </div>

                                    {appState.segmentData && Object.keys(appState.segmentData).some(key => appState.segmentData[key] && typeof appState.segmentData[key] === 'string' && appState.segmentData[key].trim()) ? (
                                        <div className="space-y-4">
                                            {appState.segmentData['Desired Outcomes'] && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-700 mb-1">Desired Outcomes</h4>
                                                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                                        {appState.segmentData['Desired Outcomes']}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {appState.segmentData['Functional Value'] && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-700 mb-1">Functional Value</h4>
                                                        <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                                            {appState.segmentData['Functional Value']}
                                                        </p>
                                                    </div>
                                                )}

                                                {appState.segmentData['Economic Justification'] && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-700 mb-1">Economic Justification</h4>
                                                        <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                                            {appState.segmentData['Economic Justification']}
                                                        </p>
                                                    </div>
                                                )}

                                                {appState.segmentData['Table Stakes'] && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-700 mb-1">Table Stakes</h4>
                                                        <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                                            {appState.segmentData['Table Stakes']}
                                                        </p>
                                                    </div>
                                                )}

                                                {appState.segmentData['Ease of Doing Business'] && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-700 mb-1">Ease of Doing Business</h4>
                                                        <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                                            {appState.segmentData['Ease of Doing Business']}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {(appState.segmentData['Context'] || appState.segmentData['Struggling Moments']) && (
                                                <div className="pt-4 border-t border-green-200">
                                                    <h4 className="font-semibold text-gray-700 mb-2">Business Context</h4>
                                                    <div className="space-y-2">
                                                        {appState.segmentData['Context'] && (
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Context:</span> {appState.segmentData['Context']}
                                                            </p>
                                                        )}
                                                        {appState.segmentData['Struggling Moments'] && (
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Struggling Moments:</span> {appState.segmentData['Struggling Moments']}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-gray-500 mb-3">
                                                <span className="text-2xl">📝</span>
                                            </div>
                                            <h4 className="font-semibold text-gray-700 mb-2">No Segment Data Yet</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Complete Part 1 (Segment Foundation) to see your market segment data here.
                                            </p>
                                            <button
                                                onClick={() => onNavigate('segment')}
                                                className="scale-green-bg text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90"
                                            >
                                                Go to Part 1: Segment Foundation
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block font-bold text-gray-700">Quick Decision Making</label>
                                        <p className="text-sm text-gray-500 mb-2">Who is the economic buyer and can they approve the purchase efficiently?</p>
                                        <textarea
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                            rows="3"
                                            placeholder="Example: The VP of Finance is the economic buyer. They have budget authority up to $250k for transformation projects and can sign off without a lengthy committee review."
                                            value={appState.positioningData.icp_quick_decision_making || ''}
                                            onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, icp_quick_decision_making: e.target.value } }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700">Prioritized Requirements</label>
                                        <p className="text-sm text-gray-500 mb-2">What do they value most in a solution for this problem?</p>
                                        <textarea
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                            rows="3"
                                            placeholder="Example: Speed-to-insight is #1. We cannot wait 6 months for consultants. #2 is accuracy; the data must be audit-grade. #3 is ease of use for our internal team."
                                            value={appState.positioningData.icp_prioritized_requirements || ''}
                                            onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, icp_prioritized_requirements: e.target.value } }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700">Implementation Readiness</label>
                                        <p className="text-sm text-gray-500 mb-2">Can they adopt and get value from the product today?</p>
                                        <textarea
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                            rows="3"
                                            placeholder="Example: They have a dedicated transformation team ready to start. All relevant contracts and process documents are digitized and accessible."
                                            value={appState.positioningData.icp_implementation_readiness || ''}
                                            onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, icp_implementation_readiness: e.target.value } }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700">Firmographic</label>
                                        <p className="text-sm text-gray-500 mb-2">What are the key company attributes (size, industry, revenue)?</p>
                                        <textarea
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                            rows="3"
                                            placeholder="Example: Publicly traded B2B SaaS company, >$1B in annual revenue, 2000+ employees. Headquartered in North America."
                                            value={appState.positioningData.icp_firmographic || ''}
                                            onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, icp_firmographic: e.target.value } }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700">Technographic</label>
                                        <p className="text-sm text-gray-500 mb-2">What is their current technology stack?</p>
                                        <textarea
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                            rows="3"
                                            placeholder="Example: Currently using NetSuite, Salesforce, and Coupa. Moving to Oracle Fusion. Internal BI uses Tableau."
                                            value={appState.positioningData.icp_technographic || ''}
                                            onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, icp_technographic: e.target.value } }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700">Behavioral</label>
                                        <p className="text-sm text-gray-500 mb-2">How do they act, buy, and use technology?</p>
                                        <textarea
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                            rows="3"
                                            placeholder="Example: They are early adopters of AI technology in their finance stack. They prefer to buy best-of-breed solutions over suite extensions. They have a history of successful, large-scale software implementations."
                                            value={appState.positioningData.icp_behavioral || ''}
                                            onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, icp_behavioral: e.target.value } }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => {
                                        setAppState(prev => ({
                                            ...prev,
                                            positioningData: getInitialState().positioningData
                                        }));
                                        alert('All fields cleared! Refresh the page to see placeholder text.');
                                    }}
                                    className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors mr-4"
                                >
                                    Clear All Fields
                                </button>

                                <button
                                    onClick={() => {
                                        markPartAsCompleted('icp');
                                        onNavigate('positioning');
                                        window.scrollTo(0, 0);
                                    }}
                                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Continue to Positioning
                                </button>
                            </div>
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
