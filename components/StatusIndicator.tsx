import React from 'react';

const AudioVisualizer: React.FC<{ volume: number }> = ({ volume }) => {
  const barHeight = Math.max(2, Math.min(1, volume || 0) * 20);
  return (
    <div className="flex items-end justify-center w-4 h-6">
      <div
        className="w-2 bg-red-500 rounded-full"
        style={{ height: `${barHeight}px`, transition: 'height 75ms ease-out' }}
      ></div>
    </div>
  );
};

interface StatusIndicatorProps {
  isListening: boolean;
  statusMessage: string | null;
  volume: number;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isListening, statusMessage, volume }) => {
  const messageColor = statusMessage?.includes('dipulihkan') ? 'text-blue-600' : 'text-green-600';

  return (
    <div className="h-8 mb-4 flex items-center justify-center gap-4 text-center">
      {isListening && (
        <div className="flex items-center justify-center gap-2 text-red-500">
          <AudioVisualizer volume={volume} />
          <span>Merakam...</span>
        </div>
      )}
      {statusMessage && (
        <div key={statusMessage} className={`transition-opacity duration-500 ease-in-out font-medium ${messageColor}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};