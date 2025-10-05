import React from 'react';

const PromptDisplayModal = (props) => {
    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[95vh]">
                <div className="p-6">
                    <h2 className="text-2xl font-bold">Prompt Display Modal</h2>
                    <p>Component content will be migrated here.</p>
                </div>
            </div>
        </div>
    );
};

export default PromptDisplayModal;
