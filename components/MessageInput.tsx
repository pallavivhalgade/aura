import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition();

  useEffect(() => {
    if(isListening) {
      setText(transcript);
    }
  }, [transcript, isListening]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleMicClick = () => {
      if (isListening) {
          stopListening();
      } else {
          startListening();
      }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening..." : "Type your message here..."}
          disabled={isLoading}
          className="flex-1 w-full p-4 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition duration-200 text-black caret-black"
          autoComplete="off"
        />
        {hasRecognitionSupport && (
           <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${isListening ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-300'}`}
                aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          aria-label="Send message"
          className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white transition-all duration-200 ease-in-out transform ${
            isLoading || !text.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-95'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform="rotate(90)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;