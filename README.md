# Learning Prototype - Charles Dorner

## Open the prototype

**Fastest option:** open `Learning Prototype - Charles Dorner.html` in a current desktop or mobile browser. This is a self-contained file with the compiled Tailwind CSS and JavaScript embedded.

**Source-file option:** open `index.html`. Keep `index.html`, `tailwind.css`, `styles.css`, `data.js`, `core.js`, `screens-learn.js`, and `screens-apply.js` in the same folder.

No web server, account, installation, build step, or internet connection is required for the submitted prototype.

## Intended learner experience

ML Learning Companion is a self-instructional introduction to machine learning for college students and adult learners with no assumed prior experience. The experience contains 17 linked screens, four concept lessons, two interactive visual models, an eight-card algorithm explorer, four branching cases, six guided-practice questions, an eight-question mastery check, objective-level results, progress tracking, a glossary, and downloadable study support.

### Learning objectives

1. Given a real-world problem, distinguish supervised, unsupervised, and reinforcement learning with at least 80% accuracy.
2. Match common algorithms to appropriate data, outputs, and applications, then explain the match using evidence from the scenario.

## Navigation

- Desktop: persistent left sidebar, Back/Next controls, and header shortcuts.
- Mobile: menu drawer, fixed bottom navigation, and Back/Next controls.
- Feedback branches: incorrect answers provide a direct link to the relevant lesson or algorithm reference.
- All screens remain available regardless of the learner's route.

## Progress and privacy

Progress is stored in the current browser using `localStorage`. It does not leave the device. Open **Progress and achievements → Settings → Reset all saved progress** to clear the prototype. A JSON learning record can be exported from the Progress or Results screens.

## Accessibility controls

The prototype includes semantic headings, a skip link, keyboard-operable controls, focus management, visible focus indicators, descriptive labels, live feedback regions, reduced-motion support, responsive reflow, and light/dark display modes.

## File guide

- `Learning Prototype - Charles Dorner.html` — self-contained deliverable.
- `Learning Prototype - Charles Dorner - Revised Project Proposal.docx` — detailed proposal, instructional design rationale, access directions, testing record, and rubric crosswalk.
- `index.html` — multi-file app entry point.
- `tailwind.css` — locally compiled Tailwind CSS; no CDN dependency.
- `styles.css` — component styling, themes, animation, and accessibility details.
- `data.js` — learning content, algorithms, questions, glossary, and objectives.
- `core.js` — state, routing, persistence, navigation, modal, and event logic.
- `screens-learn.js` — onboarding, dashboard, path, lessons, and explorer.
- `screens-apply.js` — scenario, practice, quiz, results, progress, and reference screens.
- `docs/RUBRIC_ALIGNMENT.md` — requirement-by-requirement evidence.
- `docs/QA_REPORT.md` — validation and interaction test record.
- `screenshots/final/` — representative desktop and mobile views.
- `build-tailwind.js` — reproducible Tailwind build utility used for the bundled CSS.

## Browser support

Validated with Chromium at 1440 × 1000 and 390 × 844. The implementation uses standard HTML, CSS, SVG, and modern JavaScript supported by current Chrome, Edge, Firefox, and Safari releases.
