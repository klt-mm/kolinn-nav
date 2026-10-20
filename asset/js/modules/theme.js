const THEME_CYCLE = { auto: 'light', light: 'dark', dark: 'auto' };
const THEME_LABELS = {
    auto: 'Switch to light theme',
    light: 'Switch to dark theme',
    dark: 'Use system theme',
};

export const applyTheme = (theme, themeToggle) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', THEME_LABELS[theme] || THEME_LABELS.auto);
    }
};

export const initTheme = (themeToggle) => {
    let storedTheme;
    try {
        storedTheme = localStorage.getItem('theme');
    } catch {
        storedTheme = null;
    }

    const bootTheme = storedTheme || document.documentElement.getAttribute('data-theme');
    const validatedTheme = ['dark', 'light', 'auto'].includes(bootTheme) ? bootTheme : 'auto';
    applyTheme(validatedTheme, themeToggle);

    themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = THEME_CYCLE[current] || 'light';
        applyTheme(next, themeToggle);
        try {
            localStorage.setItem('theme', next);
        } catch {
            // Storage unavailable
        }
    });
};
