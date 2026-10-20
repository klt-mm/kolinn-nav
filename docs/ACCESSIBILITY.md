# Accessibility

Accessibility is part of the page structure and interaction behavior, not
only its visual styling. Verify changes using keyboard interaction, assistive
technology where available, and automated checks.

## Existing support

- A skip link targets the main content.
- Navigation landmarks have names; the mobile drawer is exposed as a named
  modal dialog while open.
- Desktop triggers expose `aria-expanded` and `aria-controls`. The mobile
  accordion buttons expose expanded state and control their associated
  content panels.
- Closed desktop/mobile panels use `inert` and `aria-hidden` to keep hidden
  controls out of keyboard navigation and the accessibility tree.
- Opening the mobile drawer moves focus inside, contains Tab navigation,
  makes the page background inert, and locks background scrolling.
- Escape closes the active menu and returns focus to the relevant trigger.
  Selecting a mobile navigation link also closes the drawer.
- A polite live region announces menu changes. Mobile search announces result
  counts and empty results.
- Focus-visible styles and reduced-motion overrides are provided in CSS.

## When changing interactions

- Keep visible and programmatic state synchronized. Update `aria-expanded`
  whenever the associated panel opens or closes.
- Preserve a usable focus order; do not leave focus in content that has become
  inert or hidden.
- On dismissible overlays, provide an explicit close control, Escape
  dismissal, and predictable focus restoration.
- Keep menu content reachable at short viewport heights and browser zoom.
- Do not rely on color alone for state, errors, selection, or focus.
- Check contrast for normal text against every background/theme combination.
  Small text should meet WCAG AA contrast (4.5:1); large text should meet
  3:1.
- Respect reduced-motion preferences for both CSS animations and any scripted
  scrolling or transitions.
- Make touch targets comfortable to activate and ensure hover-only behavior
  has a keyboard/touch equivalent.

## Manual check

1. Use Tab and Shift+Tab from the top of the page; confirm the skip link is
   available and focus remains visible.
2. Open each desktop navigation panel with keyboard and pointer. Verify
   expanded state, panel links, Escape dismissal, and focus return.
3. At a narrow viewport, open the mobile drawer; Tab through it, expand each
   accordion, use search, close with Escape, and activate a link.
4. Repeat with light, dark, and system themes and with reduced motion enabled.
5. Check at browser zoom and short viewport heights; verify scrollable content
   is not clipped.

Automated audits help detect issues but do not replace keyboard or
screen-reader testing.
