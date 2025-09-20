import React from 'react';
import { Theme } from '../utils/themes';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface SettingsViewProps {
  themes: Theme[];
  activeThemeName: string;
  onSelectTheme: (themeName: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ themes, activeThemeName, onSelectTheme }) => {
  const { hasRecognitionSupport } = useSpeechRecognition();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">App Settings</h2>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Appearance</h3>
                <p className="text-sm text-gray-600 mb-4">Choose a theme to personalize your experience.</p>
                <div className="space-y-3">
                    {themes.map((theme) => {
                        const isActive = theme.name === activeThemeName;
                        return (
                            <button
                                key={theme.name}
                                onClick={() => onSelectTheme(theme.name)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${isActive ? 'border-[var(--primary)] bg-indigo-50' : 'border-gray-200 hover:border-gray-400 bg-white'}`}
                                aria-pressed={isActive}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br" style={{
                                        background: `linear-gradient(to bottom right, ${theme.colors['--gradient-start']}, ${theme.colors['--gradient-via']}, ${theme.colors['--gradient-end']})`
                                    }}/>
                                    <span className={`font-medium ${isActive ? 'text-[var(--primary)]' : 'text-gray-700'}`}>
                                        {theme.displayName}
                                    </span>
                                </div>
                                {isActive && (
                                     <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Accessibility</h3>
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium text-gray-800">Voice Input</p>
                        <p className="text-sm text-gray-600">Use your microphone to talk to Aura.</p>
                     </div>
                     <span className={`px-3 py-1 text-xs font-bold rounded-full ${hasRecognitionSupport ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {hasRecognitionSupport ? 'Supported' : 'Not Supported'}
                     </span>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsView;
