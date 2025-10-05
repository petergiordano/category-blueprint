import React, { useState } from 'react';

const CompanySetupModal = ({ isOpen, onComplete, companyData, setCompanyData }) => {
    console.log('CompanySetupModal rendered, isOpen:', isOpen, 'companyData:', companyData);

    if (!isOpen) return null;

    // Ensure companyData has all required properties with defaults
    const safeCompanyData = {
        companyName: '',
        companyWebsite: '',
        industry: '',
        productName: '',
        targetMarket: 'B2B',
        competitorNames: ['', '', ''],
        caseStudyUrls: [],
        documentationUrls: [],
        isSetupComplete: false,
        ...companyData
    };

    const [errors, setErrors] = useState({});

    const industries = [
        'SaaS/Software',
        'Financial Services',
        'Healthcare',
        'E-commerce',
        'Manufacturing',
        'Professional Services',
        'Other'
    ];

    const validateForm = () => {
        const newErrors = {};

        // Validate required fields
        if (!safeCompanyData.companyName || safeCompanyData.companyName.length < 2) {
            newErrors.companyName = 'Company name must be at least 2 characters';
        }

        if (!safeCompanyData.companyWebsite) {
            newErrors.companyWebsite = 'Website is required';
        } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]*\.[a-zA-Z]{2,}/.test(safeCompanyData.companyWebsite.replace(/^https?:\/\//, ''))) {
            newErrors.companyWebsite = 'Please enter a valid domain (e.g., example.com)';
        }

        // Industry validation temporarily disabled - field is hidden
        // if (!safeCompanyData.industry) {
        //   newErrors.industry = 'Please select an industry';
        // }

        if (!safeCompanyData.productName || safeCompanyData.productName.length < 2) {
            newErrors.productName = 'Product name must be at least 2 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Ensure website has https:// prefix
            const websiteWithProtocol = safeCompanyData.companyWebsite.startsWith('http://') || safeCompanyData.companyWebsite.startsWith('https://')
                ? safeCompanyData.companyWebsite
                : `https://${safeCompanyData.companyWebsite}`;

            setCompanyData(prev => ({
                ...safeCompanyData,
                ...prev,
                companyWebsite: websiteWithProtocol,
                isSetupComplete: true
            }));
            onComplete();
        }
    };

    const updateCompetitor = (index, value) => {
        const newCompetitors = [...safeCompanyData.competitorNames];
        newCompetitors[index] = value;
        setCompanyData(prev => ({ ...safeCompanyData, ...prev, competitorNames: newCompetitors }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome! Let's set up your company context</h2>
                    <p className="text-gray-600 mb-6">This information helps our AI provide more accurate insights and recommendations.</p>

                    {/* Required Fields Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <span className="text-red-500 mr-2">*</span>Required Information
                        </h3>

                        {/* Company Name */}
                        <div className="mb-4">
                            <label className="block font-bold text-gray-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                className={`w-full p-2 border rounded-md ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                                value={safeCompanyData.companyName}
                                onChange={(e) => setCompanyData(prev => ({ ...safeCompanyData, ...prev, companyName: e.target.value }))}
                                placeholder="e.g., Acme Corporation"
                            />
                            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                        </div>

                        {/* Company Website */}
                        <div className="mb-4">
                            <label className="block font-bold text-gray-700 mb-1">Company Website</label>
                            <input
                                type="url"
                                className={`w-full p-2 border rounded-md ${errors.companyWebsite ? 'border-red-500' : 'border-gray-300'}`}
                                value={safeCompanyData.companyWebsite}
                                onChange={(e) => setCompanyData(prev => ({ ...safeCompanyData, ...prev, companyWebsite: e.target.value }))}
                                placeholder="example.com"
                            />
                            {errors.companyWebsite && <p className="text-red-500 text-sm mt-1">{errors.companyWebsite}</p>}
                        </div>

                        {/* Industry - TEMPORARILY HIDDEN per user decision (can be restored by removing style={{display:'none'}}) */}
                        <div className="mb-4" style={{ display: 'none' }}>
                            <label className="block font-bold text-gray-700 mb-1">Industry</label>
                            <select
                                className={`w-full p-2 border rounded-md ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
                                value={safeCompanyData.industry}
                                onChange={(e) => setCompanyData(prev => ({ ...safeCompanyData, ...prev, industry: e.target.value }))}
                            >
                                <option value="">Select an industry</option>
                                {industries.map(ind => (
                                    <option key={ind} value={ind}>{ind}</option>
                                ))}
                            </select>
                            {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                        </div>

                        {/* Product Name */}
                        <div className="mb-4">
                            <label className="block font-bold text-gray-700 mb-1">Product/Service Name</label>
                            <input
                                type="text"
                                className={`w-full p-2 border rounded-md ${errors.productName ? 'border-red-500' : 'border-gray-300'}`}
                                value={safeCompanyData.productName}
                                onChange={(e) => setCompanyData(prev => ({ ...safeCompanyData, ...prev, productName: e.target.value }))}
                                placeholder="e.g., Analytics Platform"
                            />
                            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
                        </div>

                    </div>

                    {/* Optional Fields Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Optional Information</h3>

                        {/* Top 3 Competitors */}
                        <div className="mb-4">
                            <label className="block font-bold text-gray-700 mb-1">Top 3 Competitors</label>
                            <p className="text-sm text-gray-600 mb-2">Helps us understand your competitive landscape</p>
                            {[0, 1, 2].map(i => (
                                <input
                                    key={i}
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                    value={safeCompanyData.competitorNames[i]}
                                    onChange={(e) => updateCompetitor(i, e.target.value)}
                                    placeholder={`Competitor ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            onClick={handleSubmit}
                            className="scale-green-bg text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanySetupModal;