import React from 'react';

interface PostCrisisSupportProps {
  onSelect: (choice: 'breathing' | 'meditation' | 'none') => void;
}

const PostCrisisSupport: React.FC<PostCrisisSupportProps> = ({ onSelect }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-crisis-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 transform animate-fade-in-up text-center"
      >
        <div className="text-4xl mb-4" role="img" aria-label="Heart emoji">❤️</div>
        <h2 id="post-crisis-title" className="text-xl font-bold text-gray-800 mb-2">
            Just checking in.
        </h2>
        <p className="text-gray-600 mb-8">
            How are you feeling now? What would feel best for you?
        </p>
        <div className="space-y-3">
           <button
             onClick={() => onSelect('breathing')}
             className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[var(--primary)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all duration-200"
           >
             <span className="text-2xl" aria-hidden="true">😮‍💨</span>
             <span className="font-semibold text-gray-700">Breathing Exercise</span>
           </button>
           <button
             onClick={() => onSelect('meditation')}
             className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[var(--primary)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all duration-200"
           >
             <span className="text-2xl" aria-hidden="true">🧘</span>
             <span className="font-semibold text-gray-700">Guided Meditation</span>
           </button>
           <button
             onClick={() => onSelect('none')}
             className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[var(--primary)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all duration-200"
           >
             <span className="text-2xl" aria-hidden="true">💬</span>
             <span className="font-semibold text-gray-700">No, nothing. I'm fine.</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default PostCrisisSupport;
