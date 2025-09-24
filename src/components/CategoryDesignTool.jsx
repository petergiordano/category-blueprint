import React, { useState } from 'react';
import { PrimaryActions } from './PrimaryActions';
import { ExportModal } from './ExportModal';

// CategoryDesignTool Component
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
                        if (content.pointOfView.fromStatement) updates['from-statement'] = content.pointOfView.fromStatement;
                        if (content.pointOfView.toStatement) updates['to-statement'] = content.pointOfView.toStatement;
                    }
                    if (content.newOpportunity) updates['new-opportunity'] = content.newOpportunity;
                    if (content.categoryName && content.categoryName.name) updates['category-name'] = content.categoryName.name;
                    if (content.categoryName && content.categoryName.definition) updates['category-definition'] = content.categoryName.definition;
                    if (content.manifesto) updates['manifesto'] = content.manifesto;
                    if (content.marketCategory) updates['market-category'] = content.marketCategory;

                    // Target market characteristics
                    if (content.targetMarketCharacteristics) {
                        const tm = content.targetMarketCharacteristics;
                        if (tm.summary) updates['target-market-summary'] = tm.summary;
                        if (tm.firmographic) updates['target-market-firmographic'] = tm.firmographic;
                        if (tm.technographic) updates['target-market-technographic'] = tm.technographic;
                        if (tm.behavioral) updates['target-market-behavioral'] = tm.behavioral;
                        if (tm.implementationReadiness) updates['target-market-readiness'] = tm.implementationReadiness;
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
                    <PrimaryActions
                        currentPart='category'
                        onImport={handleImportCategory}
                        onReset={() => {
                            if (window.confirm("Are you sure you want to reset all data for Part 4? This will clear all Category Design fields.")) {
                                setAppState(prev => ({
                                    ...prev,
                                    categoryData: getInitialState().categoryData
                                }));
                            }
                        }}
                        onExport={handleExport}
                        onContinue={() => {
                            // Complete Blueprint - could navigate to completion page or show success message
                            alert('Blueprint Complete! All parts have been finished.');
                            window.scrollTo(0, 0);
                        }}
                    />
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

export default CategoryDesignTool;
