# KOLINN_NAV

A responsive, terminal-inspired navigation demo built with plain HTML, CSS, and
JavaScript ES modules. It includes a desktop mega menu, mobile navigation
drawer with accordions, documentation search suggestions, and a light/dark/
system theme toggle.

## Run locally

There is no package manager, build step, or runtime dependency. Serve the
project root over HTTP so the browser can load the ES modules:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/>. Alternatively, use any static file server whose
document root is this directory. Opening `index.html` directly with a `file:`
URL may prevent module loading in some browsers.

## Project structure

```text
.
├── index.html                 # Page markup and navigation content
├── README.md
├── LICENSE                    # MIT License
├── docs/
│   ├── ACCESSIBILITY.md
│   ├── ARCHITECTURE.md
│   ├── PERFORMANCE.md
│   └── STYLE_GUIDE.md
└── asset/
    ├── js/                    # Active modular JavaScript implementation
    │   ├── components/
    │   ├── core/
    │   ├── modules/
    │   └── main.js
    ├── style/                 # Active modular CSS implementation
    │   ├── base/
    │   ├── components/
    │   ├── layout/
    │   ├── tokens/
    │   └── main.css
```

The page loads `asset/style/main.css` and `asset/js/main.js`. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for module responsibilities and
extension guidance.

## Features

- Responsive navigation with desktop panels and a mobile menu.
- Search suggestions backed by the local data in `asset/js/modules/search.js`.
- Light, dark, and system-preference themes; the selected choice is persisted
  in browser storage when available.
- Keyboard support, focus management, live announcements, and reduced-motion
  styling.
- CSS custom properties organized into primitive, semantic, typography,
  motion, layout, and theme tokens.

Navigation and search destinations in the demo use site-root-relative paths
such as `/docs/colors`. Connect those routes to real pages or update the links
and search data when integrating the demo into another site.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Style guide](docs/STYLE_GUIDE.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Performance](docs/PERFORMANCE.md)

## License

This project is licensed under the [MIT License](LICENSE).
