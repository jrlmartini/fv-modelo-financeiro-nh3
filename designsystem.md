# Conatus Executive Dashboard Design System (Single Source of Truth)

**Product:** Conatus Environmental Technologies — Executive / Board Dashboard

**Mode:** Online dashboard + **Kiosk mode** (always-on, big screens)

**Component library:** shadcn/ui (Tailwind)

**Visual style:** clean • minimalist • sleek • **no gradients** • no “AI-looking” effects

**Font:** Google Fonts **Outfit**

**Theme:** Dark-first (this document defines the canonical dark theme)

---

## 0) Design principles (non-negotiables)

1. **Clarity > beauty.** Every UI decision must improve scanability and comprehension.
2. **Consistency > novelty.** Repeat patterns. Avoid decorative variation.
3. **Data-first hierarchy.** KPIs and trends are the hero; chrome must be quiet.
4. **Low visual noise.** Prefer spacing + typography + subtle borders over shadows.
5. **Kiosk-ready UX.** Readable from distance, stable layouts, no “hover-only” affordances.
6. **Palette integrity.** **Do not create new colors.** Use only the HEX tokens below.
7. **Do not hardcode, use tokens** Use tokens to express semantics of each element

---

## 1) Foundations

### 1.1 Typography

**Font family:** Outfit (Google Fonts)

**Font feature:** enable `tabular-nums` for all numeric KPIs, tables, and axis values.

| Style | Weight | Size (px) | Usage |
| --- | --- | --- | --- |
| Display | Bold | 30 | KPI values, hero numbers |
| Heading 1 | SemiBold | 24 | Page titles, section headers |
| Heading 2 | SemiBold | 20 | Card titles, panel headers |
| Body | Regular | 16 | Default text, labels, table cells |

**Type rules**

- Always keep **KPI numbers** in Display style (30) and **labels** in Body (16) or smaller variants from Body via opacity/secondary color (no new sizes required).
- Use **Sentence case** for titles (avoid ALL CAPS).
- Use **max 2 lines** for card titles; truncate with ellipsis after that.

---

## 2) Color system (canonical tokens)

> **Do not add colors. Do not adjust hues. Do not introduce gradients.**
> 
> 
> If transparency is needed, apply opacity at implementation level (Tailwind opacity utilities), not by inventing new HEX values.
> 

### 2.1 Core UI tokens

| Token | HEX | Primary usage |
| --- | --- | --- |
| bg-main | #03131e | App/page background |
| bg-card | #071724 | Card surfaces, panels |
| bg-modal | #214058 | Modal shell / overlay surfaces (see modal rules) |
| bg-button | #275fc1 | Primary action background |
| bg-destructive | #e45757 | Destructive actions + destructive banners |
| str-default | #214059 | Default borders/dividers *(canonical spelling: `str-default` — keep HEX)* |
| str-hover | #275fc1 | Hover/focus border highlight |
| str-disabled | #8f9da7 | Disabled borders |
| str-destructive | #d32f2f | Destructive borders |
| txt-main | #f2f2f2 | Primary text on dark surfaces |
| txt-secondary | #c1cdd9 | Secondary text (supporting info) |
| txt-muted | #8f9da7 | Muted/disabled text |
| txt-modal | #03131e | **Dark text** for high-chroma/light-ish surfaces (see accessibility rules) |

---

## 3) Layout & spacing

### 3.1 Grid & alignment (dashboard)

- Use an **8px spacing system** (8, 16, 24, 32, 40…).
- Prefer **12-column layout** for desktop dashboards:
    - Gutters: 24px
    - Card padding: 16–24px (use 24px for KPI-heavy cards)
- Align KPI numbers to the **baseline** where possible; align multiple KPI values using `tabular-nums`.

### 3.2 Kiosk mode rules

- **Minimum readable size at distance:** KPI value (Display 30) must remain visually dominant.
- Avoid interactions that require precision:
    - Prefer big targets (≥ 40px height for clickable rows/buttons).
- Avoid “hover-only” information. If something matters, it must be visible or accessible via click/focus.

---

## 4) Surfaces, borders, radii

### 4.1 Radii (canonical)

- `radius-sm`: **8px** (chips, buttons)
- `radius-md`: **12px** (cards)
- `radius-lg`: **16px** (modals)

### 4.2 Borders (separation strategy)

- Prefer borders instead of shadows.
- Default border: **0.5px** using `str-default`.
- Highlight border (hover/focus): **1px** using `str-hover`.

---

## 5) Component states (global)

> Applies to all interactive components: buttons, tabs, inputs, selectable cards, table rows.
> 

### 5.1 Canonical states

**Default**

- Background: `bg-card`
- Border: `str-default` @ 0.5px
- Text: `txt-main`

**Hover**

- Border: `str-hover` @ 1px
- Background remains `bg-card` (no glow, no gradients)

**Active / Pressed**

- Border: `str-hover` @ 0.5px
- Background remains `bg-card`

**Selected**

- Border: `str-hover` @ 1px *(use hover color to unify selection language)*
- Background: `bg-card`
- Text: `txt-main`

**Disabled**

- Border: `str-disabled` @ 0.5px
- Text: `txt-muted`
- Reduce emphasis (opacity at implementation level)

### 5.2 Focus-visible (keyboard)

- Required for accessibility and kiosk navigation.
- Use a **1px border** in `str-hover` plus an **outer ring** using the same `str-hover` color (implementation via ring utilities; do not introduce new colors).

---

## 6) Buttons (shadcn/ui mapping + canonical styling)

> Keep buttons visually quiet; primary is the only strong color block.
> 

### 6.1 Button variants

**Primary**

- Background: `bg-button`
- Text: `txt-main`
- Border: none (default)
- Hover: add 1px border `str-hover` *(same HEX as bg-button; gives crisp edge)*

**Secondary (Outline)**

- Background: `bg-card`
- Text: `txt-main`
- Border: `str-default` @ 0.5px
- Hover: border `str-hover` @ 1px

**Ghost**

- Background: `bg-card`
- Text: `txt-secondary` (default), `txt-main` on hover is allowed
- Border: `str-disabled` @ 0.5px (subtle)
- Hover: border `str-disabled` @ 1px (optional)

**Destructive**

- Background: `bg-destructive`
- Text: `txt-main`
- Border: none (default)
- Hover: border `str-destructive` @ 1px

---

## 7) Modals & overlays

### 7.1 Modal structure (recommended, within existing palette)

To avoid low-contrast combinations:

- **Backdrop / overlay layer:** `bg-modal` (as the dim layer behind the dialog)
- **Dialog surface:** `bg-card`
- **Dialog text:** `txt-main`

### 7.2 When to use `txt-modal`

Use `txt-modal` **only** when the background is sufficiently bright/high-chroma (e.g., destructive/status pills).

Do **not** set `txt-modal` as the default text on `bg-modal` or `bg-card`.

---

## 8) Data visualization system (charts)

### 8.1 Categorical palette (fixed order)

Use these colors **in order** for series/categories. Do not reorder unless you are preserving meaning across screens.

| Token | HEX | Meaning / usage |
| --- | --- | --- |
| chart-1 | #275fc1 | Default / primary series (also brand-primary) |
| chart-2 | #19c2b8 | Secondary series |
| chart-3 | #2aa9e0 | Tertiary series |
| chart-4 | #22A87e | Positive/efficiency series (if semantically meaningful) |
| chart-5 | #7ad74a | Attention/ contrast series, positive |
| chart-6 | #f2c14e | Attention/contrast series, neutral |
| chart-7 | #e45757 | Attention/ contrast series, negative |
| chart-other | #B6c2D1 | “Other” bucket, remainder categories |

**Rules**

- Default line charts: start with `chart-1`.
- Multi-series comparisons: `chart-1` vs `chart-2` is the default pairing.
- If categories exceed 7: show top N, group rest as **Other** (`chart-other`).

### 8.2 Extended chart colors (only when needed)

| Token | HEX | Usage |
| --- | --- | --- |
| chart-9 | #d95ad0 | Extra series |
| chart-10 | #8a5cf6 | Extra series |
| chart-11 | #6b7dff | Extra series |
| chart-12 | #b71c71 | Extra series |

### 8.3 Status colors (for KPI state, thresholds, alerts)

| Token | HEX | Usage |
| --- | --- | --- |
| st-success | #34d399 | Success indicator, positive, efficiency, gains |
| st-warning | #fbbf24 | Warning indicator, close to goal, threshold |
| st-danger | #fb7185 | Danger indicator, negative, losses |

**Status usage rules**

- Prefer using status colors as **small accents** (icons, left border, dot markers), not large filled backgrounds.
- If you must use a filled status pill/background, use `txt-modal` for text on top.

### 8.4 Chart styling (dark dashboard rules)

- Axes/labels: `txt-secondary`
- Gridlines: `str-default` with reduced opacity (implementation-level opacity, no new HEX)
- Data labels: `txt-main` only when essential; otherwise omit to reduce clutter.
- Tooltips:
    - **Tooltip = small contextual popup** shown when hovering/focusing a data point; it shows the exact value(s) and label/date.
    - Tooltip container: `bg-card` with border `str-default`
    - Tooltip text: `txt-main` + `txt-secondary` for labels

---

## 9) Tables, filters, and density

### 9.1 Tables (executive-friendly)

- Use zebra striping if strictly needed for readability; alternate between bg-card and bg-main.
- Header text: `txt-secondary`
- Cell text: `txt-main`
- Row hover: border highlight `str-hover` (avoid background tinting)

### 9.2 Filters

- Filters must be compact and predictable:
    - Date range, unit/site, business line, segment.
- Default filter components must come from shadcn (Select, Popover, Calendar, Command).

---

## 10) shadcn/ui token mapping (implementation guidance)

> shadcn commonly uses CSS variables. Keep the **source palette** exactly as defined above.
> 

Recommended mapping:

- `-background` → `bg-main`
- `-card` → `bg-card`
- `-popover` → `bg-card` (or `bg-modal` only for special overlays)
- `-primary` → `bg-button`
- `-primary-foreground` → `txt-main`
- `-destructive` → `bg-destructive`
- `-destructive-foreground` → `txt-modal` (contrast-safe)
- `-border` → `str-default`
- `-input` → `str-default`
- `-ring` → `str-hover`
- `-foreground` → `txt-main`
- `-muted-foreground` → `txt-muted`

---

## 11) Quality & consistency checklist (use before shipping screens)

- [ ]  No gradients, glows, glass effects, or decorative shadows.
- [ ]  Only approved HEX tokens are used (no new colors).
- [ ]  KPI numbers use Display (30) and tabular numbers.
- [ ]  Borders are consistent: default 0.5px, hover/selected 1px.
- [ ]  No critical information is hover-only (kiosk-safe).
- [ ]  Charts use the palette order; “Other” uses `chart-other`.

---

## 12) Known issues / intentional constraints (do not “fix” by adding colors)

1. `txt-modal` is not suitable as default modal text on dark surfaces; it is reserved for high-chroma/filled backgrounds to preserve contrast.
2. Any alpha/transparency must be applied via opacity utilities, not by inventing new HEX colors.

---

**End of Design System**