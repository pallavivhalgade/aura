import React, { useEffect, useRef, useState } from 'react';

interface RolePlayScenarioModalProps {
  onClose: () => void;
  onSelectScenario: (scenario: string) => void;
}

const scenarios = [
  { 
    name: 'Job Interview',
    icon: '💼',
    description: 'Practice answering common interview questions and get feedback on your performance.'
  },
  {
    name: 'Difficult Conversation with a Friend',
    icon: '👥',
    description: 'Rehearse a sensitive talk with a friend to express your feelings clearly and kindly.'
  },
  {
    name: 'Difficult Conversation with Parents',
    icon: '👨‍👩‍👧',
    description: 'Prepare for a challenging conversation with your parents in a safe, supportive space.'
  },
  {
    name: 'Presenting to a Group',
    icon: '📊',
    description: 'Build confidence by practicing your presentation for school or college.'
  }
];

const RolePlayScenarioModal: React.FC<RolePlayScenarioModalProps> = ({ onClose, onSelectScenario }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [customScenario, setCustomScenario] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    setTimeout(() => closeButtonRef.current?.focus(), 100);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customScenario.trim()) {
      onSelectScenario(customScenario.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="roleplay-title"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg m-4 transform animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="roleplay-title" className="text-xl font-bold text-gray-800">Choose a Scenario</h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="Close scenario selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6 text-sm">Select a situation you'd like to practice. Aura will act as the other person to help you prepare.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => onSelectScenario(scenario.name)}
              className="text-left p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[var(--primary)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl bg-white p-2 rounded-md shadow-sm" aria-hidden="true">{scenario.icon}</div>
                <div>
                    <h3 className="font-semibold text-gray-800">{scenario.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm font-medium text-gray-500">Or create your own</span>
          </div>
        </div>

        <form onSubmit={handleCustomSubmit}>
          <label htmlFor="custom-scenario" className="sr-only">Custom scenario description</label>
          <textarea
            id="custom-scenario"
            rows={2}
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition duration-200 resize-none"
            placeholder="e.g., Asking my boss for a raise..."
          />
          <button
            type="submit"
            disabled={!customScenario.trim()}
            className="mt-3 w-full bg-[var(--primary)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start Custom Practice
          </button>
        </form>

      </div>
    </div>
  );
};

export default RolePlayScenarioModal;