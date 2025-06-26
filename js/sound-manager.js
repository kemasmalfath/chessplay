// Sound Management
class SoundManager {
  constructor() {
    this.audioContext = null
    this.soundEnabled = true
    this.initializeAudio()
  }

  initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn("Audio context not supported")
    }
  }

  createSound(frequency, duration, volume) {
    return () => {
      if (!this.soundEnabled || !this.audioContext) return

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    }
  }

  playMoveSound() {
    this.createSound(440, 0.1, 0.1)()
  }

  playCaptureSound() {
    this.createSound(220, 0.2, 0.15)()
  }

  playCheckSound() {
    this.createSound(880, 0.3, 0.2)()
  }

  playCheckmateSound() {
    this.createSound(110, 0.5, 0.3)()
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled
  }
}

// Make SoundManager available globally
window.SoundManager = SoundManager
