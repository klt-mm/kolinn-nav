# Style Guide

## Principles

- Prefer the active modular styles under `asset/style/`.
- Reuse existing tokens and component patterns.
- Keep responsive behavior and reduced-motion rules in the cascade; do not
  rely on JavaScript for visual states that CSS can express.
- Use semantic HTML and native controls before adding custom roles or
  interaction patterns.

## CSS organization

`asset/style/main.css` is the stylesheet entry point. Keep imports in this
order:

1. Tokens
2. Reset and base
3. Layout
4. Components
5. Responsive overrides

Responsive overrides belong last so they can override component defaults.
When adding a file, import it from the manifest in its matching layer.

## Design tokens

Use CSS custom properties from the token layers instead of adding repeated
hard-coded values:

- `tokens/primitives.css`: Nord-derived palette, spacing, and radii.
- `tokens/semantic.css`: surface, text, border, action, focus, and status
  aliases.
- `tokens/typography.css`: font stacks and type sizes/line heights.
- `tokens/motion.css`: durations, easing, and stagger interval.
- `tokens/layout-tokens.css`: container sizing, gutter, navigation height,
  stacking levels, and shadows.
- `tokens/dark-theme.css`: dark palette for explicit dark mode and system dark
  preference when theme is `auto`.

Keep theme overrides aligned: when a semantic color is changed for one theme,
check its contrast and use across all themes. The current layout breakpoints
are 640px and 1024px for content grids, and 768px / 769px for the
mobile/desktop navigation switch.

## Component styling

- Keep selectors scoped to a component class where practical.
- Use the existing state classes and attributes, such as `.is-open`,
  `.is-active`, `.is-animating`, `[aria-expanded="true"]`, and
  `[data-theme="dark"]`.
- Avoid new arbitrary high z-index values; use the `--z-*` scale in
  `layout-tokens.css`.
- Preserve visible focus indicators. Do not remove outlines without providing
  an equivalent focus-visible style.
- Interactive links and controls should have usable hit areas, particularly
  in mobile navigation.

## Typography and content

Use `--font-mono` for terminal-style labels and headings and `--font-sans` for
reading text. Use the existing type scale and line-height tokens. Keep
paragraph line lengths readable and preserve text zoom/browser zoom support.

## Motion

Use existing transition and stagger tokens. Prefer transform and opacity for
animation. Every non-essential motion effect must remain suppressed or
minimized under `prefers-reduced-motion: reduce`.

## HTML and naming

Use descriptive component classes and stable IDs only where scripts or
ARIA references need them. Keep every `aria-controls` value pointed at an
existing unique ID. Decorative SVGs and visual flourishes should be hidden
from assistive technology; interactive controls need accessible names.
