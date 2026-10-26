---
name: Quilt web (printables, online tracker, comparisons)
description: A quilt being pieced; whole regions of the page are pastel cotton patches sewn with a dashed running stitch onto warm cream, and the year grid of each habit is the print on the cloth.
colors:
  cream: "#FBF8F3"
  linen: "#F3ECDF"
  ink: "#2E2A24"
  ink-2: "#5E574B"
  line: "#E3DACB"
  link: "#2F6B5A"
  rose: "#F0AFBE"
  peach: "#F5C39B"
  butter: "#EDDC98"
  sage: "#B6D6AB"
  mint: "#9CD3C7"
  sky: "#A2C3E9"
  peri: "#B4B8EC"
  lilac: "#D9AFE6"
  cream-dark: "#17150F"
  linen-dark: "#211E16"
  ink-dark: "#EDE7DC"
  ink-2-dark: "#B9B0A0"
  line-dark: "#3A342A"
  link-dark: "#9CD3C7"
  rose-dark: "#4E2F37"
  peach-dark: "#4F3A29"
  butter-dark: "#48411F"
  sage-dark: "#33432F"
  mint-dark: "#22413B"
  sky-dark: "#283A50"
  peri-dark: "#32365C"
  lilac-dark: "#45304F"
typography:
  numeral:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(104px, 13vw, 176px)"
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(36px, 4vw, 50px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "0"
  headline:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(28px, 3.2vw, 38px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "0"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  day: "6px"
  sm: "10px"
  button: "14px"
  patch: "22px"
  phone: "26px"
  paper: "3px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "24px"
  xl: "44px"
  band: "88px"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0 22px"
    height: "50px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.button}"
    padding: "0 28px"
    height: "56px"
  option:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "11px"
    padding: "0 16px"
    height: "42px"
  option-checked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  patch:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.patch}"
    padding: "40px 44px"
  day:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.day}"
    height: "34px"
  woven-label:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink-2}"
    rounded: "4px"
    padding: "7px 11px"
---

# Design System: Quilt web (printables, online tracker, comparisons)

Scope: `habit-tracker/`, `online-habit-tracker/`, `alternatives/` and the per-app comparison pages, with their `es/` and `pt/` twins. Source of truth: `qt/qt.css`, `qt/maker.js`, `tools/build.mjs`, `tools/sheets.mjs`, `tools/og.mjs`. The policy page `index.html` and `terms.html` at the repo root are older and not part of this design system.

## Overview

**Creative North Star: "The Quilt Being Pieced"**

Every region is a cotton patch sewn to the next with a visible dashed running stitch, on the app's warm cream backing. The eight pastels of the app own whole regions of the page; the year grids are the print on those patches. Light is cream and linen; dark keeps the same eight cottons as deep dyed versions, never black or white. Display type is Caprasimo (soft, chunky, quilt-shop lettering); body is the system sans. The brief refused the washi-tape printable-site look and the split SaaS hero.

Three surfaces share the system. Printables (Persuade): one block, butter controls patch beside a bare linen sheet patch, a mint strip under both. Online tracker (Operate): one peri board patch holding the month and year views. Comparisons (Read): butter lede patch beside a linen sample year, then a linen table, sage "ours" column and dashed seams.

**Key Characteristics:**
- Whole-region cotton fields, one per patch; patches sewn into a block share straight edges and only the block's outer corners round (22px).
- The stitch (dashed ink at 40%) is the only seam device: inset 9px inside every patch, between steps and columns, under the footer, around the segmented control.
- One filled control per view (Download PDF, the active view tab); everything else is outlined with ink 1.5px.
- Flat everywhere except objects that stand for physical things (the paper sheet, the phone crop) and the edit popover.
- Warm ink `#2E2A24` on every pastel in both themes; threads (habit colors) are pastel in both themes so ink on them never changes.

## Colors

Frontmatter is normative. `-dark` entries apply under `prefers-color-scheme: dark`; the build has no manual theme switch.

### Backing and ink
- **Cream** (cream): page ground and the fill of empty squares, mixed down to 72% (52% on weekends). Dark `#17150F`.
- **Linen** (linen): default patch, sheet patch, comparison table field, input fields.
- **Ink** (ink): text, focus ring, today ring, filled buttons, stitch (at 40%). Dark `#EDE7DC`.
- **Ink 2** (ink-2): secondary text, notes, table headers. On a patch, secondary text is instead ink mixed 86% toward that patch's thread (`--tc`) so it leans toward the cotton, never toward grey.
- **Line** (line): hairline for inputs, label chips, dashed table and FAQ rules.
- **Link** (link): `#2F6B5A` deep sage, dashed underline on hover; `#9CD3C7` in dark.

### Cottons (the app's eight pastels, region fills)
Rose `#F0AFBE`, Peach `#F5C39B`, Butter `#EDDC98`, Sage `#B6D6AB`, Mint `#9CD3C7`, Sky `#A2C3E9`, Periwinkle `#B4B8EC`, Lilac `#D9AFE6`. In dark each becomes a deep dye (`#4E2F37`, `#4F3A29`, `#48411F`, `#33432F`, `#22413B`, `#283A50`, `#32365C`, `#45304F`). Region assignment as built: hero controls butter, sheet bare linen, strip mint; "why" patch peri; app patch sage; ideas patchwork rose, peach, sky, lilac, butter, mint; tracker board peri; comparison hero butter and linen; fit pair sage and linen; the sage tint (38%) marks "ours" columns.

### Threads (not tokens)
A habit's own color on a day square is `--t`, set per habit from the same eight pastels (build palette order: rose, sky, mint, lilac in the sample rows and OG cards). Threads stay pastel in dark so the dark ink stitch on them never changes.

### Printable ink
Sheets use ink `#2E2A24`, muted `#6F695E`, line `#B9B1A4`, faint `#DDD6CA`, shade `#F3EFE8`; legible in black and white.

### Named Rules
**The Cotton Owns the Region Rule.** A pastel fills a whole patch or a swatch; it is never a text color, border or tint on a white card.
**The Warm Ink Rule.** Text on every cotton, in both themes, is warm ink; no pure black, no pure white, no cool grey.
**The Never Red Rule.** An empty square is the whole statement of a missed day; no red, no warning color, anywhere.

## Typography

**Display:** Caprasimo (latin subset, one weight, `font-display: swap`), fallback Georgia. Used for H1, H2, the brand, the giant year, step numbers, idea titles, the tracker's month output and the year on printed sheets.
**Body and UI:** system stack `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif`.
**Print and OG:** `tools/fonts/Roboto.ttf` for PDFs and OG cards; Caprasimo embedded as data URI for the year and month heads.

### Hierarchy
- **Numeral** (Caprasimo, clamp(104px, 13vw, 176px), line 0.82, 112px on phones): the year in the printables H1.
- **Display** (Caprasimo 400, clamp(36px, 4vw, 50px), 1.08): printables H1; comparison H1 clamp(34px, 4.2vw, 54px); tracker H1 clamp(30px, 3.4vw, 42px).
- **Headline** (Caprasimo 400, clamp(28px, 3.2vw, 38px), 1.08): band H2; pair H2 clamp(28px, 2.7vw, 36px); fit H2 26px.
- **Title** (system 600, 18px): H3. Idea titles are Caprasimo 24px; step numbers Caprasimo 44px.
- **Body** (system 400, 17px, 1.6; 16px under 640px): paragraphs capped at 68ch; lede 18.5px capped at 58ch.
- **Label** (system 600, 15px): nav, options, buttons (16 to 17px), table headers 14px, legends 700 14px, notes 14px.

### Named Rules
**The One Soft Face Rule.** Caprasimo only at weight 400 and only for headings, numerals and the brand; every label, button and sentence stays in the system sans.

## Layout

Wrapper max 1180px, 24px side padding (16px under 640px). Header min-height 76px, brand left, nav and EN/ES/PT right; under 640px the nav drops to a scrolling full-width row.

Printables hero: grid 5fr / 6fr, no gap, sheet patch padding 48px, strip 18px 44px. Pairs 1fr / 1fr with 48px padding; comparison hero 6fr / 5fr; at 960px every block stacks and the first and last patches take the outer corners. Bands are spaced 88px (64px on phones) with no divider; the footer sits 104px below with a dashed stitch rule.

Ideas patchwork is a 6-column grid with spans 3, 3, 2, 2, 2, 6 and no gap. Steps (4 columns, 2 at 960px, 1 at 640px) and "better" lists (3 columns) are separated by dashed stitch seams, not cards.

Tracker month grid: a habit-name column (120 to 160px), one column per day, a 52px totals column, 4px gap, square cells. Under 760px the same cells rotate: days down, habits across, add button becomes a column. Year view: per habit, 53 week columns by 7 day rows, 2px gap.

Spacing rhythm in use: 4, 6, 8, 10, 12, 14, 18, 22, 28, 40, 44, 48, 88, 104.

## Elevation & Depth

Flat and tonal; the patch color is the depth. A `--stitch` dashed line 9px inside each patch gives the sewn-on edge. Shadows exist only for physical or lifted objects: the paper sheet (`0 1px 2px rgb(46 42 36 / .08), 0 22px 44px -20px rgb(46 42 36 / .45)`), the edit popover (`0 2px 6px rgb(0 0 0 / .1), 0 24px 60px -18px rgb(0 0 0 / .45)`), and the numbered pin on the paper (white 3px ring plus a soft drop). Buttons, patches and rows never cast.

### Named Rules
**The Stitch Is the Seam Rule.** Division between regions is a dashed stitch or a change of cotton, never a solid hairline box or a shadow.

## Shapes

Patch and block 22px; phone crop 26px top only with a 6px ink bezel; buttons 14px; options 11px; nav links and add row 10px; day squares 6px (5px mini, 2.5px year, 1.5px sample); habit chips 4 to 9px; label chip 4px; paper corner 3px; pins and step counters full circles. Focus is a 2.5px ink outline, 3px offset, on every interactive element.

## Components

### Buttons
- 50px high, 14px radius, 1.5px ink border, transparent, 600 16px. Hover mixes ink 8% in; active nudges 1px down.
- **Primary:** ink fill, cream text, 56px and 17px in the download row, one per view. Hover mixes ink 86% with the patch cotton.
- **Icon button:** 44px, 12px radius, 22px inline SVG.
- **Edit popover danger:** text-only underlined ink-2.
- Transitions 250ms `cubic-bezier(.16, 1, .3, 1)`.

### Options and view tabs
- Radio-backed option: 42px, 11px radius, dashed 1.5px ink border at 45%, checked becomes solid ink fill with cream text. View tabs sit in a dashed 14px frame, pressed tab is ink fill.

### Patch (signature)
- Cotton field, 22px radius, 40px 44px padding (32px 24px on phones), dashed 1.5px stitch inset 9px (7px on phones) with 14px radius.

### Day square and the sewing interaction (signature)
- Cream-mixed square, 6px radius, aspect 1 (34px tall rows on phones). Weekends lighter, future days 55% opacity, today a 2px ink ring with 1px offset. Dark mode fills empty squares with ink at 13% (9% weekends) so the control stays findable on dyed cottons.
- Tap cycles: done, skipped, empty. Done fills the habit thread then draws an inset dashed stitch; skipped is a 7px ink dot; empty returns to cream. State lives in `localStorage` only.
- The sew: the fill lands (scale from .35, 320ms), then the stitch outline draws by clip-path (420ms, 120ms delay). Off under reduced motion.
- Every square carries a text label (habit, date, state) for assistive tech.

### Woven label
- 12.5px 600 chip, 4px radius, cream fill, 1px line border, tabular figures. Small meta text only.

### Printable sheet and pins
- White paper at true ratio, 3px corner, paper shadow, width min(100%, 470px) (620px wide variant). Numbered pins (26px, ink dot, 3px white ring) mark the three things on the sheet; the strip below repeats them as 24px counters.

### Mini month and year grids
- Mini month: up to 14 day columns of 22px squares, 4px gap, a dashed stitch inset on done squares, today ringed. Year grid per habit: 53 x 7 squares, month names as buttons that jump to the month.

### Comparison table
- Linen field, 22px radius, dashed 1.5px row rules, fixed layout; "ours" column tinted sage 38%. Under 720px each row becomes a stack with the app name from `data-app` as a 92px label column.

### Navigation and FAQ
- 15px 600 links, 8px 12px padding; current page shows a dashed underline offset 8px. FAQ is native `details` with a chevron drawn from borders, rotating 180 degrees over 300ms.

## Do's and Don'ts

### Do:
- **Do** let a cotton own a whole region and put ink text on it; keep secondary text leaning toward that cotton's thread.
- **Do** draw seams as dashed running stitch (`--stitch`) or change the cotton.
- **Do** keep empty squares readable in dark by mixing ink into them.
- **Do** keep tap targets at 44px or more and keep every color paired with a text label.
- **Do** keep year numerals and display headings in Caprasimo and everything else in the system sans.
- **Do** respect `prefers-reduced-motion` and `prefers-color-scheme`; keep state in the browser only.

### Don't:
- **Don't** use pure white or pure black for a page or a patch; the paper sheet and the pin ring are the only whites.
- **Don't** use red or any warning color for a missed day.
- **Don't** put kickers or eyebrows above headings; the build has none.
- **Don't** stack equal white cards in a row; patches differ in span and cotton.
- **Don't** add shadows to buttons, patches, rows or squares.
- **Don't** load third-party scripts or webfonts other than the self-hosted Caprasimo subset.

Fixed on purpose, not defects: the pins and the strip counters sit on the paper sheet or a pastel strip and keep `#2E2A24` with `#FBF8F3` in both themes; `::selection` is butter with warm ink in both themes; `--tc` is the thread color, pastel in both themes, so secondary text on a patch leans toward its cotton. Still open: grid labels at 10 to 13px (month names, day heads, mini day numbers) stay small to line up with the day cell; the Caprasimo titles on the dark patches have not been contrast-measured.

## Raster and font provenance

- `qt/caprasimo.woff2`: Caprasimo, latin subset from Google Fonts (OFL).
- `tools/fonts/Roboto.ttf`: Roboto (OFL), used only for PDFs and OG cards.
- `qt/img/app-*.webp`: cropped from the app's own iPhone store screenshots in the HabitTracker repo.
- `qt/icon.svg`: from `HabitTracker/tools/icon-master.svg` with rounded corners; `qt/icon-180.png` is its raster.
- `qt/og/*.png`: rendered by `tools/og.mjs` with headless Chrome.
- `qt/sheets/*` and `qt/pdf/*`: rendered by `tools/sheets.mjs`.
