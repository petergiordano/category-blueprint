import React from 'react';

const PrimaryActions = ({ currentPart, onExport, onContinue, onReset, onImport }) => {
    const getButtonConfig = (part) => {
        const configs = {
            'segment': {
                continue: 'Continue to ICP Definition',
                export: 'Export Foundation'
            },
            'icp': {
                continue: 'Continue to Positioning',
                export: 'Export ICP'
            },
            'positioning': {
                continue: 'Continue to Category Design',
                export: 'Export Positioning'
            },
            'category': {
                continue: 'Complete Blueprint',
                export: 'Export Category Design'
            }
        };
        return configs[part] || { continue: 'Continue →', export: 'Export' };
    };

    const config = getButtonConfig(currentPart);

    return (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {onReset && (
                <button
                    onClick={onReset}
                    style={{
                        background: 'transparent',
                        color: '#6b7280',
                        fontWeight: 500,
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        cursor: 'pointer'
                    }}
                >
                    Reset
                </button>
            )}
            {onImport && (
                <button
                    onClick={onImport}
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        fontWeight: 500,
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Import Part Data
                </button>
            )}
            <button
                onClick={onExport}
                style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                {config.export}
            </button>
            <button
                onClick={onContinue}
                style={{
                    background: '#10b981',
                    color: 'white',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                {config.continue}
            </button>
        </div>
    );
};

export default PrimaryActions;
