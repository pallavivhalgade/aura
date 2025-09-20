import { motivationalQuotes } from './quotes';
import { toDateKey } from './dateUtils';

interface StoredQuote {
    quote: string;
    date: string; // YYYY-MM-DD
}

const QUOTE_KEY = 'aura-daily-quote';

export const getDailyQuote = (): StoredQuote => {
    const todayKey = toDateKey(new Date());
    
    try {
        const storedData = localStorage.getItem(QUOTE_KEY);
        if (storedData) {
            const parsedData: StoredQuote = JSON.parse(storedData);
            if (parsedData.date === todayKey) {
                return parsedData; // Return today's stored quote
            }
        }
    } catch (error) {
        console.error("Could not load daily quote", error);
    }
    
    // If no valid quote for today, pick a new one
    const newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    const newStoredQuote: StoredQuote = { quote: newQuote, date: todayKey };

    try {
        localStorage.setItem(QUOTE_KEY, JSON.stringify(newStoredQuote));
    } catch (error) {
        console.error("Could not save daily quote", error);
    }

    return newStoredQuote;
};
