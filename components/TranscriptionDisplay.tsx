import React from 'react';
import { TranscriptionEntry } from '../hooks/useLiveTranscription';

interface TranscriptionDisplayProps {
  history: TranscriptionEntry[];
  interim: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ history, interim }) => {
  const hasContent = history.length > 0 || interim;

  return (
    <div className="flex-grow w-full text-left p-4 overflow-y-auto text-lg md:text-xl leading-relaxed">
      {hasContent ? (
        <>
          {history.map((entry, index) => (
            <p key={index} className="mb-4">
              <span className="font-mono text-sm text-slate-400 align-middle mr-2 select-none">
                [{entry.timestamp}]
              </span>
              <span className="text-slate-800 align-middle">
                {entry.text}
              </span>
            </p>
          ))}
          {interim && <p className="text-slate-400">{interim}</p>}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-center">
            Klik "Mula Rakam" untuk memulakan transkripsi.
            </p>
        </div>
      )}
    </div>
  );
};