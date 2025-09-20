import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechSynthesisOptions {
  onEnd?: () => void;
}

export const useSpeechSynthesis = (options: SpeechSynthesisOptions = {}) => {
  const { onEnd } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    if (onEnd) {
      onEnd();
    }
  }, [onEnd]);
  
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    const u = new SpeechSynthesisUtterance();
    u.onend = handleEnd;
    u.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      handleEnd(); // Also treat error as an end
    };
    
    // Attempt to find a soothing, high-quality voice
    const voices = synth.getVoices();
    let selectedVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || 
                        voices.find(v => v.name.includes('Sonia') || v.name.includes('Samantha') || v.name.includes('Aura')) ||
                        voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-US'));

    u.voice = selectedVoice || voices[0] || null;
    u.pitch = 1;
    u.rate = 0.9;
    
    utteranceRef.current = u;
    
    // Voices might load asynchronously
    synth.onvoiceschanged = () => {
        const updatedVoices = synth.getVoices();
        if(utteranceRef.current && !utteranceRef.current.voice) {
             let updatedSelectedVoice = updatedVoices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || 
                        updatedVoices.find(v => v.name.includes('Sonia') || v.name.includes('Samantha') || v.name.includes('Aura')) ||
                        updatedVoices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-US'));
             utteranceRef.current.voice = updatedSelectedVoice || updatedVoices[0] || null;
        }
    };


    return () => {
      synth.cancel();
    };
  }, [handleEnd]);

  const speak = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    if (!synth || !utteranceRef.current) return;

    // Ensure any previous speech is stopped before starting new
    synth.cancel();

    utteranceRef.current.text = text;
    synth.speak(utteranceRef.current);
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const cancel = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synth.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synth.resume();
    setIsPaused(false);
  }, []);

  return {
    speak,
    cancel,
    pause,
    resume,
    isPlaying,
    isPaused,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
};
