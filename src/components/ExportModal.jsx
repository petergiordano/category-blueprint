import React, { useState } from 'react';

const ExportModal = ({ isOpen, onClose, title, content, appState, filename = 'category-blueprint-export', partData = null }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleDownloadJSON = () => {
        const jsonData = JSON.stringify(partData || appState, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-bold scale-green-text">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl font-light">×</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md font-mono">{content}</pre>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={handleDownloadJSON}
                        className="border border-gray-300 text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Download JSON
                    </button>
                    <button
                        onClick={handleCopy}
                        className="scale-green-bg text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90"
                    >
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
