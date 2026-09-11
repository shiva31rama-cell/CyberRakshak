# CyberRakshak UI/UX System

## Design goal

CyberRakshak should feel like a calm public-safety utility, not a crowded dashboard. The interface should make the user's next safe action obvious within a few seconds.

## Core principles

1. **One page, one primary purpose.** Each route should answer one question or support one task.
2. **Progressive disclosure.** Do not show every feature on every page. Put secondary features under More, related-topic navigation or the next step.
3. **Classic first.** Prefer familiar forms, cards, headings, lists, breadcrumbs and clear buttons over decorative effects.
4. **One primary action.** Every important screen should have one visually dominant action and a small number of secondary actions.
5. **Explain before alarming.** Risk labels must show the reason, the confidence/uncertainty, and the next safe action.
6. **Mobile first.** Design for one-handed use, narrow screens and inconsistent bandwidth.
7. **Readable everywhere.** Keep content blocks short, use descriptive headings, and avoid giant walls of controls.
8. **Consistent templates.** Use shared page framing, spacing, button hierarchy, form behavior and status messaging across modules.

## Page templates

### 1. Utility page

Use for Safety Checker, Feedback and similar focused tools:

- page title + one-sentence purpose
- one primary form/task card
- clear result/status area
- next-step action
- small related-help section

### 2. Learning page

Use for lessons and safety topics:

- topic title
- short introduction
- 3–7 focused learning sections
- example/scenario
- take-away checklist
- next lesson or quiz action

### 3. Incident-response page

Use for Emergency Help and Report Scam:

- urgency level
- immediate actions
- official escalation path
- information to preserve
- what not to share
- follow-up/case tracking

### 4. Admin page

Use only for authorized operators:

- compact summary
- filters
- primary work queue
- detail panel
- audit/status context

## Navigation

Primary navigation is intentionally limited to Home, Check, Learn, Emergency and Report Scam. Secondary learning modules, quiz, feedback and topic-specific pages live under More. This avoids turning the navbar into a list of every route.

## Button hierarchy

- **Primary:** one action that moves the user forward.
- **Secondary:** a safe alternative or supporting action.
- **Tertiary:** text link for navigation.
- Avoid multiple visually identical buttons on one screen.

## Visual language

The visual system uses calm neutrals, strong readable text, moderate corner radius, restrained shadows and limited motion. Security severity must never depend on color alone; always show a textual label and explanation.

## Content density rule

When a page becomes long, split it into a journey of related pages rather than continuing to add cards and buttons. Prefer a clear sequence such as:

`Check → Understand → Act → Report → Learn`

## Acceptance test

Before releasing a new screen, ask:

- Can a first-time user tell what this page is for?
- Is there one obvious next action?
- Can the user complete the task without scrolling through unrelated features?
- Does the mobile version remain readable and usable?
- Are errors and risk states understandable without color or jargon?
- Is every visible feature actually useful on this page?
