// Timer Management
class TimerManager {
  constructor() {
    this.timers = { white: 600, black: 600 } // 10 minutes default
    this.activeTimer = null
    this.currentPlayer = "white"
    this.gameEndCallback = null
  }

  setGameEndCallback(callback) {
    this.gameEndCallback = callback
  }

  setTimers(time) {
    this.timers = { white: time, black: time }
    this.updateDisplay()
  }

  start() {
    if (this.timers.white === 0) return

    this.activeTimer = setInterval(() => {
      this.timers[this.currentPlayer]--

      if (this.timers[this.currentPlayer] <= 0) {
        this.stop()
        const winner = window.ChessUtils.getOpponentColor(this.currentPlayer)
        if (this.gameEndCallback) {
          this.gameEndCallback(`${winner.charAt(0).toUpperCase() + winner.slice(1)} wins on time!`)
        }
      }

      this.updateDisplay()
    }, 1000)
  }

  stop() {
    if (this.activeTimer) {
      clearInterval(this.activeTimer)
      this.activeTimer = null
    }
  }

  switchPlayer(newPlayer) {
    this.currentPlayer = newPlayer
    this.updateActiveTimer()
  }

  updateActiveTimer() {
    document.getElementById("white-timer").classList.remove("active")
    document.getElementById("black-timer").classList.remove("active")
    document.getElementById(`${this.currentPlayer}-timer`).classList.add("active")
  }

  updateDisplay() {
    document.getElementById("white-timer").textContent = window.ChessUtils.formatTime(this.timers.white)
    document.getElementById("black-timer").textContent = window.ChessUtils.formatTime(this.timers.black)
  }

  reset(time = 600) {
    this.stop()
    this.timers = { white: time, black: time }
    this.currentPlayer = "white"
    this.updateDisplay()
    this.updateActiveTimer()
  }
}

// Make TimerManager available globally
window.TimerManager = TimerManager
