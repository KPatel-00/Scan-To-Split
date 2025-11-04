// Sound effects utility for premium micro-interactions

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('sounds-enabled') !== 'false';
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext!;
  }

  // Generate sound using Web Audio API (no external files needed)
  private createSound(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Predefined sound effects
  click(): void {
    this.createSound(800, 0.05, 'sine');
  }

  success(): void {
    if (!this.enabled) return;
    
    // Two-tone success sound
    setTimeout(() => this.createSound(523.25, 0.1, 'sine'), 0);   // C5
    setTimeout(() => this.createSound(659.25, 0.15, 'sine'), 80);  // E5
  }

  error(): void {
    if (!this.enabled) return;
    
    // Descending error sound
    setTimeout(() => this.createSound(400, 0.1, 'square'), 0);
    setTimeout(() => this.createSound(300, 0.15, 'square'), 70);
  }

  toggleSound(): void {
    this.createSound(600, 0.08, 'triangle');
  }

  notification(): void {
    if (!this.enabled) return;
    
    // Pleasant notification chime
    setTimeout(() => this.createSound(880, 0.1, 'sine'), 0);    // A5
    setTimeout(() => this.createSound(1046.5, 0.1, 'sine'), 60); // C6
  }

  scan(): void {
    if (!this.enabled) return;
    
    // Scanning beep
    setTimeout(() => this.createSound(1200, 0.05, 'square'), 0);
    setTimeout(() => this.createSound(1400, 0.05, 'square'), 60);
  }

  complete(): void {
    if (!this.enabled) return;
    
    // Achievement/completion sound
    setTimeout(() => this.createSound(523.25, 0.1, 'sine'), 0);   // C5
    setTimeout(() => this.createSound(659.25, 0.1, 'sine'), 100); // E5
    setTimeout(() => this.createSound(783.99, 0.2, 'sine'), 200); // G5
  }

  pop(): void {
    this.createSound(1000, 0.04, 'sine');
  }

  whoosh(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  // Control methods
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sounds-enabled', enabled.toString());
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): void {
    this.setEnabled(!this.enabled);
  }
}

// Haptic feedback utility
class HapticManager {
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('haptics-enabled') !== 'false';
    }
  }

  private vibrate(pattern: number | number[]): void {
    if (!this.enabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    }
  }

  light(): void {
    this.vibrate(10);
  }

  medium(): void {
    this.vibrate(20);
  }

  heavy(): void {
    this.vibrate(30);
  }

  success(): void {
    this.vibrate([10, 50, 10]);
  }

  error(): void {
    this.vibrate([50, 100, 50]);
  }

  notification(): void {
    this.vibrate([10, 30, 10, 30]);
  }

  selection(): void {
    this.vibrate(5);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('haptics-enabled', enabled.toString());
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): void {
    this.setEnabled(!this.enabled);
  }
}

// Export singleton instances
export const sound = new SoundManager();
export const haptic = new HapticManager();

// Combined feedback function for common actions
export const feedback = {
  click: () => {
    sound.click();
    haptic.light();
  },
  
  success: () => {
    sound.success();
    haptic.success();
  },
  
  error: () => {
    sound.error();
    haptic.error();
  },
  
  toggle: () => {
    sound.toggleSound();
    haptic.selection();
  },
  
  scan: () => {
    sound.scan();
    haptic.medium();
  },
  
  complete: () => {
    sound.complete();
    haptic.success();
  },
  
  notification: () => {
    sound.notification();
    haptic.notification();
  },
  
  select: () => {
    sound.pop();
    haptic.selection();
  },
};
