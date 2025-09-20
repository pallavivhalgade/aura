import React from 'react';

interface StreakMilestoneModalProps {
  milestone: number;
  onClose: () => void;
}

const StreakMilestoneModal: React.FC<StreakMilestoneModalProps> = ({ milestone, onClose }) => {
  const getBadge = () => {
    if (milestone >= 100) return '💎';
    if (milestone >= 50) return '🏆';
    if (milestone >= 30) return '🏅';
    if (milestone >= 14) return '🎖️';
    return '🥉';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="milestone-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 transform animate-fade-in-up text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4" aria-hidden="true">🎉</div>
        <h2 id="milestone-title" className="text-2xl font-bold text-gray-800 mb-2">Streak Milestone!</h2>
        <p className="text-gray-600 mb-6">
          Amazing! You've logged your mood for <span className="font-bold text-[var(--primary)]">{milestone} days</span> in a row. Keep it up!
        </p>
        <div className="text-5xl mb-6" aria-label={`Badge for ${milestone} days`}>
          {getBadge()}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[var(--primary)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StreakMilestoneModal;
