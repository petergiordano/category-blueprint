import React from 'react';

const SessionImportModal = ({ isOpen, fileName, onCancel, onConfirm, isProcessing }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">Overwrite Current Blueprint?</h2>
        <p className="mt-3 text-sm text-gray-700">Importing this file will overwrite all current progress in your session. This action cannot be undone directly, though a temporary backup will be made.</p>
        {fileName && (
          <p className="mt-3 text-xs text-gray-500">Selected file: <span className="font-medium">{fileName}</span></p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white transition ${isProcessing ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isProcessing ? 'Importing...' : 'Confirm & Import'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionImportModal;
