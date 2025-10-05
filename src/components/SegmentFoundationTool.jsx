import React, { useState } from 'react';
import PrimaryActions from './PrimaryActions.jsx';
import ExportModal from './ExportModal.jsx';
import SegmentFunnelDiagram from './SegmentFunnelDiagram.jsx';

const SegmentFoundationTool = ({ appState, setAppState, onNavigate, markPartAsCompleted, openTourAtStep }) => {
            console.log('SegmentFoundationTool rendering, appState:', appState);
            const [exportModalOpen, setExportModalOpen] = useState(false);
            const [exportContent, setExportContent] = useState('');
            const [exportData, setExportData] = useState(null);
            const [validationState, setValidationState] = useState({});
            
            // Import state variables
            const [importMessage, setImportMessage] = useState(null);
            const [importMessageType, setImportMessageType] = useState(''); // 'success', 'error', 'warning'
            
            // AI Draft State Variables
            const [aiDraftLoading, setAiDraftLoading] = useState(false);
            const [aiDraftsAvailable, setAiDraftsAvailable] = useState(false);
            const [aiDraftError, setAiDraftError] = useState(null);
            
            // WTP AI Draft State Variables
            const [wtpDraftLoading, setWtpDraftLoading] = useState(false);
            const [wtpDraftsAvailable, setWtpDraftsAvailable] = useState(false);
            const [wtpDraftError, setWtpDraftError] = useState(null);

            const handleValidateJtbd = async (jtbdElementName, userInput) => {
                // Check if company context is properly set up (industry no longer required)
                if (!appState.companyContext?.productName) {
                    setValidationState(prev => ({
                        ...prev,
                        [jtbdElementName]: {
                            status: 'error', 
                            result: {
                                alignmentScore: 0,
                                marketLanguage: [],
                                refinementSuggestions: ['Please complete the Company Context setup first by clicking "Dev Tools: Reset Company Context" in the footer and filling out your company information.']
                            }
                        }
                    }));
                    return;
                }
                
                setValidationState(prev => ({ ...prev, [jtbdElementName]: { status: 'validating' } }));
                try {
                    const response = await fetch('/api/validate-jtbd?debug=true', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            companyContext: appState.companyContext,
                            jtbdElementName,
                            userInput
                        })
                    });
                    if (!response.ok) {
                        throw new Error('Validation failed');
                    }
                    const results = await response.json();
                    
                    // Log debug information to console
                    console.log(`🔍 VAL-FEAT-001 Debug: ${jtbdElementName}`, {
                        userInput: userInput,
                        queries: results.debug?.queries,
                        searchResults: {
                            snippetCount: results.debug?.searchResultsCount.snippets,
                            titleCount: results.debug?.searchResultsCount.titles,
                            sampleSnippets: results.debug?.sampleSnippets
                        },
                        analysis: {
                            alignmentScore: results.alignmentScore,
                            marketLanguage: results.marketLanguage,
                            suggestions: results.refinementSuggestions
                        }
                    });
                    
                    setValidationState(prev => ({ ...prev, [jtbdElementName]: { status: 'success', results } }));
                } catch (error) {
                    console.error(`❌ VAL-FEAT-001 Error: ${jtbdElementName}`, error);
                    setValidationState(prev => ({ ...prev, [jtbdElementName]: { status: 'error', error: error.message } }));
                }
            };

            const renderValidationResult = (elementName) => {
                const state = validationState[elementName];
                if (!state) return null;
                if (state.status === 'validating') {
                    return <div className="text-sm text-gray-500 italic mt-2">Validating...</div>;
                }
                if (state.status === 'error') {
                    const errorMessage = state.error || 'Validation service is unavailable. Please try again later.';
                    return <div className="text-sm text-red-500 mt-2">Error: {errorMessage}</div>;
                }
                if (state.status === 'success' && state.results) {
                    const { alignmentScore, marketLanguage, refinementSuggestions } = state.results;
                    return (
                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">
                                Validation Results 
                                <span className="ml-2 text-xs text-blue-600 cursor-help" title="Check browser console for detailed analysis">
                                    (Debug: Check Console)
                                </span>
                            </h4>
                            <p className="text-sm text-gray-600"><strong>Alignment Score:</strong> {alignmentScore}%</p>
                            <p className="text-sm text-gray-600"><strong>Market Language:</strong> {marketLanguage.join(', ')}</p>
                            <div>
                                <p className="text-sm font-bold text-gray-700 mt-2">Suggestions:</p>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    {refinementSuggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                }
                return null;
            };

            const handleReset = () => {
                if (window.confirm('Are you sure you want to reset all segment data? This action cannot be undone.')) {
                    setAppState(prev => ({ ...prev, segmentData: {} }));
                }
            };

            // Generate part-specific structured data for consistent exports
            const generatePartSpecificData = () => {
                const formatFieldValue = (fieldValue) => {
                    // Handle arrays (future dynamic content)
                    if (Array.isArray(fieldValue)) {
                        return fieldValue.filter(item => item && item.toString().trim()).join('; ');
                    }
                    // Handle objects (future complex data)
                    if (typeof fieldValue === 'object' && fieldValue !== null) {
                        return Object.entries(fieldValue)
                            .filter(([k, v]) => v && v.toString().trim())
                            .map(([k, v]) => `${k}: ${v}`)
                            .join('; ');
                    }
                    // Handle strings (current implementation)
                    return fieldValue && fieldValue.toString().trim() || null;
                };

                // Build company object excluding null values
                const companyData = {};
                const companyName = formatFieldValue(appState.companyContext?.companyName);
                const companyWebsite = formatFieldValue(appState.companyContext?.companyWebsite);
                const industry = formatFieldValue(appState.companyContext?.industry);
                const productName = formatFieldValue(appState.companyContext?.productName);
                const targetMarket = formatFieldValue(appState.companyContext?.targetMarket);
                
                if (companyName) companyData.name = companyName;
                if (companyWebsite) companyData.website = companyWebsite;
                if (industry) companyData.industry = industry;
                if (productName) companyData.productName = productName;
                if (targetMarket) companyData.targetMarket = targetMarket;

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

            // Generate markdown from structured data
            const generateMarkdownFromData = (data) => {
                const { metadata, content } = data;
                
                let markdown = `# Segment Foundation Summary\n\n`;
                
                // Add company context header
                if (metadata.company.name || metadata.company.website) {
                    markdown += `**Export Date:** ${new Date(metadata.exportDate).toLocaleDateString()}\n`;
                    if (metadata.company.name) {
                        markdown += `**Company:** ${metadata.company.name}`;
                        if (metadata.company.website) markdown += ` (${metadata.company.website})`;
                        markdown += `\n`;
                    }
                    if (metadata.company.industry || metadata.company.productName || metadata.company.targetMarket) {
                        const companyDetails = [];
                        if (metadata.company.industry) companyDetails.push(`**Industry:** ${metadata.company.industry}`);
                        if (metadata.company.productName) companyDetails.push(`**Product:** ${metadata.company.productName}`);
                        if (metadata.company.targetMarket) companyDetails.push(`**Market:** ${metadata.company.targetMarket}`);
                        markdown += `${companyDetails.join(' | ')}\n`;
                    }
                    markdown += `\n`;
                }

                // Jobs to be Done section
                markdown += `## Jobs to be Done\n`;
                Object.entries(content.jobsToBeDone).forEach(([key, value]) => {
                    markdown += `**${key}:** ${value || 'Not provided'}\n\n`;
                });

                // Customer Value section
                markdown += `## Customer Value\n`;
                Object.entries(content.customerValue).forEach(([key, value]) => {
                    markdown += `**${key}:** ${value || 'Not provided'}\n\n`;
                });

                // Willingness to Pay section
                markdown += `## Willingness to Pay\n`;
                Object.entries(content.willingnessToPay).forEach(([key, value]) => {
                    markdown += `**${key}:** ${value || 'Not provided'}\n\n`;
                });

                return markdown;
            };
            
            const handleExport = () => {
                const partData = generatePartSpecificData();
                const markdownContent = generateMarkdownFromData(partData);
                
                setExportData(partData);
                setExportContent(markdownContent);
                setExportModalOpen(true);
            };
            
            // AI Customer Value Generation Handler
            const handleGenerateCustomerValue = async () => {
                setAiDraftLoading(true);
                setAiDraftError(null);
                
                try {
                    const jtbdFields = ['Context', 'Struggling Moments', 'Pushes & Pulls', 'Anxieties & Habits', 'Desired Outcomes', 'Basic Quality (Table Stakes)', 'Hiring Criteria', 'Firing Criteria', 'Key Trade-offs'];
                    const filledFields = jtbdFields.filter(field => appState.segmentData[field] && typeof appState.segmentData[field] === 'string' && appState.segmentData[field].trim());
                    
                    if (filledFields.length < 3) {
                        setAiDraftError('Please complete at least 3 Jobs-to-be-Done fields before using the AI assistant.');
                        setAiDraftLoading(false);
                        return;
                    }
                    
                    const response = await fetch('/api/draft-customer-value', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            jtbdData: appState.segmentData
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`API call failed: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data.success && data.drafts) {
                        // Update segmentData with AI-generated drafts
                        setAppState(prev => ({
                            ...prev,
                            segmentData: {
                                ...prev.segmentData,
                                'Table Stakes': data.drafts['Table Stakes'],
                                'Functional Value': data.drafts['Functional Value'],
                                'Ease of Doing Business': data.drafts['Ease of Doing Business'],
                                'Individual Value': data.drafts['Individual Value'],
                                'Aspirational Value': data.drafts['Aspirational Value']
                            }
                        }));
                        
                        setAiDraftsAvailable(true);
                    } else {
                        throw new Error(data.error || 'AI generation failed');
                    }
                } catch (error) {
                    console.error('AI Customer Value Generation Error:', error);
                    setAiDraftError(error.message || 'AI assistant is currently unavailable. Please try again later.');
                }
                
                setAiDraftLoading(false);
            };
            
            // AI WTP Generation Handler
            const handleGenerateWTP = async () => {
                setWtpDraftLoading(true);
                setWtpDraftError(null);
                
                try {
                    const customerValueFields = ['Table Stakes', 'Functional Value', 'Ease of Doing Business', 'Individual Value', 'Aspirational Value'];
                    const hasCustomerValue = customerValueFields.some(field => appState.segmentData[field] && typeof appState.segmentData[field] === 'string' && appState.segmentData[field].trim());
                    
                    if (!hasCustomerValue) {
                        setWtpDraftError('Please complete the Customer Value section first before generating WTP drivers.');
                        setWtpDraftLoading(false);
                        return;
                    }
                    
                    const response = await fetch('/api/draft-wtp-value', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            jtbdData: appState.segmentData,
                            customerValueData: {
                                'Table Stakes': appState.segmentData['Table Stakes'],
                                'Functional Value': appState.segmentData['Functional Value'],
                                'Ease of Doing Business': appState.segmentData['Ease of Doing Business'],
                                'Individual Value': appState.segmentData['Individual Value'],
                                'Aspirational Value': appState.segmentData['Aspirational Value']
                            }
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`API call failed: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data.success && data.drafts) {
                        // Update segmentData with AI-generated WTP drafts
                        setAppState(prev => ({
                            ...prev,
                            segmentData: {
                                ...prev.segmentData,
                                'Ability to Pay': data.drafts['Ability to Pay'],
                                'Economic Justification': data.drafts['Economic Justification'],
                                'Relative Value vs. Alternatives': data.drafts['Relative Value vs. Alternatives'],
                                'Risk': data.drafts['Risk'],
                                'Market Reference Points': data.drafts['Market Reference Points']
                            }
                        }));
                        
                        setWtpDraftsAvailable(true);
                    } else {
                        throw new Error(data.error || 'AI generation failed');
                    }
                } catch (error) {
                    console.error('AI WTP Generation Error:', error);
                    setWtpDraftError(error.message || 'AI assistant is currently unavailable. Please try again later.');
                }
                
                setWtpDraftLoading(false);
            };

            // Schema validation function for import data
            const validateImportData = (data) => {
                const errors = [];
                const warnings = [];

                // Check if data is an object
                if (!data || typeof data !== 'object') {
                    errors.push('Invalid file format. Expected JSON object.');
                    return { isValid: false, errors, warnings };
                }

                // Check required top-level structure
                if (!data.metadata || typeof data.metadata !== 'object') {
                    errors.push('Missing or invalid metadata section.');
                }

                if (!data.content || typeof data.content !== 'object') {
                    errors.push('Missing or invalid content section.');
                }

                if (errors.length > 0) {
                    return { isValid: false, errors, warnings };
                }

                // Validate metadata structure
                const { metadata } = data;
                if (!metadata.partName || metadata.partName !== 'Segment Foundation') {
                    const detectedType = metadata?.partName || 'Unknown';
                    errors.push(`Wrong data type: Found "${detectedType}" data, but expected "Segment Foundation" data. Please select a Segment Foundation export file.`);
                }

                if (!metadata.company || typeof metadata.company !== 'object') {
                    warnings.push('Company information is missing or invalid.');
                }

                // Validate content structure
                const { content } = data;
                const requiredSections = ['jobsToBeDone', 'customerValue', 'willingnessToPay'];
                const missingSections = requiredSections.filter(section => !content[section]);
                
                if (missingSections.length > 0) {
                    errors.push(`Missing required sections: ${missingSections.join(', ')}`);
                }

                // Validate individual sections exist
                const jtbdFields = [
                    'Context', 'Struggling Moments', 'Pushes & Pulls', 
                    'Anxieties & Habits', 'Desired Outcomes', 'Basic Quality (Table Stakes)',
                    'Hiring Criteria', 'Firing Criteria', 'Key Trade-offs'
                ];

                const customerValueFields = [
                    'Table Stakes', 'Functional Value', 'Ease of Doing Business',
                    'Individual Value', 'Aspirational Value'
                ];

                const wtpFields = [
                    'Ability to Pay', 'Economic Justification', 'Relative Value vs. Alternatives',
                    'Risk & Switching Costs', 'Market Reference Points'
                ];

                // Count populated fields for quality assessment
                const populatedJtbd = jtbdFields.filter(field => 
                    content.jobsToBeDone?.[field] && content.jobsToBeDone[field].trim()
                ).length;

                const populatedCustomerValue = customerValueFields.filter(field => 
                    content.customerValue?.[field] && content.customerValue[field].trim()
                ).length;

                const populatedWtp = wtpFields.filter(field => 
                    content.willingnessToPay?.[field] && content.willingnessToPay[field].trim()
                ).length;

                if (populatedJtbd < 3) {
                    warnings.push(`Only ${populatedJtbd} of ${jtbdFields.length} Jobs-to-be-Done fields are populated.`);
                }

                if (populatedCustomerValue < 2) {
                    warnings.push(`Only ${populatedCustomerValue} of ${customerValueFields.length} Customer Value fields are populated.`);
                }

                if (populatedWtp < 2) {
                    warnings.push(`Only ${populatedWtp} of ${wtpFields.length} Willingness to Pay fields are populated.`);
                }

                return { 
                    isValid: errors.length === 0, 
                    errors, 
                    warnings,
                    stats: {
                        populatedJtbd,
                        populatedCustomerValue,
                        populatedWtp,
                        totalFields: jtbdFields.length + customerValueFields.length + wtpFields.length
                    }
                };
            };

            // Import handler function
            const handleImport = () => {
                // Create a hidden file input element
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.json';
                fileInput.style.display = 'none';
                
                fileInput.onchange = (event) => {
                    const file = event.target.files[0];
                    if (!file) return;
                    
                    // Clear any previous messages
                    setImportMessage(null);
                    setImportMessageType('');
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedData = JSON.parse(e.target.result);
                            
                            // Validate the imported data
                            const validation = validateImportData(importedData);
                            
                            if (!validation.isValid) {
                                setImportMessage(`Import failed: ${validation.errors.join('; ')}`);
                                setImportMessageType('error');
                                return;
                            }
                            
                            // Process the import
                            const { content, metadata } = importedData;
                            const { jobsToBeDone, customerValue, willingnessToPay } = content;
                            
                            // Create new segment data by merging imported data
                            const newSegmentData = { ...appState.segmentData };
                            
                            // Import Jobs-to-be-Done fields
                            if (jobsToBeDone) {
                                Object.keys(jobsToBeDone).forEach(field => {
                                    if (jobsToBeDone[field] !== undefined && jobsToBeDone[field] !== null) {
                                        newSegmentData[field] = jobsToBeDone[field];
                                    }
                                });
                            }
                            
                            // Import Customer Value fields
                            if (customerValue) {
                                Object.keys(customerValue).forEach(field => {
                                    if (customerValue[field] !== undefined && customerValue[field] !== null) {
                                        newSegmentData[field] = customerValue[field];
                                    }
                                });
                            }
                            
                            // Import Willingness to Pay fields
                            if (willingnessToPay) {
                                Object.keys(willingnessToPay).forEach(field => {
                                    if (willingnessToPay[field] !== undefined && willingnessToPay[field] !== null) {
                                        newSegmentData[field] = willingnessToPay[field];
                                    }
                                });
                            }
                            
                            // Update app state with imported data
                            setAppState(prev => ({
                                ...prev,
                                segmentData: newSegmentData
                            }));
                            
                            // Show success message with statistics
                            const { stats, warnings } = validation;
                            let message = `Successfully imported ${stats.populatedJtbd + stats.populatedCustomerValue + stats.populatedWtp} fields from ${stats.totalFields} total fields.`;
                            
                            if (warnings.length > 0) {
                                message += ` Warnings: ${warnings.join('; ')}`;
                                setImportMessageType('warning');
                            } else {
                                setImportMessageType('success');
                            }
                            
                            setImportMessage(message);
                            
                            // Auto-clear message after 10 seconds
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
                
                // Trigger file selection
                document.body.appendChild(fileInput);
                fileInput.click();
                document.body.removeChild(fileInput);
            };
            
            return (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen pb-16">
                    {/* AI-Generated Banner */}
                    {appState.aiGeneratedSegment && !appState.aiGeneratedBannerDismissed && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-800">
                                        AI-Generated Draft
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        This form has been pre-populated with AI-generated insights based on your company analysis. Review and edit as needed.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAppState(prev => ({ ...prev, aiGeneratedBannerDismissed: true }))}
                                className="flex-shrink-0 ml-4 text-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded-md p-1"
                                aria-label="Dismiss banner"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                    
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
                            {React.createElement(PrimaryActions, {
                                currentPart: 'segment',
                                onReset: handleReset,
                                onImport: handleImport,
                                onExport: handleExport,
                                onContinue: () => { 
                                    markPartAsCompleted('segment'); 
                                    onNavigate('icp'); 
                                    window.scrollTo(0, 0); 
                                }
                            })}
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
                                    <p className="text-sm font-medium">
                                        {importMessage}
                                    </p>
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
                            {/* Sticky Navigation Sidebar */}
                            <nav className="hidden lg:block w-64 flex-shrink-0 sticky top-36 h-fit">
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Section Navigation</h3>
                                    <ul className="space-y-3">
                                        <li>
                                            <a 
                                                href="#jtbd-section" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('jtbd-section').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Jobs to be Done
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#value-section" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('value-section').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Customer Value
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#wtp-section" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('wtp-section').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Willingness to Pay
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                            
                            <main className="flex-1 min-w-0">
                                <div className="space-y-8">
                                    {/* Market Segment Definition Header */}
                                    <div id="segment-definition-section" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                                        <div className="text-center mb-8">
                                            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
                                                A true market segment is composed of customers who share a common Job to be Done, 
                                                perceive value similarly, and have a similar Willingness to Pay.
                                            </p>
                                            
                                            {/* Segment Foundation Summary */}
                                            <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-4xl mx-auto">
                                                <div className="text-center mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Market Segmentation Process:</h3>
                                                    <p className="text-gray-600 mb-4 text-left">
                                                        To determine a true Market Segment, we filter the total market to find customers who share the same:
                                                    </p>
                                                    <ul className="text-left text-gray-700 mb-4 space-y-2 ml-6">
                                                        <li><strong>Jobs to be Done</strong> (shared context & struggling moments)</li>
                                                        <li><strong>Customer Value</strong> (similar value priorities)</li>
                                                        <li><strong>Willingness to Pay</strong> (investment threshold)</li>
                                                    </ul>
                                                    <button
                                                        onClick={() => openTourAtStep(1)}
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
                                                The three input sections below help you define each filter criterion to identify your true market segment.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Jobs To Be Done Section */}
                                    <div id="jtbd-section" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                                        <h2 className="text-2xl font-bold scale-green-text mb-6">Jobs To Be Done</h2>
                                        <div className="space-y-6">
                                            {[
                                                { name: 'Context', description: 'The business situation or operating environment.', placeholder: 'Quarterly close process across distributed finance teams.' },
                                                { name: 'Struggling Moments', description: 'Breakdowns, inefficiencies, or risks that trigger the search.', placeholder: 'Errors in revenue recognition delaying financial reporting.' },
                                                { name: 'Pushes & Pulls', description: 'Internal and external forces moving them toward or away from change.', placeholder: 'CFO pressure to modernize systems vs. IT reluctance to add new vendors.' },
                                                { name: 'Anxieties & Habits', description: 'Concerns about adopting something new, and inertia with current processes/tools.', placeholder: 'Fear of migration failure; comfort with spreadsheets.' },
                                                { name: 'Desired Outcomes', description: 'We will refine this outcome into specific types of value in the **Customer Value** section', placeholder: 'Reduce audit prep time by 50%; ensure SOX compliance.' },
                                                { name: 'Basic Quality (Table Stakes)', description: 'Minimum standards a solution must meet to even be considered.', placeholder: 'SOC2 compliance, API integrations with ERP, enterprise-grade security.' },
                                                { name: 'Hiring Criteria', description: 'Differentiators that make them select one vendor.', placeholder: 'Proven implementation playbook; reference customers in financial services.' },
                                                { name: 'Firing Criteria', description: 'Triggers that get a vendor rejected or replaced.', placeholder: 'System downtime; lack of role-based access control.' },
                                                { name: 'Key Trade-offs', description: 'Acceptable compromises or limits.', placeholder: 'May sacrifice customization for faster time to value.' }
                                            ].map(field => (
                                                <div key={field.name}>
                                                    <label className="block text-lg font-semibold text-gray-800 mb-2">{field.name}</label>
                                                    <p className="text-gray-600 text-sm mb-3">{field.description}</p>
                                                    <textarea
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        rows="3"
                                                        value={appState.segmentData[field.name] || ''}
                                                        onChange={(e) => {
                                                            const newSegmentData = { ...appState.segmentData, [field.name]: e.target.value };
                                                            setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                        }}
                                                        placeholder={field.placeholder}
                                                    />
                                                    {/* Validate button removed for simplification */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Value Section */}
                                    <div id="value-section" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                                        <h2 className="text-2xl font-bold scale-green-text mb-6">Customer Value</h2>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Table Stakes</label>
                                                <p className="text-gray-600 text-sm mb-3">The non-negotiables for credibility and trust. Baseline requirements.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Table Stakes'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Table Stakes': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: SOC2 certification; ERP integration; 99.9% uptime SLAs."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Functional Value</label>
                                                <p className="text-gray-600 text-sm mb-3">Tangible, measurable outcomes—ROI, efficiency, cost savings, growth, or risk mitigation.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Functional Value'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Functional Value': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: $500K OpEx savings from faster close cycles and fewer errors."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Ease of Doing Business</label>
                                                <p className="text-gray-600 text-sm mb-3">How simple you make adoption and daily use. Less friction wins.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Ease of Doing Business'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Ease of Doing Business': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: Fast implementation playbook; role-based onboarding; 24/7 enterprise support."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Individual Value</label>
                                                <p className="text-gray-600 text-sm mb-3">What matters to each buyer personally—status, workload relief, confidence, or career gains.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Individual Value'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Individual Value': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: CFO is seen as innovator; IT leader feels secure; end users save hours."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Aspirational Value</label>
                                                <p className="text-gray-600 text-sm mb-3">Alignment with higher-order goals and purpose. Motivations beyond rational ROI.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Aspirational Value'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Aspirational Value': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: Supports ESG reporting; signals innovation to board and investors."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Willingness to Pay Section */}
                                    <div id="wtp-section" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                                        <h2 className="text-2xl font-bold scale-green-text mb-6">Willingness to Pay</h2>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Ability to Pay</label>
                                                <p className="text-gray-600 text-sm mb-3">Whether the customer has budget and capacity to spend. Even strong solutions fail without funding.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Ability to Pay'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Ability to Pay': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: Line item already approved in FY25 budget for compliance automation."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Economic Justification</label>
                                                <p className="text-gray-600 text-sm mb-3">Whether the ROI and payback case makes financial sense. Customers want proof it pays for itself.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Economic Justification'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Economic Justification': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: Pays for itself in under 12 months through $1M annual cost avoidance."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Relative Value vs. Alternatives</label>
                                                <p className="text-gray-600 text-sm mb-3">How your solution compares to competitors or the status quo. Clear differentiation increases willingness to pay.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Relative Value vs. Alternatives'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Relative Value vs. Alternatives': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: Automates 80% of manual work versus consultant-heavy models."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Risk & Switching Costs</label>
                                                <p className="text-gray-600 text-sm mb-3">How much risk or friction they see in making the change. Higher risk lowers willingness; mitigation raises it.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Risk & Switching Costs'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Risk & Switching Costs': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: Migration takes days, not months; vendor assumes implementation risk."
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-lg font-semibold text-gray-800 mb-2">Market Reference Points</label>
                                                <p className="text-gray-600 text-sm mb-3">The pricing anchors customers bring from prior spend or competitors. Buyers benchmark against "similar" tools.</p>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows="3"
                                                    value={appState.segmentData['Market Reference Points'] || ''}
                                                    onChange={(e) => {
                                                        const newSegmentData = { ...appState.segmentData, 'Market Reference Points': e.target.value };
                                                        setAppState(prev => ({ ...prev, segmentData: newSegmentData }));
                                                    }}
                                                    placeholder="Example: Analytics platforms in this space usually run $100K–$150K annually."
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Clear All Fields Button */}
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={() => {
                                                    // Clear all JTBD and Customer Value fields
                                                    const clearedSegmentData = {};
                                                    setAppState(prev => ({ ...prev, segmentData: clearedSegmentData }));
                                                    alert('All fields cleared! Refresh the page to see placeholder text.');
                                                }}
                                                className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors mr-4"
                                            >
                                                Clear All Fields
                                            </button>
                                            
                                            {/* Continue to Part 2 Button */}
                                            <button
                                                onClick={() => { 
                                                    markPartAsCompleted('segment');
                                                    onNavigate('icp'); 
                                                    window.scrollTo(0, 0); 
                                                }}
                                                className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Continue to ICP Definition
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
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

        // ICPFlowVisualization Component
        const ICPFlowVisualization = ({ appState, onNavigate, openTourAtStep }) => {
            const [hoveredSection, setHoveredSection] = useState(null);
            const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
            
            // Check completion status for progressive states
            const isSegmentComplete = appState.segmentData && 
                Object.values(appState.segmentData).some(value => value && typeof value === 'string' && value.trim().length > 0);
            
            const isICPStarted = appState.positioningData && (
                appState.positioningData.icp_summary ||
                (appState.positioningData.values && appState.positioningData.values.some(v => v.val1))
            );
            
            const isICPComplete = appState.positioningData && 
                appState.positioningData.icp_summary && 
                appState.positioningData.values && 
                appState.positioningData.values.length > 0 &&
                appState.positioningData.values[0].val1;
            
            // Tooltip content for each section
            const tooltips = {
                segment: {
                    title: "Market Segment Foundation",
                    content: "Your foundational customer understanding from Part 1: Segment Foundation. This includes Jobs-to-be-Done, Customer Value propositions, and Willingness to Pay analysis.",
                    action: "Click to edit Segment Foundation"
                },
                bridge: {
                    title: "Strategic Bridge Analysis",
                    content: "The analytical work required to transform market segment insights into actionable ICP. This involves validating Product-Problem Fit and confirming your Scalable Business Model.",
                    action: "This represents your current analysis work"
                },
                strategic: {
                    title: "Strategic ICP - The 'Why'",
                    content: "The strategic reasoning behind your ICP focused on messaging and positioning. Includes the fundamental motivations, value drivers, and job-to-be-done insights.",
                    action: "Click to work on Strategic ICP elements"
                },
                operational: {
                    title: "Operational ICP - The 'Where'",
                    content: "The tactical targeting criteria for campaigns and sales. Includes firmographics, technographics, and behavioral signals for finding and reaching prospects.",
                    action: "Click to work on Operational ICP elements"
                }
            };
            
            // Handle mouse events for tooltips
            const handleMouseEnter = (section, event) => {
                setHoveredSection(section);
                const rect = event.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10
                });
            };
            
            const handleMouseLeave = () => {
                setHoveredSection(null);
            };
            
            // Handle click navigation
            const handleSectionClick = (section) => {
                switch (section) {
                    case 'segment':
                        onNavigate('segment');
                        window.scrollTo(0, 0);
                        break;
                    case 'strategic':
                    case 'operational':
                        // Stay on current page but scroll to ICP definition
                        const icpSection = document.getElementById('section-1');
                        if (icpSection) {
                            icpSection.scrollIntoView({ behavior: 'smooth' });
                        }
                        break;
                    default:
                        break;
                }
            };
            
            return (
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Strategic Flow: From Market Segment to Actionable ICP</h3>

                    {/* ICP Development Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-600 mb-4 max-w-3xl mx-auto">
                            Your <strong>Market Segment Foundation</strong> (JTBD, Value, WTP) combines with <strong>Product & Business Model Fit</strong>
                            to create an <strong>Actionable ICP</strong> with both <em>Strategic Why</em> (messaging & positioning) and <em>Operational Where</em> (targeting & campaigns).
                        </p>
                        <button
                            onClick={() => openTourAtStep(2)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            View Interactive Flow
                        </button>
                    </div>
                </div>
            );
        };

        // ICPDefinitionTool Component - Updated with openTourAtStep


export default SegmentFoundationTool;
