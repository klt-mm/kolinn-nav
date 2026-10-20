import { onReady } from './core/dom.js';
import { initTheme } from './modules/theme.js';
import { handleSearch } from './modules/search_logic.js';
import { initDesktopMenu } from './components/navigation.js';
import { initMobileMenu } from './components/panels.js';

onReady(() => {
    const cache = {
        globalNav: document.getElementById('globalNav'),
        globalNavBackground: document.querySelectorAll(
            '#globalNav .logo, #globalNav nav, #globalNav .nav-actions > :not(#mobileMenuToggle)'
        ),
        megaContainer: document.getElementById('megaMenuContainer'),
        panels: Array.from(document.querySelectorAll('.mega-panel')),
        triggers: Array.from(document.querySelectorAll('[data-target]')),
        themeToggle: document.getElementById('themeToggle'),
        mobileToggle: document.getElementById('mobileMenuToggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        mobileContent: document.getElementById('mobileMenuContent'),
        desktopSearchInput: document.getElementById('desktopSearchInput'),
        mobileSearchInput: document.getElementById('mobileSearchInput'),
        mainEl: document.getElementById('main'),
        menuCurtain: document.getElementById('menuCurtain'),
        siteFooter: document.querySelector('.site-footer'),
        skipLink: document.getElementById('skip-link'),
        navStatus: document.getElementById('nav-status'),
        mobileAccordionHeaders: Array.from(document.querySelectorAll('.mobile-accordion-header'))
    };

    if (!cache.globalNav || !cache.megaContainer) return;

    const desktopMQ = window.matchMedia('(min-width: 769px)');
    const hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Initialize Modules
    initTheme(cache.themeToggle);
    
    cache.desktopSearchInput?.addEventListener('input', handleSearch);
    cache.mobileSearchInput?.addEventListener('input', handleSearch);

    // Initialize Components
    initDesktopMenu(cache, desktopMQ, hoverMQ);
    initMobileMenu(cache, desktopMQ);

    cache.skipLink?.addEventListener('click', (event) => {
        event.preventDefault();
        if (!cache.mainEl) return;

        cache.mainEl.scrollIntoView({ behavior: reduceMotionMQ.matches ? 'auto' : 'smooth' });
        cache.mainEl.focus();
    });

    if (hoverMQ.matches && !reduceMotionMQ.matches) {
        document.querySelectorAll('.featured-card').forEach((card) => {
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            glow.setAttribute('aria-hidden', 'true');
            card.appendChild(glow);

            let bounds;
            card.addEventListener('pointerenter', () => {
                bounds = card.getBoundingClientRect();
            });
            card.addEventListener('pointermove', (event) => {
                if (!bounds) return;
                card.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
                card.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
            });
            card.addEventListener('pointerleave', () => {
                bounds = undefined;
            });
        });
    }
});
