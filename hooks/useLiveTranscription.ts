import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from "@google/genai";
import { createPcmBlob } from '../utils/audioUtils';

interface CustomErrorEvent extends Event {
  message?: string;
}

export interface TranscriptionEntry {
  timestamp: string;
  text: string;
}

export const useLiveTranscription = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('transcriptionAutoSave');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0 && typeof parsedHistory[0] === 'object' && 'text' in parsedHistory[0]) {
          setTranscriptionHistory(parsedHistory);
          setStatusMessage('Sesi sebelum ini telah dipulihkan.');
          setTimeout(() => setStatusMessage(null), 3500);
        }
      }
    } catch (e) {
      console.error("Gagal memuat dari localStorage:", e);
      localStorage.removeItem('transcriptionAutoSave');
    }
  }, []);

  useEffect(() => {
    if (!isListening) {
      return;
    }

    const intervalId = setInterval(() => {
      setTranscriptionHistory(currentHistory => {
        if (currentHistory.length > 0) {
          console.log("Menyimpan transkripsi secara automatik...");
          localStorage.setItem('transcriptionAutoSave', JSON.stringify(currentHistory));
          setStatusMessage('Disimpan secara automatik.');
          setTimeout(() => setStatusMessage(null), 2000);
        }
        return currentHistory;
      });
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isListening]);

  const processAudio = useCallback((event: AudioProcessingEvent) => {
    if (!sessionPromiseRef.current) return;

    const inputData = event.inputBuffer.getChannelData(0);
    const pcmBlob = createPcmBlob(inputData);
    
    sessionPromiseRef.current.then((session) => {
      session.sendRealtimeInput({ media: pcmBlob });
    });
  }, []);
  
  const stopAudioProcessing = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    setVolume(0);

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.onaudioprocess = null;
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (!sessionPromiseRef.current) return;
    
    setIsConnecting(false);
    setIsListening(false);
    
    try {
        const session = await sessionPromiseRef.current;
        session.close();
    } catch (e) {
        console.error("Error closing session:", e);
    } finally {
        sessionPromiseRef.current = null;
        stopAudioProcessing();
    }
  }, [stopAudioProcessing]);

  const visualizeAudio = useCallback(() => {
    if (!analyserRef.current) {
      return;
    }
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    setVolume(average / 128); 
    animationFrameIdRef.current = requestAnimationFrame(visualizeAudio);
  }, []);

  const startListening = useCallback(async () => {
    if (isListening || isConnecting) return;
    
    if (!navigator.onLine) {
      setError("Sambungan internet tidak dijumpai. Sila semak rangkaian anda dan cuba lagi.");
      setIsConnecting(false);
      return;
    }

    localStorage.removeItem('transcriptionAutoSave');
    setError(null);
    setInterimTranscript('');
    setTranscriptionHistory([]);
    setIsConnecting(true);

    try {
      if (!process.env.API_KEY) {
        throw new Error("Kunci API tidak dijumpai. Sila pastikan ia ditetapkan dalam pembolehubah persekitaran anda.");
      }
      
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = context;
      
      mediaStreamSourceRef.current = context.createMediaStreamSource(localStreamRef.current);
      scriptProcessorRef.current = context.createScriptProcessor(4096, 1, 1);
      analyserRef.current = context.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Session opened.');
            mediaStreamSourceRef.current!.connect(analyserRef.current!);
            analyserRef.current!.connect(scriptProcessorRef.current!);
            scriptProcessorRef.current!.connect(context.destination);
            scriptProcessorRef.current!.onaudioprocess = processAudio;
            
            setIsConnecting(false);
            setIsListening(true);
            animationFrameIdRef.current = requestAnimationFrame(visualizeAudio);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setInterimTranscript(message.serverContent.inputTranscription.text);
            }
            if (message.serverContent?.turnComplete) {
              setInterimTranscript(currentInterim => {
                const finalTranscript = currentInterim.trim();
                if (finalTranscript) {
                  const newEntry: TranscriptionEntry = {
                    timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit'}),
                    text: finalTranscript,
                  };
                  setTranscriptionHistory(prev => [...prev, newEntry]);
                }
                return '';
              });
            }
          },
          onerror: (e: CustomErrorEvent) => {
            console.error('Session error:', e);
            let detailedError = `Berlaku ralat sesi: ${e.message || 'Ralat tidak diketahui'}. Sila cuba lagi.`;

            const errorString = (e.message || String(e)).toLowerCase();

            if (errorString.includes('network error')) {
              detailedError = `Gagal menyambung ke perkhidmatan Gemini kerana ralat rangkaian.`;
              if (window.location.protocol !== 'https:') {
                detailedError += `\n\nAplikasi ini perlu dijalankan pada sambungan selamat (HTTPS) untuk berfungsi dengan betul, terutamanya untuk akses mikrofon.\n\nJika anda seorang pembangun, sila pastikan pelayan pembangunan anda disajikan melalui HTTPS.`;
              } else {
                detailedError += `\n\nSila semak sambungan internet anda. Tembok api (firewall) atau proksi mungkin menyekat sambungan.`;
              }
            } else if (errorString.includes('api key') || errorString.includes('403')) {
                detailedError = `Kunci API tidak sah atau tidak mempunyai kebenaran yang diperlukan. Sila semak Kunci API anda.`;
            }

            setError(detailedError);
            stopListening();
          },
          onclose: () => {
            console.log('Session closed.');
            if (isListening) {
                stopListening();
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
        },
      });

    } catch (err) {
      console.error("Failed to start listening:", err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal memulakan sesi.';
      if (errorMessage.includes('Permission denied')) {
        setError('Akses mikrofon ditolak. Sila benarkan akses mikrofon dalam tetapan pelayar web anda.');
      } else {
        setError(errorMessage);
      }
      setIsConnecting(false);
      stopAudioProcessing();
    }
  }, [isConnecting, isListening, processAudio, stopAudioProcessing, stopListening, visualizeAudio]);
  
  useEffect(() => {
    return () => {
        stopListening();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return {
    isListening,
    isConnecting,
    interimTranscript,
    transcriptionHistory,
    error,
    statusMessage,
    volume,
    startListening,
    stopListening,
  };
};
