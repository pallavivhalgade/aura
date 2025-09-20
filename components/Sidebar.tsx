import React, { useState, useEffect, useRef } from 'react';
import { getDailyQuote } from '../utils/quoteStorage';
import DailyQuoteCard from './DailyQuoteCard';

type View = 'chat' | 'mood' | 'settings' | 'insights' | 'progress';

interface SidebarProps {
    activeView: View;
    streakCount: number;
    onNavigate: (view: View) => void;
    onStartBreathing: () => void;
    onStartMeditation: () => void;
    onShowCrisisSupport: () => void;
    onStartRolePlay: () => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dailyQuote, setDailyQuote] = useState<string | null>(null);
    const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
    // FIX: Changed HTMLAsideElement to HTMLElement for broader compatibility.
    const mobileMenuRef = useRef<HTMLElement>(null);

    const handleNavigate = (view: View) => {
        props.onNavigate(view);
        setMobileMenuOpen(false);
    };

    const handleAction = (action: () => void) => {
        action();
        setMobileMenuOpen(false);
    }

    useEffect(() => {
        setDailyQuote(getDailyQuote().quote);
    }, []);
    
    // Effect for closing with Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileMenuOpen]);

    // Effect for focus management (open/close)
    useEffect(() => {
        if (isMobileMenuOpen) {
            setTimeout(() => {
                // Focus the first focusable element in the menu (the close button)
                // FIX: Cast querySelector result to HTMLElement to access .focus()
                (mobileMenuRef.current?.querySelector('button') as HTMLElement)?.focus();
            }, 100); // Wait for CSS transition
        } else {
            // Return focus to the hamburger button only if the menu was the last thing focused
            if (document.activeElement && mobileMenuRef.current?.contains(document.activeElement)) {
                // FIX: Added explicit cast to HTMLElement to resolve type inference issue.
                (hamburgerButtonRef.current as HTMLElement)?.focus();
            }
        }
    }, [isMobileMenuOpen]);

    // Effect for trapping focus inside the mobile menu
    useEffect(() => {
        const menuElement = mobileMenuRef.current;
        if (!isMobileMenuOpen || !menuElement) return;

        const focusableElements = Array.from(
            menuElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKeyPress = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        menuElement.addEventListener('keydown', handleTabKeyPress);
        return () => {
            menuElement.removeEventListener('keydown', handleTabKeyPress);
        };
    }, [isMobileMenuOpen]);


    const navContent = (
        <nav className="p-4 space-y-6">
            {dailyQuote && <DailyQuoteCard quote={dailyQuote} />}
            {props.streakCount > 0 && (
                <div className="flex flex-col items-center gap-1.5 p-3 bg-orange-100/50 rounded-lg" role="status" aria-live="polite">
                    <span className="text-3xl leading-none" aria-hidden="true">🔥</span>
                    <p className="font-bold text-sm text-orange-700">
                        {props.streakCount}-day streak!
                    </p>
                    <p className="text-xs text-orange-600 text-center">Keep the momentum going!</p>
                </div>
            )}
            
            <NavSection title="Conversation & Support">
                <NavItem icon={ChatIcon} label="Chat with Aura" ariaLabel="Navigate to chat with Aura" isActive={props.activeView === 'chat'} onClick={() => handleNavigate('chat')} />
                <NavItem icon={CrisisIcon} label="Crisis Support" ariaLabel="Get crisis support information" onClick={() => handleAction(props.onShowCrisisSupport)} isCrisisButton />
            </NavSection>

            <NavSection title="Mood & Wellness">
                <NavItem icon={MoodIcon} label="Log Your Mood" ariaLabel="Navigate to mood logging page" isActive={props.activeView === 'mood'} onClick={() => handleNavigate('mood')} />
                <NavItem icon={InsightsIcon} label="Mood Insights" ariaLabel="View your mood insights" isActive={props.activeView === 'insights'} onClick={() => handleNavigate('insights')} />
                <NavItem icon={ProgressIcon} label="Your Progress" ariaLabel="View your progress" isActive={props.activeView === 'progress'} onClick={() => handleNavigate('progress')} />
            </NavSection>

            <NavSection title="Interactive Tools">
                <NavItem icon={MeditationIcon} label="Guided Meditation" ariaLabel="Start a guided meditation" onClick={() => handleAction(props.onStartMeditation)} />
                <NavItem icon={BreathingIcon} label="Breathing Exercise" ariaLabel="Start a breathing exercise" onClick={() => handleAction(props.onStartBreathing)} />
                <NavItem icon={RolePlayIcon} label="Role-Play Practice" ariaLabel="Start a role-play practice session" onClick={() => handleAction(props.onStartRolePlay)} />
            </NavSection>
            
             <NavSection title="Personalization">
                <NavItem icon={ThemeIcon} label="App Settings" ariaLabel="Navigate to app settings" isActive={props.activeView === 'settings'} onClick={() => handleNavigate('settings')} />
            </NavSection>
        </nav>
    );

    return (
        <>
            {/* Mobile Hamburger Button */}
            <div className="absolute top-4 left-4 z-30 md:hidden">
                <button
                    ref={hamburgerButtonRef}
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600"
                    aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 bg-white/60 backdrop-blur-lg border-r border-gray-200 overflow-y-auto">
                {navContent}
            </aside>
            
            {/* Mobile Sidebar (Overlay) */}
            {isMobileMenuOpen && (
                 <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)} aria-hidden="true"></div>
                    <aside 
                        ref={mobileMenuRef}
                        id="mobile-menu"
                        className="fixed top-0 left-0 h-full w-72 bg-gray-50 z-50 overflow-y-auto shadow-xl md:hidden transform transition-transform duration-300 ease-in-out" 
                        style={{transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'}}
                    >
                       <div className="flex justify-end p-4">
                           <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500" aria-label="Close menu">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                       </div>
                       {navContent}
                    </aside>
                </>
            )}
        </>
    )
}

const NavSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const sectionId = title.replace(/\s+/g, '-').toLowerCase();
    return (
        <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2" id={sectionId}>{title}</h3>
            <ul className="space-y-1" role="group" aria-labelledby={sectionId}>
                {children}
            </ul>
        </div>
    );
};


interface NavItemProps {
    icon: React.FC;
    label: string;
    ariaLabel: string;
    isActive?: boolean;
    isCrisisButton?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, ariaLabel, isActive = false, isCrisisButton = false, onClick }) => (
    <li role="none">
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            aria-current={isActive ? 'page' : undefined}
            role="menuitem"
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm font-medium transition-colors ${
                isActive 
                    ? 'bg-[var(--primary)] text-white shadow' 
                    : isCrisisButton
                    ? 'bg-red-100/60 text-red-800 hover:bg-red-200/80 font-semibold'
                    : 'text-gray-700 hover:bg-gray-200/70'
            }`}
        >
            <span className={isActive ? 'text-white' : isCrisisButton ? 'text-red-700' : 'text-gray-500'} aria-hidden="true"><Icon /></span>
            <span>{label}</span>
        </button>
    </li>
);

// --- ICONS ---
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="w-5 h-5">{children}</div>;
const ChatIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72a1.125 1.125 0 01-.282-.803v-4.286c0-.97.616-1.813 1.5-2.097m6.562 0H9.562c-.884-.284-1.5-1.128-1.5-2.097V6.214c0-1.136.847-2.1 1.98-2.193l3.72-3.72a1.125 1.125 0 011.59 0l3.72 3.72a1.125 1.125 0 01.282.803v4.286z" /></svg></IconWrapper>;
const CrisisIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></IconWrapper>;
const MoodIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></IconWrapper>;
const InsightsIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg></IconWrapper>;
const ProgressIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.94-3.94m3.94 3.94l-3.94 3.94" /></svg></IconWrapper>;
const BreathingIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.234-4.266-9.5-9.5-9.5S.5 6.766.5 12s4.266 9.5 9.5 9.5 9.5-4.234 9.5-9.5zm-15.05 0c0-1.07.168-2.1.47-3.04l3.208 3.209a4.5 4.5 0 006.364-6.364L7.54 2.47A9.45 9.45 0 0112 2.5a9.503 9.503 0 019.5 9.5c0 .34-.018.677-.052.998l-3.21 3.21a4.5 4.5 0 00-6.364-6.364L9.04 15.53a9.45 9.45 0 01-4.59-3.53z" /></svg></IconWrapper>;
const MeditationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 00-1.423-.464z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg></IconWrapper>;
const MusicIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0118 7.5v3.75m-7.5-6l-4.5-1.5m0 0l-1.5 4.5M4.5 6l1.5 4.5" /></svg></IconWrapper>;
const RolePlayIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 16H5a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2" /></svg></IconWrapper>;
const ThemeIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.05.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>;


export default Sidebar;