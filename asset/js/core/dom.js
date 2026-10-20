export const onReady = (fn) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
        fn();
    }
};

export const announceToScreenReader = (message, statusEl) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    setTimeout(() => {
        statusEl.textContent = '';
    }, 1000);
};

export const triggerHaptic = (style = 'light') => {
    if ('vibrate' in navigator) {
        const patterns = {
            light: [10],
            medium: [20],
            heavy: [30]
        };
        navigator.vibrate(patterns[style] || patterns.light);
    }
};
