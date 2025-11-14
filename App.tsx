import React, { useState } from 'react';
import { useLiveTranscription } from './hooks/useLiveTranscription';
import { Header } from './components/Header';
import { ControlButton } from './components/ControlButton';
import { StatusIndicator } from './components/StatusIndicator';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Roadmap } from './components/Roadmap';
import { SaveIcon, RoadmapIcon, CopyIcon, TxtFileIcon } from './components/icons';
import { TranscriptionEntry } from './hooks/useLiveTranscription';


const App: React.FC = () => {
  const [isRoadmapVisible, setIsRoadmapVisible] = useState(false);
  const {
    isListening,
    isConnecting,
    interimTranscript,
    transcriptionHistory,
    error,
    statusMessage,
    volume,
    startListening,
    stopListening,
  } = useLiveTranscription();
  
  const [copyButtonText, setCopyButtonText] = useState('Salin');

  const formatHistoryToString = (format: 'txt' | 'md' | 'clipboard'): string => {
    if (format === 'md') {
      return transcriptionHistory
        .map(entry => `**[${entry.timestamp}]**\n\n${entry.text}`)
        .join('\n\n---\n\n');
    }
    // for txt and clipboard
    return transcriptionHistory
        .map(entry => `[${entry.timestamp}] ${entry.text}`)
        .join('\n\n');
  };

  const handleSaveFile = (format: 'md' | 'txt') => {
    if (transcriptionHistory.length === 0) return;

    const content = formatHistoryToString(format);
    const mimeType = format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
    const filename = `transkripsi_${new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '')}.${format}`;
    
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    localStorage.removeItem('transcriptionAutoSave');
  };
  
  const handleCopy = () => {
    if (transcriptionHistory.length === 0) return;
    
    const textToCopy = formatHistoryToString('clipboard');
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopyButtonText('Disalin!');
        setTimeout(() => setCopyButtonText('Salin'), 2000);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        setCopyButtonText('Gagal');
        setTimeout(() => setCopyButtonText('Salin'), 2000);
    });
  };

  return (
    <>
      <div className="bg-slate-100 min-h-screen text-slate-800 flex flex-col items-center justify-center font-sans p-4">
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
          <Header />
          <main className="flex-grow flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden mt-6">
            <div className="p-6 flex-grow flex flex-col min-h-[300px] md:min-h-[400px]">
              <StatusIndicator isListening={isListening} statusMessage={statusMessage} volume={volume} />
              <ErrorDisplay error={error} />
              <TranscriptionDisplay
                history={transcriptionHistory}
                interim={interimTranscript}
              />
            </div>
            <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-center sticky bottom-0">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ControlButton
                  isConnecting={isConnecting}
                  isListening={isListening}
                  onStart={startListening}
                  onStop={stopListening}
                />
                <div className="flex items-center gap-2">
                   <button
                    onClick={handleCopy}
                    disabled={transcriptionHistory.length === 0}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-md font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                    aria-label="Salin ke papan keratan"
                  >
                    <CopyIcon />
                    <span className="hidden sm:inline">{copyButtonText}</span>
                  </button>
                  <button
                    onClick={() => handleSaveFile('md')}
                    disabled={transcriptionHistory.length === 0}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-md font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                    aria-label="Simpan sebagai .md"
                  >
                    <SaveIcon />
                    <span className="hidden sm:inline">.md</span>
                  </button>
                  <button
                    onClick={() => handleSaveFile('txt')}
                    disabled={transcriptionHistory.length === 0}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-md font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                    aria-label="Simpan sebagai .txt"
                  >
                    <TxtFileIcon />
                    <span className="hidden sm:inline">.txt</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
          <footer className="text-center text-slate-500 text-sm mt-6 pb-4">
            <p>Dikuasakan oleh Google Gemini API</p>
            <button
              onClick={() => setIsRoadmapVisible(true)}
              className="mt-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 inline-flex items-center gap-1.5"
            >
              <RoadmapIcon />
              Lihat Pelan Pembangunan Aplikasi
            </button>
          </footer>
        </div>
      </div>
      <Roadmap isVisible={isRoadmapVisible} onClose={() => setIsRoadmapVisible(false)} />
    </>
  );
};

export default App;