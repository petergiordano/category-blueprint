import React, { useEffect } from 'react';

const SessionNotice = ({ notice, onDismiss }) => {
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  const baseClass = notice.type === 'error'
    ? 'bg-red-100 border border-red-400 text-red-800'
    : 'bg-green-100 border border-green-400 text-green-800';

  return (
    <div className={`fixed top-20 right-4 max-w-sm px-4 py-3 rounded shadow-md ${baseClass}`}>
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-medium leading-5">{notice.message}</span>
        <button
          type="button"
          className="text-lg leading-none"
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SessionNotice;
