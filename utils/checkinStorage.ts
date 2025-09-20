import { MoodEntry } from '../types';

const CHECKIN_STORAGE_KEY = 'aura-last-checkin-time';

export const updateLastCheckinTime = (): void => {
  try {
    localStorage.setItem(CHECKIN_STORAGE_KEY, new Date().toISOString());
  } catch (error) {
    console.error("Could not update last check-in time", error);
  }
};

export const getLastCheckinTime = (): Date | null => {
  try {
    const storedTime = localStorage.getItem(CHECKIN_STORAGE_KEY);
    if (!storedTime) {
      return null;
    }
    return new Date(storedTime);
  } catch (error) {
    console.error("Could not get last check-in time", error);
    return null;
  }
};
