/**
 * Choonz - Mobile Strudel Live Coding Interface
 * A touch-friendly music live coding environment
 */

// Import Strudel from CDN
import {
  repl,
  controls,
  evalScope
} from 'https://unpkg.com/@strudel/repl@latest';

import {
  initAudioOnFirstClick,
  getAudioContext,
  webaudioOutput,
  samples
} from 'https://unpkg.com/@strudel/webaudio@latest';

// Pattern presets for quick access
const PRESETS = [
  {
    name: "Basic Beat",
    desc: "Simple kick & snare",
    code: `sound("bd sd bd sd")`
  },
  {
    name: "Hi-Hat Groove",
    desc: "Classic drum pattern",
    code: `sound("bd hh sd hh").fast(2)`
  },
  {
    name: "Four on Floor",
    desc: "Dance beat",
    code: `stack(
  sound("bd*4"),
  sound("~ sd").slow(2),
  sound("hh*8").gain(.6)
)`
  },
  {
    name: "Melodic",
    desc: "Simple melody",
    code: `note("c3 e3 g3 b3")
  .sound("sawtooth")
  .lpf(800)
  .decay(.2)`
  },
  {
    name: "Bass Line",
    desc: "Deep bass groove",
    code: `note("c2 ~ e2 ~ g2 ~ e2 ~")
  .sound("sawtooth")
  .lpf(400)
  .gain(.8)`
  },
  {
    name: "Ambient Pad",
    desc: "Dreamy chords",
    code: `note("<c3 e3 g3> <e3 g3 b3>")
  .sound("sine")
  .room(.8)
  .delay(.5)
  .slow(4)`
  },
  {
    name: "Breakbeat",
    desc: "Chopped drums",
    code: `sound("bd hh sd hh bd bd sd hh")
  .fast(2)
  .sometimes(rev)`
  },
  {
    name: "Acid Bass",
    desc: "303-style bass",
    code: `note("c2 c2 c3 c2 eb2 c2 c3 c2")
  .sound("sawtooth")
  .lpf(sine.range(200,2000).slow(4))
  .resonance(15)`
  },
  {
    name: "Polyrhythm",
    desc: "Complex rhythms",
    code: `stack(
  sound("bd").slow(3),
  sound("sd").slow(4),
  sound("hh").slow(5)
)`
  },
  {
    name: "Glitch",
    desc: "Random chaos",
    code: `sound("bd sd hh cp")
  .fast(2)
  .sometimes(fast(2))
  .rarely(rev)
  .room(.3)`
  }
];

// Application state
const state = {
  isPlaying: false,
  bpm: 120,
  repl: null,
  audioInitialized: false
};

// DOM Elements
const elements = {
  codeEditor: document.getElementById('code-editor'),
  playBtn: document.getElementById('play-btn'),
  stopBtn: document.getElementById('stop-btn'),
  shuffleBtn: document.getElementById('shuffle-btn'),
  clearBtn: document.getElementById('clear-btn'),
  bpmDisplay: document.getElementById('bpm-display'),
  bpmUp: document.getElementById('bpm-up'),
  bpmDown: document.getElementById('bpm-down'),
  errorDisplay: document.getElementById('error-display'),
  presetsDrawer: document.getElementById('presets-drawer'),
  presetsToggle: document.getElementById('presets-toggle'),
  presetsGrid: document.getElementById('presets-grid'),
  vizCanvas: document.getElementById('viz-canvas'),
  loadingOverlay: document.getElementById('loading-overlay'),
  quickInsertBtns: document.querySelectorAll('.insert-btn')
};

// Initialize the application
async function init() {
  try {
    // Load samples
    await samples('https://strudel.cc/samples.json');

    // Initialize the Strudel REPL
    state.repl = repl({
      defaultOutput: webaudioOutput,
      afterEval: () => {
        hideError();
      },
      onError: (error) => {
        showError(error.message || error);
      }
    });

    // Setup event listeners
    setupEventListeners();

    // Render presets
    renderPresets();

    // Setup visualizer
    setupVisualizer();

    // Load saved code
    loadSavedCode();

    // Hide loading overlay
    elements.loadingOverlay.classList.add('hidden');

    console.log('Choonz initialized successfully');
  } catch (error) {
    console.error('Failed to initialize:', error);
    showError('Failed to initialize Strudel: ' + error.message);
  }
}

// Setup all event listeners
function setupEventListeners() {
  // Play button - needs user interaction to start audio
  elements.playBtn.addEventListener('click', async () => {
    if (!state.audioInitialized) {
      await initAudio();
    }
    play();
  });

  // Stop button
  elements.stopBtn.addEventListener('click', stop);

  // Shuffle button - random preset
  elements.shuffleBtn.addEventListener('click', shufflePreset);

  // Clear button
  elements.clearBtn.addEventListener('click', () => {
    stop();
    elements.codeEditor.value = '';
    hideError();
    saveCode();
  });

  // BPM controls
  elements.bpmUp.addEventListener('click', () => changeBpm(5));
  elements.bpmDown.addEventListener('click', () => changeBpm(-5));

  // Presets drawer toggle
  elements.presetsToggle.addEventListener('click', togglePresetsDrawer);

  // Quick insert buttons
  elements.quickInsertBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      insertCode(btn.dataset.insert);
    });
  });

  // Save code on change (debounced)
  let saveTimeout;
  elements.codeEditor.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCode, 500);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to evaluate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!state.audioInitialized) {
        initAudio().then(play);
      } else {
        play();
      }
    }
    // Escape or Ctrl/Cmd + . to stop
    if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === '.')) {
      e.preventDefault();
      stop();
    }
  });

  // Handle visibility change (pause when hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.isPlaying) {
      // Optionally stop when app goes to background
      // stop();
    }
  });
}

// Initialize audio context (requires user interaction)
async function initAudio() {
  if (state.audioInitialized) return;

  try {
    await initAudioOnFirstClick();
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    state.audioInitialized = true;
  } catch (error) {
    console.error('Audio init error:', error);
    showError('Failed to initialize audio. Tap play again.');
  }
}

// Play/evaluate the current pattern
async function play() {
  const code = elements.codeEditor.value.trim();

  if (!code) {
    showError('Write some code first!');
    return;
  }

  try {
    hideError();

    // Stop any current playback
    if (state.repl) {
      state.repl.stop();
    }

    // Evaluate the code with current BPM
    const fullCode = `setcps(${state.bpm / 60 / 4})\n${code}`;
    await state.repl.evaluate(fullCode);

    state.isPlaying = true;
    elements.playBtn.classList.add('playing');

  } catch (error) {
    showError(error.message || 'Evaluation error');
    state.isPlaying = false;
    elements.playBtn.classList.remove('playing');
  }
}

// Stop playback
function stop() {
  if (state.repl) {
    state.repl.stop();
  }
  state.isPlaying = false;
  elements.playBtn.classList.remove('playing');
}

// Change BPM
function changeBpm(delta) {
  state.bpm = Math.max(40, Math.min(300, state.bpm + delta));
  elements.bpmDisplay.textContent = state.bpm;

  // If playing, update the tempo
  if (state.isPlaying) {
    play();
  }
}

// Show error message
function showError(message) {
  elements.errorDisplay.textContent = message;
  elements.errorDisplay.classList.remove('hidden');
}

// Hide error message
function hideError() {
  elements.errorDisplay.classList.add('hidden');
}

// Toggle presets drawer
function togglePresetsDrawer() {
  elements.presetsDrawer.classList.toggle('open');
}

// Render preset buttons
function renderPresets() {
  elements.presetsGrid.innerHTML = PRESETS.map((preset, index) => `
    <button class="preset-btn" data-index="${index}">
      <span class="preset-name">${preset.name}</span>
      <span class="preset-desc">${preset.desc}</span>
    </button>
  `).join('');

  // Add click handlers
  elements.presetsGrid.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      loadPreset(index);
    });
  });
}

// Load a preset
function loadPreset(index) {
  const preset = PRESETS[index];
  if (preset) {
    elements.codeEditor.value = preset.code;
    saveCode();
    elements.presetsDrawer.classList.remove('open');

    // Optionally auto-play
    if (state.audioInitialized) {
      play();
    }
  }
}

// Random preset
function shufflePreset() {
  const randomIndex = Math.floor(Math.random() * PRESETS.length);
  loadPreset(randomIndex);
}

// Insert code at cursor
function insertCode(text) {
  const editor = elements.codeEditor;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const value = editor.value;

  editor.value = value.substring(0, start) + text + value.substring(end);

  // Position cursor appropriately
  const cursorPos = start + text.indexOf('""') + 1;
  if (text.includes('""')) {
    editor.setSelectionRange(cursorPos, cursorPos);
  } else {
    editor.setSelectionRange(start + text.length, start + text.length);
  }

  editor.focus();
  saveCode();
}

// Save code to localStorage
function saveCode() {
  try {
    localStorage.setItem('choonz-code', elements.codeEditor.value);
    localStorage.setItem('choonz-bpm', state.bpm.toString());
  } catch (e) {
    // localStorage might not be available
  }
}

// Load saved code from localStorage
function loadSavedCode() {
  try {
    const savedCode = localStorage.getItem('choonz-code');
    const savedBpm = localStorage.getItem('choonz-bpm');

    if (savedCode) {
      elements.codeEditor.value = savedCode;
    }

    if (savedBpm) {
      state.bpm = parseInt(savedBpm, 10) || 120;
      elements.bpmDisplay.textContent = state.bpm;
    }
  } catch (e) {
    // localStorage might not be available
  }
}

// Setup simple waveform visualizer
function setupVisualizer() {
  const canvas = elements.vizCanvas;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  }

  resize();
  window.addEventListener('resize', resize);

  // Animation colors
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#00d9ff');
  gradient.addColorStop(0.5, '#ff6b9d');
  gradient.addColorStop(1, '#c678dd');

  let animationId;
  let phase = 0;

  function draw() {
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    if (!state.isPlaying) {
      // Draw flat line when not playing
      ctx.strokeStyle = '#606070';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else {
      // Draw animated waveform when playing
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();

      const segments = 100;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        const frequency = 3 + Math.sin(phase * 0.5) * 2;
        const amplitude = (height / 4) * (0.5 + Math.sin(phase * 0.7) * 0.5);
        const y = height / 2 + Math.sin((i / segments) * Math.PI * frequency + phase) * amplitude;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      phase += 0.08;
    }

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

// Start the app
init().catch(console.error);
