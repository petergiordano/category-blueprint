import React, { useState, useEffect, useRef } from 'react';

const SessionMenu = ({ onImport, onExport, disabled }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (disabled) return;
    setOpen(prev => !prev);
  };

  const handleImport = () => {
    setOpen(false);
    onImport?.();
  };

  const handleExport = () => {
    setOpen(false);
    onExport?.();
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm transition ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-100'}`}
      >
        Session
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 z-[70] mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleImport}
            >
              Import Blueprint from File...
            </button>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleExport}
            >
              Export Blueprint to File...
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionMenu;
