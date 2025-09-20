import React, { useState, useEffect } from 'react';
import { getMeditationScript } from './services/geminiService';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface GuidedMeditationProps {
  topic: string;
  onClose: () => void;
}

const GuidedMeditation: React.FC<GuidedMeditationProps> = ({ topic, onClose }) => {
  const [script, setScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    speak,
    cancel,
    pause,
    resume,
    isPlaying,
    isPaused,
  } = useSpeechSynthesis({ onEnd: onClose });

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const generatedScript = await getMeditationScript(topic);
        setScript(generatedScript);
        speak(generatedScript);
      } catch (e) {
        setError('Could not prepare the meditation. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScript();

    return () => {
      cancel();
    };
  }, [topic, speak, cancel]);

  const handleStop = () => {
    cancel();
    onClose();
  };
  
  const handleTogglePlay = () => {
    if (isPlaying && !isPaused) {
      pause();
    } else {
      resume();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/80 mx-auto"></div>
            <p className="text-white/80 text-lg mt-4">Preparing your meditation...</p>
        </div>
      )
    }
    if (error) {
       return (
        <div className="text-center p-4">
            <p className="text-white/90 text-lg mb-6">{error}</p>
             <button
                onClick={onClose}
                className="px-6 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
                Close
            </button>
        </div>
      )
    }
    return (
       <>
         <div className="relative flex items-center justify-center w-64 h-64 mb-10">
            <div className={`absolute inset-0 bg-white/10 rounded-full ${isPlaying && !isPaused ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''}`} />
            <div className={`absolute inset-0 bg-white/20 rounded-full transition-transform duration-[4000ms] ease-in-out transform ${isPlaying && !isPaused ? 'scale-125' : 'scale-100'}`} style={{ animation: isPlaying && !isPaused ? 'pulse-scale 4s ease-in-out infinite' : 'none' }} />
            <div className="w-1/2 h-1/2 bg-white/80 rounded-full" />
            <style>{`
                @keyframes pulse-scale {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `}</style>
        </div>

        <p className="text-white text-xl font-medium tracking-wider mb-8 capitalize">
            Meditation for: {topic}
        </p>

        <div className="flex items-center space-x-6">
            <button 
                onClick={handleTogglePlay}
                className="w-16 h-16 flex items-center justify-center bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                aria-label={isPlaying && !isPaused ? 'Pause meditation' : 'Play meditation'}
            >
                {isPlaying && !isPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm6 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
            <button 
                onClick={handleStop}
                className="w-16 h-16 flex items-center justify-center bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                aria-label="Stop meditation"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 00-1 1v.01L7 10a1 1 0 001 1h4a1 1 0 100-2H8z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
       </>
    );
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-lg animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
        <button 
          onClick={handleStop} 
          className="absolute top-6 right-6 p-2 rounded-full text-white/70 hover:bg-white/10"
          aria-label="Close meditation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {renderContent()}
    </div>
  );
};

export default GuidedMeditation;
