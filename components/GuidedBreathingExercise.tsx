import React, { useState, useEffect } from 'react';

interface GuidedBreathingExerciseProps {
  onClose: () => void;
}

const breathingCycle = [
  { instruction: 'Breathe In...', duration: 4000, scale: 'scale-125' },
  { instruction: 'Hold', duration: 4000, scale: 'scale-125' },
  { instruction: 'Breathe Out...', duration: 4000, scale: 'scale-50' },
  { instruction: 'Hold', duration: 4000, scale: 'scale-50' },
];

const TOTAL_DURATION = 120000; // 2 minutes

const GuidedBreathingExercise: React.FC<GuidedBreathingExerciseProps> = ({ onClose }) => {
  const [step, setStep] = useState(-1); // Start at -1 for "Get Ready"

  useEffect(() => {
    const startTime = Date.now();
    
    const initialTimer = setTimeout(() => {
      setStep(0); // Start the first cycle
    }, 2000); // Initial "Get Ready" pause

    const cycleInterval = setInterval(() => {
        setStep(prevStep => (prevStep + 1) % breathingCycle.length);
    }, 4000);
    
    const mainTimer = setTimeout(() => {
      onClose();
    }, TOTAL_DURATION + 2000); // Add initial pause to total duration

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
      clearTimeout(mainTimer);
    };
  }, [onClose]);

  const currentPhase = step === -1 
    ? { instruction: 'Get Ready...', scale: 'scale-50' } 
    : breathingCycle[step];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-lg animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breathing-instruction"
    >
      <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full text-white/70 hover:bg-white/10"
          aria-label="Close breathing exercise"
      >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
      </button>

      <div className="relative flex items-center justify-center w-64 h-64">
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        <div
          className={`absolute inset-0 bg-white/20 rounded-full transition-transform duration-[4000ms] ease-in-out ${currentPhase.scale}`}
          style={{ transformOrigin: 'center' }}
        />
        <div
          className="w-1/2 h-1/2 bg-white/80 rounded-full"
        />
      </div>

      <p id="breathing-instruction" className="text-white text-3xl font-medium mt-12 tracking-wider">
        {currentPhase.instruction}
      </p>

    </div>
  );
};

export default GuidedBreathingExercise;