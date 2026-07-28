# Drift — Ocean Opening Scene

A cinematic, interactive pixel-art opening for Drift: an AI-directed living
documentary experience.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production check:

```bash
pnpm build
pnpm start
```

## Scene architecture

- `sceneConfig.ts` — feature flags, reveal timing, copy, and ambient audio
- `components/OceanScene.tsx` — scene direction and interaction
- `components/PixelCanvasScene.tsx` — 640×360 Canvas renderer for the complete
  pixel world, including the seated protagonist, perspective ocean, moon,
  lighthouse, meadow, flora, lantern, cat, rabbit, stars, fog, and fireflies
- `components/SoundToggle.tsx` — opt-in layered ambient sound
- `app/globals.css` — cinematic framing and accessible interaction layout

## Living-world configuration

`sceneConfig.ts` can independently show or hide:

- moon and moon reflection
- lighthouse
- clouds
- flowers
- animals
- fireflies
- lantern

The scene is drawn frame-by-frame on a low-resolution 16:9 Canvas and enlarged
with browser smoothing disabled. The opening is orchestrated as a ten-second
sequence. People who prefer reduced motion receive a still completed
composition without waiting through the full timeline.

## Audio

The three locally generated ambience loops live in `public/audio/`:

- `ocean.wav`
- `wind.wav`
- `night.wav`

Audio is muted by default and begins only after the listener selects the sound
control.
