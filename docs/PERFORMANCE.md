# Performance

## Current approach

- The page is static and has no framework runtime or third-party JavaScript
  dependencies.
- JavaScript is split into native ES modules and initialized after DOM
  readiness.
- Frequently used elements are collected once in `asset/js/main.js`.
- Search data is local, and results are rendered with DOM nodes and
  `textContent`.
- Desktop menu panel height is read when a panel opens and observed for later
  content-size changes with `ResizeObserver` where supported.
- Featured-card pointer effects are initialized only for fine pointers when
  reduced motion is not requested.
- CSS transitions and animations use compositing-friendly properties such as
  opacity and transform where possible.
- Responsive CSS avoids showing the desktop mega menu on small screens, and
  the mobile drawer constrains scroll to its own viewport.

## Performance-sensitive changes

- Avoid repeated DOM queries in pointer, scroll, or input handlers when a
  cached reference or delegated listener will suffice.
- Avoid reading layout properties immediately after writes that invalidate
  layout. Batch reads before writes, or schedule non-urgent visual updates
  with `requestAnimationFrame`.
- Keep event handlers lightweight. Filter only the needed local search data
  and avoid rebuilding unrelated navigation content.
- Avoid permanent `will-change`; it can retain unnecessary compositor
  resources.
- Use passive listeners for scroll/touch events when they do not cancel
  browser behavior.
- Keep CSS import order understandable. If introducing a build pipeline,
  measure its output before changing the current static delivery model.
- Keep reduced-motion behavior intact; animation is not an acceptable
  substitute for immediate state changes.

## Validate

Run the page from a local HTTP server and inspect it at mobile and desktop
sizes. Use browser developer tools or Lighthouse to check:

- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Interaction to Next Paint (INP), particularly menu/search interactions
- Long tasks, console errors, and forced synchronous layout
- Behavior on a constrained network and device

There is no configured build, benchmark, or test runner in this repository.
Treat measured results as environment-specific; do not claim a performance
target without recording the browser, device, throttling, and tested route.
