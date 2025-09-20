import React, { useState } from 'react';
import { Mood } from '../types';
import { moodOptions, getMoodDetails } from '../utils/moodUtils';

interface MoodLoggerProps {
  onLogMood: (mood: Mood) => void;
  onGoToChat: () => void;
  onStartBreathing: () => void;
  onStartMusicRequest: (mood: Mood) => void;
  onShareMoodWithAura: (mood: Mood) => void;
}

const MoodLogger: React.FC<MoodLoggerProps> = ({ onLogMood, onGoToChat, onStartBreathing, onStartMusicRequest, onShareMoodWithAura }) => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

    const handleMoodSelect = (mood: Mood) => {
        onLogMood(mood); // Log it immediately
        setSelectedMood(mood);
    };

    const getQuickActions = (mood: Mood) => {
        switch (mood) {
            case Mood.Stressed:
            case Mood.Anxious:
            case Mood.Sad:
                return [
                    { label: 'Guided Breathing', icon: '😮‍💨', action: onStartBreathing },
                    { label: 'Listen to Music', icon: '🎵', action: () => onStartMusicRequest(mood) },
                    { label: 'Just Talk with Aura', icon: '💬', action: () => onShareMoodWithAura(mood) }
                ];
            case Mood.Happy:
            case Mood.Calm:
                return [
                    { label: 'Listen to Music', icon: '🎶', action: () => onStartMusicRequest(mood) },
                    { label: 'Share with Aura', icon: '💬', action: () => onShareMoodWithAura(mood) }
                ];
            default:
                return [{ label: 'Continue to Chat', icon: '💬', action: onGoToChat }];
        }
    };

    if (selectedMood) {
        const actions = getQuickActions(selectedMood);
        const moodDetails = getMoodDetails(selectedMood);
        return (
            <div className="max-w-md mx-auto w-full flex flex-col items-center text-center p-4 animate-fade-in">
                <div className="text-6xl mb-4" aria-hidden="true">{moodDetails?.emoji}</div>
                <h2 className="text-2xl font-bold text-gray-800">You're feeling {selectedMood}.</h2>
                <p className="text-gray-600 mt-2 mb-8">
                    That's noted. Here are a few things that might help. What would you like to do next?
                </p>
                <div className="w-full space-y-3">
                    {actions.map(({label, icon, action}) => (
                         <button 
                            key={label} 
                            onClick={action} 
                            className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[var(--primary)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            <span className="text-2xl" aria-hidden="true">{icon}</span>
                            <span className="font-semibold text-gray-700">{label}</span>
                         </button>
                    ))}
                </div>
                 <button 
                    onClick={onGoToChat} 
                    className="mt-6 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-all duration-200"
                >
                    Maybe later
                </button>
            </div>
        );
    }
  
    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up duration-300 ease-in-out">
            <p className="text-center text-gray-600 font-medium mb-4">How are you feeling right now?</p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
                {moodOptions.map(({ mood, emoji }) => (
                    <button
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        className="flex flex-col items-center justify-center p-3 w-20 h-20 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-[var(--primary)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all duration-200 transform hover:-translate-y-1 active:scale-95"
                        aria-label={`Log mood as ${mood}`}
                    >
                        <span className="text-3xl">{emoji}</span>
                        <span className="text-xs font-semibold text-gray-700 mt-1">{mood}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={onGoToChat}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-all duration-200 transform hover:-translate-y-0.5"
                aria-label="Cancel mood logging and return to chat"
            >
                Cancel
            </button>
        </div>
    );
};

export default MoodLogger;