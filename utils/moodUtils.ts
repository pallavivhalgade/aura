import { Mood } from '../types';

export const moodOptions: { 
  mood: Mood; 
  emoji: string; 
  color: string; 
  tileColor: string;
  tileTextColor: string;
  tileHexColor: string;
}[] = [
  { mood: Mood.Happy, emoji: '😊', color: 'bg-green-100 text-green-800 ring-green-300', tileColor: 'bg-green-400', tileTextColor: 'text-white', tileHexColor: '#4ade80' },
  { mood: Mood.Sad, emoji: '😢', color: 'bg-blue-100 text-blue-800 ring-blue-300', tileColor: 'bg-blue-400', tileTextColor: 'text-white', tileHexColor: '#60a5fa' },
  { mood: Mood.Anxious, emoji: '😟', color: 'bg-yellow-100 text-yellow-800 ring-yellow-300', tileColor: 'bg-yellow-300', tileTextColor: 'text-yellow-900', tileHexColor: '#fde047' },
  { mood: Mood.Stressed, emoji: '😫', color: 'bg-red-100 text-red-800 ring-red-300', tileColor: 'bg-red-400', tileTextColor: 'text-white', tileHexColor: '#f87171' },
  { mood: Mood.Calm, emoji: '😌', color: 'bg-purple-100 text-purple-800 ring-purple-300', tileColor: 'bg-purple-400', tileTextColor: 'text-white', tileHexColor: '#c084fc' },
];

export const getMoodDetails = (mood: Mood) => {
    return moodOptions.find(option => option.mood === mood);
};
