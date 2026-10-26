# Product

<!-- impeccable:product-schema 1 -->

Inferred on 26-10-2026 from the brief of the growth plan (`plan-apps/0-plan.md`) and the app repository
(`BaltaJmn/quilt`: `SPEC.md`, `store/listings/`, `ui/theme/Theme.kt`). No interview round was held because
the owner runs this work from another session, as with the FlowTime and Chroma webs. Facts marked
(inferred) are not confirmed.

## Platform

web

## Users

- People who search in December and January for a printable habit tracker for the new year (2027), in
  English and Spanish, and print it at home (A4 in Spain and the UK, US Letter in the Americas). (inferred
  from search suggestions)
- People who look for an alternative to the habit app they use (Habitica, Loop, Streaks and others) because
  of price, ads, accounts, platform or too much gamification.
- On a phone, a visitor who may install Quilt to keep the same year grid with a widget.

## Product Purpose

The web of Quilt (`quilt.baltajmn.dev`): privacy policy and terms (the URLs in the app and both stores), and
from October 2026 free printables, an online habit tracker maker and honest comparison pages that bring
search traffic to the app. Success is installs from Google Play and the App Store with the web campaign
token.

## Positioning

Quilt shows each habit as its whole year, 365 squares at once, so you see the month you slipped and the
weeks you did not. Skipped days (ill, away, rest) do not break the streak. No account, no ads, no analytics;
the free version has three habits, every widget and the full export.

## Operating Context

- Printables: printed once in late December or January, ticked by hand each evening for a month or a year.
- Maker: opened on a laptop or phone, a few taps a day; it must keep state in the browser only.
- Comparison pages: read once, carefully, by someone deciding whether to switch apps.

## Capabilities and Constraints

- Static files on GitHub Pages (`BaltaJmn/quilt-privacy`, branch `main`) behind Cloudflare. No server code,
  no cookies, no analytics or third party scripts.
- The app: Play `com.baltajmn.habit`, App Store id 6819302953. Free: 3 habits; Pro: unlimited habits and the
  full color palette, $1.99 once or $0.99 a month (US App Store, 26-10-2026; 1,99 EUR and 0,99 EUR in Spain).
- `index.html` (privacy, en and es) and `terms.html` must keep their URLs.
- Languages: en and es at least; pt decided by search data.

## Brand Commitments

- Store title "Quilt: Habit Tracker & Streaks". The year grid of each habit, one square per day, is the
  product's signature ("every day is a patch; by the end of the year you have the whole quilt").
- App palette (`Theme.kt`): warm cream `#FBF8F3` light and `#17150F` dark, never pure white or black; sage
  `#6FAE9B`; eight muted pastels for habits (rose `#F0AFBE`, peach `#F5C39B`, butter `#EDDC98`, sage
  `#B6D6AB`, mint `#9CD3C7`, sky `#A2C3E9`, periwinkle `#B4B8EC`, lilac `#D9AFE6`); dark ink `#2E2A24` on
  the pastels. Generous radii, 1px borders instead of shadows.
- No red for missed days: empty squares already say it. No blame, no hype.

## Evidence on Hand

- App screenshots in `HabitTracker/store/screenshots/` (en, es, Play and App Store sets).
- Listed on AlternativeTo since 28-09-2026.
- No testimonials, ratings worth quoting or press. Do not invent any.

## Product Principles

- The printable and the maker are complete on their own; the app is offered for what paper cannot do
  (widget, reminders, the whole year counted for you), never forced.
- Nothing about the user leaves the browser.
- True claims only, about Quilt and about every other app named: checked, dated, with sources.

## Accessibility & Inclusion

Every color carries a text label; tap targets 44px or more; keyboard use of the maker; reduced motion
respected; printables legible in black and white.
