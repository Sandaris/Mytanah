---
name: html-to-pdf-best-practices
description: Use when generating the fraud-risk research report PDF. Defines print-safe CSS rules, design system tokens, component patterns, and page-break controls matched to the dashboard's visual language.
version: 2.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [pdf, html-to-pdf, print-design, css, playwright, fraud-report]
    related_skills: [writing-plans]
---

# HTML-to-PDF: Fraud Report Generation

## Design System Tokens

Match the live dashboard exactly. Use these values — do not invent new colors or fonts.

### Colors
```css
:root {
  --cream:      #DCD7C9;   /* page background */
  --raised:     #EDE9E1;   /* card background */
  --border:     #C8C3B8;   /* card borders, dividers */
  --muted:      #B0AA9E;   /* de-emphasised text, metadata */
  --deep:       #2C3930;   /* primary text, headings */
  --mid:        #3F4F44;   /* secondary text */
  --light:      #5C7065;   /* tertiary text */
  --earth:      #A27B5C;   /* eyebrow labels, accents */
  --earth-light:#C49A7A;   /* hover states (not used in PDF) */

  /* Verdict / risk tiers */
  --up:         #2D7A4F;   /* Green — low risk / Proceed */
  --stable:     #8B6914;   /* Amber — escalate with note */
  --down:       #A63228;   /* Red — escalate immediately */
}
```

### Typography
Load from Google Fonts in the `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Role | Font | Usage |
|---|---|---|
| Display / section headings | Cormorant Garamond, serif | Report title, section titles |
| Body / UI labels | DM Sans, sans-serif | Body copy, eyebrow labels, metadata |
| Numbers / data | JetBrains Mono, monospace | Prices, PSF, percentages, dates |

---

## Core Print-Safe CSS Reset

Inject this into every generated HTML template:

```css
@page {
  size: A4;
  margin: 40px 44px;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--cream);
  color: var(--deep);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  line-height: 1.55;

  /* CRITICAL: forces backgrounds, colors, and borders to print */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* --- Page break controls --- */
.page-break { page-break-before: always; break-before: always; }

.report-section, .card, .metric-row, tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

h1, h2, h3, .eyebrow {
  page-break-after: avoid;
  break-after: avoid;
}
```

---

## Component Patterns

### Eyebrow label
```html
<div class="eyebrow">Area &amp; Scheme Reputation</div>
```
```css
.eyebrow {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--earth);
  margin-bottom: 6px;
}
```

### Card
```html
<div class="card">...</div>
```
```css
.card {
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 14px;
}

.card--accent-green  { border-top: 3px solid var(--up); }
.card--accent-amber  { border-top: 3px solid var(--stable); }
.card--accent-red    { border-top: 3px solid var(--down); }
```

### Mono number
```html
<span class="mono">RM 720,000</span>
```
```css
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-feature-settings: 'tnum';
  font-size: 15px;
  font-weight: 500;
  color: var(--deep);
}
.mono--lg  { font-size: 22px; }
.mono--sm  { font-size: 11px; }
.mono--up  { color: var(--up); }
.mono--amber { color: var(--stable); }
.mono--down { color: var(--down); }
.mono--muted { color: var(--muted); }
```

### Display heading
```html
<span class="display">Fraud Risk Report</span>
```
```css
.display {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--deep);
}
.display--sm { font-size: 20px; }
```

### Verdict badge (risk tier)
```html
<div class="verdict-badge verdict-badge--red">RED · Escalate immediately</div>
```
```css
.verdict-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.verdict-badge--green  { background: var(--up);     color: #fff; }
.verdict-badge--amber  { background: var(--stable); color: #fff; }
.verdict-badge--red    { background: var(--down);   color: #fff; }
```

### Divider
```css
.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 14px 0;
}
```

---

## Cover Page

The cover page is a full A4 page with a **split layout**: dark upper half (`var(--deep)`) for the title block, light lower half (`var(--cream)`) for the meta summary. A verdict badge sits at the boundary between the two halves.

```html
<div class="cover">
  <div class="cover-bg-block"></div>   <!-- dark upper fill -->
  <div class="cover-accent-bar"></div> <!-- earth-colour left edge bar -->

  <div class="cover-body">
    <!-- DARK HALF -->
    <div class="cover-top">
      <div class="cover-logo-row">
        <div class="cover-logo-text">KW Property Valuation</div>
        <div class="cover-ref">Ref: FRR-20260626-TPL</div>
      </div>
      <div class="cover-eyebrow">Property Fraud Risk Report</div>
      <div class="cover-title">Taman Pelangi,<br>Plentong</div>
      <div class="cover-subtitle">Johor Bahru · 2-Storey Terrace · Freehold</div>
    </div>

    <!-- VERDICT STRIP — spans the boundary -->
    <div class="cover-verdict-strip">
      <span class="verdict-badge verdict-badge--red">Red · Escalate Immediately</span>
      <span class="cover-verdict-text">
        Declared price is <strong>32.7%</strong> below comparable transacted range
      </span>
    </div>

    <!-- LIGHT HALF -->
    <div class="cover-bottom">
      <div class="cover-meta-grid">
        <div class="cover-meta-cell">
          <div class="cover-meta-label">Declared Price</div>
          <div class="cover-meta-value">RM 480,000</div>
        </div>
        <!-- repeat for Predicted Range, Price Gap, Scheme, District/Mukim, Comparables Used -->
      </div>
      <div class="cover-footer">
        <div class="cover-footer-left">Generated by KW Property Valuation Platform<br>Confidential</div>
        <div class="cover-footer-right">26 Jun 2026<br>Page 1 of 4</div>
      </div>
    </div>
  </div>
</div>
```

```css
/* Full-page cover — forces its own A4 page */
.cover {
  width: 100%; height: 100vh; min-height: 1050px;
  display: flex; flex-direction: column;
  page-break-after: always; break-after: always;
  position: relative; overflow: hidden;
}

/* Dark upper half background */
.cover-bg-block {
  position: absolute; top: 0; left: 0; right: 0;
  height: 52%;
  background: var(--deep);
}

/* Earth-colour left accent bar */
.cover-accent-bar {
  position: absolute; top: 0; left: 0;
  width: 5px; height: 52%;
  background: var(--earth);
}

.cover-body {
  position: relative; z-index: 1;
  display: flex; flex-direction: column;
  height: 100%; padding: 52px 56px 48px;
}

.cover-top { flex: 1; }

.cover-logo-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 64px;
}
.cover-logo-text {
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.18em; color: var(--muted);
}
.cover-ref {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted);
}

.cover-eyebrow {
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.18em;
  color: var(--earth); margin-bottom: 14px;
}
.cover-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px; font-weight: 500;
  line-height: 1.0; letter-spacing: -0.02em;
  color: var(--cream); margin-bottom: 10px;
}
.cover-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; color: var(--muted); line-height: 1.5;
}

/* Verdict strip: positioned at the dark/light boundary */
.cover-verdict-strip {
  position: absolute;
  top: calc(52% - 26px);
  left: 56px; right: 56px; z-index: 2;
  display: flex; align-items: center; gap: 16px;
}
.cover-verdict-text {
  font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--mid); font-weight: 500;
}

.cover-bottom { padding-top: 80px; }

/* 3-column meta summary grid */
.cover-meta-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--border); border-radius: 12px;
  overflow: hidden; margin-bottom: 32px;
}
.cover-meta-cell {
  padding: 16px 20px; border-right: 1px solid var(--border);
}
.cover-meta-cell:last-child { border-right: none; }
.cover-meta-label {
  font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.14em;
  color: var(--earth); margin-bottom: 5px;
}
.cover-meta-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; font-weight: 500; color: var(--deep);
}

.cover-footer {
  display: flex; justify-content: space-between; align-items: flex-end;
  border-top: 1px solid var(--border); padding-top: 16px;
}
.cover-footer-left {
  font-family: 'DM Sans', sans-serif; font-size: 11px;
  color: var(--muted); line-height: 1.6;
}
.cover-footer-right {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--muted); text-align: right;
}
```

**Key rules for the cover:**
- `page-break-after: always` on `.cover` forces it onto its own A4 page — the report body starts fresh on page 2.
- `min-height: 1050px` + `height: 100vh` ensures it fills the full A4 height even if font rendering varies.
- The `.cover-accent-bar` (5px earth-colour strip) is the same visual motif as `Card borderTop` — consistent with the design system.
- Do NOT use `position: fixed` for the background block — use `position: absolute` within a `position: relative` container, or it will leak across pages.

---

## Report Section Layout

The fraud report has 6 sections. Render each as a `.report-section` block.
Use CSS Grid for two-column metric rows (Playwright on Chromium handles Grid correctly).

```css
.report-section {
  margin-bottom: 20px;
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Two-column metric grid — safe in Playwright/Chromium */
.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.metric-grid--3col {
  grid-template-columns: repeat(3, 1fr);
}

.metric-card {
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  page-break-inside: avoid;
  break-inside: avoid;
}
```

### Section order and heading sizes

| # | Section | heading |
|---|---|---|
| 1 | Verdict Header | `display` (28px serif) + verdict badge |
| 2 | Price Gap Summary | `display--sm` + metric-grid 3-col |
| 3 | Historical Transacted Price & PSF | `display--sm` + table |
| 4 | Household Income Context | `display--sm` + metric-grid 2-col |
| 5 | Synthesis & Recommendation | `display--sm` + body copy |
| 6 | Sources | `eyebrow` + numbered list |

---

## Table Styling (Section 3 — Transacted Comparables)

```html
<table class="comps-table">
  <thead>
    <tr>
      <th>Year</th><th>Area</th><th>Price (RM)</th><th>PSF (RM)</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>2024</td><td>Taman Pelangi</td><td class="mono">720,000</td><td class="mono">388</td><td>2-sty Terrace</td></tr>
  </tbody>
</table>
```

```css
.comps-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-top: 10px;
}

.comps-table thead tr {
  background: var(--deep);
  color: var(--cream);
}

.comps-table thead th {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 8px 10px;
  text-align: left;
}

.comps-table tbody tr {
  border-bottom: 1px solid var(--border);
  page-break-inside: avoid;
  break-inside: avoid;
}

.comps-table tbody tr:nth-child(even) {
  background: var(--raised);
}

.comps-table tbody td {
  padding: 8px 10px;
  color: var(--mid);
}

/* thead repeats on subsequent pages automatically */
```

---

## Essential Rules

### 1. Always enable background printing in the runner script
```python
# Playwright (Python)
await page.pdf(
    path="report.pdf",
    format="A4",
    print_background=True,   # REQUIRED — without this all colors vanish
    margin={"top": "40px", "bottom": "40px", "left": "44px", "right": "44px"},
)
```

### 2. Wait for fonts before printing
```python
await page.goto(url, wait_until="networkidle")
# or wait for a known font-rendered element:
await page.wait_for_selector(".display")
```

### 3. CSS Grid is safe in Playwright
Playwright uses Chromium, which fully supports CSS Grid and Flexbox in print
context. The `display: table` hack is only needed for WeasyPrint or very old
engines — do not use it here, it produces inferior layouts.

### 4. Avoid pseudo-element height traps
Do not use `::before` or `::after` with `height: 100%` (e.g. vertical timeline
bars). They cause infinite height loops that break page boundaries. Use a
bordered `div` instead.

### 5. Explicit dimensions on any inline SVG charts
```html
<svg width="520" height="160" viewBox="0 0 520 160">...</svg>
```
Without explicit `width`/`height`, the PDF engine may render SVGs as zero-size.

### 6. Page density
If the last page is sparse (<25% full), tighten body `font-size` to `12px` and
card `padding` to `14px 16px` to reflow content onto fewer pages.

---

## Verification Checklist
- [ ] `print-color-adjust: exact` on `body`
- [ ] `print_background=True` in Playwright runner
- [ ] Google Fonts loaded and `networkidle` awaited before `.pdf()` call
- [ ] All colors use `var(--*)` tokens from this skill, not hardcoded hex
- [ ] `page-break-inside: avoid` on `.card`, `.report-section`, `tr`
- [ ] `page-break-after: avoid` on all headings and `.eyebrow`
- [ ] Verdict badge uses `.verdict-badge--green/amber/red` class
- [ ] Section 3 table has `<thead>`/`<tbody>` for header repetition across pages
- [ ] All SVG/chart elements have explicit `width` and `height`
