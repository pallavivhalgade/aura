import React from 'react';
import { MoodEntry, Mood } from '../types';
import { StreakData } from '../utils/streakStorage';
import { moodOptions } from '../utils/moodUtils';

// --- Helper Functions ---

// Maps a mood to a numerical value for charting (1-5 scale)
const moodToValue = (mood: Mood): number => {
    switch (mood) {
        case Mood.Happy: return 5;
        case Mood.Calm: return 4;
        case Mood.Anxious: return 3;
        case Mood.Stressed: return 2;
        case Mood.Sad: return 1;
        default: return 0;
    }
};

// --- Sub-components ---

const MoodChart: React.FC<{ data: MoodEntry[] }> = ({ data }) => {
    const chartHeight = 200;
    const chartWidth = 500; // Arbitrary width for aspect ratio
    const yPadding = 20;
    const xPadding = 10;
    
    // Y-axis labels with emojis
    const yAxisLabels = [
        { mood: Mood.Happy, emoji: '😊' },
        { mood: Mood.Calm, emoji: '😌' },
        { mood: Mood.Anxious, emoji: '😟' },
        { mood: Mood.Stressed, emoji: '😫' },
        { mood: Mood.Sad, emoji: '😢' },
    ];
    
    if (data.length < 2) {
        return (
            <div className="h-[240px] flex items-center justify-center text-center text-gray-500 bg-gray-50 rounded-lg">
                <p>Log your mood for at least two different days<br/>to see your journey visualized here.</p>
            </div>
        );
    }
    
    const firstTimestamp = data[0].timestamp;
    const lastTimestamp = data[data.length - 1].timestamp;
    const totalTimeSpan = lastTimestamp - firstTimestamp;

    // Convert data points to SVG coordinates
    const points = data.map(entry => {
        const x = totalTimeSpan > 0 
            ? ((entry.timestamp - firstTimestamp) / totalTimeSpan) * (chartWidth - xPadding * 2) + xPadding 
            : chartWidth / 2; // Center if only one day has entries
        const y = chartHeight - ((moodToValue(entry.mood) - 1) / 4) * (chartHeight - yPadding * 2) - yPadding;
        return { x, y };
    });

    // Create the SVG path string for the line
    const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

    return (
        <div className="relative h-[240px]">
             <svg viewBox={`0 -10 ${chartWidth} ${chartHeight + 20}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="A line chart showing mood trends over the last 30 days.">
                {/* Y-axis labels */}
                <g className="text-lg" aria-hidden="true">
                    {yAxisLabels.map(({ mood, emoji }) => {
                        const y = chartHeight - ((moodToValue(mood) - 1) / 4) * (chartHeight - yPadding * 2) - yPadding;
                        return (
                            <text key={mood} x="0" y={y + 5} className="text-xl" fill="#6b7280">{emoji}</text>
                        );
                    })}
                </g>

                {/* Main chart area starting after labels */}
                <svg x="30" y="0" width={chartWidth - 30}>
                    {/* Dotted grid lines */}
                    {yAxisLabels.map(({ mood }) => {
                        const y = chartHeight - ((moodToValue(mood) - 1) / 4) * (chartHeight - yPadding * 2) - yPadding;
                        return (
                            <line key={`line-${mood}`} x1={xPadding} y1={y} x2={chartWidth - xPadding} y2={y} stroke="#e5e7eb" strokeDasharray="3,3" />
                        );
                    })}
                    
                    {/* Line Path */}
                    <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Data Points */}
                    {points.map((p, i) => (
                         <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--primary)" stroke="white" strokeWidth="2" />
                    ))}
                </svg>
            </svg>
        </div>
    );
};


const ProgressView: React.FC<{ moodHistory: MoodEntry[], streakData: StreakData }> = ({ moodHistory, streakData }) => {
    
    // Filter and prepare data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const chartData = moodHistory
        .filter(entry => entry.timestamp >= thirtyDaysAgo.getTime())
        .sort((a, b) => a.timestamp - b.timestamp);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Your Progress</h2>
                    <p className="text-gray-600 mt-1">A private look at your wellness journey.</p>
                </header>
                
                <div className="p-4 bg-indigo-100/50 rounded-lg mb-8 border border-indigo-200/50" role="note">
                    <h4 className="text-xs font-semibold text-indigo-700 mb-1 text-center uppercase tracking-wider">A Gentle Reminder</h4>
                    <p className="text-sm text-indigo-800 text-center italic">"Healing is not linear."</p>
                </div>
                
                <div className="space-y-6">

                    {/* Streak Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Check-in Streak</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-5xl" aria-hidden="true">🔥</div>
                            <div>
                                <p className="text-3xl font-bold text-[var(--primary)]">{streakData.streak} {streakData.streak === 1 ? 'day' : 'days'}</p>
                                <p className="text-gray-600">You're building a great habit of checking in with yourself. Keep it up!</p>
                            </div>
                        </div>
                    </div>

                    {/* Mood Chart Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Mood Journey</h3>
                        <p className="text-sm text-gray-500 mb-4">Last 30 Days</p>
                        <MoodChart data={chartData} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProgressView;
