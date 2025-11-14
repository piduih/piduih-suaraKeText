import React from 'react';
import { MicrophoneIcon, StopIcon, SpinnerIcon } from './icons';

interface ControlButtonProps {
  isConnecting: boolean;
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  isConnecting,
  isListening,
  onStart,
  onStop,
}) => {
  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  const isDisabled = isConnecting;
  
  const getButtonContent = () => {
    if (isConnecting) {
      return (
        <>
          <SpinnerIcon />
          Menyambung...
        </>
      );
    }
    if (isListening) {
      return (
        <>
          <StopIcon />
          Hentikan Rakaman
        </>
      );
    }
    return (
      <>
        <MicrophoneIcon />
        Mula Rakam
      </>
    );
  };

  const baseClasses = "flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 w-72";
  const disabledClasses = "bg-slate-300 text-slate-500 cursor-not-allowed";
  const activeClasses = isListening 
    ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300" 
    : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300";

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`${baseClasses} ${isDisabled ? disabledClasses : activeClasses}`}
    >
      {getButtonContent()}
    </button>
  );
};