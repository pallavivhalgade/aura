import { Mood, MoodEntry } from '../types';

export interface MoodCount {
  mood: Mood;
  count: number;
}

export interface PeriodInsight {
  totalEntries: number;
  mostFrequentMood: Mood | null;
  moodCounts: MoodCount[];
}

export interface MoodInsights {
  last7Days: PeriodInsight;
  last30Days: PeriodInsight;
}

const getInsightForPeriod = (moodHistory: MoodEntry[], days: number): PeriodInsight => {
    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    const relevantEntries = moodHistory.filter(entry => entry.timestamp >= cutoffDate.getTime());

    if (relevantEntries.length === 0) {
        return { totalEntries: 0, mostFrequentMood: null, moodCounts: [] };
    }

    const counts: { [key in Mood]?: number } = {};
    for (const entry of relevantEntries) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    }

    const moodCounts: MoodCount[] = Object.entries(counts)
      .map(([mood, count]) => ({ mood: mood as Mood, count: count! }))
      .sort((a, b) => b.count - a.count);

    const mostFrequentMood = moodCounts.length > 0 ? moodCounts[0].mood : null;

    return {
        totalEntries: relevantEntries.length,
        mostFrequentMood,
        moodCounts
    };
};


export const generateInsights = (moodHistory: MoodEntry[]): MoodInsights => {
    return {
        last7Days: getInsightForPeriod(moodHistory, 7),
        last30Days: getInsightForPeriod(moodHistory, 30),
    };
};
