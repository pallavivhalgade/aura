
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-3 justify-start">
        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-[var(--avatar-gradient-start)] to-[var(--avatar-gradient-end)]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 m-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" />
            </svg>
        </div>
      <div className="px-5 py-3 rounded-2xl shadow-md bg-white text-gray-800 rounded-bl-lg">
        <div className="flex items-center justify-center space-x-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;