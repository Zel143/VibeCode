export function playSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    switch (type) {
      case 'correct': {
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.4);
        break;
      }
      case 'wrong': {
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime + 0.15);
        oscillator.gain && gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
        break;
      }
      case 'complete': {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gn = audioCtx.createGain();
          osc.connect(gn);
          gn.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);
          gn.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.12);
          gn.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.12 + 0.3);
          osc.start(audioCtx.currentTime + i * 0.12);
          osc.stop(audioCtx.currentTime + i * 0.12 + 0.3);
        });
        break;
      }
      case 'click': {
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.05);
        break;
      }
      case 'levelup': {
        const freqs = [440, 554.37, 659.25, 880];
        freqs.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gn = audioCtx.createGain();
          osc.connect(gn);
          gn.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
          gn.gain.setValueAtTime(0.25, audioCtx.currentTime + i * 0.15);
          gn.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.4);
          osc.start(audioCtx.currentTime + i * 0.15);
          osc.stop(audioCtx.currentTime + i * 0.15 + 0.4);
        });
        break;
      }
      default:
        break;
    }
  } catch (e) {
    // Audio not supported, silently fail
  }
}
