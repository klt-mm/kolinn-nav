import { state } from '../core/state.js';
import { announceToScreenReader, triggerHaptic } from '../core/dom.js';

export const initMobileMenu = (cache, desktopMQ) => {
    if (!cache.mobileToggle || !cache.mobileMenu) return;

    const setMobileMenu = (open) => {
        state.isMobileMenuOpen = open;
        cache.mobileToggle.setAttribute('aria-expanded', String(open));
        cache.mobileToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        cache.mobileMenu.classList.toggle('is-open', open);
        cache.mobileMenu.inert = !open;
        cache.mobileMenu.setAttribute('aria-hidden', String(!open));

        const backgroundLayer = [
            cache.mainEl,
            cache.menuCurtain,
            cache.siteFooter,
            cache.skipLink,
            ...cache.globalNavBackground
        ].filter(Boolean);
        backgroundLayer.forEach((el) => {
            el.inert = open;
        });

        if (open) {
            state.scrollPosition = window.pageYOffset;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${state.scrollPosition}px`;
            document.body.style.width = '100%';

            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';

            const focusableElements = Array.from(cache.mobileMenu.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ));
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (firstFocusable) firstFocusable.focus();

            const trapFocus = (e) => {
                if (e.key !== 'Tab' || !firstFocusable || !lastFocusable) return;
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            };

            if (firstFocusable && lastFocusable) {
                cache.mobileMenu.addEventListener('keydown', trapFocus);
                cache.mobileMenu.__trapFocus = trapFocus;
            }

            triggerHaptic('light');
            announceToScreenReader('Menu opened', cache.navStatus);
        } else {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, state.scrollPosition);
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            if (cache.mobileMenu.__trapFocus) {
                cache.mobileMenu.removeEventListener('keydown', cache.mobileMenu.__trapFocus);
                delete cache.mobileMenu.__trapFocus;
            }

            announceToScreenReader('Menu closed', cache.navStatus);
        }
    };

    cache.mobileToggle?.addEventListener('click', () => {
        setMobileMenu(!state.isMobileMenuOpen);
    });

    cache.mobileAccordionHeaders?.forEach((header) => {
        header.addEventListener('click', () => {
            const willOpen = header.getAttribute('aria-expanded') !== 'true';
            const inner = header.nextElementSibling?.querySelector('.mobile-accordion-inner');

            cache.mobileContent
                ?.querySelectorAll('.mobile-accordion-header[aria-expanded="true"]')
                .forEach((openHeader) => {
                    if (openHeader === header) return;
                    openHeader.setAttribute('aria-expanded', 'false');
                    const openInner = openHeader.nextElementSibling?.querySelector('.mobile-accordion-inner');
                    if (openInner) openInner.classList.remove('is-animating');
                });

            header.setAttribute('aria-expanded', String(willOpen));

            if (inner) {
                inner.classList.remove('is-animating');
                if (willOpen) {
                    requestAnimationFrame(() => {
                        if (header.getAttribute('aria-expanded') === 'true') {
                            inner.classList.add('is-animating');
                        }
                    });
                }
            }
        });
    });

    cache.mobileContent?.addEventListener('click', (event) => {
        if (!event.target.closest('a[href]')) return;
        setMobileMenu(false);
        cache.mobileToggle.focus();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !state.isMobileMenuOpen) return;

        setMobileMenu(false);
        cache.mobileToggle.focus();
    });

    desktopMQ?.addEventListener('change', () => {
        if (desktopMQ.matches && state.isMobileMenuOpen) setMobileMenu(false);
    });
};
