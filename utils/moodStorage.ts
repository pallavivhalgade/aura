import { Mood, MoodEntry } from '../types';

const MOOD_STORAGE_KEY = 'aura-mood-history';

export const saveMoodHistory = (history: MoodEntry[]): void => {
  try {
    const serializedHistory = JSON.stringify(history);
    localStorage.setItem(MOOD_STORAGE_KEY, serializedHistory);
  } catch (error) {
    console.error("Could not save mood history to local storage", error);
  }
};

export const loadMoodHistory = (): MoodEntry[] => {
  try {
    const serializedHistory = localStorage.getItem(MOOD_STORAGE_KEY);
    if (serializedHistory === null) {
      return [];
    }
    const history: (MoodEntry | { mood: Mood; date: string })[] = JSON.parse(serializedHistory);
    
    // Data migration for old entries without a timestamp
    return history.map((entry, index) => {
      if ('timestamp' in entry && typeof entry.timestamp === 'number') {
        return entry as MoodEntry;
      }
      // For old data, create a synthetic timestamp.
      // Set to noon to avoid timezone issues, add index to make it unique.
      const date = new Date(entry.date);
      date.setHours(12, 0, 0, index); 
      return { ...entry, mood: entry.mood, timestamp: date.getTime() };
    });

  } catch (error) {
    console.error("Could not load mood history from local storage", error);
    return [];
  }
};
