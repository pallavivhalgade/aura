const THEME_STORAGE_KEY = 'aura-active-theme';
const DEFAULT_THEME = 'aura-default';

export const saveTheme = (themeName: string): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (error) {
    console.error("Could not save theme to local storage", error);
  }
};

export const loadTheme = (): string => {
  try {
    const themeName = localStorage.getItem(THEME_STORAGE_KEY);
    return themeName || DEFAULT_THEME;
  } catch (error) {
    console.error("Could not load theme from local storage", error);
    return DEFAULT_THEME;
  }
};
