import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
      <strong className="font-bold">Ralat: </strong>
      {/* Use pre-line to respect newline characters in the error string */}
      <span className="block sm:inline" style={{ whiteSpace: 'pre-line' }}>{error}</span>
    </div>
  );
};