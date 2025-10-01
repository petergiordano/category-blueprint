import React, { useState } from 'react';
import PrimaryActions from './PrimaryActions.jsx';
import ExportModal from './ExportModal.jsx';

const CategoryDesignTool = ({ appState, setAppState, onNavigate, markPartAsCompleted }) => {
            const [exportModal, setExportModal] = useState({ isOpen: false, content: '', title: '' });
            const [importMessage, setImportMessage] = useState(null);
            const [importMessageType, setImportMessageType] = useState('');

            // Validation function for category import data
            const validateCategoryImportData = (data) => {
                const errors = [];
                
                if (!data || typeof data !== 'object') {
                    errors.push('Invalid JSON format');
                    return { isValid: false, errors };
                }
                
                if (!data.metadata || data.metadata.partName !== 'Category Design') {
                    const detectedType = data.metadata?.partName || 'Unknown';
                    errors.push(`Wrong data type: Found "${detectedType}" data, but expected "Category Design" data. Please select a Category Design export file.`);
                }
                
                if (!data.content || typeof data.content !== 'object') {
                    errors.push('Missing or invalid content section');
                }
                
                return { isValid: errors.length === 0, errors };
            };

            // Handle import for Category Design
            const handleImportCategory = () => {
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
                            const validation = validateCategoryImportData(importedData);
                            
                            if (!validation.isValid) {
                                setImportMessage(`Import failed: ${validation.errors.join('; ')}`);
                                setImportMessageType('error');
                                return;
                            }
                            
                            // Process the import
                            const { content } = importedData;
                            const updates = {};
                            
                            // Map Point of View fields from export format to internal state
                            if (content.pointOfView) {
                                if (content.pointOfView.fromStatement !== undefined && content.pointOfView.fromStatement !== null) updates['from-statement'] = content.pointOfView.fromStatement;
                                if (content.pointOfView.toStatement !== undefined && content.pointOfView.toStatement !== null) updates['to-statement'] = content.pointOfView.toStatement;
                            }
                            if (content.newOpportunity !== undefined && content.newOpportunity !== null) updates['new-opportunity'] = content.newOpportunity;
                            if (content.categoryNameAndDefinition && content.categoryNameAndDefinition.name !== undefined && content.categoryNameAndDefinition.name !== null) updates['category-name'] = content.categoryNameAndDefinition.name;
                            if (content.categoryNameAndDefinition && content.categoryNameAndDefinition.definition !== undefined && content.categoryNameAndDefinition.definition !== null) updates['category-definition'] = content.categoryNameAndDefinition.definition;
                            if (content.manifesto !== undefined && content.manifesto !== null) updates['manifesto'] = content.manifesto;
                            if (content.marketCategory !== undefined && content.marketCategory !== null) updates['market-category'] = content.marketCategory;

                            // Target market characteristics
                            if (content.targetMarketCharacteristics) {
                                const tm = content.targetMarketCharacteristics;
                                if (tm.summary !== undefined && tm.summary !== null) updates['target-market-summary'] = tm.summary;
                                if (tm.firmographic !== undefined && tm.firmographic !== null) updates['target-market-firmographic'] = tm.firmographic;
                                if (tm.technographic !== undefined && tm.technographic !== null) updates['target-market-technographic'] = tm.technographic;
                                if (tm.behavioral !== undefined && tm.behavioral !== null) updates['target-market-behavioral'] = tm.behavioral;
                                if (tm.implementationReadiness !== undefined && tm.implementationReadiness !== null) updates['target-market-readiness'] = tm.implementationReadiness;
                            }
                            
                            // Update the state
                            setAppState(prev => ({
                                ...prev,
                                categoryData: {
                                    ...prev.categoryData,
                                    ...updates
                                }
                            }));
                            
                            setImportMessage(`Successfully imported ${Object.keys(updates).length} fields from Category Design data`);
                            setImportMessageType('success');
                            
                        } catch (error) {
                            console.error('Import error:', error);
                            setImportMessage(`Import failed: ${error.message}`);
                            setImportMessageType('error');
                        }
                    };
                    
                    reader.readAsText(file);
                };
                
                // Trigger file dialog
                document.body.appendChild(fileInput);
                fileInput.click();
                document.body.removeChild(fileInput);
            };
            

            // Generate Part 4 specific data for dual-format export
            const generatePart4SpecificData = () => {
                const exportDate = new Date().toISOString();
                
                // Utility to format field values with future-proofing
                const formatFieldValue = (fieldValue) => {
                    if (Array.isArray(fieldValue)) {
                        return fieldValue.filter(item => item && item.toString().trim()).join('; ');
                    }
                    return fieldValue && fieldValue.toString().trim() || null;
                };

                // Generate comprehensive positioning foundation summary from Part 3 data
                const generatePositioningFoundationSummary = () => {
                    if (!appState.positioningData) return null;
                    
                    const foundation = {};
                    
                    // 1. Competitive Alternatives
                    if (appState.positioningData.alternatives && Array.isArray(appState.positioningData.alternatives)) {
                        const alternatives = appState.positioningData.alternatives
                            .filter(alt => alt && alt.val1)
                            .map(alt => ({
                                alternative: formatFieldValue(alt.val1),
                                description: formatFieldValue(alt.val2),
                                whyCustomersChoose: formatFieldValue(alt.val3),
                                weaknessesOrGaps: formatFieldValue(alt.val4),
                                customerProof: formatFieldValue(alt.val5)
                            }));
                        if (alternatives.length > 0) {
                            foundation.competitiveAlternatives = alternatives;
                        }
                    }
                    
                    // 2. Unique Value & Proof
                    if (appState.positioningData.values && Array.isArray(appState.positioningData.values)) {
                        const values = appState.positioningData.values
                            .filter(v => v && v.val1)
                            .map(v => ({
                                attribute: formatFieldValue(v.val1),
                                attributeDescription: formatFieldValue(v.val2),
                                benefit: formatFieldValue(v.val3),
                                value: formatFieldValue(v.val4)
                            }));
                        if (values.length > 0) {
                            foundation.uniqueValueAndProof = values;
                        }
                    }
                    
                    // 3. Market Category
                    if (appState.positioningData['market-context']) {
                        foundation.marketCategory = appState.positioningData['market-context'] === 'Other' 
                            ? formatFieldValue(appState.positioningData['market-context-other'])
                            : formatFieldValue(appState.positioningData['market-context']);
                    }
                    
                    // 4. Target Market Characteristics
                    const targetMarket = {};
                    if (appState.positioningData.icp_summary) {
                        targetMarket.summary = formatFieldValue(appState.positioningData.icp_summary);
                    }
                    if (appState.positioningData.icp_firmographic) {
                        targetMarket.firmographic = formatFieldValue(appState.positioningData.icp_firmographic);
                    }
                    if (appState.positioningData.icp_technographic) {
                        targetMarket.technographic = formatFieldValue(appState.positioningData.icp_technographic);
                    }
                    if (appState.positioningData.icp_behavioral) {
                        targetMarket.behavioral = formatFieldValue(appState.positioningData.icp_behavioral);
                    }
                    if (appState.positioningData.icp_implementation_readiness) {
                        targetMarket.implementationReadiness = formatFieldValue(appState.positioningData.icp_implementation_readiness);
                    }
                    if (Object.keys(targetMarket).length > 0) {
                        foundation.targetMarketCharacteristics = targetMarket;
                    }
                    
                    // 5. Relevant Trends
                    const trends = [];
                    if (appState.positioningData.trend1_desc) trends.push(formatFieldValue(appState.positioningData.trend1_desc));
                    if (appState.positioningData.trend2_desc) trends.push(formatFieldValue(appState.positioningData.trend2_desc));
                    if (appState.positioningData.trend3_desc) trends.push(formatFieldValue(appState.positioningData.trend3_desc));
                    if (appState.positioningData.trend4_desc) trends.push(formatFieldValue(appState.positioningData.trend4_desc));
                    if (trends.length > 0) {
                        foundation.relevantTrends = trends;
                    }
                    
                    return Object.keys(foundation).length > 0 ? foundation : null;
                };

                return {
                    metadata: {
                        exportDate: exportDate,
                        partName: "Category Design",
                        company: {
                            name: formatFieldValue(appState.companyData?.name),
                            url: formatFieldValue(appState.companyData?.url),
                            productName: formatFieldValue(appState.companyData?.productName),
                            industry: formatFieldValue(appState.companyData?.industry)
                        }
                    },
                    content: {
                        positioningFoundation: generatePositioningFoundationSummary(),
                        pointOfView: {
                            fromStatement: formatFieldValue(appState.categoryData?.['from-statement']),
                            toStatement: formatFieldValue(appState.categoryData?.['to-statement'])
                        },
                        newOpportunity: formatFieldValue(appState.categoryData?.['new-opportunity']),
                        categoryNameAndDefinition: {
                            name: formatFieldValue(appState.categoryData?.['category-name']),
                            definition: formatFieldValue(appState.categoryData?.['category-definition'])
                        },
                        manifesto: formatFieldValue(appState.categoryData?.['manifesto']),
                        marketCategory: formatFieldValue(appState.categoryData?.['market-category']),
                        targetMarketCharacteristics: {
                            summary: formatFieldValue(appState.categoryData?.['target-market-summary']),
                            firmographic: formatFieldValue(appState.categoryData?.['target-market-firmographic']),
                            technographic: formatFieldValue(appState.categoryData?.['target-market-technographic']),
                            behavioral: formatFieldValue(appState.categoryData?.['target-market-behavioral']),
                            implementationReadiness: formatFieldValue(appState.categoryData?.['target-market-readiness'])
                        }
                    }
                };
            };

            // Generate Part 4 markdown content
            const generatePart4Markdown = (data) => {
                let markdown = `# Category Design\n\n`;
                
                // Add metadata
                if (data.metadata.company.name) {
                    markdown += `**Company:** ${data.metadata.company.name}\n`;
                }
                if (data.metadata.company.url) {
                    markdown += `**Website:** ${data.metadata.company.url}\n`;
                }
                if (data.metadata.company.productName) {
                    markdown += `**Product:** ${data.metadata.company.productName}\n`;
                }
                if (data.metadata.company.industry) {
                    markdown += `**Industry:** ${data.metadata.company.industry}\n`;
                }
                markdown += `**Export Date:** ${new Date(data.metadata.exportDate).toLocaleString()}\n\n`;
                
                markdown += `---\n\n`;

                // Positioning Foundation
                markdown += `## Positioning Foundation\n\n`;
                if (data.content.positioningFoundation) {
                    const foundation = data.content.positioningFoundation;
                    
                    // 1. Competitive Alternatives
                    if (foundation.competitiveAlternatives && foundation.competitiveAlternatives.length > 0) {
                        markdown += `### 1. Competitive Alternatives\n`;
                        foundation.competitiveAlternatives.forEach(alt => {
                            markdown += `- **${alt.alternative}**${alt.description ? `: ${alt.description}` : ''}\n`;
                        });
                        markdown += `\n`;
                    }
                    
                    // 2. Unique Value & Proof
                    if (foundation.uniqueValueAndProof && foundation.uniqueValueAndProof.length > 0) {
                        markdown += `### 2. Unique Value & Proof\n`;
                        foundation.uniqueValueAndProof.forEach(value => {
                            markdown += `- **${value.attribute}**\n`;
                            if (value.attributeDescription) {
                                markdown += `  - *Description:* ${value.attributeDescription}\n`;
                            }
                            if (value.benefit) {
                                markdown += `  - *Benefit:* ${value.benefit}\n`;
                            }
                            if (value.value) {
                                markdown += `  - *Value & Proof:* ${value.value}\n`;
                            }
                            markdown += `\n`;
                        });
                    }
                    
                    // 3. Market Category
                    if (foundation.marketCategory) {
                        markdown += `### 3. Market Category\n`;
                        markdown += `${foundation.marketCategory}\n\n`;
                    }
                    
                    // 4. Target Market Characteristics
                    if (foundation.targetMarketCharacteristics) {
                        markdown += `### 4. Target Market Characteristics\n`;
                        const tm = foundation.targetMarketCharacteristics;
                        if (tm.summary) {
                            markdown += `**Summary:** ${tm.summary}\n\n`;
                        }
                        if (tm.firmographic) {
                            markdown += `**Firmographic:** ${tm.firmographic}\n\n`;
                        }
                        if (tm.technographic) {
                            markdown += `**Technographic:** ${tm.technographic}\n\n`;
                        }
                        if (tm.behavioral) {
                            markdown += `**Behavioral:** ${tm.behavioral}\n\n`;
                        }
                        if (tm.implementationReadiness) {
                            markdown += `**Implementation Readiness:** ${tm.implementationReadiness}\n\n`;
                        }
                    }
                    
                    // 5. Relevant Trends
                    if (foundation.relevantTrends && foundation.relevantTrends.length > 0) {
                        markdown += `### 5. Relevant Trends\n`;
                        foundation.relevantTrends.forEach((trend, index) => {
                            markdown += `${index + 1}. ${trend}\n`;
                        });
                        markdown += `\n`;
                    }
                } else {
                    markdown += `*No positioning foundation data available*\n\n`;
                }

                // Point of View (The "From/To" Shift)
                markdown += `## The Point of View (The "From/To" Shift)\n\n`;
                if (data.content.pointOfView.fromStatement || data.content.pointOfView.toStatement) {
                    if (data.content.pointOfView.fromStatement) {
                        markdown += `    **From:** ${data.content.pointOfView.fromStatement}\n`;
                    }
                    if (data.content.pointOfView.toStatement) {
                        markdown += `    **To:** ${data.content.pointOfView.toStatement}\n`;
                    }
                    markdown += `\n`;
                } else {
                    markdown += `*No point of view defined*\n\n`;
                }

                // The New Opportunity
                markdown += `## The New Opportunity\n\n`;
                if (data.content.newOpportunity) {
                    markdown += `${data.content.newOpportunity}\n\n`;
                } else {
                    markdown += `*No new opportunity defined*\n\n`;
                }

                // Category Name & Definition
                markdown += `## Category Name & Definition\n\n`;
                if (data.content.categoryNameAndDefinition.name || data.content.categoryNameAndDefinition.definition) {
                    if (data.content.categoryNameAndDefinition.name) {
                        markdown += `    **Name:** ${data.content.categoryNameAndDefinition.name}\n`;
                    }
                    if (data.content.categoryNameAndDefinition.definition) {
                        markdown += `    **Definition:** ${data.content.categoryNameAndDefinition.definition}\n`;
                    }
                    markdown += `\n`;
                } else {
                    markdown += `*No category name and definition specified*\n\n`;
                }

                // The Manifesto
                markdown += `## The Manifesto\n\n`;
                if (data.content.manifesto) {
                    markdown += `${data.content.manifesto}\n\n`;
                } else {
                    markdown += `*No manifesto defined*\n\n`;
                }

                // Market Category (Part 4 specific)
                markdown += `## Market Category\n\n`;
                if (data.content.marketCategory) {
                    markdown += `${data.content.marketCategory}\n\n`;
                } else {
                    markdown += `*No market category defined*\n\n`;
                }

                // Target Market Characteristics (Part 4 specific)
                markdown += `## Target Market Characteristics\n\n`;
                if (data.content.targetMarketCharacteristics && 
                    (data.content.targetMarketCharacteristics.summary ||
                     data.content.targetMarketCharacteristics.firmographic ||
                     data.content.targetMarketCharacteristics.technographic ||
                     data.content.targetMarketCharacteristics.behavioral ||
                     data.content.targetMarketCharacteristics.implementationReadiness)) {
                    const tm = data.content.targetMarketCharacteristics;
                    if (tm.summary) {
                        markdown += `**Summary:** ${tm.summary}\n\n`;
                    }
                    if (tm.firmographic) {
                        markdown += `**Firmographic:** ${tm.firmographic}\n\n`;
                    }
                    if (tm.technographic) {
                        markdown += `**Technographic:** ${tm.technographic}\n\n`;
                    }
                    if (tm.behavioral) {
                        markdown += `**Behavioral:** ${tm.behavioral}\n\n`;
                    }
                    if (tm.implementationReadiness) {
                        markdown += `**Implementation Readiness:** ${tm.implementationReadiness}\n\n`;
                    }
                } else {
                    markdown += `*No target market characteristics defined*\n\n`;
                }

                return markdown;
            };

            const handleExport = () => {
                try {
                    const data = generatePart4SpecificData();
                    const markdown = generatePart4Markdown(data);
                    
                    setExportModal({
                        isOpen: true,
                        content: markdown,
                        title: 'Category Design Export',
                        filename: 'category-design-export',
                        partData: data
                    });
                } catch (error) {
                    console.error("Error during Part 4 export:", error);
                    setExportModal({
                        isOpen: true,
                        content: "Error generating export. Please try again.",
                        title: 'Export Error'
                    });
                }
            };

            return (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
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
                            <h1 className="text-xl sm:text-2xl font-bold scale-green-text">Part 4: Category Design</h1>
                            {React.createElement(PrimaryActions, {
                                currentPart: 'category',
                                onImport: handleImportCategory,
                                onReset: () => {
                                    if (window.confirm("Are you sure you want to reset all data for Part 4? This will clear all Category Design fields.")) {
                                        setAppState(prev => ({
                                            ...prev,
                                            categoryData: getInitialState().categoryData
                                        }));
                                    }
                                },
                                onExport: handleExport,
                                onContinue: () => {
                                    // Complete Blueprint - could navigate to completion page or show success message
                                    alert('Blueprint Complete! All parts have been finished.');
                                    window.scrollTo(0, 0);
                                }
                            })}
                        </div>
                    </header>

                    {/* Import Message Display */}
                    {importMessage && (
                        <div className={`mt-4 p-4 rounded-md ${
                            importMessageType === 'success' 
                                ? 'bg-green-50 border border-green-200 text-green-800' 
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                            <div className="flex items-center">
                                <span className="font-medium">
                                    {importMessageType === 'success' ? '✅ ' : '❌ '}
                                    {importMessage}
                                </span>
                                <button 
                                    onClick={() => setImportMessage(null)}
                                    className="ml-auto text-sm opacity-70 hover:opacity-100"
                                >
                                    ✕
                                </button>
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
                                                href="#positioning-foundation" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('positioning-foundation').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Positioning Foundation
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#section-1" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('section-1').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                The Point of View
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#section-2" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('section-2').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                The New Opportunity
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#section-3" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('section-3').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Category Name & Definition
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#section-4" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('section-4').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                The Manifesto
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#section-5" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('section-5').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Market Category
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#section-6" 
                                                className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('section-6').scrollIntoView({ behavior: 'smooth' });
                                                }}
                                            >
                                                Target Market Characteristics
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>

                            <main className="w-full">
                                <div className="space-y-8">
                        <div id="positioning-foundation" className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg shadow-sm scroll-mt-32">
                            <h3 className="text-xl font-bold text-green-800 mb-3">Positioning Foundation</h3>
                            <p className="text-green-700 mb-4">This category design exercise builds upon the positioning work from Part 3. Here is a comprehensive summary of your positioning inputs:</p>
                            <div className="bg-white p-4 rounded-md border border-green-200 space-y-4">
                                
                                {/* 1. Competitive Alternatives */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">1. Competitive Alternatives</h4>
                                    <div className="text-sm text-gray-600">
                                        {(appState.positioningData.alternatives && appState.positioningData.alternatives.some(alt => alt.val1)) ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {appState.positioningData.alternatives.map((alt, index) => (
                                                    alt.val1 && <li key={index}>
                                                        <strong>{alt.val1}:</strong> {alt.val2 && <span className="italic">{alt.val2}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="italic">Complete Part 3 first</span>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Unique Value & Proof */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">2. Unique Value & Proof</h4>
                                    <div className="text-sm text-gray-600">
                                        {(appState.positioningData.values && appState.positioningData.values.some(v => v.val1)) ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {appState.positioningData.values.map((item, index) => (
                                                    item.val1 && <li key={index}>
                                                        <strong>{item.val1}:</strong> {item.val2 && <span>{item.val2}</span>}
                                                        {item.val3 && <span className="italic"> - {item.val3}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="italic">Complete Part 3 first</span>
                                        )}
                                    </div>
                                </div>

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

                                {/* 5. Relevant Trends */}
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">5. Relevant Trends</h4>
                                    <div className="text-sm text-gray-600">
                                        {(appState.positioningData.trend1_desc || 
                                          appState.positioningData.trend2_desc || 
                                          appState.positioningData.trend3_desc || 
                                          appState.positioningData.trend4_desc) ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {appState.positioningData.trend1_desc && (
                                                    <li>{appState.positioningData.trend1_desc}</li>
                                                )}
                                                {appState.positioningData.trend2_desc && (
                                                    <li>{appState.positioningData.trend2_desc}</li>
                                                )}
                                                {appState.positioningData.trend3_desc && (
                                                    <li>{appState.positioningData.trend3_desc}</li>
                                                )}
                                                {appState.positioningData.trend4_desc && (
                                                    <li>{appState.positioningData.trend4_desc}</li>
                                                )}
                                            </ul>
                                        ) : (
                                            <span className="italic">Complete Part 3 first</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="section-1" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                            <h2 className="text-2xl font-bold scale-green-text mb-2">The Point of View (The "From/To" Shift)</h2>
                            <p className="font-semibold text-gray-600 mb-2">Question: What is the old, broken way of thinking, and what is our new, better way?</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-bold text-gray-700">From (The Old, Broken Way)</label>
                                    <textarea 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows="4" 
                                        placeholder="Example: Business transformation is a series of slow, high-risk, episodic projects."
                                        value={appState.categoryData['from-statement'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'from-statement': e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700">To (Our New, Better Way)</label>
                                    <textarea 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows="4" 
                                        placeholder="Example: Operational excellence is a continuous, automated, data-driven business function."
                                        value={appState.categoryData['to-statement'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'to-statement': e.target.value } }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div id="section-2" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                            <h2 className="text-2xl font-bold scale-green-text mb-2">The New Opportunity</h2>
                            <p className="font-semibold text-gray-600 mb-2">Question: What becomes possible for businesses that adopt our point of view?</p>
                            <textarea 
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                rows="4" 
                                placeholder="Example: Businesses can now move beyond reactive, crisis-driven change and achieve continuous transformation..."
                                value={appState.categoryData['new-opportunity'] || ''}
                                onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'new-opportunity': e.target.value } }))}
                            />
                        </div>

                        <div id="section-3" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                            <h2 className="text-2xl font-bold scale-green-text mb-2">Category Name & Definition</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold text-gray-700">Category Name</label>
                                    <div className="flex gap-2 mt-1">
                                        <input 
                                            type="text" 
                                            className="flex-1 p-2 border border-gray-300 rounded-md"
                                            placeholder="Example: Continuous Transformation"
                                            value={appState.categoryData['category-name'] || ''}
                                            onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'category-name': e.target.value } }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700">One-Sentence Definition</label>
                                    <input 
                                        type="text" 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        placeholder="Example: The practice of using AI to continuously analyze and optimize business processes in real-time."
                                        value={appState.categoryData['category-definition'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'category-definition': e.target.value } }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div id="section-4" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                            <h2 className="text-2xl font-bold scale-green-text mb-2">The Manifesto</h2>
                            <p className="font-semibold text-gray-600 mb-2">Question: What is our story?</p>
                            <textarea 
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                rows="8" 
                                placeholder="Enter your manifesto here..."
                                value={appState.categoryData['manifesto'] || ''}
                                onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'manifesto': e.target.value } }))}
                            />
                        </div>

                        <div id="section-5" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                            <h2 className="text-2xl font-bold scale-green-text mb-2">Market Category</h2>
                            <p className="font-semibold text-gray-600 mb-2">Question: What market category does your solution belong to?</p>
                            <textarea 
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                rows="3" 
                                placeholder="Example: Customer Success Platform, Marketing Automation, etc."
                                value={appState.categoryData['market-category'] || ''}
                                onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'market-category': e.target.value } }))}
                            />
                        </div>

                        <div id="section-6" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                            <h2 className="text-2xl font-bold scale-green-text mb-2">Target Market Characteristics</h2>
                            <p className="font-semibold text-gray-600 mb-2">Question: Who is the ideal customer for this category?</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold text-gray-700">Summary</label>
                                    <textarea 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows="3" 
                                        placeholder="Brief overview of your target market..."
                                        value={appState.categoryData['target-market-summary'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'target-market-summary': e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700">Firmographic</label>
                                    <textarea 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows="2" 
                                        placeholder="Company size, industry, revenue..."
                                        value={appState.categoryData['target-market-firmographic'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'target-market-firmographic': e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700">Technographic</label>
                                    <textarea 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows="2" 
                                        placeholder="Technology stack, tools used..."
                                        value={appState.categoryData['target-market-technographic'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'target-market-technographic': e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700">Behavioral</label>
                                    <textarea 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows="2" 
                                        placeholder="Buying patterns, preferences..."
                                        value={appState.categoryData['target-market-behavioral'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'target-market-behavioral': e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700">Implementation Readiness</label>
                                    <textarea 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                        rows="2" 
                                        placeholder="Readiness to adopt new solutions..."
                                        value={appState.categoryData['target-market-readiness'] || ''}
                                        onChange={(e) => setAppState(prev => ({ ...prev, categoryData: { ...prev.categoryData, 'target-market-readiness': e.target.value } }))}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Clear All Fields Button */}
                        <div className="mt-8 mb-32 text-center">
                            <button
                                onClick={() => {
                                    // Clear all Category Design fields
                                    const clearedCategoryData = {};
                                    setAppState(prev => ({ ...prev, categoryData: clearedCategoryData }));
                                    alert('All fields cleared! Refresh the page to see placeholder text.');
                                }}
                                className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors mr-4"
                            >
                                Clear All Fields
                            </button>
                            
                            {/* Complete Blueprint Button */}
                            <button
                                onClick={() => {
                                    // Complete Blueprint - could navigate to completion page or show success message
                                    alert('Blueprint Complete! All parts have been finished.');
                                    window.scrollTo(0, 0);
                                }}
                                className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Complete Blueprint
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
                        filename="category-design-blueprint"
                    />
                </div>
            );
        };

        // Home Component
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

                                {React.createElement(SessionMenu, {
                                    onImport: onImport,
                                    onExport: onExport,
                                    disabled: disabled
                                })}
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
                                                        <li><strong>Session Persistence:</strong> Return to your work anytime in the same browser</li>
                                                        <li><strong>Export/Import:</strong> Save your work as files for backup or sharing</li>
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

        // SegmentFunnelDiagram Component
        const SegmentFunnelDiagram = ({ highlightedSection = null, subStep = 0 }) => {
            const getSectionOpacity = (sectionName) => {
                if (!highlightedSection) return 1;
                return highlightedSection === sectionName ? 1 : 0.3;
            };

            const getSectionFilter = (sectionName) => {
                if (!highlightedSection) return '';
                return highlightedSection === sectionName ? 'drop-shadow(0 0 8px currentColor)' : '';
            };

            return (
                <svg width="850" height="450" viewBox="0 0 850 450" className="max-w-full h-auto transition-all duration-500">
                    <defs>
                        <marker id="tour-arrowhead" markerWidth="10" markerHeight="7"
                                refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#224f41"/>
                        </marker>
                    </defs>

                    {/* Total Market */}
                    <g style={{ opacity: getSectionOpacity('total-market'), filter: getSectionFilter('total-market'), transition: 'all 0.3s ease' }}>
                        <rect x="50" y="20" width="300" height="60" fill="#e5ecea" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="200" y="55" textAnchor="middle" fill="#224f41" fontSize="16" fontWeight="600">
                            Total Market of Buyers
                        </text>
                    </g>

                    {/* Arrow 1 */}
                    <line x1="200" y1="80" x2="200" y2="110" stroke="#224f41" strokeWidth="2" markerEnd="url(#tour-arrowhead)"
                          style={{ opacity: getSectionOpacity('arrow1'), transition: 'all 0.3s ease' }}/>

                    {/* JTBD Filter */}
                    <g style={{ opacity: getSectionOpacity('jtbd-filter'), filter: getSectionFilter('jtbd-filter'), transition: 'all 0.3s ease' }}>
                        <rect x="80" y="115" width="240" height="50" fill="#7da399" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="200" y="135" textAnchor="middle" fill="white" fontSize="14" fontWeight="500">
                            Shared Job to be Done
                        </text>
                        <text x="200" y="150" textAnchor="middle" fill="white" fontSize="12">
                            (Common Context & Struggling Moments)
                        </text>
                    </g>

                    {/* Arrow 2 */}
                    <line x1="200" y1="165" x2="200" y2="195" stroke="#224f41" strokeWidth="2" markerEnd="url(#tour-arrowhead)"
                          style={{ opacity: getSectionOpacity('arrow2'), transition: 'all 0.3s ease' }}/>

                    {/* Value Filter */}
                    <g style={{ opacity: getSectionOpacity('value-filter'), filter: getSectionFilter('value-filter'), transition: 'all 0.3s ease' }}>
                        <rect x="110" y="200" width="180" height="50" fill="#528577" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="200" y="220" textAnchor="middle" fill="white" fontSize="14" fontWeight="500">
                            Commonly Perceived Value
                        </text>
                        <text x="200" y="235" textAnchor="middle" fill="white" fontSize="12">
                            (Similar Value Priorities)
                        </text>
                    </g>

                    {/* Arrow 3 */}
                    <line x1="200" y1="250" x2="200" y2="280" stroke="#224f41" strokeWidth="2" markerEnd="url(#tour-arrowhead)"
                          style={{ opacity: getSectionOpacity('arrow3'), transition: 'all 0.3s ease' }}/>

                    {/* WTP Filter */}
                    <g style={{ opacity: getSectionOpacity('wtp-filter'), filter: getSectionFilter('wtp-filter'), transition: 'all 0.3s ease' }}>
                        <rect x="140" y="285" width="120" height="50" fill="#224f41" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="200" y="305" textAnchor="middle" fill="white" fontSize="14" fontWeight="500">
                            Similar Willingness
                        </text>
                        <text x="200" y="320" textAnchor="middle" fill="white" fontSize="14" fontWeight="500">
                            to Pay
                        </text>
                    </g>

                    {/* Arrow 4 */}
                    <line x1="200" y1="335" x2="200" y2="365" stroke="#224f41" strokeWidth="2" markerEnd="url(#tour-arrowhead)"
                          style={{ opacity: getSectionOpacity('arrow4'), transition: 'all 0.3s ease' }}/>

                    {/* Market Segment Result */}
                    <g style={{ opacity: getSectionOpacity('segment-result'), filter: getSectionFilter('segment-result'), transition: 'all 0.3s ease' }}>
                        <rect x="160" y="370" width="80" height="60" fill="#e5a819" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="200" y="390" textAnchor="middle" fill="#224f41" fontSize="14" fontWeight="600">
                            A True
                        </text>
                        <text x="200" y="405" textAnchor="middle" fill="#224f41" fontSize="14" fontWeight="600">
                            Market
                        </text>
                        <text x="200" y="420" textAnchor="middle" fill="#224f41" fontSize="14" fontWeight="600">
                            Segment
                        </text>
                    </g>

                    {/* Side Labels */}
                    <text x="30" y="225" textAnchor="middle" fill="#224f41" fontSize="12" transform="rotate(-90, 30, 225)"
                          style={{ opacity: getSectionOpacity('labels'), transition: 'all 0.3s ease' }}>
                        Filtering Process
                    </text>
                    <text x="370" y="225" textAnchor="middle" fill="#224f41" fontSize="12" transform="rotate(90, 370, 225)"
                          style={{ opacity: getSectionOpacity('labels'), transition: 'all 0.3s ease' }}>
                        Strategic Focus
                    </text>

                    {/* Relationship Flow - Right Side */}
                    <g style={{ opacity: getSectionOpacity('relationship-flow'), transition: 'all 0.3s ease' }}>
                        <line x1="425" y1="50" x2="425" y2="400" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5"/>

                        <text x="625" y="40" textAnchor="middle" fill="#224f41" fontSize="18" fontWeight="600">
                            How the Components Relate
                        </text>

                        {/* JTBD Box */}
                        <rect x="450" y="120" width="110" height="120" fill="#7da399" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="505" y="145" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">(1)</text>
                        <text x="505" y="170" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">Why the</text>
                        <text x="505" y="185" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">customer is</text>
                        <text x="505" y="200" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">motivated</text>
                        <text x="505" y="220" textAnchor="middle" fill="white" fontSize="11" fontStyle="italic">(Jobs to be Done)</text>

                        <line x1="560" y1="180" x2="590" y2="180" stroke="#224f41" strokeWidth="3" markerEnd="url(#tour-arrowhead)"/>

                        {/* Customer Value Box */}
                        <rect x="590" y="120" width="110" height="120" fill="#528577" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="645" y="145" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">(2)</text>
                        <text x="645" y="170" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">How they</text>
                        <text x="645" y="185" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">define</text>
                        <text x="645" y="200" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">success</text>
                        <text x="645" y="220" textAnchor="middle" fill="white" fontSize="11" fontStyle="italic">(Customer Value)</text>

                        <line x1="700" y1="180" x2="730" y2="180" stroke="#224f41" strokeWidth="3" markerEnd="url(#tour-arrowhead)"/>

                        {/* WTP Box */}
                        <rect x="730" y="120" width="110" height="120" fill="#224f41" stroke="#224f41" strokeWidth="2" rx="4"/>
                        <text x="785" y="145" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">(3)</text>
                        <text x="785" y="165" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">How much</text>
                        <text x="785" y="180" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">they will</text>
                        <text x="785" y="195" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">invest & why</text>
                        <text x="785" y="215" textAnchor="middle" fill="white" fontSize="11" fontStyle="italic">(Willingness</text>
                        <text x="785" y="228" textAnchor="middle" fill="white" fontSize="11" fontStyle="italic">to Pay)</text>

                        <text x="645" y="290" textAnchor="middle" fill="#224f41" fontSize="14" fontWeight="500">Understanding Progression</text>
                        <text x="645" y="310" textAnchor="middle" fill="#6b7280" fontSize="12">Customer motivation drives what they value,</text>
                        <text x="645" y="325" textAnchor="middle" fill="#6b7280" fontSize="12">which determines their investment threshold</text>
                    </g>
                </svg>
            );
        };

        // ICPFlowDiagram Component
        const ICPFlowDiagram = ({ highlightedSection = null, subStep = 0 }) => {
            const getSectionOpacity = (sectionName) => {
                if (!highlightedSection) return 1;
                return highlightedSection === sectionName ? 1 : 0.3;
            };

            const getSectionFilter = (sectionName) => {
                if (!highlightedSection) return '';
                return highlightedSection === sectionName ? 'drop-shadow(0 0 8px currentColor)' : '';
            };

            return (
                <svg viewBox="0 0 800 300" className="w-full h-auto max-w-4xl mx-auto transition-all duration-500">
                    <defs>
                        <marker id="icp-arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                        </marker>
                    </defs>

                    {/* Market Segment Box */}
                    <g style={{ opacity: getSectionOpacity('market-segment'), filter: getSectionFilter('market-segment'), transition: 'all 0.3s ease' }}>
                        <rect x="30" y="100" width="150" height="100" rx="8" fill="#059669" />
                        <text x="105" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Market Segment</text>
                        <text x="105" y="145" textAnchor="middle" fill="white" fontSize="12">JTBD • Value • WTP</text>
                        <text x="105" y="165" textAnchor="middle" fill="white" fontSize="10">Foundation Complete</text>
                        <text x="105" y="180" textAnchor="middle" fill="white" fontSize="10">✓</text>
                    </g>

                    {/* Bridge Arrow */}
                    <line x1="180" y1="150" x2="380" y2="150" stroke="#6B7280" strokeWidth="3" markerEnd="url(#icp-arrowhead)"
                          style={{ opacity: getSectionOpacity('bridge-arrow'), transition: 'all 0.3s ease' }} />

                    {/* Bridge Content Box */}
                    <g style={{ opacity: getSectionOpacity('bridge'), filter: getSectionFilter('bridge'), transition: 'all 0.3s ease' }}>
                        <rect x="220" y="60" width="180" height="80" rx="6" fill="#F3F4F6" stroke="#6B7280" strokeWidth="1" />
                        <text x="310" y="80" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">Add Product & Business</text>
                        <text x="310" y="95" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">Model Fit</text>
                        <text x="310" y="115" textAnchor="middle" fill="#6B7280" fontSize="10">Product-Problem Fit</text>
                        <text x="310" y="128" textAnchor="middle" fill="#6B7280" fontSize="10">Scalable Business Model</text>
                    </g>

                    {/* Actionable ICP Container */}
                    <rect x="420" y="50" width="350" height="200" rx="8" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1"
                          style={{ opacity: getSectionOpacity('actionable-icp'), filter: getSectionFilter('actionable-icp'), transition: 'all 0.3s ease' }} />

                    <text x="595" y="75" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="bold">Actionable ICP</text>

                    {/* Strategic Why Section */}
                    <g style={{ opacity: getSectionOpacity('strategic-why'), filter: getSectionFilter('strategic-why'), transition: 'all 0.3s ease' }}>
                        <rect x="440" y="90" width="155" height="140" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />
                        <text x="517.5" y="110" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">Strategic Why</text>
                        <text x="455" y="130" fill="#15803D" fontSize="10">• Jobs to be Done</text>
                        <text x="455" y="145" fill="#15803D" fontSize="10">• Value Drivers</text>
                        <text x="455" y="160" fill="#15803D" fontSize="10">• Buyer Motivations</text>
                        <text x="517.5" y="185" textAnchor="middle" fill="#059669" fontSize="9" fontStyle="italic">For messaging</text>
                        <text x="517.5" y="200" textAnchor="middle" fill="#059669" fontSize="9" fontStyle="italic">& positioning</text>
                    </g>

                    {/* Operational Where Section */}
                    <g style={{ opacity: getSectionOpacity('operational-where'), filter: getSectionFilter('operational-where'), transition: 'all 0.3s ease' }}>
                        <rect x="610" y="90" width="155" height="140" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
                        <text x="687.5" y="110" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">Operational Where</text>
                        <text x="625" y="130" fill="#A16207" fontSize="10">• Firmographics</text>
                        <text x="625" y="145" fill="#A16207" fontSize="10">• Technographics</text>
                        <text x="625" y="160" fill="#A16207" fontSize="10">• Behavioral Signals</text>
                        <text x="687.5" y="185" textAnchor="middle" fill="#D97706" fontSize="9" fontStyle="italic">For targeting</text>
                        <text x="687.5" y="200" textAnchor="middle" fill="#D97706" fontSize="9" fontStyle="italic">& campaigns</text>
                    </g>
                </svg>
            );
        };



export default CategoryDesignTool;
