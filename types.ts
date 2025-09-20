export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  isError?: boolean;
  feedback?: 'up' | 'down';
}

export enum Mood {
  Happy = 'Happy',
  Sad = 'Sad',
  Anxious = 'Anxious',
  Stressed = 'Stressed',
  Calm = 'Calm',
}

export interface MoodEntry {
  mood: Mood;
  date: string; // YYYY-MM-DD format
  timestamp: number;
}

export interface Song {
  artist: string;
  title: string;
}