import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageBubble from './Message';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onRetry: (errorId: string) => void;
  onFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  onStartBreathingExercise: () => void;
  onStartMeditation: (topic: string) => void;
  onStartPlaylistCreation: (theme: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onRetry, onFeedback, onStartBreathingExercise, onStartMeditation, onStartPlaylistCreation }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="space-y-6">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            onRetry={onRetry} 
            onFeedback={onFeedback} 
            onStartBreathingExercise={onStartBreathingExercise}
            onStartMeditation={onStartMeditation}
            onStartPlaylistCreation={onStartPlaylistCreation}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatWindow;