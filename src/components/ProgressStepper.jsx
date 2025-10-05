import React, { useState, useEffect } from 'react';
import SessionMenu from './SessionMenu.jsx';

const ProgressStepper = ({ currentPart, completedParts, onNavigate, appState, saveAppState, onImport, onExport, disabled }) => {
    const parts = [
        { id: 'segment', name: 'Segment', number: 1, fullName: 'Segment Foundation' },
        { id: 'icp', name: 'ICP Definition', number: 2, fullName: 'ICP Definition' },
        { id: 'positioning', name: 'Positioning', number: 3, fullName: 'Positioning' },
        { id: 'category', name: 'Category Design', number: 4, fullName: 'Category Design' }
    ];

    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isNavigable = (partId) => {
        if (completedParts.includes(partId) || partId === currentPart) {
            return true;
        }

        const partOrder = ['segment', 'icp', 'positioning', 'category'];
        const partIndex = partOrder.indexOf(partId);
        const currentIndex = partOrder.indexOf(currentPart);

        return partIndex < currentIndex && currentIndex > 0;
    };

    const getStepStatus = (partId) => {
        if (partId === currentPart) return 'current';
        if (completedParts.includes(partId)) return 'completed';

        const partOrder = ['segment', 'icp', 'positioning', 'category'];
        const partIndex = partOrder.indexOf(partId);
        const currentIndex = partOrder.indexOf(currentPart);

        if (partIndex < currentIndex && currentIndex > 0) {
            return 'completed';
        }

        return 'upcoming';
    };

    const handleStepClick = (partId) => {
        if (!isNavigable(partId)) return;

        if (saveAppState && appState) {
            saveAppState(appState);
        }

        onNavigate(partId);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleHomeClick = () => {
        if (saveAppState && appState) {
            saveAppState(appState);
        }

        onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStepStyles = (status, isHoverable) => {
        const baseStyles = {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease',
            cursor: isHoverable ? 'pointer' : 'not-allowed',
            userSelect: 'none',
            position: 'relative',
            border: 'none',
            outline: 'none'
        };

        const statusStyles = {
            completed: {
                backgroundColor: '#10b981',
                color: 'white',
                opacity: 1
            },
            current: {
                backgroundColor: '#3b82f6',
                color: 'white',
                opacity: 1,
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
            },
            upcoming: {
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                opacity: 0.6
            }
        };

        return { ...baseStyles, ...statusStyles[status] };
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
            <button
                onClick={handleHomeClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                title="Return to Home"
                aria-label="Return to Home Screen"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ marginRight: '0.25rem' }}
                >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="hidden sm:inline">Positioning Blueprint</span>
                <span className="sm:hidden">Home</span>
            </button>

            <nav role="navigation" aria-label="Blueprint progress">
                <ol role="list" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                    {parts.map((part, index) => {
                        const status = getStepStatus(part.id);
                        const isHoverable = isNavigable(part.id);

                        return (
                            <React.Fragment key={part.id}>
                                <li role="listitem">
                                    <button
                                        onClick={() => handleStepClick(part.id)}
                                        disabled={!isHoverable}
                                        aria-label={`Part ${part.number}: ${part.fullName} - ${status}`}
                                        aria-current={part.id === currentPart ? 'step' : undefined}
                                        style={getStepStyles(status, isHoverable)}
                                    >
                                        {status === 'completed' ? (
                                            <span style={{ fontSize: '1.1rem' }}>✓</span>
                                        ) : (
                                            <span style={{
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                minWidth: '1.5rem',
                                                textAlign: 'center'
                                            }}>{part.number}</span>
                                        )}
                                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                            {isMobile ? part.number : part.name}
                                        </span>
                                    </button>
                                </li>
                                {index < parts.length - 1 && (
                                    <li role="presentation" aria-hidden="true">
                                        <div style={{
                                            width: '2rem',
                                            height: '2px',
                                            backgroundColor: completedParts.includes(parts[index + 1].id) || parts[index + 1].id === currentPart ? '#10b981' : '#d1d5db',
                                            transition: 'background-color 0.3s ease'
                                        }} />
                                    </li>
                                )}
                            </React.Fragment>
                        );
                    })}
                </ol>
            </nav>

            <SessionMenu
                onImport={onImport}
                onExport={onExport}
                disabled={disabled}
            />
        </div>
    );
};

export default ProgressStepper;
