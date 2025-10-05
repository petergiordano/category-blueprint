import React, { useState } from 'react';
import { APP_VERSION } from '../utils/helpers.js';

const AIResearchModal = ({ isOpen, onClose, appState, setAppState }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    if (!isOpen) return null;

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['text/markdown', 'text/plain', '.md', '.txt'];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            const fileType = selectedFile.type;

            if (fileType === 'text/markdown' || fileType === 'text/plain' ||
                fileExtension === 'md' || fileExtension === 'txt') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a markdown (.md) or text (.txt) file');
                setFile(null);
            }
        }
    };

    const handleUploadAndProcess = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setProcessing(false);
        setError(null);
        setUploadProgress(0);

        try {
            const fileContent = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(new Error('Failed to read file'));
                reader.readAsText(file);
            });

            setUploadProgress(50);
            setUploading(false);
            setProcessing(true);

            const response = await fetch('/api/mine-research-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportText: fileContent
                })
            });

            if (response.status !== 200 && response.status !== 207) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API response:', data);

            if (data.success || (data.results && data.summary && data.summary.successful > 0)) {
                setResults(data.results);
                setUploadProgress(100);

                if (data.summary) {
                    console.log(`Processing complete: ${data.summary.successful}/${data.summary.total} parts successful`);
                }
            } else {
                throw new Error(data.message || 'Processing failed');
            }

        } catch (err) {
            console.error('Upload/Processing error:', err);
            setError(err.message || 'Failed to process research report');
        } finally {
            setUploading(false);
            setProcessing(false);
        }
    };

    const downloadResults = () => {
        if (!results) return;

        const populateSegmentData = () => {
            const segmentContent = results['Segment Foundation']?.content || {};
            const jobsToBeDone = segmentContent.jobsToBeDone || {};
            const customerValue = segmentContent.customerValue || {};
            const willingnessToPay = segmentContent.willingnessToPay || {};

            return {
                ...jobsToBeDone,
                ...customerValue,
                ...willingnessToPay
            };
        };

        const populatePositioningData = () => {
            const positioningContent = results['Positioning']?.content || {};
            const icpContent = results['ICP Definition']?.content || {};
            const segmentContent = results['Segment Foundation']?.content || {};
            const categoryContent = results['Category Design']?.content || {};

            const icpDefinition = icpContent.icpDefinition || {};
            const jobsToBeDone = segmentContent.jobsToBeDone || {};
            const customerValue = segmentContent.customerValue || {};
            const willingnessToPay = segmentContent.willingnessToPay || {};

            const uniqueValues = positioningContent.uniqueValueAndProof || [];
            const pillars = uniqueValues.slice(0, 3).map((item, index) => ({
                id: index + 1,
                name: item.attributeName || '',
                benefit: item.benefit || ''
            }));

            if (pillars.length === 0) {
                pillars.push({ id: 1, name: '', benefit: '' });
            }

            const values = uniqueValues.map((item, index) => ({
                val1: item.attributeName || '',
                val2: item.attributeDescription || '',
                val3: item.benefit || '',
                val4: item.value || '',
                pillarId: (index % 3) + 1
            }));

            if (values.length === 0) {
                values.push({ val1: '', val2: '', val3: '', val4: '', pillarId: null });
            }

            const relevantTrends = positioningContent.relevantTrends || {};

            const mapMarketCategory = (aiCategory) => {
                if (!aiCategory) return { dropdown: '', other: '' };

                const category = aiCategory.toLowerCase();
                const originalCategory = aiCategory.trim();

                if (category.includes('new') || category.includes('novel') ||
                    category.includes('first') || category.includes('emerging') ||
                    category.includes('revolutionary') || category.includes('breakthrough')) {
                    return { dropdown: 'New Category', other: '' };
                }
                else if (category.includes('existing') || category.includes('established') ||
                        category.includes('traditional') || category.includes('current') ||
                        category.includes('standard') || category.includes('conventional')) {
                    return { dropdown: 'Existing Category', other: '' };
                }
                else if (category.includes('sub') || category.includes('segment') ||
                        category.includes('niche') || category.includes('specialized') ||
                        category.includes('subset')) {
                    return { dropdown: 'Sub-category', other: '' };
                }
                else {
                    return { dropdown: 'Other', other: originalCategory };
                }
            };

            const categoryMapping = mapMarketCategory(positioningContent.marketCategory || '');

            return {
                icp_quick_decision_making: icpDefinition.quickDecisionMaking || '',
                icp_prioritized_requirements: icpDefinition.prioritizedRequirements || '',
                icp_implementation_readiness: icpDefinition.implementationReadiness || '',
                icp_firmographic: icpDefinition.firmographic || '',
                icp_technographic: icpDefinition.technographic || '',
                icp_behavioral: icpDefinition.behavioral || '',

                quickDecisionMaking: icpDefinition.quickDecisionMaking || '',
                prioritizedRequirements: icpDefinition.prioritizedRequirements || '',
                implementationReadiness: icpDefinition.implementationReadiness || '',
                firmographic: icpDefinition.firmographic || '',
                technographic: icpDefinition.technographic || '',
                behavioral: icpDefinition.behavioral || '',

                icp_common_needs: jobsToBeDone['Desired Outcomes'] || customerValue['Functional Value'] || '',
                icp_desired_business_value: customerValue['Aspirational Value'] || customerValue['Individual Value'] || '',
                icp_problem_urgency: jobsToBeDone['Struggling Moments'] || jobsToBeDone['Pushes & Pulls'] || '',
                icp_willingness_to_pay: willingnessToPay['Economic Justification'] || willingnessToPay['Ability to Pay'] || '',
                icp_summary: categoryContent.targetMarketCharacteristics?.summary || '',

                'market-context': categoryMapping.dropdown,
                'market-context-other': categoryMapping.other || positioningContent.categoryName || '',

                trend1_desc: relevantTrends.trend1 || '',
                trend2_desc: relevantTrends.trend2 || '',
                trend3_desc: relevantTrends.trend3 || '',
                trend4_desc: relevantTrends.trend4 || '',

                competitiveAlternatives: positioningContent.competitiveAlternatives || [],
                uniqueValueAndProof: positioningContent.uniqueValueAndProof || [],

                pillars: pillars,
                values: values,

                marketCategory: positioningContent.marketCategory || '',
                categoryName: positioningContent.categoryName || '',
                relevantTrends: relevantTrends
            };
        };

        const populateCategoryData = () => {
            const categoryContent = results['Category Design']?.content || {};

            return {
                'from-statement': categoryContent.pointOfView?.fromStatement || '',
                'to-statement': categoryContent.pointOfView?.toStatement || '',
                'new-opportunity': categoryContent.newOpportunity || '',
                'category-name': categoryContent.categoryNameAndDefinition?.name || '',
                'category-definition': categoryContent.categoryNameAndDefinition?.definition || '',
                'manifesto': categoryContent.manifesto || '',
                'market-category': categoryContent.marketCategory || '',
                'target-market-summary': categoryContent.targetMarketCharacteristics?.summary || '',
                'target-market-firmographic': categoryContent.targetMarketCharacteristics?.firmographic || '',
                'target-market-technographic': categoryContent.targetMarketCharacteristics?.technographic || '',
                'target-market-behavioral': categoryContent.targetMarketCharacteristics?.behavioral || '',
                'target-market-readiness': categoryContent.targetMarketCharacteristics?.implementationReadiness || ''
            };
        };

        const exportData = {
            formatVersion: "1.0.0",
            appVersion: APP_VERSION,
            exportTimestamp: new Date().toISOString(),
            data: {
                companyContext: appState.companyContext || {},
                segmentData: populateSegmentData(),
                positioningData: populatePositioningData(),
                categoryData: populateCategoryData(),
                aiSuggestions: results,
                navigationProgress: {
                    completedParts: [],
                    currentPart: "home",
                    partCompletionData: {}
                },
                currentView: "home",
                lastSaved: new Date().toISOString()
            }
        };

        if (window.SessionFileIO) {
            const filename = `ai-research-results-${new Date().toISOString().split('T')[0]}.json`;
            window.SessionFileIO.triggerDownload(filename, JSON.stringify(exportData, null, 2));
        } else {
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-research-results-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleApplySuggestions = () => {
        if (!results) return;

        setAppState(prev => ({
            ...prev,
            aiSuggestions: {
                'Segment Foundation': results['Segment Foundation']?.content || null,
                'ICP Definition': results['ICP Definition']?.content || null,
                'Positioning': results['Positioning']?.content || null,
                'Category Design': results['Category Design']?.content || null
            }
        }));

        if (window.confirm('Would you like to automatically populate available fields with AI suggestions? You can review and edit them afterwards.')) {
            setAppState(prev => {
                console.log('Applying AI suggestions to app state...');
                const newState = { ...prev };

                const v8DeoptTrigger = (value) => {
                    void value;
                };

                if (results['Segment Foundation']?.content) {
                    const sfContent = results['Segment Foundation'].content;

                    if (sfContent.jobsToBeDone) {
                        Object.keys(sfContent.jobsToBeDone).forEach(key => {
                            if (sfContent.jobsToBeDone[key] && sfContent.jobsToBeDone[key].trim()) {
                                newState.segmentData[key] = sfContent.jobsToBeDone[key];
                                v8DeoptTrigger(sfContent.jobsToBeDone[key]);
                            }
                        });
                    }

                    if (sfContent.customerValue) {
                        Object.keys(sfContent.customerValue).forEach(key => {
                            if (sfContent.customerValue[key] && sfContent.customerValue[key].trim()) {
                                newState.segmentData[key] = sfContent.customerValue[key];
                                v8DeoptTrigger(sfContent.customerValue[key]);
                            }
                        });
                    }

                    if (sfContent.willingnessToPay) {
                        Object.keys(sfContent.willingnessToPay).forEach(key => {
                            if (sfContent.willingnessToPay[key] && sfContent.willingnessToPay[key].trim()) {
                                newState.segmentData[key] = sfContent.willingnessToPay[key];
                                v8DeoptTrigger(sfContent.willingnessToPay[key]);
                            }
                        });
                    }
                }

                if (results['ICP Definition']?.content?.icpDefinition) {
                    const icpContent = results['ICP Definition'].content.icpDefinition;

                    const icpFieldMapping = {
                        quickDecisionMaking: 'icp_quick_decision_making',
                        prioritizedRequirements: 'icp_prioritized_requirements',
                        implementationReadiness: 'icp_implementation_readiness',
                        firmographic: 'icp_firmographic',
                        technographic: 'icp_technographic',
                        behavioral: 'icp_behavioral'
                    };

                    Object.keys(icpFieldMapping).forEach(apiKey => {
                        const formKey = icpFieldMapping[apiKey];
                        if (icpContent[apiKey]) {
                            newState.positioningData[formKey] = icpContent[apiKey];
                            void 0;
                        }
                    });
                }

                if (results['Positioning']?.content) {
                    const posContent = results['Positioning'].content;

                    if (posContent.competitiveAlternatives && Array.isArray(posContent.competitiveAlternatives)) {
                        newState.positioningData.alternatives = posContent.competitiveAlternatives.map(alt => ({
                            val1: alt.alternative || '',
                            val2: alt.description || '',
                            val3: alt.whyCustomersChoose || '',
                            val4: alt.weaknessesOrGaps || '',
                            val5: alt.customerProof || ''
                        }));
                    }

                    if (posContent.uniqueValueAndProof && Array.isArray(posContent.uniqueValueAndProof)) {
                        newState.positioningData.values = posContent.uniqueValueAndProof.map(val => ({
                            val1: val.attributeName || '',
                            val2: val.attributeDescription || '',
                            val3: val.benefit || '',
                            val4: val.value || '',
                            pillarId: null
                        }));
                    }

                    const mapMarketCategory = (aiCategory) => {
                        if (!aiCategory) return { dropdown: '', other: '' };

                        const category = aiCategory.toLowerCase();
                        const originalCategory = aiCategory.trim();

                        if (category.includes('new') || category.includes('novel') ||
                            category.includes('first') || category.includes('emerging') ||
                            category.includes('revolutionary') || category.includes('breakthrough')) {
                            return { dropdown: 'New Category', other: '' };
                        }
                        else if (category.includes('existing') || category.includes('established') ||
                                category.includes('traditional') || category.includes('current') ||
                                category.includes('standard') || category.includes('conventional')) {
                            return { dropdown: 'Existing Category', other: '' };
                        }
                        else if (category.includes('sub') || category.includes('segment') ||
                                category.includes('niche') || category.includes('specialized') ||
                                category.includes('subset')) {
                            return { dropdown: 'Sub-category', other: '' };
                        }
                        else {
                            return { dropdown: 'Other', other: originalCategory };
                        }
                    };

                    if (posContent.marketCategory && posContent.marketCategory.trim()) {
                        const categoryMapping = mapMarketCategory(posContent.marketCategory);
                        newState.positioningData['market-context'] = categoryMapping.dropdown;
                        newState.positioningData['market-context-other'] = categoryMapping.other || posContent.categoryName || '';
                        void 0;
                    }

                    if (posContent.categoryName && posContent.categoryName.trim()) {
                        newState.positioningData['category-name'] = posContent.categoryName;
                        void 0;
                    }

                    if (posContent.relevantTrends && typeof posContent.relevantTrends === 'object') {
                        Object.entries(posContent.relevantTrends).forEach(([key, value]) => {
                            if (value && value.trim()) {
                                const fieldName = `${key}_desc`;
                                newState.positioningData[fieldName] = value;
                                v8DeoptTrigger(value);
                            }
                        });
                    }
                }

                if (results['Category Design']?.content) {
                    const cdContent = results['Category Design'].content;

                    if (cdContent.pointOfView) {
                        if (cdContent.pointOfView.fromStatement) {
                            newState.categoryData['from-statement'] = cdContent.pointOfView.fromStatement;
                            void 0;
                        }
                        if (cdContent.pointOfView.toStatement) {
                            newState.categoryData['to-statement'] = cdContent.pointOfView.toStatement;
                            void 0;
                        }
                    }

                    if (cdContent.newOpportunity) {
                        newState.categoryData['new-opportunity'] = cdContent.newOpportunity;
                        void 0;
                    }

                    if (cdContent.categoryNameAndDefinition) {
                        if (cdContent.categoryNameAndDefinition.name) {
                            newState.categoryData['category-name'] = cdContent.categoryNameAndDefinition.name;
                            void 0;
                        }
                        if (cdContent.categoryNameAndDefinition.definition) {
                            newState.categoryData['category-definition'] = cdContent.categoryNameAndDefinition.definition;
                            void 0;
                        }
                    }

                    if (cdContent.manifesto) {
                        newState.categoryData['manifesto'] = cdContent.manifesto;
                        void 0;
                    }

                    if (cdContent.marketCategory) {
                        newState.categoryData['market-category'] = cdContent.marketCategory;
                        void 0;
                    }

                    if (cdContent.targetMarketCharacteristics) {
                        const tm = cdContent.targetMarketCharacteristics;
                        if (tm.summary) {
                            newState.categoryData['target-market-summary'] = tm.summary;
                            void 0;
                        }
                        if (tm.firmographic) {
                            newState.categoryData['target-market-firmographic'] = tm.firmographic;
                            void 0;
                        }
                        if (tm.technographic) {
                            newState.categoryData['target-market-technographic'] = tm.technographic;
                            void 0;
                        }
                        if (tm.behavioral) {
                            newState.categoryData['target-market-behavioral'] = tm.behavioral;
                            void 0;
                        }
                        if (tm.implementationReadiness) {
                            newState.categoryData['target-market-readiness'] = tm.implementationReadiness;
                            void 0;
                        }
                    }
                }

                newState.currentView = 'home';

                return newState;
            });
        }

        onClose();
    };

    const resetModal = () => {
        setFile(null);
        setUploading(false);
        setProcessing(false);
        setResults(null);
        setError(null);
        setUploadProgress(0);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 scale-green-bg rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold scale-green-text">AI Processing Assistant</h2>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-800 text-3xl font-light">×</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {!results ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Upload your research report (markdown or text file) and let AI extract insights for your Positioning Blueprint.</p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="research-file"
                                    accept=".md,.txt,text/markdown,text/plain"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="research-file" className="cursor-pointer">
                                    <div className="space-y-3">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <span className="text-purple-600 hover:text-purple-700 font-medium">Choose a file</span>
                                            <span className="text-gray-500"> or drag and drop</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Markdown (.md) or Text (.txt) files only</p>
                                    </div>
                                </label>
                            </div>

                            {file && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-gray-900">{file.name}</p>
                                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                </div>
                            )}

                            {(uploading || processing) && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {uploading ? 'Reading file...' : 'Processing with AI...'}
                                        </div>
                                        <span className="text-sm">{uploadProgress}%</span>
                                    </div>
                                    {uploadProgress > 0 && (
                                        <div className="mt-2 bg-blue-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Research report processed successfully! Review the extracted insights below.
                                </div>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(results).map(([partName, partResult]) => (
                                    <div key={partName} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                                                {partName}
                                                {partResult.error ? (
                                                    <span className="text-red-600 text-sm">Failed</span>
                                                ) : (
                                                    <span className="text-green-600 text-sm">✓ Extracted</span>
                                                )}
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            {partResult.error ? (
                                                <p className="text-red-600 text-sm">{partResult.error}</p>
                                            ) : (
                                                <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded overflow-x-auto">
                                                    {JSON.stringify(partResult.content, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    {!results ? (
                        <>
                            <button
                                onClick={handleClose}
                                className="border border-gray-300 text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadAndProcess}
                                disabled={!file || uploading || processing}
                                className="scale-green-bg text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploading || processing ? 'Processing...' : 'Process Research Report'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={downloadResults}
                                className="border border-blue-500 text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Save these Results
                            </button>
                            <button
                                onClick={handleApplySuggestions}
                                className="scale-green-bg text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Apply Results to Framework
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIResearchModal;
