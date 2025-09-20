import { toDateKey } from './dateUtils';

export interface StreakData {
  streak: number;
  lastLogDate: string; // YYYY-MM-DD
}

const STREAK_KEY = 'aura-streak-data';

export const loadStreakData = (): StreakData => {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { streak: 0, lastLogDate: '' };
  } catch (error) {
    console.error("Could not load streak data", error);
    return { streak: 0, lastLogDate: '' };
  }
};

const saveStreakData = (data: StreakData) => {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save streak data", error);
  }
};

export const updateStreak = (): StreakData => {
  const today = new Date();
  const todayKey = toDateKey(today);

  const currentData = loadStreakData();

  if (currentData.lastLogDate === todayKey) {
    // Already logged today, streak does not change.
    return currentData;
  }

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  let newStreak: number;

  if (currentData.lastLogDate === yesterdayKey) {
    // It's a consecutive day.
    newStreak = currentData.streak + 1;
  } else {
    // The streak is broken or it's the very first log.
    newStreak = 1;
  }

  const newData: StreakData = {
    streak: newStreak,
    lastLogDate: todayKey,
  };

  saveStreakData(newData);
  return newData;
};