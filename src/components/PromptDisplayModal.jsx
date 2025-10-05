import React, { useState } from 'react';

const PromptDisplayModal = ({ isOpen, onClose, promptText, title = "Deep Research Prompt" }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(promptText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = promptText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        try {
            const blob = new Blob([promptText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download file: ', err);
            alert('Failed to download file. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold scale-green-text">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-800 text-3xl font-light leading-none"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md font-mono leading-relaxed">
                        {promptText}
                    </pre>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={handleDownload}
                        className="border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Download as .txt
                    </button>
                    <button
                        onClick={handleCopy}
                        className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptDisplayModal;
