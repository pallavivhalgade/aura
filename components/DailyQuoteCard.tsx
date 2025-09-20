import React from 'react';

interface DailyQuoteCardProps {
  quote: string;
}

const DailyQuoteCard: React.FC<DailyQuoteCardProps> = ({ quote }) => {
  return (
    <div className="p-3 bg-indigo-100/50 rounded-lg" role="note">
      <h4 className="text-xs font-semibold text-indigo-700 mb-1 text-center">Thought for the Day</h4>
      <p className="text-sm text-indigo-800 text-center italic">"{quote}"</p>
    </div>
  );
};

export default DailyQuoteCard;
