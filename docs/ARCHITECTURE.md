# Architecture

## Overview

KOLINN_NAV is a static page. It has no framework, bundler, package manifest, or
server-side component. `index.html` defines the interface and loads the
modular styles and JavaScript directly from `asset/`.

The active entry points are:

- `asset/style/main.css` — CSS import manifest.
- `asset/js/main.js` — JavaScript ES module entry point.

## Runtime flow

1. The browser parses `index.html`, applies the stylesheet manifest, and
   loads `asset/js/main.js` as a module.
2. `onReady` in `asset/js/core/dom.js` waits for DOM readiness if necessary.
3. `main.js` collects shared DOM references, establishes responsive and
   reduced-motion media queries, then initializes theme, search, desktop
   navigation, and mobile navigation.
4. Component modules update classes, inline panel height, native `inert`,
   ARIA state, focus, and scroll locking in response to user input.

## JavaScript modules

| Path | Responsibility |
| --- | --- |
| `asset/js/main.js` | DOM cache, initialization, skip-link behavior, and optional pointer glow setup for featured cards. |
| `asset/js/core/dom.js` | DOM-ready callback, screen-reader announcements, and optional vibration helper. |
| `asset/js/core/state.js` | Shared state for the active desktop panel, timers, mobile drawer, and scroll position. |
| `asset/js/modules/theme.js` | `auto` / `light` / `dark` theme selection and persistence. |
| `asset/js/modules/search.js` | Search suggestion records and destination paths. |
| `asset/js/modules/search_logic.js` | Filters and renders results into the search component’s result list. |
| `asset/js/components/navigation.js` | Desktop mega-menu interactions, panel sizing, ARIA updates, dismissal, and focus restoration. |
| `asset/js/components/panels.js` | Mobile drawer, focus containment, accordion behavior, and Escape/link dismissal. |

The desktop and mobile navigation share `data-target` desktop trigger markup
and mobile menu content, but their interaction state is managed by their
respective component modules. Keep each module initialized once from `main.js`.

## Stylesheets

`asset/style/main.css` imports tokens first, then reset/base, layout,
components, and finally responsive rules. The final import position is
intentional: responsive display rules must override component base display
styles at mobile and desktop breakpoints.

- `tokens/` defines palette primitives, semantic aliases, typography, motion,
  layout/elevation, and dark/system theme overrides.
- `base/` defines reset, shared element styles, and cross-component responsive
  and reduced-motion rules.
- `layout/` defines reusable page geometry.
- `components/` holds navigation, panels, search, mobile menu, hero, footer,
  buttons, shimmer, and animation styles.

Add reusable design values as tokens rather than scattering repeated literal
values. Add component-specific rules to the component file that owns that
interface.

## Adding or changing a feature

1. Update the relevant semantic markup in `index.html`, including accessible
   names and state attributes.
2. Put interaction behavior in the appropriate module and initialize it from
   `main.js`; use `core/state.js` only for state shared across modules.
3. Put styles in the relevant component stylesheet and confirm the import
   order in `style/main.css`.
4. Check both responsive layouts, keyboard behavior, reduced-motion behavior,
   and theme variants.
5. Keep search destinations synchronized between `search.js` and visible
   navigation where appropriate.

There is no automated build or test command configured in this repository.
The browser can load the project through a static HTTP server, for example
`python3 -m http.server 8000` from the project root.
