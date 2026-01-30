// specialized sound synthesizer for space UI
const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

export const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.15; // Lower Master volume for mobile safety
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const createOscillator = (type: OscillatorType, freq: number, duration: number, vol = 0.5) => {
    if (!audioCtx || !masterGain) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

export const playSound = {
    hover: () => {
        // High-pitched short blip
        createOscillator('sine', 1200, 0.05, 0.1);
        createOscillator('triangle', 2000, 0.05, 0.05);
    },
    click: () => {
        // Mechanical click
        createOscillator('square', 800, 0.1, 0.1);
        createOscillator('sawtooth', 400, 0.1, 0.1);
    },
    type: () => {
        // Soft keystroke
        createOscillator('triangle', 800 + Math.random() * 200, 0.03, 0.15);
    },
    warpHandler: () => {
        // Buildup sound
        if (!audioCtx || !masterGain) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(8000, audioCtx.currentTime + 1.5);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime); // Reduced from 0.3
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    },
    success: () => {
        // Victory chord
        createOscillator('sine', 440, 0.5, 0.3);
        setTimeout(() => createOscillator('sine', 554, 0.5, 0.3), 100);
        setTimeout(() => createOscillator('sine', 659, 1.0, 0.3), 200);
    },
    error: () => {
        // Low buzzer
        createOscillator('sawtooth', 150, 0.3, 0.2); // Reduced from 0.4
        createOscillator('sawtooth', 100, 0.3, 0.2);
    }
};
