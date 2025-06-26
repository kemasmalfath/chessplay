// UI Management
class UIManager {
  constructor(gameInstance) {
    this.game = gameInstance
  }

  updateDisplay() {
    // Update current player
    document.getElementById("current-player").textContent =
      this.game.gameLogic.currentPlayer.charAt(0).toUpperCase() + this.game.gameLogic.currentPlayer.slice(1)

    // Update captured pieces
    document.getElementById("captured-white").innerHTML = this.game.gameLogic.capturedPieces.white
      .map((piece) => `<span class="captured-piece">${window.ChessUtils.getPieceSymbol(piece)}</span>`)
      .join("")

    document.getElementById("captured-black").innerHTML = this.game.gameLogic.capturedPieces.black
      .map((piece) => `<span class="captured-piece">${window.ChessUtils.getPieceSymbol(piece)}</span>`)
      .join("")

    // Update button states
    document.getElementById("undo-btn").disabled = !this.game.historyManager.canUndo()
    document.getElementById("redo-btn").disabled = !this.game.historyManager.canRedo()
  }

  updateAIButton() {
    const button = document.getElementById("ai-toggle-btn")
    button.textContent = this.game.isAIEnabled ? "vs Human" : "vs AI"
    button.style.background = this.game.isAIEnabled
      ? "linear-gradient(45deg, #e74c3c, #c0392b)"
      : "linear-gradient(45deg, #667eea, #764ba2)"
  }

  showGameStatus(message) {
    document.getElementById("game-status").textContent = message
  }

  showCheckStatus(message) {
    document.getElementById("check-status").textContent = message
  }

  clearStatus() {
    document.getElementById("game-status").textContent = ""
    document.getElementById("check-status").textContent = ""
  }

  setupEventListeners() {
    // New Game
    document.getElementById("new-game-btn").addEventListener("click", () => {
      this.game.newGame()
    })

    // Undo/Redo
    document.getElementById("undo-btn").addEventListener("click", () => {
      this.game.undoMove()
    })

    document.getElementById("redo-btn").addEventListener("click", () => {
      this.game.redoMove()
    })

    // Save/Load
    document.getElementById("save-btn").addEventListener("click", () => {
      this.game.saveLoadManager.saveGame()
    })

    document.getElementById("load-btn").addEventListener("click", () => {
      this.game.saveLoadManager.loadGame()
    })

    // AI Toggle
    document.getElementById("ai-toggle-btn").addEventListener("click", () => {
      this.game.toggleAI()
    })

    // AI Difficulty
    document.getElementById("ai-difficulty").addEventListener("change", (e) => {
      this.game.aiEngine.setDifficulty(e.target.value)
    })

    // Sound Toggle
    document.getElementById("sound-toggle").addEventListener("change", (e) => {
      this.game.soundManager.setSoundEnabled(e.target.checked)
    })

    // Timer Selection
    document.getElementById("timer-select").addEventListener("change", (e) => {
      const time = Number.parseInt(e.target.value)
      this.game.timerManager.setTimers(time)
    })

    // Board Click Events
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("square")) {
        const row = Number.parseInt(e.target.dataset.row)
        const col = Number.parseInt(e.target.dataset.col)
        this.game.handleSquareClick(row, col)
      }
    })
  }
}

// Make UIManager available globally
window.UIManager = UIManager
