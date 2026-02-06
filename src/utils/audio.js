let ctx = null;
let reelOsc = null;
let reelGain = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

export function playSplash() {
  const ac = getCtx();
  const bufferSize = ac.sampleRate * 0.4;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ac.createBufferSource();
  source.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1200, ac.currentTime);
  filter.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.4);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.3, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  source.start();
  source.stop(ac.currentTime + 0.4);
}

export function playBite() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.1);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.25, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.1);
}

export function playReel() {
  stopReel();
  const ac = getCtx();
  reelOsc = ac.createOscillator();
  reelOsc.type = "sawtooth";
  reelOsc.frequency.setValueAtTime(120, ac.currentTime);
  reelGain = ac.createGain();
  reelGain.gain.setValueAtTime(0.08, ac.currentTime);
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, ac.currentTime);
  reelOsc.connect(filter);
  filter.connect(reelGain);
  reelGain.connect(ac.destination);
  reelOsc.start();
}

export function stopReel() {
  if (reelOsc) {
    try { reelOsc.stop(); } catch {}
    reelOsc = null;
  }
  reelGain = null;
}

export function updateReelTension(t) {
  if (!reelOsc || !reelGain) return;
  const ac = getCtx();
  const freq = 120 + t * 4;
  reelOsc.frequency.setValueAtTime(freq, ac.currentTime);
  reelGain.gain.setValueAtTime(0.08 + t * 0.002, ac.currentTime);
}

export function playCatch(rarity) {
  const ac = getCtx();
  const notes = {
    common:    [523],
    uncommon:  [523, 659],
    rare:      [523, 659, 784],
    epic:      [523, 659, 784, 1047],
    legendary: [523, 659, 784, 1047, 1319],
    mythic:    [523, 659, 784, 1047, 1319, 1568],
  };
  const seq = notes[rarity] || notes.common;
  const step = 0.12;
  seq.forEach((freq, i) => {
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ac.currentTime + i * step);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, ac.currentTime + i * step);
    gain.gain.linearRampToValueAtTime(0.2, ac.currentTime + i * step + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * step + step * 1.5);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + i * step);
    osc.stop(ac.currentTime + i * step + step * 2);
  });
}

export function playEscape() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.5);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.2, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.5);
}

export function playLevelUp() {
  const ac = getCtx();
  const notes = [523, 659, 784, 1047];
  const step = 0.15;
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ac.currentTime + i * step);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, ac.currentTime + i * step);
    gain.gain.linearRampToValueAtTime(0.25, ac.currentTime + i * step + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * step + 0.3);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + i * step);
    osc.stop(ac.currentTime + i * step + 0.35);
  });
}
