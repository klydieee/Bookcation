# 03 · Design System

> Produced under the `frontend-design` skill: a compact token plan first, reviewed against generated-design defaults, then specified. Where this file and any other disagree about a visual value, **this file wins**.
> Implementation target: Tailwind CSS v4 (`@theme` variables in `src/styles/tokens.css`) plus shadcn/ui primitives restyled to these tokens.

---

## 1. Design plan and review

**Subject:** a trip-planning and booking tool whose objects are *bookable things with a price and a time* (flights, reservations, catering). **Audience:** people comparing options and changing their minds, on laptops and phones. **Primary job of the UI:** let someone try a change and see the consequence immediately.

**Token plan in one glance**

| Axis | Decision |
|---|---|
| Color | Cool paper canvas, deep navy ink, one ultramarine primary ("Runway"), and **module-coded accents** (Guava, Mango, Lagoon) used only to encode which module an object belongs to |
| Type | Bricolage Grotesque (expressive grotesque, headlines and numbers) plus Atkinson Hyperlegible Next (legibility-first UI and body) |
| Layout | A browse area beside a persistent **Plan Tray**; planning happens on a **day-by-day canvas** |
| Signature | The **Ticket**: every priced, bookable object shares one anatomy (body, perforation, stub). Nothing else is ticket-shaped |
| Memorable moment | The hero **Fork**: a live sample plan splits into Plan A and Plan B and the totals update. One orchestrated entrance, everything else quiet |

**Review against the defaults, and what changed**

| Default tell | First instinct | Revision |
|---|---|---|
| Warm cream + terracotta + high-contrast serif | Travel often means "warm and sandy" | Rejected. Canvas is cool blue-white; no serif; no clay accent |
| Near-black + one acid accent (dark mode) | Easy dark theme | Rejected. Dark theme is deep navy-indigo (not neutral black) and keeps all four module hues |
| SaaS-card kit (identical rounded cards, one radius, same grey shadow, gradient washes) | Features as three equal cards | Rejected. Each module has its own container shape (§9); radii form a hierarchy (§5); shadows are ink-tinted and tiered; **no gradient washes** |
| ALL-CAPS tracked eyebrows, mono data labels, `→` on links, middle-dot meta strings | Typical "technical" chrome | Rejected. No eyebrows, no all caps, prices and times use tabular figures in the display face, no `→` on buttons |
| Fade-and-slide-up on every section; hover transitions on every card | "Feels modern" | Rejected. One hero sequence; other motion only answers a user action |
| Single accented word in a headline | Easy emphasis | Rejected. Headlines are set in one style |
| Numbered 01/02/03 markers | Visual rhythm | Allowed **only** on the Draft, Fork, Compare, Book steps because that content is a true sequence |

Spend boldness in one place: the Ticket and the Fork. Everything else stays quiet and disciplined.

## 2. Color tokens

Names are CSS custom properties declared in `@theme` (light) with `.dark` overrides. Contrast figures were computed (WCAG 2.2 relative luminance), not estimated.

### 2.1 Light theme

| Token | CSS variable | Value | Use |
|---|---|---|---|
| Canvas | `--color-canvas` | `#F4F6FB` | Page background |
| Surface | `--color-surface` | `#FFFFFF` | Cards, sheets, inputs |
| Sunken | `--color-sunken` | `#E8ECF6` | Wells, input fills, table stripes |
| Ink | `--color-ink` | `#0F1A36` | Primary text |
| Ink muted | `--color-ink-muted` | `#4A5573` | Secondary text |
| Line | `--color-line` | `#D3D9E9` | Decorative dividers only |
| Line strong | `--color-line-strong` | `#76819C` | Input and control borders (needs 3:1) |
| Primary (Runway) | `--color-primary` | `#2F3DF5` | Primary buttons, flight accent, selection |
| Primary ink | `--color-primary-ink` | `#2F3DF5` | Links, icons, text in primary hue |
| Primary hover | `--color-primary-hover` | `#2330D1` | Button hover and pressed |
| Primary tint | `--color-primary-tint` | `#E8EAFE` | Selected rows, flight badge fill |
| On primary | `--color-on-primary` | `#FFFFFF` | Text on primary |
| Flight | `--color-flight` / `-tint` / `-ink` | alias of primary / primary tint / primary ink | Flights module |
| Food (Guava) | `--color-food` | `#FF5C7A` | Food solids and rails |
| Food tint / ink | `--color-food-tint` / `--color-food-ink` | `#FFE8EC` / `#B8213F` | Badge fill / text and icons |
| Catering (Mango) | `--color-catering` | `#FFB020` | Catering solids and rails |
| Catering tint / ink | `-tint` / `-ink` | `#FFF1D1` / `#7A4D00` | |
| Trip (Lagoon) | `--color-trip` | `#14B8A6` | Trips solids and rails |
| Trip tint / ink | `-tint` / `-ink` | `#DAF5F1` / `#0B6F65` | |
| On accent | `--color-on-accent` | `#0F1A36` | Text on Food, Catering, Trip solid fills |
| Success | `--color-success` / `-tint` | `#166B3F` / `#DDF3E7` | |
| Warning | `--color-warning` / `-tint` | `#8A5300` / `#FFF1D6` | Conflicts |
| Error | `--color-error` / `-tint` | `#C62828` / `#FDE7E7` | |
| Focus ring | `--color-focus` | `#2F3DF5` | 2px ring, 2px offset |
| Scrim | `--color-scrim` | `rgb(15 26 54 / 0.48)` | Modal backdrop |

### 2.2 Dark theme (deep navy, **not** neutral black)

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--color-canvas` | `#0D1330` | | `--color-food` / `-ink` | `#FF8097` / `#FF8097` |
| `--color-surface` | `#151C42` | | `--color-food-tint` | `#431A2E` |
| `--color-raised` *(dark only, popovers/modals)* | `#1D2655` | | `--color-catering` / `-ink` | `#FFC247` / `#FFC247` |
| `--color-sunken` | `#0A0F26` | | `--color-catering-tint` | `#3F3010` |
| `--color-ink` | `#EAEEFF` | | `--color-trip` / `-ink` | `#3DD6C4` / `#3DD6C4` |
| `--color-ink-muted` | `#A3AEDA` | | `--color-trip-tint` | `#0F3A3D` |
| `--color-line` | `#2D3870` | | `--color-on-accent` | `#0D1330` |
| `--color-line-strong` | `#7280C4` | | `--color-success` / `-tint` | `#4FD08A` / `#0F3323` |
| `--color-primary` *(button fill)* | `#4552F0` | | `--color-warning` / `-tint` | `#FFC247` / `#3F3010` |
| `--color-primary-ink` *(text, links, icons)* | `#7C88FF` | | `--color-error` / `-tint` | `#FF8A80` / `#3F1A1C` |
| `--color-primary-hover` | `#3A46E6` | | `--color-focus` | `#9AA4FF` |
| `--color-primary-tint` | `#1A2260` | | `--color-scrim` | `rgb(5 8 22 / 0.64)` |
| `--color-on-primary` | `#FFFFFF` | | | |

Dark elevation uses lighter surfaces, not shadows: e1 `#151C42`, e2 `#1D2655`, e3 `#242F69`, e4 `#2A3678`, each with a 1px `--color-line` border.

### 2.3 Verified contrast (minimum required: text 4.5:1, large text and UI components 3:1)

| Pair (light) | Ratio | | Pair (dark) | Ratio |
|---|---|---|---|---|
| ink on canvas | 15.90 | | ink on canvas | 15.76 |
| ink on surface | 17.19 | | ink on surface | 14.23 |
| ink-muted on canvas | 6.84 | | ink-muted on surface | 7.54 |
| ink-muted on sunken | 6.26 | | ink-muted on raised | 6.59 |
| on-primary on primary | 6.76 | | on-primary on primary (button) | 5.65 |
| on-primary on primary-hover | 8.70 | | on-primary on primary-hover | 6.57 |
| primary-ink on canvas | 6.25 | | primary-ink on canvas | 5.92 |
| primary-ink on primary-tint | 5.67 | | primary-ink on primary-tint | 4.73 |
| food-ink on surface / tint | 6.31 / 5.41 | | food on surface / tint | 6.88 / 6.16 |
| catering-ink on surface / tint | 7.27 / 6.49 | | catering on surface / tint | 10.23 / 7.96 |
| trip-ink on surface / tint | 6.04 / 5.27 | | trip on surface / tint | 9.10 / 6.86 |
| on-accent on food / catering / trip | 5.78 / 9.40 / 6.91 | | on-accent on food / catering / trip | 7.62 / 11.33 / 10.07 |
| success on surface / tint | 6.54 / 5.62 | | success on surface / tint | 8.40 / 7.06 |
| warning on surface / tint | 6.33 / 5.67 | | warning on surface / tint | 10.23 / 7.96 |
| error on surface / tint | 5.62 / 4.75 | | error on surface / tint | 7.21 / 6.69 |
| line-strong on surface / canvas / sunken | 3.90 / 3.60 / 3.29 | | line-strong on canvas / surface / raised | 4.86 / 4.39 / 3.83 |

**Hard rules that follow from the numbers**

1. **Never put white text on Food or Trip solids** (2.97 and 2.49). Use `--color-on-accent`.
2. Food, Catering, Trip tint badges use their `-ink` token for text, never the solid.
3. Color never carries meaning alone: status always pairs with an icon and text; module identity always pairs with an icon and a label.
4. `--color-line` is decoration. Anything a user must perceive as a control boundary (inputs, checkboxes, segmented controls) uses `--color-line-strong`.
5. Status colors never double as module colors. Errors use the crimson `error` token with an icon, even though Food is red-pink.

## 3. Typography

| Role | Family | Axes and weights |
|---|---|---|
| Display and headlines, numbers (prices, times, totals) | **Bricolage Grotesque Variable** (`@fontsource-variable/bricolage-grotesque`) | `wght` 600 to 800, `wdth` 85 to 100, `opsz` auto |
| UI, body, forms | **Atkinson Hyperlegible Next Variable** (`@fontsource-variable/atkinson-hyperlegible-next`) | `wght` 400 to 700 |

Why this pair: Bricolage gives headlines and numerals an expressive, slightly compressed voice. Atkinson Hyperlegible Next is built to keep similar characters apart (a real gain for flight codes, times, and prices). The two feel clearly different (expressive vs. legibility-first), which is the only reason to use two.

Both are open-licensed (OFL) and **self-hosted via Fontsource** so desktop and mobile builds work offline and under strict CSP. Import the all-axes CSS file for Bricolage if the package ships one (`full.css`), otherwise `wdth.css`, otherwise `wght.css`. Verify the file exists in `node_modules` before importing. Do not load fonts from a CDN.

Fallback stacks: `ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

### Scale

| Token | Font | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | Bricolage | `clamp(2.75rem, 1.4rem + 5.6vw, 5.75rem)` / 0.96 | 800, `wdth` 88 | -0.03em | Home `h1` only |
| `display-lg` | Bricolage | `clamp(2.25rem, 1.4rem + 3.4vw, 3.75rem)` / 1.0 | 700 | -0.025em | Section headings on marketing pages |
| `h1` | Bricolage | 2rem / 2.25rem | 700 | -0.02em | App page titles |
| `h2` | Bricolage | 1.5rem / 1.75rem | 700 | -0.015em | Panel titles |
| `h3` | Atkinson | 1.25rem / 1.75rem | 700 | 0 | Card titles |
| `h4` | Atkinson | 1rem / 1.5rem | 700 | 0 | Group labels |
| `body-lg` | Atkinson | 1.125rem / 1.75rem | 400 | 0 | Marketing paragraphs |
| `body` | Atkinson | 1rem / 1.5rem | 400 | 0 | Default |
| `body-sm` | Atkinson | 0.875rem / 1.25rem | 400 | 0 | Metadata |
| `caption` | Atkinson | 0.75rem / 1rem | 500 | 0 | Timestamps, legal. Never essential info |
| `num-xl` | Bricolage | 2rem / 2.25rem | 800, tabular | -0.02em | Plan total |
| `num-lg` | Bricolage | 1.75rem / 2rem | 700, tabular | -0.015em | Ticket price |
| `num-md` | Bricolage | 1.375rem / 1.75rem | 700, tabular | -0.01em | Flight times |
| `button` | Atkinson | 1rem / 1.5rem | 600 | 0 | Buttons |

Rules:

- Base size 16px, all sizes in `rem` so user text scaling works up to 200%.
- Form inputs are never below 16px (prevents iOS zoom on focus).
- Sans body line length ≤ 68ch. Headlines use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
- Left-aligned, ragged right. Never justified.
- **No all-caps labels, no tracked-out small caps, no eyebrow labels above headings, no accenting one word of a headline.**
- Prices and times use `font-variant-numeric: tabular-nums`. If the chosen face lacks tabular figures, give numeric columns a fixed `min-width`, right-align them, and test that totals do not jitter while animating.

## 4. Spacing, grid, breakpoints

- 4px base unit (Tailwind default scale). Section padding on marketing: `py-20 lg:py-28`. App panel padding: 16 (mobile), 24 (tablet), 32 (desktop).
- Marketing container: max 1200px, 12 columns. App content: fluid, max 1280px.
- Breakpoints (Tailwind defaults): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Shell switch at `lg` (1024): below it the app uses a bottom tab bar, at or above it a left sidebar.
- Use CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) so a right-to-left locale works later.
- Components that must adapt to their own width (Ticket, PlanItemCard) use **container queries**, not viewport breakpoints.

## 5. Radius, borders, elevation

Radii form a hierarchy so everything is not the same rounded rectangle.

| Token | Value | Applies to |
|---|---|---|
| `--radius-xs` | 4px | Badges, kbd, small tags |
| `--radius-sm` | 8px | Inputs, buttons, menu items, table cells |
| `--radius-md` | 14px | Tickets, restaurant tiles, popovers |
| `--radius-lg` | 24px | Sheets, modals, hero canvas frame |
| `--radius-pill` | 9999px | Filter chips, segmented controls, avatars |
| `--notch` | 10px | Ticket perforation notch radius |

| Elevation | Value (light) | Use |
|---|---|---|
| `shadow-1` | `0 1px 2px rgb(15 26 54 / 0.06)` | Resting inputs, small chips |
| `shadow-2` | `0 6px 16px -4px rgb(15 26 54 / 0.12)` | Tickets, tiles |
| `shadow-3` | `0 16px 36px -10px rgb(15 26 54 / 0.20)` | Popovers, dropdowns, Plan Tray |
| `shadow-4` | `0 28px 72px -16px rgb(15 26 54 / 0.32)` | Modals, sheets |

Shadows are **ink-tinted**, never neutral grey. Tickets use `filter: drop-shadow(...)` on a wrapper because masks clip `box-shadow`.

## 6. Motion

| Token | Value |
|---|---|
| `--dur-instant` | 100ms |
| `--dur-fast` | 160ms |
| `--dur-base` | 240ms |
| `--dur-slow` | 400ms |
| `--dur-hero` | 900ms (hero sequence only) |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-out-quint` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Layout spring (motion library) | `stiffness 420, damping 34, mass 1` |

**Where motion is allowed**

| Moment | Spec | Trigger |
|---|---|---|
| **Hero sequence** (the one orchestrated moment) | Route arc draws (400ms) → three tickets settle with spring, 80ms stagger → total counts up to value. Plays once per visit | Page load |
| **Trip launch** | A soft brand-color wash sweeps up from the bottom-left; larger trip-start copy fades in, followed by a gently animated supporting line; 2.4s, plays once | User selects Start a trip |
| **Booking route** | A small airplane travels once along a dashed route when the trip form opens and again when the booking guide begins | User opens the trip form, then creates a trip |
| **Fork** | The board duplicates, the copy offsets 24px and a Plan B tab appears; route arcs split; delta chips count in. 480ms | User action |
| **Add to plan** | Ticket sends a small copy along an arc into the Plan Tray; tray count bumps. 520ms, `ease-out-quint` | User action |
| **List reorder** (sort changes, filter changes) | Layout animation with the layout spring | User action |
| **Ticket to detail** | Shared-element transition via `layoutId` into the detail sheet | User action |
| **Number changes** (totals, deltas) | Count to the new value in 320ms; `aria-live="polite"` announces only the final value, debounced 600ms | Data change |
| **Sheets, dialogs, popovers** | Opacity plus 8px translate, 240ms | User action |
| **Press feedback** | `scale(0.98)` for 100ms on buttons and tickets | Pointer down |

**Not allowed:** entrance animations on scroll for each section, hover transitions on every card, parallax, auto-playing carousels, looping decorative animations.

**Reduced motion:** with `prefers-reduced-motion: reduce` (or Settings → Reduce motion = on) open the destination page without the trip-launch reveal, replace other transform animations with a 120ms opacity change, skip the route-arc draw and number counting (set values immediately), and disable shared-element transitions. Settings offers *System* (default), *On*, *Off*.

**Native haptics** (Capacitor only, feature-detected): light impact on Add to plan, selection tick on tab and day changes, success notification when a booking is created.

## 7. Iconography and imagery

**Icons:** Phosphor (`@phosphor-icons/react`). Default weight `bold`; `duotone` for empty states and module headers; `fill` for the active nav item. Sizes 16, 20, 24, 32. Icon-only buttons need an `aria-label` and a tooltip.

| Concept | Phosphor icon |
|---|---|
| Flights | `AirplaneTilt` |
| Food | `ForkKnife` |
| Catering | `CookingPot` |
| Trips | `Path` (nav), `SuitcaseRolling` (trip header) |
| Bookings | `Ticket` |
| Saved | `BookmarkSimple` / `Heart` (toggle) |
| Fork plan | `GitFork` |
| Compare | `GitDiff` |
| Conflict | `Warning` |
| Drag handle | `DotsSixVertical` |
| Swap / replace | `ArrowsLeftRight` |
| Search, date, travelers, time | `MagnifyingGlass`, `CalendarBlank`, `Users`, `Clock` |
| Settings, theme | `GearSix`, `Sun`, `Moon` |
| Command palette | `Command` |
| Download and OS | `DownloadSimple`, `AppleLogo`, `WindowsLogo`, `AndroidLogo`, `LinuxLogo`, `Globe`, `DeviceMobile` |
| QR | `QrCode` |

**Photography:** natural light, saturated but real, people-light. Food at roughly 45 degrees, hands in frame occasionally. Destinations at street level rather than postcard landmarks. Two crops only: **4:5** (tiles) and **16:9** (headers). No filters, no text on images, no stock-looking handshake shots. Sourcing and fallbacks are in `10_ASSETS_AND_LIBRARIES.md`.

**Illustration:** none. Decorative graphics come from a **motif kit** drawn in SVG/CSS: bookmark glyph, dotted route arc, perforation line, ticket notch, postmark ring. Empty states combine one duotone icon with the dotted route motif.

**Logo:** `assets/brand/logo-mark.svg` (bookmark with a dotted route to a Mango destination dot). Wordmark is "Bookcation" in Bricolage Grotesque 800, `wdth` 90, tracking -0.02em, `--color-ink`. Lockup gap = 0.4em. Clear space = the width of the bookmark notch on all sides. Minimum mark size 16px (use `favicon.svg`, which has chunkier dots). No gradients, no outlines, no recoloring other than a single-color version for notifications and the macOS menu bar.

## 8. The Ticket (signature structure)

Every **priced, bookable object** is a Ticket: flight offers, table reservations, catering quotes, and confirmed bookings. The anatomy encodes information: *the body says what it is; the stub says what it costs and what you can do.*

```
 ┌───────────────────────────────┐  ┌────────────┐
 │▌ [✈] Skyloom Air   SK 214     ┆  │  $438      │
 │▌ 07:40  JFK ·····✈····· LIS   ┆  │  round trip│
 │▌ 6h 55m · Nonstop             ┆  │ [Add to plan]
 └───────────────────────────────┘  └────────────┘
  ▌ module rail     ┆ perforation        stub
```

| Part | Spec |
|---|---|
| **Rail** | 4px strip on the inline-start edge in the module color (`flight`, `food`, `catering`, `trip`) |
| **Body** | Module badge (icon + label), primary line, secondary metadata, expandable details |
| **Perforation** | 1.5px dashed `--color-line-strong` line with a half-circle **notch** (`--notch` 10px radius) cut out at top and bottom, so the page background shows through |
| **Stub** | Right side on wide containers, bottom on narrow ones. Contains price (`num-lg`), price qualifier, and the one primary action |
| **States** | default · selected (2px `--color-primary` ring on the wrapper) · disabled or sold out (stub replaced by a status message, body stays readable) · loading (skeleton with identical anatomy) |
| **Orientation** | Container query: horizontal at ≥ 520px container width, vertical below. Perforation rotates with it |
| **Variants** | `FlightTicket`, `ReservationTicket`, `QuoteTicket`, `BoardingPassCard` (Bookings; adds QR and reference code) |

Build constraints:

1. Notches are **real transparency** (CSS `mask` with radial gradients, or `clip-path`), not circles painted in the background color, so they work in dark mode and over photos.
2. Draw the border and the shadow on an **outer wrapper** (`drop-shadow` filter), because the mask clips anything on the masked element.
3. Put the focus ring on the wrapper so the mask cannot clip it. Selected and focus states must both remain visible.
4. Use prefixed mask properties via the build tool's autoprefixing so WKWebView (iOS 16+) renders correctly.
5. A Ticket is a landmark-free `article`; its primary action is a real `button`; the whole card is not a click target except where the detail sheet opens (then a visible "Details" button also exists).

## 9. Module treatments (different shapes on purpose)

| Module | Object shape | Accent | Where it appears |
|---|---|---|---|
| Flights | **Ticket** (horizontal, route arc between airport codes) | `flight` (Runway) | Flight results, plan items, bookings |
| Food | **Photo tile** (4:5 image, name, cuisine chips, ETA); menu as plain list rows; reserved slot becomes a `ReservationTicket` | `food` (Guava) | Browse grid, restaurant page |
| Catering | **Price sheet** (itemized lines on dashed rules, a total line, receipt feel) in a `QuoteTicket` stub | `catering` (Mango) | Quote comparison |
| Trips | **Board**: day lanes with a dotted route line running through them; items are compact Tickets | `trip` (Lagoon) | Canvas, compare |
| Bookings | **Boarding pass** with QR | module accent per item | Wallet |

On the marketing page each module is shown in its own shape (a ticket, a photo tile, a price sheet, a mini board). Do **not** present modules as three equal cards.

## 10. Layout concept and wireframes

**Alignment:** left-aligned everywhere. The only centered blocks are the final call-to-action band, 404, and empty states. Numbers in columns are right-aligned.

### 10.1 Hero (two options compared, option A chosen)

```
A) Split with bleed (chosen, ≥ lg)                 B) Canvas-first
┌──────────────────────────────────────────┐      ┌──────────────────────────────┐
│ Every trip deserves      ┌───────────────┼──┐   │  Every trip deserves a       │
│ a second draft.          │ live canvas   │  │   │  second draft.               │
│ Subhead…                 │ ▢ flight      │  │   │  [Start a trip]              │
│ [Start a trip] [See how] │ ▢ dinner      │  │   │ ┌──────────────────────────┐ │
│                          │ ▢ catering    │  │   │ │ live canvas, full width  │ │
│                          │ Plan A│Plan B │  │   │ └──────────────────────────┘ │
└──────────────────────────┴───────────────┴──┘   └──────────────────────────────┘
 copy 5 cols · canvas 7 cols, bleeds off the right edge
```

Option A wins: copy and proof sit side by side so the headline's claim ("second draft") is demonstrated beside it. Below `lg` the canvas stacks under the buttons and becomes swipeable.

### 10.2 Desktop app shell (≥ 1024)

```
┌────────┬────────────────────────────────────────────┬──────────────┐
│ ▣ Logo │  [⌘K Search…]   Trip: Lisbon · Plan B ▾  ☾ $│  Plan Tray   │
│ Today  ├────────────────────────────────────────────┤  Plan B      │
│ Flights│                                            │  ✈ 2  🍴 3   │
│ Food   │              page content                  │  Total $1,284│
│ Catering│                                           │  ⚠ 1 clash   │
│ Trips  │                                            │ [Open canvas]│
│ Bookings│                                           │              │
│ Saved  │                                            │              │
│ ⚙      │                                            │              │
└────────┴────────────────────────────────────────────┴──────────────┘
 sidebar 264 (72 collapsed) · content fluid · tray 340, shown by default ≥ 1280
```

### 10.3 Mobile app shell (< 1024)

```
┌───────────────────────┐
│ Flights        ☾  ⌘   │  top bar (title, actions)
├───────────────────────┤
│                       │
│     page content      │
│                       │
├───────────────────────┤
│ ▂▂ Plan B · $1,284 ▲  │  tray handle (tap to open sheet)
├───────────────────────┤
│ Today Explore Trips Bookings Me │  bottom tabs (safe-area aware)
└───────────────────────┘
```

Explore contains a segmented control: Flights · Food · Catering. Page-specific wireframes are in `06_PAGES_AND_ROUTES.md`.

## 11. Dark mode and theming

- Mechanism: `class="dark"` on `<html>`. An **inline script in `index.html`** reads the saved preference (or `prefers-color-scheme`) and sets the class before first paint to prevent a flash.
- Preference values: `system` (default), `light`, `dark`. Stored in the prefs store. Switching animates only the color properties for 160ms (disabled when reduced motion is on).
- Native: sync status bar style (Capacitor) and `theme-color` meta (web) with the active canvas color.
- Images and photos are never inverted. Ticket notches stay transparent so both themes work.

## 12. Accessibility floor (part of the design, not a later pass)

- WCAG 2.2 AA. Targets ≥ 44×44px on touch layouts, never below 24×24px anywhere.
- Visible keyboard focus on every interactive element: 2px ring, 2px offset, `--color-focus`. Never `outline: none` without a replacement.
- Every drag interaction has a keyboard and menu alternative ("Move to day…").
- Meaning never relies on color alone (§2.3 rule 3).
- Respect `prefers-reduced-motion`, `prefers-contrast: more` (thicken `--color-line` to `--color-line-strong`), and `forced-colors` (borders must remain visible; do not rely on background colors alone to show selection).
- Text can scale to 200% and layouts reflow at 320px width with no horizontal scrolling (except the canvas lanes and data tables, which scroll inside their own container).

## 13. Anti-default checklist (reviewers reject the build if any is true)

- [ ] An eyebrow label sits above a heading
- [ ] Labels or buttons are ALL CAPS or tracked-out
- [ ] One word of a headline is accented by color, italics, or weight
- [ ] Three equal feature cards in a row
- [ ] Sections fade or slide up on scroll
- [ ] Every card has a hover transition
- [ ] Gradient washes are used as decoration
- [ ] A cream background with a clay or terracotta accent, or near-black with a single acid accent
- [ ] Monospace is used for small data labels
- [ ] `→` is appended to button or link text
- [ ] Meta text is joined with middle dots ("A · B · C")
- [ ] 01 / 02 / 03 markers appear on content that is not a sequence
- [ ] The same border radius and the same grey shadow are used everywhere
- [ ] Any text fails the contrast table in §2.3

## 14. Optional sound (P2, off by default)

A single short confirmation chime on "Trip booked", respecting the system mute switch and a Settings toggle. No other UI sounds.
