# A Little Birthday Journey

An interactive birthday site for Sofi. The visitor moves through ten stages —
one at a time, no scrolling wall — and the last one hands off to the real SPX
Express shipment carrying her present.

```
landing → chapter 1 → chapter 2 → chapter 3 → cake
        → wishes → one more thing → gift → tracking → complete
```

## Run it

```bash
npm install
cp .env.example .env.local   # then put the real tracking number in
npm run dev
```

Open http://localhost:3000.

## Put the real content in

**Words.** Everything lives in `config/birthday.ts` — titles, chapter lines,
traits, the letter, the gift card, the final screen. No component needs editing
to change a single word.

**The photo.** One image, propped behind the cake like it's standing on the
table. Replace `public/images/sofi-01.jpg` with the real one — a portrait crop
around 4:5 sits best in the polaroid frame. It's configured at
`birthdayConfig.cake.photo`; set that to `null` to show the cake on its own.
Position and size are three utilities on the `<motion.figure>` in
`BirthdayCakeStage.tsx`: `bottom-[16%]` (how high it stands), `left-0` (how far
across) and `w-[38%]` (how big relative to the cake).

**Tracking number.** In `.env.local`:

```
SPX_TRACKING_NUMBER=SPXID062889834387
```

Server-side only — never `NEXT_PUBLIC_`. The browser calls `/api/tracking` with
no parameters and never sees the number in the bundle.

**Music (optional).** Put an mp3 at `public/audio/theme.mp3`. Nothing autoplays;
the toggle in the top corner starts it. If the file isn't there the control
checks on mount and removes itself. Set `audio.enabled: false` in the config to
turn the feature off entirely.

## How the tracking works

```
browser  →  GET /api/tracking            (no tracking number)
server   →  GET spx.co.id/…?spx_tn=…&language_code=id
server   →  normalizeSPXResponse(data)   →  clean JSON
```

- `lib/tracking/spx.ts` — the only file that talks to SPX. 10s abort timeout,
  30s in-memory cache (bypassed by `?refresh=1` behind the Refresh button),
  and a typed error for each failure mode: timeout, network, HTTP status,
  `retcode !== 0`, unreadable body.
- `lib/tracking/normalize.ts` — turns the raw payload into one shape. The UI
  reads only that shape; no component ever touches `sls_tracking_info`.
- `lib/tracking/display.ts` — Asia/Jakarta formatting via `Intl.DateTimeFormat`
  (`24 Sep 2026 · 09:42 WIB`) and the friendly status wording. The original SPX
  status is never overwritten; it stays in the normalized data and in the
  detailed history.

**Milestone grouping.** SPX emits several codes per milestone — F510, F540 and
F599 are all `In transit`. `buildMilestoneJourney` collapses them into one
headline step represented by the most recent event in that group, with a count
("5 updates in this stage"), while every raw record survives in the expandable
detail log. Milestones SPX hasn't reported yet are drawn from a known list, but
anything unfamiliar the API returns is trusted and rendered as-is, so a new
milestone code won't break the timeline.

**The map** is drawn from the coordinates in the response and nothing else.
Hubs without usable coordinates are skipped, `0,0` is treated as "unknown", and
an empty `next_location` means no next marker — no destination is invented. It's
a drawing of the reported hops, not a GPS trace.

**Without a tracking number,** `/api/tracking` serves a clearly-flagged sample
shipment (Kediri → Bekasi → Palembang, out for delivery) so the final chapters
stay viewable while you build. A small chip says so, and it disappears the
moment a real number is configured. `SPX_DEMO=true` forces it.

## Two decisions worth knowing

**Ordering.** The milestone timeline reads forwards, oldest to newest. The
expandable detail log reads newest-first, which is how you actually check on a
parcel; it's labelled "Most recent first".

**Five acts, ten stages.** The progress indicator counts five, not ten:
chapters one and two are one beat, as are chapter three and the cake, and one
more thing and the gift. Ten dots on a 375px screen is noise.

## Structure

```
app/
  layout.tsx            fonts, metadata, grain
  page.tsx              server component, mounts the journey
  globals.css           tokens, grain, focus, reduced motion
  api/tracking/route.ts SPX proxy

components/birthday/
  BirthdayExperience.tsx  state machine, transitions, chrome
  JourneyProgress.tsx     01 / 06 and the dots
  MusicToggle.tsx
  stages/                 one file per stage
  tracking/               header, summary, timeline, event, map, badge
  effects/                BackgroundEffects, Confetti, Candle
  ui/                     StageShell, JourneyButton

lib/
  journey.ts              stage order, acts, navigation
  motion.ts               easing and shared variants
  useDelayedFlag.ts
  tracking/               types, spx, normalize, display, demo

config/birthday.ts        all copy
```

## Motion and accessibility

`prefers-reduced-motion` is honoured through `MotionConfig reducedMotion="user"`
plus explicit checks: no parallax, no drifting motes, no pulsing rings, no smoke,
and timed reveals resolve immediately rather than making anyone wait out an
animation they asked not to see. Every control is a real `<button>` with a
visible focus ring; stage changes move focus to the new scene; the map has a
screen-reader list beside it.

Durations sit where the brief asked: 150–250ms for micro-interactions, ~550ms
for transitions, 800ms for scene changes, all on one easing curve
(`cubic-bezier(0.22, 1, 0.36, 1)`).

## Design notes

Near-black base (`#08090D` / `#0D0F14` / `#111318`) used as depth rather than
decoration, `#F5F5F5` and `#A5A7AE` for type, and exactly two accents: a muted
lavender `#B0A4DA` and a warm cream `#E9D9BE`. Instrument Serif carries the
voice, Inter handles the interface, and a system mono is reserved for tracking
numbers and label data so they read as printed.

The two light washes behind everything shift position and weight per stage, so
the room cools toward lavender through the chapters and warms to candlelight at
the cake. The cake is one tier, a hairline ribbon and a single taper, with "23"
embossed at 9% opacity — the only bright thing in the scene is the flame.
