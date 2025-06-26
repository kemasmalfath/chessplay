// Save/Load Game Management
class SaveLoadManager {
  constructor(gameInstance) {
    this.game = gameInstance
  }

  saveGame() {
    const gameState = {
      board: this.game.boardManager.board,
      currentPlayer: this.game.gameLogic.currentPlayer,
      capturedPieces: this.game.gameLogic.capturedPieces,
      timers: this.game.timerManager.timers,
      castlingRights: this.game.boardManager.castlingRights,
      kingPositions: this.game.boardManager.kingPositions,
      enPassantTarget: this.game.boardManager.enPassantTarget,
      history: this.game.historyManager.getHistory(),
      gameOver: this.game.gameLogic.gameOver,
      isAIEnabled: this.game.isAIEnabled,
      aiDifficulty: this.game.aiEngine.difficulty,
    }

    const gameData = JSON.stringify(gameState, null, 2)

    // Save to localStorage
    localStorage.setItem("chessGameSave", gameData)

    // Create download link
    const blob = new Blob([gameData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chess_game_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)

    console.log("Game saved successfully!")
  }

  loadGame() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const gameState = JSON.parse(e.target.result)
          this.restoreGameState(gameState)
          console.log("Game loaded successfully!")
        } catch (error) {
          alert("Invalid save file!")
          console.error("Load error:", error)
        }
      }
      reader.readAsText(file)
    }

    input.click()
  }

  restoreGameState(gameState) {
    // Restore board state
    this.game.boardManager.board = gameState.board || this.game.boardManager.initializeBoard()
    this.game.boardManager.castlingRights = gameState.castlingRights || {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    }
    this.game.boardManager.kingPositions = gameState.kingPositions || { white: [7, 4], black: [0, 4] }
    this.game.boardManager.enPassantTarget = gameState.enPassantTarget || null

    // Restore game logic state
    this.game.gameLogic.currentPlayer = gameState.currentPlayer || "white"
    this.game.gameLogic.capturedPieces = gameState.capturedPieces || { white: [], black: [] }
    this.game.gameLogic.gameOver = gameState.gameOver || false

    // Restore timer state
    this.game.timerManager.timers = gameState.timers || { white: 600, black: 600 }
    this.game.timerManager.currentPlayer = this.game.gameLogic.currentPlayer

    // Restore history
    if (gameState.history) {
      this.game.historyManager.setHistory(gameState.history.moves, gameState.history.index)
    }

    // Restore AI settings
    if (gameState.isAIEnabled !== undefined) {
      this.game.isAIEnabled = gameState.isAIEnabled
      this.game.uiManager.updateAIButton()
    }
    if (gameState.aiDifficulty) {
      this.game.aiEngine.setDifficulty(gameState.aiDifficulty)
      document.getElementById("ai-difficulty").value = gameState.aiDifficulty
    }

    // Update display
    this.game.uiManager.updateDisplay()
    this.game.boardManager.createBoardHTML()
    this.game.timerManager.updateDisplay()
  }

  loadFromLocalStorage() {
    const savedGame = localStorage.getItem("chessGameSave")
    if (savedGame) {
      try {
        const gameState = JSON.parse(savedGame)
        this.restoreGameState(gameState)
        return true
      } catch (error) {
        console.error("Failed to load from localStorage:", error)
        return false
      }
    }
    return false
  }
}

// Make SaveLoadManager available globally
window.SaveLoadManager = SaveLoadManager
