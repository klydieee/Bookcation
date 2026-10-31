# 01 · Product Brief

> Source of truth for *what* Bookcation is. Every other file answers *how*.
> Convention used across all files: **P0** = must exist in the first complete build, **P1** = build right after P0 passes the acid test, **P2** = later. Items marked **⚠ confirm** need a business decision before launch; the build must not hard-code a guess without logging it in `DECISIONS.md`.

---

## 1. One-liner

Bookcation is a booking app where flights, restaurant meals, and catering live on one editable trip plan, so you can fork the plan, compare versions, and book it all in one checkout.

## 2. The problem it solves

Trips get planned across separate tools: flights in one, dinner reservations in another, a catering order in a third. Changing one piece (a later flight) silently breaks the others (a dinner booked while you are still in the air). People rebuild the plan by hand, then have no way to compare the old version with the new one.

## 3. The idea (what makes it different)

1. **One canvas.** Flights, meals, and catering are cards on a day-by-day board.
2. **Iteration is a first-class feature.** A plan can be forked into Plan B, edited freely, and compared with Plan A (items added, removed, changed, and the cost and travel-time deltas).
3. **Clash detection.** The canvas flags conflicts (meal during a flight, tight connection, catering lead time missed).
4. **Gate to plate.** After a flight lands, food suggestions respect arrival time and opening hours (P1).

## 4. Scope boundary (front-end only)

This build is the **entire front-end**. There is no backend, no real inventory, no real payments.

| Concern | In this build | Later (backend) |
|---|---|---|
| UI, routing, state, animations | Real, complete | none |
| Flight / restaurant / catering data | Deterministic **mock data** behind an API interface | Real providers swap in via `HttpAdapter` |
| Auth | Mock guest session (local only) | Real auth provider |
| Payments | **Simulated** checkout, no card data stored or sent | Payment provider (hosted fields) |
| Persistence | IndexedDB on device | Server database |
| Notifications | Simulated (in-app) | Push / email |

**Honesty rule (non-negotiable):** the UI must say it is a demo wherever a user could mistake it for a real booking (see `02_BRAND_AND_COPY.md` §9 and `12_QUALITY_AND_ACID_TEST.md` §J).

## 5. Platforms and delivery targets

| Target | Technology | Deliverable |
|---|---|---|
| Web | Vite SPA on Vercel | URL, installable PWA |
| macOS | Tauri 2 | `.dmg` (universal) |
| Windows | Tauri 2 | `.exe` (NSIS) and `.msi` |
| Linux (bonus) | Tauri 2 | `.AppImage`, `.deb` |
| Android | Capacitor 8 | `.apk` (sideload), `.aab` (Play Store) |
| iOS | Capacitor 8 | Xcode archive → TestFlight / App Store (**not a free-download file**, see `11_PLATFORMS_AND_DEPLOY.md` §6) |

One codebase and one `dist/` build output feed every target.

## 6. Audience (working personas, not research findings)

| Persona | Situation | Needs from Bookcation |
|---|---|---|
| **The solo planner** | Books a 4 to 7 day trip alone, changes dates twice | Fast flight search, price calendar, undo, plan versions |
| **The group organizer** | Plans a team offsite or family reunion | Traveler management, catering quotes by headcount, one total |
| **The food-first traveler** | Chooses the trip around where to eat | Restaurant discovery by cuisine and diet, reservations tied to arrival time |

Plus: **desktop-first** users (planning at a laptop) and **mobile-first** users (checking and tweaking on a phone). Both are first-class; neither is a shrunken version of the other.

## 7. Modules

| Module | Color id | Purpose | Priority |
|---|---|---|---|
| Flights | `flight` | Search, compare, add to plan | P0 |
| Food | `food` | Browse restaurants, reserve, pickup, delivery | P0 |
| Catering | `catering` | Headcount-based quotes | P0 |
| Trips | `trip` | Canvas, plan versions, compare | P0 |
| Bookings | n/a | Wallet of confirmed items | P0 |
| Stays, Activities, Car hire | reserved | Extension slots | P2 |

The code must use a **module registry** (see `05_ARCHITECTURE.md` §7) so adding Stays later means adding one folder and one registry entry.

## 8. Feature priority

| # | Feature | Priority |
|---|---|---|
| 1 | Marketing home with interactive hero canvas, About, Help, Legal, Download | P0 |
| 2 | Responsive app shell (sidebar / bottom tabs), theme (light, dark, system) | P0 |
| 3 | Flights: search (one-way, round trip), filters, sort, detail sheet, add to plan | P0 |
| 4 | Food: browse, restaurant page, menu, cart (delivery, pickup), table reservation | P0 |
| 5 | Catering: builder, quotes comparison, add to plan | P0 |
| 6 | Trips: list, create, Trip Canvas, drag between days, budget bar | P0 |
| 7 | Plan versions: fork, switch, compare, promote | P0 |
| 8 | Conflict detection on the canvas | P0 |
| 9 | Checkout (simulated) and Bookings wallet with ticket-style cards | P0 |
| 10 | Settings: currency, units, theme, reset demo data, failure simulation | P0 |
| 11 | i18n scaffolding (English only), all strings via `t()` | P0 |
| 12 | PWA, Tauri, Capacitor, Vercel, CI release workflow | P0 |
| 13 | Command palette (⌘K / Ctrl+K), keyboard shortcuts | P1 |
| 14 | Price calendar and flexible dates | P1 |
| 15 | Arrival-aware dining suggestions | P1 |
| 16 | Undo / redo in the canvas | P1 |
| 17 | Export: copy summary, JSON, calendar `.ics` | P1 |
| 18 | Map views (restaurants, flight route) | P1 |
| 19 | Saved items, simulated price-watch notifications | P1 |
| 20 | Checkout price re-check dialog | P1 |
| 21 | Native polish: macOS overlay title bar, haptics, first-run onboarding | P1 |
| 22 | Static meta prerender for marketing routes | P1 |
| 23 | Multi-city flights, Stays module, shareable plan links, live backend adapter, Storybook | P2 |

## 9. Glossary (use these exact words in code and UI)

| Term | Meaning |
|---|---|
| **Trip** | A named container with dates, travelers, and one or more plans |
| **Plan** | One version of a trip's contents (Plan A, Plan B). Has an `isActive` flag per trip |
| **Fork** | Copy a plan into a new plan to edit independently |
| **Item** | A flight, meal, catering order, or note placed on a day of a plan |
| **Canvas** | The day-by-day board where a plan is edited |
| **Tray** | The persistent panel/sheet that shows the active plan summary while searching |
| **Ticket** | The shared card anatomy for anything bookable and priced |
| **Booking** | A confirmed (simulated) purchase created at checkout |
| **Demo mode** | Always on in this build: sample data, simulated bookings |

## 10. Primary user journeys (each becomes an E2E test)

1. **Plan and book a simple trip.** Home → Start a trip → create trip (Lisbon, 5 days) → search flights → add outbound and return → add a dinner reservation → open canvas → Review and book → checkout → booking appears in Bookings.
2. **Iterate.** In a drafted trip, fork Plan A → in Plan B swap the flight for a cheaper one and move dinner → Compare → see deltas → "Make this the plan" → book.
3. **Resolve a clash.** Drag a dinner onto the time a flight is in the air → conflict banner appears with a fix suggestion → apply fix → banner clears.
4. **Group catering.** Open Catering → 40 guests, dietary needs, date → compare 3 or more quotes → add the chosen one to the plan → total updates.
5. **Install it.** Visit Download → OS auto-detected → primary button points to the right artifact → PWA install works where supported.

## 11. Success criteria for the front-end build

- All P0 features work end to end on web, desktop shell, and mobile shell, with mock data.
- `pnpm verify` passes (types, lint, unit, assets check, copy check, build, e2e smoke).
- Lighthouse on the marketing home: Performance, Accessibility, Best Practices, SEO each ≥ 95 (mobile profile).
- Zero critical or serious axe violations on every route.
- A fresh clone builds the web app, the Tauri app, and the Android debug APK without manual edits other than secrets.

## 12. Open questions and assumptions (**⚠ confirm**)

| # | Item | Working assumption |
|---|---|---|
| 1 | Domain | `bookcation.app` placeholder; availability not checked |
| 2 | Bundle / app id | `com.bookcation.app` placeholder |
| 3 | Legal entity, terms, privacy | Placeholder pages marked **not legal advice** |
| 4 | Default currency and locale | USD, `en-US`; user can change currency in Settings |
| 5 | Pricing / fees to users | No pricing page; do not claim "free" until confirmed |
| 6 | Real data providers | Undecided; the API contract in `09_DATA_AND_API.md` is provider-neutral |
| 7 | Store listings (App Store, Play) | Out of scope for the build; copy and size specs provided |
| 8 | Airline and restaurant names | All fictional; run a trademark check before launch |
