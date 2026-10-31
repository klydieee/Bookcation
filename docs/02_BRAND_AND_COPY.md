# 02 · Brand and Copy

> Written under the `ad-creative` rules: exact product name everywhere, specific over vague, no invented stats or testimonials, falsifiable test hypotheses, and no generated-sounding tics. Every string below was length-checked and scanned for banned patterns (see §3).
> App microcopy (buttons, toasts, errors, empty states) lives in `txt/copy_bank.txt` as flat `key = value` lines ready to convert into i18n JSON.

---

## 1. Name

| Rule | Detail |
|---|---|
| Spelling | **Bookcation**, one word, capital B, no hyphen. Never "BookCation", "Book-cation", or a shortened form |
| Origin | *book* (reserve) + *vacation* |
| Pronunciation (for audio) | book-KAY-shun, /bʊkˈkeɪʃən/ |
| Use in sentences | A product name, not a verb. Write "Open Bookcation", not "Bookcation it" |

## 2. Personality and voice

Bookcation sounds like a well-organized friend who travels a lot: calm, specific, lightly funny, never breathless.

| Do | Don't |
|---|---|
| Plain verbs: "Add to plan", "Fork plan" | Vague verbs: "Submit", "Proceed", "Explore now" |
| Sentence case everywhere (buttons, headings, nav) | Title Case Buttons, ALL CAPS labels |
| Second person, short sentences | Corporate "we are pleased to" |
| One idea per sentence; vary sentence length and shape | Ten lines that all open the same way |
| Name the real action and result: "Book trip" | "Get started today" |
| Humor only in marketing and empty states | Jokes in errors, payments, or legal |
| Errors say what happened and how to fix it, with no apology | "Oops!" or "Sorry, something went wrong" |
| One action keeps one name through the whole flow | "Save" button producing an "Updated!" toast |

## 3. Banned patterns (enforced by `scripts/check-copy.mjs`, see `12_QUALITY_AND_ACID_TEST.md`)

Never ship these in any user-facing string:

- **Contrast reveals:** "It's not X, it's Y." "Not because X. Because Y." State Y directly.
- **Negation lists:** "No X, no Y, no Z." One plain absence ("Nothing is charged") is fine.
- **Trailing pile-ons:** a full claim, then a comma and more restating clauses.
- **Self-answered questions and colon reveals:** "The result? Faster." (A question in the reader's own voice is fine: "Where to, and what's for dinner?")
- **Stock phrases:** "Say goodbye to", "X, reimagined", "Unlock the power of", "Take it to the next level", "Here's the thing", "seamless", "effortless", "journey".
- **Em dashes** (and en dashes used as dashes) in headlines, descriptions, buttons, and body copy.
- **CTA slop:** "Get started today", "Join thousands of happy customers".
- **Superlatives without proof:** "best", "leading", "#1", "fastest".
- **Invented numbers, awards, testimonials, press logos, or user counts.** Leave the section out until real data exists.

## 4. Taglines

### Primary lockup tagline

> **Gate to plate.**

Why it works out loud: three one-syllable words, a true rhyme, and it names the two ends of what the app covers (flights and food). Four syllables fit a radio tag, a logo lockup, and a tab title.

### Hero headline (web `h1`)

> **Every trip deserves a second draft.**

This is the differentiator (plan versions) in the traveler's own language.

### Alternates, grouped by angle

| Angle | Tagline | Sound device | Best use |
|---|---|---|---|
| One plan | Planes, plates, and parties. One plan. | Alliteration (P), rule of three | Landing section, social cover |
| Iteration | Draft it. Fork it. Book it. | Parallel triplet, shared "it" ending, chantable | Ads, onboarding, audio |
| Food-forward | Land hungry. | Two words, imperative | Food module header, merch |
| Food-forward | Fly first. Feast next. | Alliteration (F), sequence | Social, push copy |
| Conversational | Where to, and what's for dinner? | Question in the reader's voice | Search empty state, audio |
| Playful | Plan A, Plan B, Plan Bookcation. | Name drop at the end of a count | Social, stickers |
| Confidence | See your total before you book. | Plain promise (ships only if shown in UI) | Checkout, ads |

## 5. Website copy (exact strings)

### 5.1 Global

| Slot | Copy |
|---|---|
| Nav links | Features, Download, Help |
| Nav primary button | Start a trip |
| Nav secondary (desktop only) | Get the app |
| Footer tagline | Gate to plate. |
| Footer note | Sample data. Bookings in this preview are simulated. |

### 5.2 Home

**Hero**

- `h1`: Every trip deserves a second draft.
- Subhead: Bookcation puts your flights, restaurant reservations, and catering on one canvas. Swap a flight, move a dinner, fork the whole plan, and see what changes before you book.
- Primary button: Start a trip
- Secondary button: See how plans work *(scrolls to the Fork section)*
- Caption under the live demo: Sample trip. Prices are illustrative.

**Section: one plan for the whole trip**

- Heading: One plan for the whole trip
- Body: Flights, tables, and catering sit side by side on a day-by-day canvas. Add from search, drag between days, and Bookcation flags anything that clashes, like a dinner booked while you are still in the air.

**Module blurbs** (each is a different shape on the page; see `03_DESIGN_SYSTEM.md` §9)

| Module | Heading | Body |
|---|---|---|
| Flights | Flights | Search by airport, compare fares by stops and time, and check prices across nearby dates. |
| Food | Food | Browse restaurants by cuisine and dietary need. Reserve a table, schedule pickup, or order delivery for the day you land. |
| Catering | Catering | Set a headcount, compare per-person quotes, and add the one that fits your budget. |
| Trips | Trips | Every trip keeps its versions. Open Plan A and Plan B next to each other. |

**Section: draft, fork, compare** *(this is a true sequence, so numbered steps are appropriate)*

- Heading: Draft it. Fork it. Book it.
- Intro: Start with a plan. Fork it to try a cheaper flight or a nicer dinner. Compare the two and keep the one you like.
- Steps:
  1. **Draft.** Add flights, meals, and catering to a plan.
  2. **Fork.** Copy the plan in one click and change what you want.
  3. **Compare.** See what was added, removed, and what the total did.
  4. **Book.** Choose a plan and check out once.

**Section: gate to plate** *(ships only if the P1 arrival-aware suggestions ship)*

- Heading: Land with a table waiting
- Body: Landing at 6:40 pm? Bookcation lists restaurants that are open when you arrive and still taking reservations, so dinner is sorted before baggage claim.

**Section: catering**

- Heading: Catering for two people or two hundred
- Body: Slide the headcount and every quote recalculates per person and in total. Add the one you like to your trip.

**Section: platforms**

- Heading: On every screen you plan from
- Body (demo build): Use Bookcation in your browser, on macOS and Windows, or on iOS and Android. In this preview your plans stay on your device.
- Body (swap in when accounts exist): Sign in once and your plans follow you from browser to phone.
- Button: See downloads

**FAQ** (accordion; `Question` / `Answer`)

| Question | Answer |
|---|---|
| Is this a real booking? | Right now Bookcation is a working preview. Searches use sample data, bookings are simulated, and nothing is charged. |
| Where are my plans stored? | On this device, in your browser or app. You can erase them any time in Settings. |
| What is a plan version? | A copy of your trip that you can change without touching the original. Fork Plan A to make Plan B, then compare them. |
| Can I book for a group? | Add travelers at checkout, and use catering to compare quotes by headcount. |
| Which devices does it run on? | Any current browser, macOS, Windows, Android, and iOS through TestFlight or the App Store. |
| Does it work offline? | You can open and edit saved plans without a connection. |

**Final call to action band** *(centered; the only centered block on the page)*

- Heading: Your next trip starts as a draft.
- Button: Start a trip

### 5.3 About

- `h1`: One plan for the whole trip
- Body: Bookcation is built around one idea: a trip is a draft until you book it. Flights, meals, and catering belong on the same page, and changing one should show you what it does to the rest.

  The app keeps every version of your plan, so trying a different flight or a different dinner costs nothing. You decide when a draft becomes a booking.
- `[FOUNDER_STORY_PLACEHOLDER]` *Leave this slot empty until the real story is provided. Do not invent a founding story, team size, or milestones.*

### 5.4 Download

- `h1`: Bookcation on every screen you use
- Subhead: Download the desktop app, install it on your phone, or keep using the browser.

| Card | Heading | Detail line | Button |
|---|---|---|---|
| macOS | Mac | macOS 13 or later. Apple silicon and Intel. | Download for macOS |
| Windows | Windows | Windows 10 or later. | Download for Windows |
| Linux | Linux | AppImage and .deb. | Download for Linux |
| Android | Android | Direct install file, Google Play link when listed. | Download APK |
| iOS | iPhone and iPad | Join the TestFlight beta, App Store link when listed. | Join TestFlight |
| Web | Browser | Works in any current browser and installs as an app. | Open Bookcation |

Install help (show only for the matching OS; show the unsigned-app lines **only until signing is configured**):

| OS | Text |
|---|---|
| macOS | Open the .dmg and drag Bookcation to Applications. If macOS blocks the first launch, right-click the app and choose Open. |
| Windows | Run the installer. If SmartScreen appears, select More info, then Run anyway. |
| Android | Allow installs from your browser when Android asks, then open the file. |
| iOS | Open the TestFlight link on your iPhone or iPad and tap Install. |
| Web install | In Chrome or Edge, choose Install in the address bar. On iPhone, tap Share, then Add to Home Screen. |

### 5.5 Help

- `h1`: Help
- Sections: Plans and versions, Flights, Food and catering, Bookings, Demo mode
- Every answer is 2 to 4 sentences, sentence case question as the heading. Reuse the FAQ above, then add:
  - **How do I compare two plans?** Open a trip, choose Compare plans, and pick two versions. Added, removed, and changed items are highlighted, with the cost and travel-time difference at the top.
  - **What does a clash warning mean?** Two items overlap or cannot fit, such as a dinner during a flight. Select the warning to see the suggested fix.
  - **How do I erase everything?** Go to Settings, then Data, then Reset demo data.

### 5.6 Legal pages

Placeholders titled "Terms of Use" and "Privacy Policy" with a visible banner: *These pages are placeholders and are not legal advice. Replace them with reviewed text before launch.* **⚠ confirm**

## 6. Descriptions (verified lengths)

| Use | Limit | Chars | Copy |
|---|---|---|---|
| `<title>` home | 60 | 57 | Bookcation \| Flights, food, and catering on one trip plan |
| Meta description home | 155 | 144 | Bookcation puts flights, restaurant reservations, and catering on one trip plan. Fork it, compare versions, and book everything in one checkout. |
| OG / Twitter title | 60 | 43 | Bookcation: gate to plate, in one trip plan |
| OG / Twitter description | 200 | 143 | Search flights, reserve tables, and order catering from one trip plan. Fork it to try a different route or menu, compare the totals, then book. |
| `<title>` download | 60 | 54 | Download Bookcation for Mac, Windows, Android, and iOS |
| Meta download | 155 | 138 | Get Bookcation as a desktop app for macOS and Windows, on Android and iOS, or install it from your browser. Pick your device and download. |
| `<title>` about | 60 | 46 | About Bookcation \| One plan for the whole trip |
| Meta about | 155 | 117 | Bookcation is built around one idea: a trip is a draft until you book it. See how plans, forks, and comparisons work. |
| `<title>` help | 60 | 48 | Bookcation Help \| Plans, bookings, and demo mode |
| Meta help | 155 | 115 | Answers about trip plans, forking and comparing versions, bookings, and why Bookcation currently runs in demo mode. |
| App Store subtitle | 30 | 29 | Flights, meals, one trip plan |
| Google Play short description | 80 | 76 | Plan flights, restaurants, and catering on one trip. Fork plans and compare. |
| Social bio | 160 | 91 | Flights, meals, and catering on one trip plan. Fork it, compare it, book it. Gate to plate. |
| PWA `short_name` | 12 | 10 | Bookcation |

**One-sentence description (elevator):** Bookcation is a trip-planning app where flights, meals, and catering share one plan you can fork and compare before you book.

**Boilerplate (press, store "about"):** Bookcation is a trip planning and booking app for flights, restaurant meals, and catering. Plans can be forked and compared before anything is booked. Bookcation is available on the web, desktop, and mobile.

**Long description (store listings, About fallback; 115 words, 665 characters):**

> Bookcation puts your whole trip on one canvas. Search flights by airport and date, browse restaurants by cuisine and dietary need, and request catering quotes by headcount. Add anything to a day-by-day plan and drag it where it fits.
>
> Every plan can be forked. Try a cheaper flight in Plan B, keep Plan A untouched, and compare the two with the cost and travel-time differences laid out. Bookcation flags clashes, such as a dinner scheduled while you are still in the air.
>
> When the plan is right, book it in one checkout. Bookcation runs on the web, macOS, Windows, Android, and iOS. This preview uses sample data, so bookings are simulated and nothing is charged.

## 7. Ad creative packs (verified against platform limits)

Angles: **one plan**, **iteration**, **food-forward**, **groups**, **confidence**. Vary the angle, not just the wording. No pack contains a statistic, testimonial, or superlative.

### Google Ads RSA headlines (≤ 30 characters)

| # | Headline | Chars | Angle |
|---|---|---|---|
| 1 | Flights and meals, one plan | 27 | One plan |
| 2 | Draft it. Fork it. Book it. | 27 | Iteration |
| 3 | A second draft for every trip | 29 | Iteration |
| 4 | Gate to plate, in one plan | 26 | Food-forward |
| 5 | Compare two plans side by side | 30 | Confidence |
| 6 | Catering for the whole team | 27 | Groups |
| 7 | Book the flight and the dinner | 30 | One plan |
| 8 | See your total before you book | 30 | Confidence |
| 9 | Move a dinner. Swap a flight. | 29 | Iteration |

RSA rules met: includes a keyword-style headline (1), a benefit headline (3), and CTA-leaning headlines (2, 7). Every headline stands alone in any order.

### Google Ads descriptions (≤ 90 characters)

| # | Description | Chars |
|---|---|---|
| 1 | Search flights, pick restaurants, and add catering to one trip plan. Fork it to compare. | 88 |
| 2 | Move a dinner, swap a flight, and watch the total update before you book anything. | 82 |
| 3 | Planning for a group? Compare catering quotes by headcount and drop one into your trip. | 87 |
| 4 | Try Plan B without losing Plan A. Bookcation keeps every version of your trip. | 78 |

### Meta Ads

| Field | Limit | Copy | Chars |
|---|---|---|---|
| Primary text A (food-forward) | 125 visible | Booked the flight but forgot about dinner? Bookcation keeps flights, restaurants, and catering on one editable plan. | 116 |
| Primary text B (iteration) | 125 visible | Your first itinerary is a draft. Fork it, change the flight, move the dinner, and compare the totals. | 101 |
| Primary text C (groups) | 125 visible | Team offsite coming up? Compare catering quotes by headcount and add the winner to the trip. | 92 |
| Headline 1 | 40 | Every trip deserves a second draft | 34 |
| Headline 2 | 40 | Flights, tables, and catering together | 38 |
| Headline 3 | 40 | Compare two versions of your trip | 33 |
| CTA button | n/a | Download (or Learn More) | n/a |

### Audio (10 seconds, radio tag or podcast read)

> "Booked the flight? Now book the dinner. Bookcation puts both on one plan. Draft it. Fork it. Book it. Bookcation. Gate to plate."

23 words. End on the primary tagline with a half-second pause before "Gate to plate."

## 8. Social proof policy

Ship **no** testimonials, ratings, user counts, "as seen in" strips, or awards until the business supplies real, attributable ones. Put the section behind a `SHOW_SOCIAL_PROOF` content flag defaulting to `false`, with a typed `proof[]` array that the build ignores when empty.

## 9. Demo-mode honesty copy (appears wherever money or confirmation appears)

| Where | Copy |
|---|---|
| Persistent banner (dismissible per session, returns on checkout) | Demo mode: this app uses sample data. Bookings are simulated and nothing is charged. |
| Checkout payment step | Demo only. Do not enter a real card number. |
| Confirmation screen heading | Demo booking created |
| Confirmation body | This is a simulated booking. No airline, restaurant, or caterer has been contacted. |
| Hero demo caption | Sample trip. Prices are illustrative. |
| Booking card badge | Demo |

## 10. Test hypotheses (each can lose)

These apply once analytics exist. The v1 build ships a typed `track(event, props)` no-op so they can be measured later.

| # | Test | Metric and audience | Comparison | Expected direction |
|---|---|---|---|---|
| T1 | Home `h1`: "Every trip deserves a second draft." vs "Gate to plate." | Start a trip click-through rate, new visitors | Control = second draft | Control wins by at least 10% relative. If the gap is under 10% or reversed, keep "Gate to plate." only as the lockup tagline and run the headline test again with a clearer subhead |
| T2 | Meta primary text A (forgot dinner) vs B (second draft) | Link click-through rate to /download, cold audience | A vs B | A beats B by at least 15% relative, because it names a specific problem rather than a feature |
| T3 | Google description 3 (group catering) vs description 2 (iteration) | Click-through rate on "catering" keyword group | D3 vs D2 | D3 wins on the catering keyword group; D2 wins on the generic "trip planner" group. A tie on both retires the catering angle for search |

## 11. Claims register (do not ship a line unless its feature ships)

| Claim in copy | Backing feature | Priority |
|---|---|---|
| "flags anything that clashes" | Conflict detection | P0 |
| "Compare two plans side by side" | Compare view | P0 |
| "check prices across nearby dates" | Price calendar | P1 |
| "restaurants open when you arrive" | Arrival-aware suggestions | P1 |
| "open and edit saved plans without a connection" | Offline-capable local store + PWA/native shell | P0 |
| "See your total before you book" | Plan total in tray and checkout | P0 |
| "Linux" download card | Linux build in release workflow | P0 (bonus) |
