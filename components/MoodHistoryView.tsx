import React from 'react';
import { MoodEntry } from '../types';

interface MoodHistoryViewProps {
  moodHistory: MoodEntry[];
}

const MoodHistoryView: React.FC<MoodHistoryViewProps> = ({ moodHistory }) => {
  // The Mood Calendar view has been removed and this component is no longer used.
  return null;
};

export default MoodHistoryView;
