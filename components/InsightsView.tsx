import React, { useState, useEffect } from 'react';
import { MoodEntry, Mood } from '../types';
import { generateInsights, PeriodInsight } from '../utils/insightsGenerator';
import { getMoodDetails } from '../utils/moodUtils';

const InsightCard: React.FC<{ title: string; insight: PeriodInsight }> = ({ title, insight }) => {
    if (insight.totalEntries === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
                <p className="text-gray-500">Not enough data yet. Keep logging your mood to see your insights here!</p>
            </div>
        );
    }
    
    const mostFrequent = insight.mostFrequentMood ? getMoodDetails(insight.mostFrequentMood) : null;
    
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>

            {mostFrequent && (
                <div className="mb-6 p-4 rounded-lg bg-gray-100/60 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Your most frequent feeling was:</p>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">{mostFrequent.emoji}</span>
                        <span className="text-xl font-bold text-gray-800">{mostFrequent.mood}</span>
                    </div>
                </div>
            )}
            
            <div>
                <h4 className="font-semibold text-gray-600 mb-3">Your Mood Log</h4>
                <ul className="space-y-3">
                    {insight.moodCounts.map(({ mood, count }) => {
                        const details = getMoodDetails(mood);
                        const percentage = (count / insight.totalEntries) * 100;

                        return (
                            <li key={mood} className="space-y-1">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{details?.emoji}</span>
                                        <span>{mood}</span>
                                    </div>
                                    <span>{count} {count > 1 ? 'times' : 'time'}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="h-2.5 rounded-full" 
                                        style={{ width: `${percentage}%`, backgroundColor: details?.tileHexColor || '#ccc' }}
                                        role="progressbar"
                                        aria-valuenow={count}
                                        aria-valuemin={0}
                                        aria-valuemax={insight.totalEntries}
                                        aria-label={`${mood} logged ${count} times`}
                                    ></div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

        </div>
    );
};


const InsightsView: React.FC<{ moodHistory: MoodEntry[] }> = ({ moodHistory }) => {
    const insights = generateInsights(moodHistory);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Your Mood Insights</h2>
                    <p className="text-gray-600 mt-1">A private look at your recent emotional patterns. All data is only stored on your device.</p>
                </header>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <InsightCard title="Last 7 Days" insight={insights.last7Days} />
                    <InsightCard title="Last 30 Days" insight={insights.last30Days} />
                </div>
            </div>
        </div>
    );
};

export default InsightsView;
