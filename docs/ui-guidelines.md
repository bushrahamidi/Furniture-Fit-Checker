# DesignFit — UI Guidelines

> Core UI standards for the DesignFit frontend.
> Applies to every component in `packages/frontend/src/components/`.

---

## 1. Design Principles

DesignFit is a professional tool for interior designers, not a consumer app. The interface should feel like a precision instrument: calm, legible, and quick to read at a glance.

| Principle | What it means in practice |
| --- | --- |
| **The verdict is the hero** | Fit status and score are the largest, highest-contrast elements on screen |
| **Measurements are data** | Numbers are tabular, monospaced, and right-aligned — never prose |
| **Warnings inform, never scold** | Neutral wording, severity conveyed by colour *and* icon *and* text |
| **Input is fast** | Keyboard-first, sensible tab order, no modal interruptions |
| **Quiet by default** | Colour is reserved for meaning; the chrome is greyscale |

---

## 2. Component Library

**Plain CSS with design tokens. No component library in the MVP.**

This is a deliberate choice and it is worth stating why, because "use Material" is the obvious default:

- The UI is one form plus one result panel. A component library would add a large dependency to render inputs, a table, and some badges.
- The distinctive parts of this UI — the fit score meter, the status badge, the measurements table — are custom anyway. Material would style the boring 20% and get in the way of the interesting 80%.
- Learning the architecture is the goal of this project. Hand-written CSS keeps the styling legible rather than hidden behind a theming API.

**Revisit in V2** if the app grows a floor plan editor, dialogs, toasts, and date pickers. At that point MUI or Radix earns its weight. Until then, tokens and plain CSS.

### Structure

- One `.css` file per component, colocated: `FitScoreMeter.jsx` + `FitScoreMeter.css`
- Global tokens in `src/styles/tokens.css`
- Global resets and base typography in `src/styles/base.css`
- **No inline styles** except for genuinely dynamic values (e.g. the score meter's `width: {score}%`)
- Class naming: `block__element--modifier`, scoped by component name — `.fit-score-meter__bar--critical`

---

## 3. Colour Palette

All colours are defined as CSS custom properties in `src/styles/tokens.css`. **Never hardcode a hex value in a component stylesheet.**

### Neutrals — the chrome

```css
--color-bg:            #FAFAF8;  /* page background, warm off-white */
--color-surface:       #FFFFFF;  /* cards, panels */
--color-border:        #E2E2DD;  /* dividers, input borders */
--color-border-strong: #C4C4BD;  /* focused/hovered borders */
--color-text:          #1C1C1A;  /* primary text */
--color-text-muted:    #6B6B65;  /* labels, hints, units */
```

### Brand — actions and identity

```css
--color-primary:       #2D5F4C;  /* deep green — buttons, links, focus */
--color-primary-hover: #234A3B;
--color-primary-light: #E8F0EC;  /* tinted backgrounds */
```

Deep green rather than the default blue: it reads as architectural and avoids competing with the status colours, which are the only other colour on the page.

### Semantic — fit status and warning severity

| Token | Hex | Used for |
| --- | --- | --- |
| `--color-success` | `#2E7D52` | status `fits` |
| `--color-success-bg` | `#E6F4EC` | success badge background |
| `--color-warning` | `#B26A00` | status `tight`, severity `warning` |
| `--color-warning-bg` | `#FDF3E3` | warning badge background |
| `--color-danger` | `#B3261E` | status `does-not-fit`, severity `critical` |
| `--color-danger-bg` | `#FBEAE9` | danger badge background |
| `--color-info` | `#2D5F4C` | severity `info` |
| `--color-info-bg` | `#E8F0EC` | info background |

### Status mapping — must be consistent everywhere

| API value | Colour token | Icon | Label |
| --- | --- | --- | --- |
| `fits` | success | ✓ | "Fits" |
| `tight` | warning | ! | "Tight fit" |
| `does-not-fit` | danger | ✕ | "Does not fit" |
| severity `info` | info | i | — |
| severity `warning` | warning | ! | — |
| severity `critical` | danger | ✕ | — |

**Colour is never the only signal.** Every status carries an icon and a text label. Roughly 1 in 12 men has a colour vision deficiency, and red/green is the most common axis — which is exactly the axis a fit checker lives on.

---

## 4. Typography

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-mono: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace;
```

| Token | Size | Weight | Used for |
| --- | --- | --- | --- |
| `--text-xs` | 12px | 500 | Units, hints, helper text |
| `--text-sm` | 14px | 400 | Labels, warnings, table cells |
| `--text-base` | 16px | 400 | Body, inputs |
| `--text-lg` | 20px | 600 | Section headings |
| `--text-xl` | 28px | 600 | Fit status badge |
| `--text-2xl` | 40px | 700 | Fit score number |

**Rules:**

- Minimum body size **16px** — also prevents iOS Safari zooming on input focus.
- **All measurements use `--font-mono`**, right-aligned in tables. Proportional digits make columns of numbers impossible to scan.
- Line height 1.5 for text, 1.2 for headings.
- Never centre-align more than two lines of text.

---

## 5. Spacing & Layout

A 4px base scale — every margin, padding, and gap must be a token:

```css
--space-1: 4px;   --space-4: 16px;   --space-8: 48px;
--space-2: 8px;   --space-5: 24px;   --space-10: 64px;
--space-3: 12px;  --space-6: 32px;
```

**Radii:** `--radius-sm: 4px` (inputs, badges) · `--radius-md: 8px` (cards) · `--radius-full: 999px` (pills)

**Shadows:** used sparingly, only on the result panel.
`--shadow-sm: 0 1px 2px rgba(0,0,0,0.06)` · `--shadow-md: 0 2px 8px rgba(0,0,0,0.08)`

### Page layout

- Max content width **1100px**, centred.
- Two columns on desktop: inputs left (`400px`), results right (fluid).
- Single column below **768px**, inputs first.
- Breakpoints: `768px` (tablet), `1100px` (desktop). Mobile-first.

---

## 6. Buttons

Three variants only. Resist adding a fourth.

| Variant | Appearance | Used for |
| --- | --- | --- |
| **Primary** | Solid `--color-primary`, white text | "Check Fit" — one per screen |
| **Secondary** | Transparent, `--color-border-strong` border | "Reset", "Clear" |
| **Text** | No border, primary-coloured text | Inline links, "Learn more" |

### Specification

```
height:        44px    (min 44×44px touch target)
padding:       0 var(--space-5)
border-radius: var(--radius-sm)
font:          var(--text-base) / 500
transition:    background-color 120ms ease, border-color 120ms ease
```

### Required states

Every button must implement **all five**:

| State | Treatment |
| --- | --- |
| Default | As specified above |
| Hover | `--color-primary-hover`; cursor `pointer` |
| Focus | `outline: 2px solid var(--color-primary); outline-offset: 2px` — **never removed** |
| Active | Darken 5%, no transform |
| Disabled | `opacity: 0.45`, `cursor: not-allowed`, `aria-disabled="true"` |

**Loading:** the primary button shows an inline spinner and the label changes to "Checking…". It stays disabled and **retains its width** — no layout shift.

**No transforms on interaction.** No lift, no scale. This is a measurement tool; bouncing buttons undermine it.

---

## 7. Forms & Inputs

- **Every input has a visible `<label>`.** Placeholders are not labels — they vanish on focus and fail screen readers.
- Labels sit above inputs, left-aligned, `--text-sm`, `--color-text-muted`.
- Units render as a suffix inside the field (`cm`), in `--color-text-muted`, and are **not** part of the input value.
- Numeric fields: `type="number"`, `inputmode="decimal"`, `min="1"`.
- Input height **44px**, matching buttons.
- Focus: 2px `--color-primary` outline, offset 2px.

### Validation

- Validate on **blur**, not on every keystroke. Validating while typing tells the user their half-entered value is wrong, which is both true and useless.
- Re-validate on change **only after** the field has already errored once.
- Error text sits directly below the field, `--text-xs`, `--color-danger`, prefixed with an icon.
- Errored inputs get `aria-invalid="true"` and `aria-describedby` pointing at the error element.
- The submit button stays disabled while the form is invalid.

### Required fields

Mark **optional** fields rather than required ones — in this form everything is required, so marking them all adds noise to every label.

---

## 8. Result Presentation

The result panel is what the user came for. It gets the visual weight.

**Order, top to bottom:**

1. **`FitStatusBadge`** — pill, `--text-xl`, icon + label, semantic background tint
2. **`FitScoreMeter`** — horizontal bar, `--text-2xl` number, bar fill matches status colour
3. **`RecommendationCard`** — the single sentence, `--text-base`, `--color-primary-light` background
4. **`WarningList`** — one row per warning, icon by severity, sorted critical → warning → info
5. **`MeasurementsTable`** — label left, value right, monospaced, `--text-sm`

**Empty state:** before the first check, the panel shows a short instruction rather than an empty box or a zeroed-out result. Never render a fake `0` score.

**Loading:** skeleton blocks matching the final layout — not a centred spinner. This keeps the page from jumping when the result arrives.

**Score meter fill:**

| Score | Colour |
| --- | --- |
| 75–100 | `--color-success` |
| 40–74 | `--color-warning` |
| 0–39 | `--color-danger` |

---

## 9. Accessibility Requirements

**Target: WCAG 2.1 Level AA.** These are requirements, not aspirations — a component is not done until it meets them.

### Non-negotiable

- **Contrast:** 4.5:1 for text, 3:1 for UI borders and icons. Every token pairing above has been chosen to clear this.
- **Focus visible:** never `outline: none` without an equivalent replacement.
- **Keyboard complete:** every interactive element reachable by Tab and operable by Enter/Space. Tab order follows visual order.
- **Touch targets:** minimum 44×44px.
- **Colour independence:** status and severity always carry an icon and a text label.

### Semantics

- One `<h1>`; heading levels never skip.
- Native elements first — `<button>`, `<select>`, `<table>`. Reach for ARIA only when no native element fits.
- Forms wrapped in `<form>`; submit via a real `submit` button so Enter works.
- Related inputs grouped in `<fieldset>` with a `<legend>` ("Room", "Furniture").
- `MeasurementsTable` is a real `<table>` with `<th scope="row">`.

### Dynamic content

- Result panel: `aria-live="polite"` so the verdict is announced when it arrives.
- Validation errors: `role="alert"`.
- Loading state: `aria-busy="true"` on the panel.
- On a `400` response, move focus to the first errored field.

### Motion

- Transitions capped at **200ms**.
- Honour `prefers-reduced-motion: reduce` — disable all transitions and animations.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Testing

- Query by **role and accessible name** in React Testing Library — `getByRole('button', { name: /check fit/i })`, never by class name. Tests that query by role fail when accessibility breaks, which is the point.
- Manual keyboard pass on each screen before a phase is considered done.
- One E2E test completes the full journey using the keyboard only.

---

## 10. Content & Tone

- **Sentence case** for all labels, buttons, and headings. Not Title Case.
- Buttons are **verbs**: "Check fit", not "Submit".
- Warnings state the fact and the standard: *"Only 45 cm of walking space in front of the sofa; 90 cm is recommended."* — measurement, comparison, no blame.
- Never use "error", "invalid", or "failed" in user-facing copy about furniture. The furniture is not wrong; it is the wrong size for this room.
- Always show units. A bare `220` is ambiguous.
- Round displayed measurements to whole centimetres; percentages to one decimal.

---

## 11. Definition of Done

A UI component is complete when:

- [ ] Uses only tokens — no hardcoded colours, sizes, or spacing
- [ ] All five interaction states implemented where applicable
- [ ] Keyboard operable, with a visible focus ring
- [ ] Contrast verified at AA
- [ ] Status conveyed by colour **and** icon **and** text
- [ ] Has a component test querying by role, not class
- [ ] Renders correctly at 375px, 768px, and 1280px
- [ ] Honours `prefers-reduced-motion`
