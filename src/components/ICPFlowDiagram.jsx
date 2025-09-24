import React from 'react';

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

export default ICPFlowDiagram;
