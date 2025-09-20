import React, { useState, useEffect, useCallback } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import MoodLogger from './components/MoodLogger';
import SettingsView from './components/SettingsView';
import InsightsView from './components/InsightsView';
import ProgressView from './components/ProgressView';
import StreakMilestoneModal from './components/StreakMilestoneModal';
import GuidedBreathingExercise from './components/GuidedBreathingExercise';
import GuidedMeditation from './components/GuidedMeditation';
import PlaylistModal from './components/PlaylistModal';
import CrisisSupportModal from './components/CrisisSupportModal';
import Sidebar from './components/Sidebar';
import RolePlayScenarioModal from './components/RolePlayScenarioModal';
import PostCrisisSupport from './components/PostCrisisSupport';
import { getAIResponse, getPlaylist } from './components/services/geminiService';
import { loadMoodHistory, saveMoodHistory } from './utils/moodStorage';
import { getLastCheckinTime, updateLastCheckinTime } from './utils/checkinStorage';
import { loadTheme, saveTheme } from './utils/themeStorage';
import { themes, Theme } from './utils/themes';
import { motivationalQuotes } from './utils/quotes';
import { sanitizeInput } from './utils/sanitization';
import { updateStreak, loadStreakData, StreakData } from './utils/streakStorage';
import { Message, Sender, Mood, MoodEntry, Song } from './types';


const selectDailyMessage = () => {
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  
  const checkinPrompts = [
    "How are you feeling today?",
    "How has your day been treating you so far?",
    "What's the emotional weather like for you right now?",
    "How are you, really? It's okay to not be okay.",
    "What's on your mind at this moment?",
    "Just gently checking in. How are things on your end?",
  ];
  const checkin = checkinPrompts[Math.floor(Math.random() * checkinPrompts.length)];

  return `Here's a little thought for your day:\n\n"${quote}"\n\nWith that in mind, ${checkin.toLowerCase()}`;
};


const getInitialMessage = (): Message => {
    const lastCheckinTime = getLastCheckinTime();
    const now = new Date();
    let text: string;
    let id: string;

    if (!lastCheckinTime) {
        // First visit ever
        id = 'initial-welcome';
        text = "Hey, I'm Aura. It's nice to meet you. This is a quiet, private space just for you, where you can share anything at all without judgment. I'm here to listen whenever you're ready. To start, how are you feeling right now?";
        updateLastCheckinTime();
    } else {
        const hoursSinceLastCheckin = (now.getTime() - lastCheckinTime.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastCheckin >= 24) {
            // Daily check-in
            id = 'daily-checkin';
            text = selectDailyMessage();
            updateLastCheckinTime();
        } else {
            // Welcome back within 24 hours
            id = 'welcome-back';
            const welcomeBackPrompts = [
              "Welcome back! It's good to see you again. I'm here if you'd like to talk.",
              "Hey, glad you're back. Remember this is a safe space to share whatever is on your mind.",
              "Hi again. I'm here to listen if anything has come up for you."
            ];
            text = welcomeBackPrompts[Math.floor(Math.random() * welcomeBackPrompts.length)];
        }
    }

    return { id, text, sender: Sender.AI };
};


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'mood' | 'settings' | 'insights' | 'progress'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [activeThemeName, setActiveThemeName] = useState<string>(loadTheme());
  const [streakData, setStreakData] = useState<StreakData>({ streak: 0, lastLogDate: '' });
  const [achievedMilestone, setAchievedMilestone] = useState<number | null>(null);
  const [isBreathingExerciseActive, setIsBreathingExerciseActive] = useState(false);
  const [isMeditationActive, setIsMeditationActive] = useState(false);
  const [meditationTopic, setMeditationTopic] = useState<string | null>(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [playlistTheme, setPlaylistTheme] = useState('');
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isRolePlayModalOpen, setIsRolePlayModalOpen] = useState(false);
  const [activeRolePlayScenario, setActiveRolePlayScenario] = useState<string | null>(null);
  const [showPostCrisisOptions, setShowPostCrisisOptions] = useState(false);

  // --- Effects ---

  useEffect(() => {
    // Apply theme to the document
    const theme = themes.find(t => t.name === activeThemeName);
    if (theme) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [activeThemeName]);

  useEffect(() => {
    // Load initial data on mount
    const loadedMoodHistory = loadMoodHistory();
    setMoodHistory(loadedMoodHistory);

    const loadedStreakData = loadStreakData();
    setStreakData(loadedStreakData);
    
    setMessages([getInitialMessage()]);
  }, []);

  // --- Handlers ---

  const handleSendMessage = useCallback(async (text: string) => {
    const sanitizedText = sanitizeInput(text);
    if (!sanitizedText) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: sanitizedText,
      sender: Sender.User,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const aiResponseText = await getAIResponse(updatedMessages, moodHistory, activeRolePlayScenario, streakData);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponseText,
        sender: Sender.AI,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: Sender.AI,
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, moodHistory, activeRolePlayScenario, streakData]);
  
  const handleRetry = useCallback((errorId: string) => {
    const errorIndex = messages.findIndex(msg => msg.id === errorId);
    if (errorIndex > 0) {
      const lastUserMessage = messages[errorIndex - 1];
      // Remove error message and resubmit
      setMessages(prev => prev.slice(0, errorIndex));
      if (lastUserMessage && lastUserMessage.sender === Sender.User) {
        handleSendMessage(lastUserMessage.text);
      }
    }
  }, [messages, handleSendMessage]);

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };
  
  const handleLogMood = (mood: Mood) => {
    const newEntry: MoodEntry = {
      mood,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };
    const updatedHistory = [...moodHistory, newEntry];
    setMoodHistory(updatedHistory);
    saveMoodHistory(updatedHistory);

    const newStreakData = updateStreak();
    setStreakData(newStreakData);

    const milestones = [3, 7, 14, 30, 50, 100];
    if (milestones.includes(newStreakData.streak)) {
        setAchievedMilestone(newStreakData.streak);
    }
  };

  const handleSelectTheme = (themeName: string) => {
    setActiveThemeName(themeName);
    saveTheme(themeName);
  };
  
  const closePlaylistModal = () => {
      setIsPlaylistModalOpen(false);
      // Reset state after a short delay to allow for exit animation
      setTimeout(() => {
          setPlaylistSongs([]);
          setPlaylistTheme('');
          setIsPlaylistLoading(false);
          setPlaylistError(null);
      }, 300);
  };

  const handleStartPlaylistCreation = useCallback(async (theme: string) => {
    setPlaylistTheme(theme);
    setPlaylistError(null);
    setPlaylistSongs([]);
    setIsPlaylistLoading(true);
    setIsPlaylistModalOpen(true);

    try {
        const songs = await getPlaylist(theme);
        setPlaylistSongs(songs);
    } catch (error) {
        console.error("Failed to get playlist:", error);
        setPlaylistError("Sorry, I couldn't create that playlist right now. Please try again later.");
    } finally {
        setIsPlaylistLoading(false);
    }
  }, []);

  const handleSelectScenario = (scenario: string) => {
    setActiveRolePlayScenario(scenario);
    setIsRolePlayModalOpen(false);
    setActiveView('chat');
    const scenarioStartMessage: Message = {
      id: `ai-scenario-${Date.now()}`,
      text: `Okay, let's practice the "${scenario}" scenario. I'm ready when you are. You can start the conversation.`,
      sender: Sender.AI,
    };
    setMessages(prev => [...prev, scenarioStartMessage]);
  };
  
  const handlePostCrisisSelection = (choice: 'breathing' | 'meditation' | 'none') => {
    setShowPostCrisisOptions(false);
    if (choice === 'breathing') {
      setIsBreathingExerciseActive(true);
    } else if (choice === 'meditation') {
      setMeditationTopic('finding calm');
      setIsMeditationActive(true);
    }
  };

  const handleStartDefaultMeditation = () => {
    setMeditationTopic('stress relief');
    setIsMeditationActive(true);
  };
  
  const handleStartMusicRequestFromMood = (mood: Mood) => {
    setActiveView('chat');
    handleSendMessage(`I'm feeling ${mood.toLowerCase()}, can you suggest some music?`);
  };

  const handleShareMoodWithAura = (mood: Mood) => {
    setActiveView('chat');
    handleSendMessage(`User Selected Mood: ${mood}`);
  };

  // --- Render ---

  return (
    <div className="flex h-screen w-screen font-sans bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-via)] to-[var(--gradient-end)]">
      <Sidebar
        activeView={activeView}
        streakCount={streakData.streak}
        onNavigate={setActiveView}
        onStartBreathing={() => setIsBreathingExerciseActive(true)}
        onStartMeditation={handleStartDefaultMeditation}
        onShowCrisisSupport={() => setIsCrisisModalOpen(true)}
        onStartRolePlay={() => setIsRolePlayModalOpen(true)}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeView === 'chat' && (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        onRetry={handleRetry}
                        onFeedback={handleFeedback}
                        onStartBreathingExercise={() => setIsBreathingExerciseActive(true)}
                        onStartMeditation={(topic) => {
                            setMeditationTopic(topic);
                            setIsMeditationActive(true);
                        }}
                        onStartPlaylistCreation={handleStartPlaylistCreation}
                    />
                </div>
                <div className="p-4 bg-transparent">
                    <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
          )}
          {activeView === 'mood' && (
            <div className="flex items-center justify-center h-full p-4">
                <MoodLogger 
                    onLogMood={handleLogMood} 
                    onGoToChat={() => setActiveView('chat')}
                    onStartBreathing={() => setIsBreathingExerciseActive(true)}
                    onStartMusicRequest={handleStartMusicRequestFromMood}
                    onShareMoodWithAura={handleShareMoodWithAura}
                />
            </div>
          )}
          {activeView === 'settings' && <SettingsView themes={themes} activeThemeName={activeThemeName} onSelectTheme={handleSelectTheme} />}
          {activeView === 'insights' && <InsightsView moodHistory={moodHistory} />}
          {activeView === 'progress' && <ProgressView moodHistory={moodHistory} streakData={streakData} />}
        </div>
        
        <footer className="p-3 border-t border-gray-200/50 text-center text-xs text-gray-600 bg-transparent">
            <strong>Disclaimer:</strong> Aura is not a doctor, therapist, or medical specialist. 
            Aura is here to support your emotional well-being. 
            For professional help, please contact trained specialists.
        </footer>
      </main>

      {/* Modals & Overlays */}
      {achievedMilestone && <StreakMilestoneModal milestone={achievedMilestone} onClose={() => setAchievedMilestone(null)} />}
      {isBreathingExerciseActive && <GuidedBreathingExercise onClose={() => setIsBreathingExerciseActive(false)} />}
      {isMeditationActive && meditationTopic && <GuidedMeditation topic={meditationTopic} onClose={() => { setIsMeditationActive(false); setMeditationTopic(null); }} />}
      {isPlaylistModalOpen && (
          <PlaylistModal
            theme={playlistTheme}
            songs={playlistSongs}
            isLoading={isPlaylistLoading}
            error={playlistError}
            onClose={closePlaylistModal}
          />
      )}
      {isCrisisModalOpen && <CrisisSupportModal onClose={() => { setIsCrisisModalOpen(false); setShowPostCrisisOptions(true); }} />}
      {showPostCrisisOptions && <PostCrisisSupport onSelect={handlePostCrisisSelection} />}
      {isRolePlayModalOpen && <RolePlayScenarioModal onClose={() => setIsRolePlayModalOpen(false)} onSelectScenario={handleSelectScenario} />}
    </div>
  );
};

export default App;