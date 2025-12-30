# Choonz - Mobile Strudel UI

A mobile-friendly live coding music interface powered by [Strudel](https://strudel.cc/), built with Next.js.

## Features

- **Touch-optimized UI** - Large buttons and touch-friendly controls
- **Quick insert bar** - Common Strudel functions at your fingertips
- **Pattern presets** - Pre-built patterns to get started quickly
- **BPM control** - Easily adjust tempo
- **Real-time visualization** - Animated waveform display
- **Code persistence** - Your code is saved locally
- **PWA support** - Install as a standalone app on mobile

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Strudel** - Live coding music library
- **Web Audio API** - Browser-based audio synthesis

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your mobile device or browser.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main page (client-side)
│   └── globals.css     # Global styles
├── components/
│   ├── StrudelUI.tsx   # Main UI component
│   ├── Header.tsx      # Logo and BPM controls
│   ├── CodeEditor.tsx  # Code textarea
│   ├── Visualizer.tsx  # Waveform canvas
│   ├── TransportBar.tsx # Play/stop buttons
│   ├── PresetsDrawer.tsx # Pattern presets
│   └── QuickInsert.tsx # Quick function buttons
├── hooks/
│   └── useStrudel.ts   # Strudel REPL integration
└── lib/
    └── presets.ts      # Pattern preset definitions
```

## Usage

1. **Tap a preset** to load a pattern, or write your own code
2. **Tap the play button** to start the audio (required for mobile)
3. Use the **quick insert bar** to add common Strudel functions
4. Adjust **BPM** with the +/- buttons in the header
5. **Ctrl/Cmd + Enter** to evaluate, **Escape** to stop

## Strudel Basics

```javascript
// Basic drum pattern
sound("bd sd bd sd")

// Stack multiple patterns
stack(
  sound("bd*4"),
  sound("~ sd").slow(2),
  sound("hh*8").gain(.6)
)

// Melodic pattern
note("c3 e3 g3 b3")
  .sound("sawtooth")
  .lpf(800)

// Effects
sound("bd sd").room(.5).delay(.25)
```

Learn more at [strudel.cc](https://strudel.cc/)

## License

MIT
