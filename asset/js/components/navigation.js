import { state } from '../core/state.js';
import { announceToScreenReader } from '../core/dom.js';

export const initDesktopMenu = (cache, desktopMQ, hoverMQ) => {
    const HOVER_OPEN_DELAY = 80;
    const CLOSE_GRACE = 200;
    const panelResizeObserver = 'ResizeObserver' in window
        ? new ResizeObserver(() => {
            if (state.activePanel && cache.globalNav.classList.contains('is-open')) {
                cache.megaContainer.style.height = `${state.activePanel.scrollHeight}px`;
            }
        })
        : null;

    const closeMenu = () => {
        if (!state.activePanel) return;

        clearTimeout(state.closeTimeout);
        clearTimeout(state.hoverIntentTimeout);
        state.activePanel.classList.remove('is-active');
        cache.megaContainer.style.height = '0px';
        cache.megaContainer.classList.remove('is-open');
        cache.megaContainer.inert = true;
        cache.megaContainer.setAttribute('aria-hidden', 'true');
        cache.globalNav.classList.remove('is-open');
        cache.menuCurtain?.classList.remove('is-visible');
        cache.panels.forEach((panel) => panel.classList.remove('is-active'));
        cache.triggers.forEach((trigger) => {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.classList.remove('is-active');
        });
        panelResizeObserver?.disconnect();
        state.activePanel = null;
        announceToScreenReader('Menu closed', cache.navStatus);
    };

    const openPanel = (targetId) => {
        const panel = cache.panels.find(p => p.id === targetId);
        if (!panel) {
            console.warn(`Panel not found: ${targetId}`);
            return;
        }

        const panelHeight = panel.scrollHeight;
        clearTimeout(state.closeTimeout);
        if (state.activePanel === panel) return;

        if (state.activePanel) {
            state.activePanel.classList.remove('is-active');
        }

        state.activePanel = panel;
        cache.panels.forEach((item) => item.classList.toggle('is-active', item === panel));
        cache.triggers.forEach((trigger) => {
            const isSource = trigger.dataset.target === targetId;
            trigger.setAttribute('aria-expanded', String(isSource));
            trigger.classList.toggle('is-active', isSource);
        });
        cache.megaContainer.classList.add('is-open');
        cache.megaContainer.inert = false;
        cache.megaContainer.setAttribute('aria-hidden', 'false');
        cache.globalNav.classList.add('is-open');
        cache.menuCurtain?.classList.add('is-visible');
        cache.megaContainer.style.height = `${panelHeight}px`;
        panelResizeObserver?.disconnect();
        panelResizeObserver?.observe(panel);
        announceToScreenReader(`Opened ${panel.dataset.label || panel.id.replace('panel-', '')} menu`, cache.navStatus);
    };

    const handleMouseEnter = (trigger) => {
        return () => {
            if (!desktopMQ.matches || !hoverMQ.matches || trigger.dataset.target === 'panel-search') return;
            
            clearTimeout(state.hoverIntentTimeout);
            state.hoverIntentTimeout = setTimeout(() => {
                openPanel(trigger.dataset.target);
            }, HOVER_OPEN_DELAY);
        };
    };

    const handleClick = (trigger) => {
        return () => {
            if (!desktopMQ.matches) return;
            clearTimeout(state.hoverIntentTimeout);
            const targetId = trigger.dataset.target;
            const isAlreadyOpen = state.activePanel && state.activePanel.id === targetId;

            if (isAlreadyOpen && !hoverMQ.matches) {
                closeMenu();
                return;
            }

            if (trigger.dataset.target === 'panel-search' && isAlreadyOpen) {
                closeMenu();
                return;
            }

            openPanel(targetId);
        };
    };

    const handleMouseLeave = () => {
        if (!desktopMQ.matches || !hoverMQ.matches) return;
        clearTimeout(state.hoverIntentTimeout);
        state.closeTimeout = setTimeout(closeMenu, CLOSE_GRACE);
    };

    // Attach trigger events
    cache.triggers.forEach((trigger) => {
        trigger.addEventListener('mouseenter', handleMouseEnter(trigger));
        trigger.addEventListener('mouseleave', handleMouseLeave);
        trigger.addEventListener('click', handleClick(trigger));
    });

    // Mega container events
    cache.megaContainer.addEventListener('mouseenter', () => clearTimeout(state.closeTimeout));
    cache.menuCurtain?.addEventListener('click', closeMenu);

    // Global nav events
    cache.globalNav.addEventListener('mouseleave', () => {
        if (!desktopMQ.matches) return;
        clearTimeout(state.closeTimeout);
        state.closeTimeout = setTimeout(closeMenu, CLOSE_GRACE);
    });

    cache.globalNav.addEventListener('focusin', (event) => {
        if (!desktopMQ.matches) return;
        const trigger = event.target.closest('[data-target]');
        if (trigger) {
            const isSearchTrigger = trigger.dataset.target === 'panel-search';
            if (event.target.matches(':focus-visible') && !isSearchTrigger) {
                openPanel(trigger.dataset.target);
            }
            return;
        }
        if (!cache.megaContainer.contains(event.target)) closeMenu();
    });

    cache.globalNav.addEventListener('focusout', (event) => {
        if (!desktopMQ.matches) return;
        if (!cache.globalNav.contains(event.relatedTarget)) {
            clearTimeout(state.closeTimeout);
            state.closeTimeout = setTimeout(closeMenu, CLOSE_GRACE);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !desktopMQ.matches || !state.activePanel) return;

        const sourceTrigger = cache.triggers.find(
            (trigger) => trigger.dataset.target === state.activePanel.id
        );
        closeMenu();
        sourceTrigger?.focus();
    });

    document.addEventListener('click', (event) => {
        if (!desktopMQ.matches || !state.activePanel) return;
        if (!cache.globalNav.contains(event.target)) closeMenu();
    });

    window.addEventListener('scroll', () => {
        if (desktopMQ.matches && state.activePanel) closeMenu();
    }, { passive: true });

    desktopMQ.addEventListener('change', closeMenu);
};
