# Saiyam & Jenny — Wedding Invitation (static HTML/CSS/JS)

Plain HTML/CSS/JS version of the invitation, no build tools, no React —
just open `index.html` in a browser or upload the folder to any static host.

## Folder structure
```
index.html
favicon.ico
assets/
  css/
    style.css     ← the site's ACTUAL compiled stylesheet, copied byte-for-byte
                     (all real colors, gradients, shadows, keyframes — nothing rewritten)
    custom.css    ← a few small additions on top (safe to edit)
  js/
    script.js     ← intro tap-to-open, scratch-to-reveal card, countdown,
                     scroll-reveal animations, music toggle
  fonts/
    Candlescript.otf   ← the real script font file used for headings
  images/
    homehero.jpg, lunch.jpg, sangeet.jpg, mayra.jpg, wedding.jpg  ← PLACEHOLDERS
    countdown-frame.png   ← PLACEHOLDER decorative frame for the scratch card
    bg-texture.png        ← PLACEHOLDER subtle paper texture
    intro-poster.jpg      ← the real poster image used behind the intro screen
```

## Latest update (single-image gallery viewer + faster video fade-out)

- **Gallery is no longer a grid.** Clicking `lunch.jpg` now opens
  directly into the single full-image viewer (starting at photo 1),
  with only prev/next navigation — no thumbnail grid step in between.
  The old grid markup and CSS have been removed.
- **Video fade-out shortened to 1 second** (was 2s). The hero photo
  fade-in stays at 0.8s, so the full transition from "video ends" to
  "hero fully visible" is now ~1.8s total. See
  `fadeOutVideoThenRevealHero()` in `script.js`.

## Latest update (flower rain, faster fade-in, in-page gallery)

- **Flower rain replaces the party-popper confetti.** Tapping the
  envelope now rains flower emojis down from the top of the screen
  (staggered spawn + drift + rotation) instead of bursting outward from
  the center. See `rainFlowers()` in `script.js`.
- **Fade-in shortened to 0.8s.** The hero photo now fades in over 0.8s
  after the video's 2s fade-out (previously 2s each way). Edit the
  `"opacity 0.8s ease"` lines in `fadeOutVideoThenRevealHero()` /
  `openInvitation()` in `script.js` to change it again. The video's 2s
  fade-out itself is unchanged.
- **The separate `engagement_gallery.html` page has been removed.**
  Clicking the `lunch.jpg` photo now opens an **in-page gallery modal**
  instead of a new tab — same grid-of-photos layout, same tap-to-open
  full-image lightbox with prev/next, swipe, and arrow-key navigation,
  just built directly into `index.html` (see `#gallery-modal` /
  `#gallery-lightbox` and `initGallery()` in `script.js`).
- **Add your photos** to the `gallery/` folder using the exact filenames
  listed in `gallery/PUT_YOUR_PHOTOS_HERE.txt` (29 files, `1.jpg` first).
  To change which photos appear or their order, edit the `files` array
  inside `initGallery()` in `script.js`.

## Latest update (real envelope-flap animation + video card)

Rebuilt the intro to match the mechanic from your reference project
(`mahiladinasya`) instead of the earlier whole-image tilt:

- **The envelope photo is now a literal hinged flap.** It's positioned
  with `transform-origin: top center` and lifts open with `rotateX`,
  using the same bounce easing (`cubic-bezier(0.68, -0.55, 0.27, 1.35)`)
  as the reference project's `.envelope-flap`. See `#intro-poster` /
  `#intro-poster.is-open` in `custom.css`.
- **The video now plays full screen** — it covers the entire viewport
  (`position: fixed; inset: 0`) once the flap opens, rather than a small
  card.
- **Confetti burst** is ported directly from the reference project's
  `createConfettiBurst()` — same physics (gravity, velocity, rotation),
  recolored to the site's rose/gold/sage palette.
- Once the video finishes (`ended` event), the page crossfades smoothly
  into the invitation, same as before. If the video can't play for any
  reason, a ~9s safety timer opens the invitation anyway so no one gets
  stuck on a closed envelope.
- The envelope's "inside" (revealed once the flap lifts) is a soft
  rose/cream gradient (`#envelope-body-bg`) — swap this for a different
  color or pattern in `custom.css` if you'd like.

## Latest update (countdown alignment + matching font)

- Fixed a bug where the Days/Hours/Minutes/Seconds boxes weren't the same
  size (their width was accidentally driven by label text length), which
  threw the row out of alignment on some screens. The row is now a strict
  4-column grid so all four boxes are always identical size and sit
  perfectly in one line, matching the reference image.
- Countdown digits and labels now use the **same font family** as the
  date title (Cormorant Garamond) — see `.countdown-num` /
  `.countdown-label` in `custom.css` — instead of the previous mismatched
  Cinzel font.
- Labels shortened to "Min" / "Sec" so they don't crowd the row on small
  screens; edit them in `index.html` if you'd prefer the full words.

## Latest update (bigger date/countdown text + party-popper burst)

- Regenerated `countdown-frame.png` with a thinner scalloped border so the
  transparent center window is much larger — this gives the date/time and
  countdown room to be sized close to the reference image instead of being
  shrunk down.
- The date now uses a **drop-cap** treatment ("**2**8th **A**ugust 2026")
  matching the reference's large-first-letter, small-caps look — see
  `.frame-title .drop-cap` in `custom.css`.
- Countdown digits and the "9:58 AM" time are sized up to match the
  reference's proportions.
- The scratch-reveal burst now mixes 🎉 🎊 ✨ in with the flower emojis for
  a proper "party popper" feel.

## Latest update (envelope crossfade + ornate scratch frame)

- **countdown-frame.png** is now a hand-drawn scalloped rose/sage-green
  "plaque" frame (double scalloped border + scattered confetti flecks)
  matching the reference design you shared, with a transparent center so
  the live date/countdown renders inside it.
- **Date title font**: "28th August 2026" now uses `Cormorant Garamond`
  with `font-variant: small-caps` (see `.frame-title` in `custom.css`) to
  match the elegant mixed-caps look of the reference frame's typography.
- **Envelope open**: tapping the envelope now plays the tilt-back-and-fade
  flap animation anchored near the top edge (like a real envelope flap
  hinge), then **crossfades smoothly** straight into the invitation — no
  white flash. The intro sits as a fixed full-screen layer on top of the
  invitation and simply fades away.
- **Flower burst**: scratching the card fully now bursts real flower
  emojis (🌸🌿🌼🌷💐🌺❀) instead of confetti dots.
- The frame's inner window is intentionally sized a bit smaller than the
  scalloped opening so the card/canvas never pokes past the border —
  if you resize the countdown text or digits, keep an eye on this.

## Intro & scratch card behavior (latest update)

- **Tap to open**: tapping the envelope image now plays a real "envelope
  opening" animation (scale up + flip back + fade), using the exact
  `envelope-open` keyframe from the original site's own stylesheet — then
  fades into the invitation. Swap `assets/images/intro-poster.jpg` for your
  own envelope/poster photo any time; the animation applies to whatever
  image is there.
- **Scratch card**: the canvas markup matches exactly what you specified
  (`width="512" height="343"`, `cursor-grab active:cursor-grabbing
  touch-none rounded-lg`, `absolute inset-0 w-full h-full`). Scratching
  (mouse or touch/pointer) erases the pink coating; once ~45% is cleared it
  reveals **28th August 2026 · 9:58 AM** plus a live Days/Hours/Minutes/
  Seconds countdown to that exact moment, and bursts flower emojis
  (🌸🌿🌼🌷💐🌺❀) across the screen instead of confetti dots.
- To change the date/time, edit the `TARGET` line near the top of
  `assets/js/script.js` (keep the `+05:30` for India time, or change the
  offset), and update the "28th August 2026" / "9:58 AM" text in
  `index.html` to match.

## What's exact vs. what's a placeholder — please read

The site you linked is a **dynamic, JS-driven invitation** (built with Vite/React).
Everything visual — colors, fonts, spacing, shadows, gradients, animation
timings — was pulled directly from the site's real compiled CSS file and its
JavaScript bundle, so those are exact:

- Full color palette (rose/gold/cream HSL variables), gradients, box-shadows
- Fonts: **Cormorant Garamond** (body/script text) and **Cinzel** (numbers/labels)
  loaded from Google Fonts exactly as the original does, plus the real
  **Candlescript.otf** script font
- All real text content: the "Awaiting your gracious presence" copy, the
  family/blessings names, "Club Babylon" venue + address, the Google Maps
  embed, the 7th July 2026 date, and the countdown logic
- Real animation/interaction logic: tap-to-open intro, scratch-to-reveal
  countdown card (canvas-based erase effect + confetti burst), scroll
  fade-up reveals, background-music toggle button

What could **not** be captured, because the automated cloning tool only
recorded the very first screen (the wax-seal "Tap to open" intro) and never
triggered a click to load what's behind it:

- The 5 real photos (hero photo + 4 event photos) — currently simple
  labelled placeholder images at `assets/images/*.jpg`
- The decorative scratch-card frame artwork — currently a simple
  approximation at `assets/images/countdown-frame.png`
- The subtle repeating paper background texture — currently a plain
  approximation at `assets/images/bg-texture.png`
- The intro video (`intro-compressed.mp4`) and background music
  (`background.mp3`) — not included; the site still works fine without them
  (tapping the intro just fades straight to the invitation after ~1s)

## How to customize
- **Swap photos**: replace the files in `assets/images/` with your own,
  keeping the same filenames (or update the `src` in `index.html`).
- **Change text/names/venue**: edit the text directly inside `index.html`.
- **Add the real intro video**: drop an `intro-compressed.mp4` into a new
  `assets/video/` folder — it's already wired up in `index.html`.
- **Add background music**: drop an mp3 into `assets/audio/background.mp3`
  — already wired up.
- **Fonts**: `Cormorant Garamond` and `Cinzel` load from Google Fonts;
  `Candlescript` is bundled locally in `assets/fonts/`.
