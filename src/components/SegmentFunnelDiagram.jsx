import React from 'react';

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

export default SegmentFunnelDiagram;
