import React, { useState } from 'react';
import PrimaryActions from './PrimaryActions';
import ExportModal from './ExportModal';
import { getInitialState } from '../utils/helpers';

// Dynamic Field Components for PositioningTool
const RemovableRow = ({ index, item, onUpdate, onRemove, placeholder1, placeholder2 }) => (
    <div className="space-y-3">
        <div className="flex items-center space-x-2">
            <input
                type="text"
                className="w-1/2 p-2 border border-gray-300 rounded-md focus-ring-gold"
                placeholder={placeholder1}
                value={item.val1}
                onChange={(e) => onUpdate(index, 'val1', e.target.value)}
            />
            <textarea
                className="w-1/2 p-2 border border-gray-300 rounded-md focus-ring-gold"
                rows="3"
                placeholder={placeholder2}
                value={item.val2}
                onChange={(e) => onUpdate(index, 'val2', e.target.value)}
            ></textarea>
            <div className="flex flex-col space-y-2">
                <button
                    onClick={() => onRemove(index)}
                    className="text-gray-400 hover:text-red-600 font-bold text-2xl transition-colors"
                >
                    ×
                </button>
            </div>
        </div>

    </div>
);

const RemovableAlternative = ({ index, item, onUpdate, onRemove }) => (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Name</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                    placeholder="e.g., Excel spreadsheets, Tableau, PowerBI"
                    value={item.val1}
                    onChange={(e) => onUpdate(index, 'val1', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                    rows="2"
                    placeholder="Brief explanation of what it is and how it works"
                    value={item.val2}
                    onChange={(e) => onUpdate(index, 'val2', e.target.value)}
                ></textarea>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why Customers Choose This</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                    rows="2"
                    placeholder="e.g., Low cost, simplicity, familiarity, incumbent status"
                    value={item.val3}
                    onChange={(e) => onUpdate(index, 'val3', e.target.value)}
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weaknesses/Gaps</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                    rows="2"
                    placeholder="e.g., Time-consuming, prone to errors, lacks scalability"
                    value={item.val4}
                    onChange={(e) => onUpdate(index, 'val4', e.target.value)}
                ></textarea>
            </div>
        </div>
        <div className="flex items-start space-x-2">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Proof</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                    rows="2"
                    placeholder="Evidence: company names, quotes from reviews, survey data, case studies"
                    value={item.val5}
                    onChange={(e) => onUpdate(index, 'val5', e.target.value)}
                ></textarea>
            </div>
            <div className="flex flex-col justify-end">
                <button
                    onClick={() => onRemove(index)}
                    className="text-gray-400 hover:text-red-600 font-bold text-2xl transition-colors mt-6"
                    title="Remove this alternative"
                >
                    ×
                </button>
            </div>
        </div>
    </div>
);

const RemovableInput = ({ index, item, onUpdate, onRemove, placeholder }) => (
    <div className="flex items-center space-x-2">
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
            placeholder={placeholder}
            value={item.value}
            onChange={(e) => onUpdate(index, 'value', e.target.value)}
        />
        <button
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-red-600 font-bold text-2xl transition-colors"
        >
            ×
        </button>
    </div>
);

const RemovableTriple = ({ index, item, onUpdate, onRemove }) => (
    <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
        <div className="flex items-start space-x-2">
            <div className="flex-grow">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Truly Unique Attribute Name (&lt; 5 word name for the Feature or Capability):
                </label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                    placeholder="Example: Real-time collaborative analytics"
                    value={item.val1}
                    onChange={(e) => onUpdate(index, 'val1', e.target.value)}
                />
            </div>
            <button
                onClick={() => onRemove(index)}
                className="mt-6 text-gray-400 hover:text-red-600 font-bold text-2xl transition-colors"
            >
                ×
            </button>
        </div>
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                Attribute Description: (10+ word description highlighting the differentiation)
            </label>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                rows="3"
                placeholder="Example: Industry's only platform enabling simultaneous multi-user data exploration with instant synchronization across all dashboards"
                value={item.val2}
                onChange={(e) => onUpdate(index, 'val2', e.target.value)}
            ></textarea>
        </div>
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                Benefit: What the attribute enables for a customer
            </label>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                rows="2"
                placeholder="Example: Enables teams to make data-driven decisions together in real-time, eliminating version control issues and reducing meeting cycles"
                value={item.val3}
                onChange={(e) => onUpdate(index, 'val3', e.target.value)}
            ></textarea>
        </div>
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                Value: The metrics and KPIs the customer use to measure value created by this attribute
            </label>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus-ring-gold"
                rows="2"
                placeholder="Example: 50% reduction in decision-making time, 3x faster insight discovery, $2M annual savings from eliminated redundant analysis"
                value={item.val4}
                onChange={(e) => onUpdate(index, 'val4', e.target.value)}
            ></textarea>
        </div>
    </div>
);

// PositioningTool Component
const PositioningTool = ({ appState, setAppState, onNavigate, markPartAsCompleted }) => {
    const [exportModal, setExportModal] = useState({ isOpen: false, content: '', title: '' });
    const [trendAnalysisResults, setTrendAnalysisResults] = useState({});
    const [pillarGenState, setPillarGenState] = useState({
        isGenerating: false,
        suggestedPillars: [],
        error: null,
        refinementInputs: {}
    });
    const [pillarGenModalOpen, setPillarGenModalOpen] = useState(false);
    const [importMessage, setImportMessage] = useState(null);
    const [importMessageType, setImportMessageType] = useState('');

    // Helper functions for nested data management
    const updateNestedValue = (section, index, key, value) => {
        const newData = { ...appState.positioningData };
        if (!newData[section]) newData[section] = [];
        if (!newData[section][index]) newData[section][index] = {};
        newData[section][index][key] = value;
        setAppState(prev => ({ ...prev, positioningData: newData }));
    };

    const addItem = (section, template) => {
        const newData = { ...appState.positioningData };
        if (!newData[section]) newData[section] = [];
        newData[section].push(template);
        setAppState(prev => ({ ...prev, positioningData: newData }));
    };

    const removeItem = (section, index) => {
        const newData = { ...appState.positioningData };
        if (newData[section]) {
            newData[section].splice(index, 1);
            setAppState(prev => ({ ...prev, positioningData: newData }));
            // Clear grading state for removed item
            setGradingState(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });
        }
    };

    // Simulate AI grading for value propositions
    const simulateAIGrading = async (proposition, index) => {
        const { val1, val2, val3 } = proposition;

        // Set loading state
        setGradingState(prev => ({
            ...prev,
            [index]: { isGrading: true, score: null, feedback: null }
        }));

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Analyze proposition quality
        let score = 'C';
        let feedback = [];

        // Check attribute quality
        if (!val1 || val1.length < 10) {
            feedback.push('Attribute needs more specificity and detail');
        } else if (val1.includes('AI') || val1.includes('intelligent') || val1.includes('automated')) {
            score = score < 'B' ? 'B' : score;
            feedback.push('Good use of compelling technology terms');
        }

        // Check benefit quality
        if (!val2 || val2.length < 15) {
            feedback.push('Benefit statement should explain customer impact more clearly');
        } else if (val2.includes('reduces') || val2.includes('increases') || val2.includes('enables')) {
            score = score < 'B+' ? 'B+' : score;
            feedback.push('Strong benefit articulation with clear outcomes');
        }

        // Check value quality
        if (!val3 || val3.length < 10) {
            feedback.push('Value statement needs quantifiable outcomes or proof points');
        } else if (val3.match(/\$|%|months?|weeks?|days?|hours?|\d+/)) {
            score = 'A-';
            feedback.push('Excellent quantifiable value with specific metrics');
        }

        // Assign final score
        if (val1 && val2 && val3 && val1.length > 10 && val2.length > 15 && val3.length > 15) {
            if (score === 'C') score = 'B';
        }

        // Create final feedback
        const finalFeedback = feedback.length > 0
            ? feedback.join('. ') + '.'
            : 'Complete all three fields with more specific details for better grading.';

        // Update grading state with results
        setGradingState(prev => ({
            ...prev,
            [index]: {
                isGrading: false,
                score,
                feedback: finalFeedback,
                timestamp: new Date().toISOString()
            }
        }));
    };

    // Analyze uniqueness using web search API
    const analyzeUniqueness = async (attributeText, index) => {
        if (!attributeText || !attributeText.trim()) {
            return;
        }

        setUniquenessResults(prev => ({
            ...prev,
            [index]: { isAnalyzing: true, results: null }
        }));

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `"${attributeText.trim()}" software features capabilities`
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const searchData = await response.json();

            // Extract relevant results for display
            const results = searchData.web?.results?.slice(0, 3).map(result => ({
                title: result.title,
                description: result.description || result.snippet || 'No description available',
                url: result.url
            })) || [];

            setUniquenessResults(prev => ({
                ...prev,
                [index]: {
                    isAnalyzing: false,
                    results,
                    timestamp: new Date().toISOString()
                }
            }));

        } catch (error) {
            console.error('Uniqueness analysis error:', error);
            setUniquenessResults(prev => ({
                ...prev,
                [index]: {
                    isAnalyzing: false,
                    error: 'Analysis unavailable - please try again later',
                    timestamp: new Date().toISOString()
                }
            }));
        }
    };

    // Validate imported Part 3 positioning data
    const validatePositioningImportData = (data) => {
        const errors = [];

        // Validate basic structure
        if (!data || typeof data !== 'object') {
            errors.push('Invalid file structure - expected JSON object');
            return { isValid: false, errors };
        }

        // Validate metadata
        if (!data.metadata || typeof data.metadata !== 'object') {
            errors.push('Missing or invalid metadata section');
        } else {
            if (!data.metadata.partName || data.metadata.partName !== 'Positioning') {
                const detectedType = data.metadata?.partName || 'Unknown';
                errors.push(`Wrong data type: Found "${detectedType}" data, but expected "Positioning" data. Please select a Positioning export file.`);
            }
            if (!data.metadata.exportDate) {
                errors.push('Missing export date in metadata');
            }
        }

        // Validate content structure
        if (!data.content || typeof data.content !== 'object') {
            errors.push('Missing or invalid content section');
            return { isValid: false, errors };
        }

        const { content } = data;

        // Validate competitiveAlternatives
        if (content.competitiveAlternatives !== undefined) {
            if (!Array.isArray(content.competitiveAlternatives)) {
                errors.push('competitiveAlternatives must be an array');
            } else {
                content.competitiveAlternatives.forEach((alt, index) => {
                    if (typeof alt !== 'object' || alt === null) {
                        errors.push(`competitiveAlternatives[${index}] must be an object`);
                    } else {
                        if (!alt.hasOwnProperty('alternative') || !alt.hasOwnProperty('description')) {
                            errors.push(`competitiveAlternatives[${index}] must have 'alternative' and 'description' fields`);
                        }
                    }
                });
            }
        }

        // Validate uniqueValueAndProof
        if (content.uniqueValueAndProof !== undefined) {
            if (!Array.isArray(content.uniqueValueAndProof)) {
                errors.push('uniqueValueAndProof must be an array');
            } else {
                content.uniqueValueAndProof.forEach((val, index) => {
                    if (typeof val !== 'object' || val === null) {
                        errors.push(`uniqueValueAndProof[${index}] must be an object`);
                    } else {
                        if (!val.hasOwnProperty('attributeName') || !val.hasOwnProperty('attributeDescription') || !val.hasOwnProperty('benefit') || !val.hasOwnProperty('value')) {
                            errors.push(`uniqueValueAndProof[${index}] must have 'attributeName', 'attributeDescription', 'benefit', and 'value' fields`);
                        }
                    }
                });
            }
        }

        // Validate marketCategory (optional string)
        if (content.marketCategory !== undefined && typeof content.marketCategory !== 'string') {
            errors.push('marketCategory must be a string');
        }

        // Validate categoryName (optional string)
        if (content.categoryName !== undefined && typeof content.categoryName !== 'string') {
            errors.push('categoryName must be a string');
        }

        // Validate relevantTrends
        if (content.relevantTrends !== undefined) {
            if (typeof content.relevantTrends !== 'object' || content.relevantTrends === null || Array.isArray(content.relevantTrends)) {
                errors.push('relevantTrends must be an object');
            } else {
                // Validate trend fields
                const validTrendKeys = ['trend1', 'trend2', 'trend3', 'trend4'];
                Object.keys(content.relevantTrends).forEach(key => {
                    if (!validTrendKeys.includes(key)) {
                        errors.push(`Invalid trend key: ${key}. Valid keys are: ${validTrendKeys.join(', ')}`);
                    }
                    if (typeof content.relevantTrends[key] !== 'string') {
                        errors.push(`${key} must be a string`);
                    }
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    // Handle import of Part 3 positioning data
    const handleImportPositioning = () => {
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
                    const validation = validatePositioningImportData(importedData);

                    if (!validation.isValid) {
                        setImportMessage(`Import failed: ${validation.errors.join('; ')}`);
                        setImportMessageType('error');
                        return;
                    }

                    // Process the import - perform reverse transformation
                    const { content } = importedData;
                    const updates = {};

                    // Transform competitive alternatives: enhanced 5-field structure → {val1, val2, val3, val4, val5}
                    if (content.competitiveAlternatives && Array.isArray(content.competitiveAlternatives)) {
                        updates.alternatives = content.competitiveAlternatives.map(alt => ({
                            val1: alt.alternative || '',
                            val2: alt.description || '',
                            val3: alt.whyCustomersChoose || '',
                            val4: alt.weaknessesOrGaps || '',
                            val5: alt.customerProof || ''
                        }));
                    }

                    if (content.uniqueValueAndProof && Array.isArray(content.uniqueValueAndProof)) {
                        updates.values = content.uniqueValueAndProof.map(val => ({
                            val1: val.attributeName || '',
                            val2: val.attributeDescription || '',
                            val3: val.benefit || '',
                            val4: val.value || ''
                        }));
                    }

                    // Map market category
                    if (content.marketCategory && content.marketCategory.trim()) {
                        updates['market-context'] = content.marketCategory;
                    }

                    // Map category name
                    if (content.categoryName && content.categoryName.trim()) {
                        updates['category-name'] = content.categoryName;
                    }

                    // Transform trends: {trend1, trend2, ...} → trend1_desc, trend2_desc, ...
                    if (content.relevantTrends && typeof content.relevantTrends === 'object') {
                        Object.entries(content.relevantTrends).forEach(([key, value]) => {
                            if (value && value.trim()) {
                                updates[`${key}_desc`] = value;
                            }
                        });
                    }

                    // Apply updates using immutable pattern, preserving existing ICP fields
                    setAppState(prev => ({
                        ...prev,
                        positioningData: {
                            ...prev.positioningData,
                            ...updates
                        }
                    }));

                    setImportMessage('Part 3 positioning data imported successfully!');
                    setImportMessageType('success');

                } catch (error) {
                    setImportMessage(`Import failed: Invalid JSON file format - ${error.message}`);
                    setImportMessageType('error');
                }
            };

            reader.readAsText(file);
        };

        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    // Generate Part 3 specific data for dual-format export
    const generatePart3SpecificData = () => {
        const exportDate = new Date().toISOString();

        // Utility to format field values with future-proofing
        const formatFieldValue = (fieldValue) => {
            if (Array.isArray(fieldValue)) {
                return fieldValue.filter(item => item && item.toString().trim()).join('; ');
            }
            return fieldValue && fieldValue.toString().trim() || null;
        };

        // Generate focused ICP summary for Target Market Characteristics
        const generateTargetMarketIcpSummary = () => {
            if (!appState.segmentData?.icpDefinition) return null;

            const icp = appState.segmentData.icpDefinition;
            const characteristics = {};

            if (icp.firmographic) {
                characteristics.firmographic = formatFieldValue(icp.firmographic);
            }
            if (icp.technographic) {
                characteristics.technographic = formatFieldValue(icp.technographic);
            }
            if (icp.behavioral) {
                characteristics.behavioral = formatFieldValue(icp.behavioral);
            }
            if (icp.quickDecisionMaking) {
                characteristics.decisionMaking = formatFieldValue(icp.quickDecisionMaking);
            }
            if (icp.prioritizedRequirements) {
                characteristics.keyRequirements = formatFieldValue(icp.prioritizedRequirements);
            }

            return Object.keys(characteristics).length > 0 ? characteristics : null;
        };

        // Format competitive alternatives
        const formatCompetitiveAlternatives = () => {
            if (!appState.positioningData.alternatives || !Array.isArray(appState.positioningData.alternatives)) {
                return [{ alternative: null, description: null, whyCustomersChoose: null, weaknessesOrGaps: null, customerProof: null }];
            }

            return appState.positioningData.alternatives.map(alt => ({
                alternative: formatFieldValue(alt.val1),
                description: formatFieldValue(alt.val2),
                whyCustomersChoose: formatFieldValue(alt.val3),
                weaknessesOrGaps: formatFieldValue(alt.val4),
                customerProof: formatFieldValue(alt.val5)
            }));
        };

        // Format unique value and proof
        const formatUniqueValueAndProof = () => {
            if (!appState.positioningData.values || !Array.isArray(appState.positioningData.values)) {
                return [{ attribute: null, benefit: null, value: null }];
            }

            return appState.positioningData.values.map(val => ({
                attribute: formatFieldValue(val.val1),
                attributeDescription: formatFieldValue(val.val2),
                benefit: formatFieldValue(val.val3),
                value: formatFieldValue(val.val4)
            }));
        };

        // Get market category
        const getMarketCategory = () => {
            if (appState.positioningData['market-context'] === 'Other') {
                return formatFieldValue(appState.positioningData['market-context-other']);
            }
            return formatFieldValue(appState.positioningData['market-context']);
        };

        // Format relevant trends
        const formatRelevantTrends = () => {
            return {
                trend1: formatFieldValue(appState.positioningData.trend1_desc),
                trend2: formatFieldValue(appState.positioningData.trend2_desc),
                trend3: formatFieldValue(appState.positioningData.trend3_desc),
                trend4: formatFieldValue(appState.positioningData.trend4_desc)
            };
        };

        return {
            metadata: {
                exportDate: exportDate,
                partName: "Positioning",
                company: {
                    name: formatFieldValue(appState.companyData?.name),
                    url: formatFieldValue(appState.companyData?.url),
                    productName: formatFieldValue(appState.companyData?.productName),
                    industry: formatFieldValue(appState.companyData?.industry)
                }
            },
            content: {
                competitiveAlternatives: formatCompetitiveAlternatives(),
                uniqueValueAndProof: formatUniqueValueAndProof(),
                marketCategory: getMarketCategory(),
                categoryName: formatFieldValue(appState.positioningData?.['category-name']),
                targetMarketCharacteristics: generateTargetMarketIcpSummary(),
                relevantTrends: formatRelevantTrends()
            }
        };
    };

    // Generate Part 3 markdown content
    const generatePart3Markdown = (data) => {
        let markdown = `# Positioning\n\n`;

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

        // Competitive Alternatives
        markdown += `## Competitive Alternatives\n\n`;
        if (data.content.competitiveAlternatives.length > 0 && data.content.competitiveAlternatives[0].alternative) {
            data.content.competitiveAlternatives.forEach((alt, index) => {
                if (alt.alternative) {
                    markdown += `**${index + 1}. ${alt.alternative}**\n`;
                    if (alt.description) {
                        markdown += `   ${alt.description}\n\n`;
                    } else {
                        markdown += `\n`;
                    }
                }
            });
        } else {
            markdown += `*No competitive alternatives defined*\n\n`;
        }

        // Unique Value and Proof
        markdown += `## Unique Value and Proof\n\n`;
        if (data.content.uniqueValueAndProof.length > 0 && data.content.uniqueValueAndProof[0].attribute) {
            data.content.uniqueValueAndProof.forEach((item, index) => {
                if (item.attribute) {
                    markdown += `**${index + 1}. ${item.attribute}**\n`;
                    if (item.benefit) {
                        markdown += `   **Benefit:** ${item.benefit}\n`;
                    }
                    if (item.value) {
                        markdown += `   **Value:** ${item.value}\n`;
                    }
                    markdown += `\n`;
                }
            });
        } else {
            markdown += `*No unique value and proof defined*\n\n`;
        }

        // Market Category
        markdown += `## Market Category\n\n`;
        if (data.content.marketCategory) {
            markdown += `**Market Context:** ${data.content.marketCategory}\n\n`;
        } else {
            markdown += `**Market Context:** *No market category defined*\n\n`;
        }

        // Category Name
        if (data.content.categoryName) {
            markdown += `**Category Name:** ${data.content.categoryName}\n\n`;
        } else {
            markdown += `**Category Name:** *No category name specified*\n\n`;
        }

        // Target Market Characteristics
        markdown += `## Target Market Characteristics\n\n`;
        if (data.content.targetMarketCharacteristics) {
            const characteristics = data.content.targetMarketCharacteristics;
            if (characteristics.firmographic) {
                markdown += `    **Firmographic**: ${characteristics.firmographic}\n`;
            }
            if (characteristics.technographic) {
                markdown += `    **Technographic**: ${characteristics.technographic}\n`;
            }
            if (characteristics.behavioral) {
                markdown += `    **Behavioral**: ${characteristics.behavioral}\n`;
            }
            if (characteristics.decisionMaking) {
                markdown += `    **Decision Making**: ${characteristics.decisionMaking}\n`;
            }
            if (characteristics.keyRequirements) {
                markdown += `    **Key Requirements**: ${characteristics.keyRequirements}\n`;
            }
            markdown += `\n`;
        } else {
            markdown += `*No target market characteristics defined*\n\n`;
        }

        // Relevant Trends
        markdown += `## Relevant Trends\n\n`;
        const trends = data.content.relevantTrends;
        let hasTrends = false;

        ['trend1', 'trend2', 'trend3', 'trend4'].forEach((trendKey, index) => {
            if (trends[trendKey]) {
                markdown += `    **Trend ${index + 1}:** ${trends[trendKey]}\n`;
                hasTrends = true;
            }
        });

        if (hasTrends) {
            markdown += `\n`;
        } else {
            markdown += `*No relevant trends defined*\n\n`;
        }

        return markdown;
    };

    // Export functionality for positioning data (dual-format)
    const exportData = () => {
        const data = generatePart3SpecificData();
        const markdownContent = generatePart3Markdown(data);

        setExportModal({
            isOpen: true,
            content: markdownContent,
            title: 'Positioning Export',
            filename: 'positioning-export',
            partData: data
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ExportModal
                isOpen={exportModal.isOpen}
                onClose={() => setExportModal({ isOpen: false, content: '', title: '' })}
                title={exportModal.title}
                content={exportModal.content}
                appState={appState}
                filename={exportModal.filename || "positioning-export"}
                partData={exportModal.partData}
            />

            {/* Header */}
            <header style={{
                position: 'sticky',
                top: '73px',
                zIndex: 40,
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '1rem 0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl sm:text-2xl font-bold scale-green-text">Part 3: Positioning</h1>
                        <PrimaryActions
                            currentPart='positioning'
                            onReset={() => {
                                if (window.confirm("Are you sure you want to reset all data for Part 3? This will clear all Positioning fields.")) {
                                    setAppState(prev => ({
                                        ...prev,
                                        positioningData: getInitialState().positioningData
                                    }));
                                }
                            }}
                            onExport={exportData}
                            onImport={handleImportPositioning}
                            onContinue={() => {
                                markPartAsCompleted('positioning');
                                onNavigate('category');
                                window.scrollTo(0, 0);
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* Import Message */}
            {importMessage && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className={`p-4 rounded-md ${importMessageType === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                        <div className="flex">
                            <div className={`${importMessageType === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                                <p className="text-sm font-medium">{importMessage}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setImportMessage(null)}
                                    className={`${importMessageType === 'error' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} transition-colors`}
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Layout with Sidebar Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:flex lg:space-x-8">
                    {/* Sticky Navigation Sidebar */}
                    <nav className="hidden lg:block w-64 flex-shrink-0 sticky top-36 h-fit">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Section Navigation</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#section-1"
                                        className="block px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('section-1').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        Competitive Alternatives
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
                                        Unique Value and Proof
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
                                        Market Category
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
                                        Target Market Characteristics
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
                                        Relevant Trends
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <main className="flex-1 min-w-0">
                        <div className="space-y-8">

                    {/* Section 1: Competitive Alternatives */}
                    <div id="section-1" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                        <h2 className="text-2xl font-bold scale-green-text mb-2">Competitive Alternatives</h2>
                        <p className="text-gray-600 mb-6">What are your target customers currently using to solve this problem?</p>
                        <div className="space-y-4">
                            {(appState.positioningData?.alternatives || []).map((item, index) =>
                                <RemovableAlternative
                                    key={index}
                                    index={index}
                                    item={item}
                                    onUpdate={(idx, key, value) => updateNestedValue('alternatives', idx, key, value)}
                                    onRemove={(idx) => removeItem('alternatives', idx)}
                                />
                            )}
                            <button
                                onClick={() => addItem('alternatives', { val1: '', val2: '', val3: '', val4: '', val5: '' })}
                                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                            >
                                + Add Alternative
                            </button>
                        </div>
                    </div>

                    {/* Section 2: Unique Value & Proof */}
                    <div id="section-2" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                        <h2 className="text-2xl font-bold scale-green-text mb-2">Unique Value & Proof</h2>
                        <p className="text-gray-600 mb-6">What unique attributes deliver measurable value to your customers?</p>
                        <div className="space-y-4">
                            {(appState.positioningData?.values || []).map((item, index) =>
                                <RemovableTriple
                                    key={index}
                                    index={index}
                                    item={item}
                                    onUpdate={(idx, key, value) => updateNestedValue('values', idx, key, value)}
                                    onRemove={(idx) => removeItem('values', idx)}
                                />
                            )}
                            <button
                                onClick={() => addItem('values', { val1: '', val2: '', val3: '', val4: '' })}
                                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                            >
                                + Add Value Proposition
                            </button>
                        </div>
                    </div>

                    {/* Section 3: Market Category */}
                    <div id="section-3" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                        <h2 className="text-2xl font-bold scale-green-text mb-2">Market Category</h2>
                        <p className="text-gray-600 mb-6">Define how customers and analysts will categorize your solution.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Market Context</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={appState.positioningData?.['market-context'] || ''}
                                    onChange={(e) => setAppState(prev => ({
                                        ...prev,
                                        positioningData: { ...prev.positioningData, 'market-context': e.target.value }
                                    }))}
                                >
                                    <option value="">Select market category...</option>
                                    <option value="New Category">New Category</option>
                                    <option value="Existing Category">Existing Category</option>
                                    <option value="Sub-category">Sub-category</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* Show additional input if "Other" is selected */}
                            {appState.positioningData?.['market-context'] === 'Other' && (
                                <div>
                                    <label className="block font-bold text-gray-700 mb-2">Specify Market Context</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter your specific market context..."
                                        value={appState.positioningData?.['market-context-other'] || ''}
                                        onChange={(e) => setAppState(prev => ({
                                            ...prev,
                                            positioningData: { ...prev.positioningData, 'market-context-other': e.target.value }
                                        }))}
                                    />
                                </div>
                            )}

                            {/* Category Name Field */}
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter the name of your chosen category..."
                                    value={appState.positioningData?.['category-name'] || ''}
                                    onChange={(e) => setAppState(prev => ({
                                        ...prev,
                                        positioningData: { ...prev.positioningData, 'category-name': e.target.value }
                                    }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Target Market Characteristics */}
                    <div id="section-4" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                        <h2 className="text-2xl font-bold scale-green-text mb-2">Target Market Characteristics</h2>
                        <p className="text-gray-600 mb-6">Who will care most about your unique value?</p>
                        <div className="space-y-4">
                            {/* Display ICP data from Part 2 */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-blue-800 mb-2">ICP Summary from Part 2</h3>
                                <div className="space-y-2">
                                    {appState.positioningData?.icp_summary ?
                                        <p className="text-blue-700">{appState.positioningData.icp_summary}</p> :
                                        <p className="text-blue-600 italic">Complete Part 2: ICP Definition to see your target market characteristics here</p>
                                    }
                                </div>
                            </div>
                            {/* Additional ICP details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Firmographic */}
                                {appState.positioningData?.icp_firmographic && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-bold text-gray-800 mb-1">Firmographic</h4>
                                        <p className="text-sm text-gray-700">{appState.positioningData.icp_firmographic}</p>
                                    </div>
                                )}
                                {/* Technographic */}
                                {appState.positioningData?.icp_technographic && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-bold text-gray-800 mb-1">Technographic</h4>
                                        <p className="text-sm text-gray-700">{appState.positioningData.icp_technographic}</p>
                                    </div>
                                )}
                                {/* Behavioral */}
                                {appState.positioningData?.icp_behavioral && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-bold text-gray-800 mb-1">Behavioral</h4>
                                        <p className="text-sm text-gray-700">{appState.positioningData.icp_behavioral}</p>
                                    </div>
                                )}
                                {/* Implementation Readiness */}
                                {appState.positioningData?.icp_implementation_readiness && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-bold text-gray-800 mb-1">Implementation Readiness</h4>
                                        <p className="text-sm text-gray-700">{appState.positioningData.icp_implementation_readiness}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Relevant Trends */}
                    <div id="section-5" className="bg-white p-8 rounded-lg shadow-md scroll-mt-32">
                        <h2 className="text-2xl font-bold scale-green-text mb-2">Relevant Trends</h2>
                        <p className="text-gray-600 mb-6">What market trends create urgency for your solution?</p>
                        <div className="space-y-6">
                            {/* Trend 1 */}
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Industry Trend 1</label>
                                <textarea
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    rows="2"
                                    placeholder="Example: AI automation is becoming table stakes in enterprise software"
                                    value={appState.positioningData?.trend1_desc || ''}
                                    onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, trend1_desc: e.target.value } }))}
                                />
                            </div>
                            {/* Trend 2 */}
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Industry Trend 2</label>
                                <textarea
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    rows="2"
                                    placeholder="Example: Remote work is driving demand for cloud-based collaboration"
                                    value={appState.positioningData?.trend2_desc || ''}
                                    onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, trend2_desc: e.target.value } }))}
                                />
                            </div>
                            {/* Trend 3 */}
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Industry Trend 3</label>
                                <textarea
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    rows="2"
                                    placeholder="Example: Regulatory compliance requirements are becoming more stringent"
                                    value={appState.positioningData?.trend3_desc || ''}
                                    onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, trend3_desc: e.target.value } }))}
                                />
                            </div>
                            {/* Trend 4 */}
                            <div>
                                <label className="block font-bold text-gray-700 mb-2">Industry Trend 4</label>
                                <textarea
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    rows="2"
                                    placeholder="Example: Customer expectations for real-time data insights"
                                    value={appState.positioningData?.trend4_desc || ''}
                                    onChange={(e) => setAppState(prev => ({ ...prev, positioningData: { ...prev.positioningData, trend4_desc: e.target.value } }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clear All Fields Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                // Clear all Positioning fields
                                const clearedPositioningData = {};
                                setAppState(prev => ({ ...prev, positioningData: clearedPositioningData }));
                                alert('All fields cleared! Refresh the page to see placeholder text.');
                            }}
                            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors mr-4"
                        >
                            Clear All Fields
                        </button>

                        {/* Continue to Part 4 Button */}
                        <button
                            onClick={() => {
                                markPartAsCompleted('positioning');
                                onNavigate('category');
                                window.scrollTo(0, 0);
                            }}
                            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Continue to Category Design
                        </button>
                    </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PositioningTool;
