# Choonz - Mobile Strudel UI

A mobile-friendly live coding music interface powered by [Strudel](https://strudel.cc/).

## Features

- **Touch-optimized UI** - Large buttons and touch-friendly controls
- **Quick insert bar** - Common Strudel functions at your fingertips
- **Pattern presets** - Pre-built patterns to get started quickly
- **BPM control** - Easily adjust tempo
- **Real-time visualization** - Animated waveform display
- **Code persistence** - Your code is saved locally
- **PWA support** - Install as a standalone app on mobile

## Getting Started

### Run locally

```bash
# Using npm
npm start

# Or with any static server
npx serve .
```

Then open `http://localhost:3000` on your mobile device.

### Usage

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
