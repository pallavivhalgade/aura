import React, { useState, useEffect } from 'react';
import { Message, Sender } from '../types';

interface MessageProps {
  message: Message;
  onRetry: (errorId: string) => void;
  onFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  onStartBreathingExercise: () => void;
  onStartMeditation: (topic: string) => void;
  onStartPlaylistCreation: (theme: string) => void;
}

const BREATHING_ACTION_KEY = '[ACTION:START_BREATHING_EXERCISE]';
const MEDITATION_REGEX = /\[ACTION:START_MEDITATION:{(.*?)}\]/g;
const PLAYLIST_REGEX = /\[ACTION:CREATE_PLAYLIST:{(.*?)}\]/;


const MessageBubble: React.FC<MessageProps> = ({ message, onRetry, onFeedback, onStartBreathingExercise, onStartMeditation, onStartPlaylistCreation }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.sender === Sender.User;

  // Effect to automatically trigger actions from AI messages
  useEffect(() => {
    if (isUser || message.isError) return;

    const playlistMatch = message.text.match(PLAYLIST_REGEX);
    if (playlistMatch) {
      const theme = playlistMatch[1];
      onStartPlaylistCreation(theme);
    }
  }, [message.id, message.text, message.sender, message.isError, isUser, onStartPlaylistCreation]);


  const wrapperClasses = `flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'} ${!isUser ? 'animate-fade-in-up' : ''}`;
  const bubbleClasses = `max-w-lg lg:max-w-xl px-5 py-3 rounded-2xl shadow-md ${
    isUser
      ? 'bg-[var(--user-bubble-bg)] text-[var(--user-bubble-text)] rounded-br-lg'
      : message.isError 
      ? 'bg-red-100 text-red-800 rounded-bl-lg' 
      : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-lg'
  }`;
  const avatarClasses = `w-8 h-8 rounded-full flex-shrink-0 ${isUser ? 'bg-gray-300' : 'bg-gradient-to-br from-[var(--avatar-gradient-start)] to-[var(--avatar-gradient-end)]'}`;
  
  const UserAvatar = () => (
    <div className={avatarClasses}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 m-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );

  const AIAvatar = () => (
     <div className={avatarClasses}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 m-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 000 5.292" />
      </svg>
    </div>
  );
  
  const RetryButton = () => (
    <button
      onClick={() => onRetry(message.id)}
      className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4s0 0 0 0l-4 4M4 20s0 0 0 0l4-4" />
      </svg>
      Retry
    </button>
  );

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(message.text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  };

  const FeedbackButtons = () => {
    const hasFeedback = !!message.feedback;
    const isUp = message.feedback === 'up';
    const isDown = message.feedback === 'down';

    return (
      <div className="flex items-center gap-2 mt-2 pl-1">
        <button
          onClick={() => onFeedback(message.id, 'up')}
          disabled={hasFeedback}
          className={`p-1 rounded-full transition-colors ${
            isUp
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed'
          }`}
          aria-label="Good response"
          aria-pressed={isUp}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isUp ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.437V10h7zM7 10V7a3 3 0 013-3v0a3 3 0 013 3v3" />
          </svg>
        </button>
        <button
          onClick={() => onFeedback(message.id, 'down')}
          disabled={hasFeedback}
          className={`p-1 rounded-full transition-colors ${
            isDown
              ? 'bg-red-100 text-red-600'
              : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed'
          }`}
          aria-label="Bad response"
          aria-pressed={isDown}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isDown ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 5.563V14h-7zM17 14v3a3 3 0 01-3 3v0a3 3 0 01-3-3v-3" />
          </svg>
        </button>
        <button
          onClick={handleCopy}
          disabled={isCopied}
          className={`p-1 rounded-full transition-colors ${
            isCopied
              ? 'text-green-600'
              : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-50 disabled:hover:bg-transparent'
          }`}
          aria-label={isCopied ? 'Copied to clipboard' : 'Copy message'}
        >
          {isCopied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (isUser) {
        return <p className="whitespace-pre-wrap">{message.text}</p>;
    }

    const actions: React.ReactNode[] = [];

    // Extract meditation actions
    const meditationMatches = [...message.text.matchAll(MEDITATION_REGEX)];
    meditationMatches.forEach((match, index) => {
        const topic = match[1];
        actions.push(
            <button
                key={`meditation-${index}`}
                onClick={() => onStartMeditation(topic)}
                className="w-full text-center px-4 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
                Start Guided Meditation
            </button>
        );
    });

    // Extract breathing exercise action
    if (message.text.includes(BREATHING_ACTION_KEY)) {
        actions.push(
            <button
                key="breathing"
                onClick={onStartBreathingExercise}
                className="w-full text-center px-4 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
                Start Guided Breathing
            </button>
        );
    }
    
    // Clean the text by removing all action tags for display
    const cleanedText = message.text
        .replace(MEDITATION_REGEX, '')
        .replace(PLAYLIST_REGEX, '')
        .replace(BREATHING_ACTION_KEY, '')
        .trim();
    
    return (
        <div>
            {cleanedText && <p className="whitespace-pre-wrap">{cleanedText}</p>}
            {actions.length > 0 && (
                <div className={`space-y-2 ${cleanedText ? 'mt-3' : ''}`}>
                    {actions}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className={wrapperClasses}>
      {!isUser && <AIAvatar />}
      <div className="flex flex-col items-start">
        <div className={bubbleClasses}>
            {renderContent()}
            {message.isError && !isUser && <RetryButton />}
        </div>
        {!isUser && !message.isError && <FeedbackButtons />}
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
};

export default MessageBubble;