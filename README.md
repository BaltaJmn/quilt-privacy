# quilt-privacy

The public web of **Quilt**, an annual habit tracker for Android and iOS. Served at
<https://quilt.baltajmn.dev/> by GitHub Pages from `main`, behind Cloudflare.

| Path | What it is |
|---|---|
| `index.html` | Privacy policy, English and Spanish. The URL in the app, Play and the App Store |
| `terms.html`, `delete.html` | Terms of use, and how to delete the account used to share a habit |
| `legal.html` | Legal notice (LSSI art. 10), English and Spanish, linked from every page's footer. Same owner details and single email (baltajmn@gmail.com) as the FlowTime web, 4-11-2026 |
| `app-ads.txt` | One line: the AdMob publisher (`pub-1605179202100483`, the same as FlowTime) so ad buyers can verify the app. `robots.txt` allows everything, so it is not blocked |
| `habit-tracker/`, `es/habit-tracker-para-imprimir/`, `pt/planilha-de-habitos/` | Habit tracker 2027 printables: year at a glance (5 or 6 habits, a 53 x 7 grid each), month by month (12 landscape pages) and one habit all year; A4 and Letter, previewed with notes on the sheet |
| `online-habit-tracker/`, `es/habit-tracker-online/`, `pt/habit-tracker-online/` | Online tracker: a row per habit, a square per day (tap for done, again for skipped), month and year views, PNG export, saved in the browser |
| `alternatives/`, `es/alternativas/` | Index of the comparisons: Quilt, Habitica, Streaks, Loop and HabitKit in one table |
| `habitica-alternative/`, `streaks-alternative/`, `loop-habit-tracker-alternative/`, `habitkit-alternative/` and their `es/alternativa-a-*` pages | One comparison per app, with sources and the date they were checked |
| `qt/` | Shared CSS, `maker.js`, Caprasimo (latin subset woff2 from Google Fonts, OFL; copyright and licence in `qt/OFL.txt`), the sheets (`sheets/*.svg` for the web, `*.png` A4 at 150 dpi), the PDFs (`pdf/`), app screenshots, OG cards, icon |
| `sitemap.xml`, `robots.txt` | For Google; the sitemap lists the pages with their language alternates |
| `tools/` | `sheets.mjs` draws the sheets and PDFs, `build.mjs` the pages, sitemap and robots, `compare.mjs` holds the comparison texts and sources, `og.mjs` the OG cards, `check.mjs` checks them. `fonts/Roboto.ttf` (OFL) is the font of the PDFs |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Product and design context of the web: the patchwork world, its tokens and rules |

## Web pages (from 26-10-2026)

Search pages that bring people to the app before its peak (late December and January), part of the
growth plan (`plan-apps/0-plan.md`). Printables in en, es and pt ("planilha de hábitos" has search
volume in Brazil); comparisons in en and es only (no "alternativa ao" demand in Portuguese).

- **Edit texts in `tools/build.mjs`, `tools/compare.mjs` or `tools/sheets.mjs`**, never in the
  generated files, then:

  ```bash
  node tools/sheets.mjs && node tools/build.mjs && node tools/og.mjs && node tools/check.mjs . https://quilt.baltajmn.dev
  ```

  `sheets.mjs` and `og.mjs` need Google Chrome installed (headless): the PDFs are printed by Chrome so
  they stay vector with Roboto embedded. `node tools/sheets.mjs --svg` redraws only the web previews.
  Commit the generated files with the change.
- **Next year:** change `YEAR` in `tools/sheets.mjs` and run the line above. A4 starts the week on
  Monday in en and es; Letter and pt (Brazil) start on Sunday.
- **Comparisons:** every fact about another app comes from its store pages, site, help pages or source
  on `CHECKED` (in `compare.mjs`), with the sources listed on each page. Before changing a line about
  another app, check it again and move `CHECKED`. HabitKit prices are never printed (the store shows
  them per country). Each page says where the other app is the better pick and that Quilt is not
  affiliated with it.
- **The online tracker** keeps everything in `localStorage` (`quilt-tracker-v1`); nothing is uploaded.
- **Store links** carry a campaign so web installs show in the consoles, since the app has no
  analytics of its own: Play `referrer=utm_source=quilt.baltajmn.dev&utm_medium=web&utm_campaign=qt-<page>-<lang>`
  and App Store `pt=129564006&ct=qt-<page>-<lang>`. A visitor who arrives with `utm_*` takes that
  origin to the store instead. Android sees only Play, iPhone only the App Store.
- **The web sets no cookies and has no analytics or advertising scripts.** The app is different since the
  free version shows a Google AdMob banner (4-11-2026): the policy says so and `index.html` is the page to
  keep true.
- CSS and JS URLs carry `?v=<hash>` so a change reaches visitors past the Cloudflare cache.

## Keeping it true

The policy is written against what the app actually does, not from a template.
It states that habits stay on the device, that an account exists only to share a
habit, that the free version shows one Google AdMob banner (Pro removes it) and
what Google's ads software receives, and that the rest of what leaves the device is
the anonymous purchase state held by RevenueCat.

Adding an analytics SDK, a second ad network or an interstitial, calling
`Purchases.logIn()`, or requesting a new permission makes this document false. Any
of those means editing this page (and the permissions table, which follows the merged
manifest) and redoing the Data Safety form in Play Console and the App Privacy answers
in App Store Connect.

No page of this web may say that Quilt has no ads: the free version has a banner. The
comparison texts in `compare.mjs` share one description of what Quilt sends
(`QUILT_DATA`).

The source of truth of the policy lives with the app, in `store/privacy/index.html`. Edit it
there, then copy it here; otherwise the two drift and the published one wins.

Nothing private is published here: no source, no keys, no user data.
