# Assignment 6A Rubric Alignment

## 1. Audience and learning objectives

**Audience:** college students and adult learners who are new to machine learning.

**Objective O1:** Given a real-world problem, distinguish supervised, unsupervised, and reinforcement learning with at least 80% accuracy.

**Objective O2:** Match common algorithms to appropriate data, outputs, and applications, then explain the match using evidence from the scenario.

Evidence appears on the learner-plan, dashboard, learning-path, lesson, practice, quiz, results, progress, and about screens.

## 2. Self-instructional design

Every learning or activity screen begins with an explanation of its purpose and explicit completion directions. Learners receive a recommended next activity, visible progress, plain-language labels, feedback explanations, remediation links, glossary support, and reset/export controls. The app can be completed without an instructor present.

## 3. Visual and screen design

The interface uses a consistent dark visual system, cyan/violet/emerald accents, high-contrast typography, predictable card hierarchy, ample spacing, inline SVG iconography, responsive reflow, and restrained motion. Light mode and reduced-motion settings are included. Desktop and mobile screenshots are in `screenshots/final/`.

## 4. Smooth functionality

The app uses hash-based routing and event delegation, so any menu, Back/Next button, remediation branch, mobile navigation item, or screen-inventory link can be used without breaking state. State is persisted in localStorage. Modal and menu layers close by button, backdrop, or Escape. Invalid or incomplete assessment submission produces explanatory feedback rather than an error state.

## 5. User-friendliness

User needs are anticipated through onboarding, a personalized dashboard, estimated durations, visible milestone status, immediate feedback during learning, delayed feedback during assessment, objective-level recommendations, searchable definitions, downloadable study support, theme/motion controls, privacy explanation, and progress reset/export.

## 6. Minimum of ten screens

The prototype contains **17 distinct screens**:

1. Welcome
2. Set your learning plan
3. Learning dashboard
4. Learning path
5. Machine learning foundations
6. Supervised learning
7. Unsupervised learning
8. Reinforcement learning
9. Algorithm explorer
10. Scenario lab
11. Guided practice
12. Mastery check
13. Results and review
14. Progress and achievements
15. Machine learning glossary
16. Resources and study tools
17. About this prototype

## 7. Navigation buttons

The prototype includes Back and Next controls, a persistent desktop sidebar, mobile menu, mobile bottom navigation, dashboard/path shortcuts, direct screen inventory, and multiple choice-dependent remediation buttons. Incorrect category answers branch to the corresponding lesson; incorrect algorithm answers branch to the algorithm explorer; assessment review branches by objective.

## 8. Interactive practice and assessment with feedback

- Four lesson checks provide immediate positive or corrective feedback.
- The K-means visualization responds to K and sample regeneration.
- The reinforcement-learning maze responds to directional actions and calculates rewards.
- Four scenario cases branch through category and algorithm decisions with positive/negative rationale.
- Six guided-practice items provide immediate explanations and remediation.
- Eight mastery items withhold feedback until submission, then provide overall score, objective analytics, item review, correct answers, explanations, and remediation links.
