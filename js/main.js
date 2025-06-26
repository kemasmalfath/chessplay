// Main Game Class - Orchestrates all components
class AdvancedChessGame {
  constructor() {
    this.initializeComponents()
    this.setupGame()
  }

  initializeComponents() {
    // Initialize all managers
    this.soundManager = new window.SoundManager()
    this.boardManager = new window.BoardManager()
    this.moveValidator = new window.MoveValidator(this.boardManager)
    this.gameLogic = new window.GameLogic(this.boardManager, this.moveValidator, this.soundManager)
    this.aiEngine = new window.AIEngine(this.boardManager, this.moveValidator)
    this.timerManager = new window.TimerManager()
    this.historyManager = new window.HistoryManager()
    this.saveLoadManager = new window.SaveLoadManager(this)
    this.uiManager = new window.UIManager(this)

    // Game state
    this.isAIEnabled = false
    this.selectedSquare = null
  }

  setupGame() {
    // Setup timer callback
    this.timerManager.setGameEndCallback((message) => {
      this.gameLogic.gameOver = true
      this.uiManager.showGameStatus(message)
      this.timerManager.stop()
    })

    // Setup UI event listeners
    this.uiManager.setupEventListeners()

    // Initialize display
    this.boardManager.createBoardHTML()
    this.uiManager.updateDisplay()
    this.timerManager.start()

    // Try to load saved game
    this.saveLoadManager.loadFromLocalStorage()
  }

  handleSquareClick(row, col) {
    if (this.gameLogic.gameOver) return
    if (this.isAIEnabled && this.gameLogic.currentPlayer === "black") return

    const clickedPiece = this.boardManager.getPiece(row, col)

    if (this.selectedSquare) {
      const [selectedRow, selectedCol] = this.selectedSquare

      if (selectedRow === row && selectedCol === col) {
        // Deselect current square
        this.selectedSquare = null
        this.boardManager.clearHighlights()
        return
      }

      if (this.moveValidator.isValidMove(selectedRow, selectedCol, row, col)) {
        const move = this.gameLogic.makeMove(selectedRow, selectedCol, row, col)
        this.historyManager.addMove(move)
        this.selectedSquare = null
        this.boardManager.clearHighlights()

        if (!this.gameLogic.gameOver) {
          this.gameLogic.switchPlayer()
          this.timerManager.switchPlayer(this.gameLogic.currentPlayer)
          this.uiManager.updateDisplay()

          if (this.isAIEnabled && this.gameLogic.currentPlayer === "black") {
            setTimeout(() => this.makeAIMove(), 500)
          }
        }
      } else {
        if (clickedPiece && clickedPiece.color === this.gameLogic.currentPlayer) {
          this.selectedSquare = [row, col]
          const validMoves = this.moveValidator
            .getAllValidMoves(this.gameLogic.currentPlayer)
            .filter((move) => move.from[0] === row && move.from[1] === col)
          this.boardManager.highlightValidMoves(row, col, validMoves)
        } else {
          this.selectedSquare = null
          this.boardManager.clearHighlights()
        }
      }
    } else {
      if (clickedPiece && clickedPiece.color === this.gameLogic.currentPlayer) {
        this.selectedSquare = [row, col]
        const validMoves = this.moveValidator
          .getAllValidMoves(this.gameLogic.currentPlayer)
          .filter((move) => move.from[0] === row && move.from[1] === col)
        this.boardManager.highlightValidMoves(row, col, validMoves)
      }
    }
  }

  makeAIMove() {
    if (this.gameLogic.gameOver) return

    const bestMove = this.aiEngine.getBestMove("black")
    if (bestMove) {
      const [fromRow, fromCol] = bestMove.from
      const [toRow, toCol] = bestMove.to
      const move = this.gameLogic.makeMove(fromRow, fromCol, toRow, toCol)
      this.historyManager.addMove(move)

      if (!this.gameLogic.gameOver) {
        this.gameLogic.switchPlayer()
        this.timerManager.switchPlayer(this.gameLogic.currentPlayer)
        this.uiManager.updateDisplay()
      }
    }
  }

  undoMove() {
    const move = this.historyManager.undo()
    if (!move) return

    // Restore board state from move
    this.boardManager.board = window.ChessUtils.cloneBoard(move.boardState)

    // Restore captured pieces
    if (move.captured) {
      const capturedArray = this.gameLogic.capturedPieces[move.captured.color]
      const index = capturedArray.findIndex((p) => p.type === move.captured.type)
      if (index > -1) {
        capturedArray.splice(index, 1)
      }
    }

    this.gameLogic.currentPlayer = move.color
    this.timerManager.switchPlayer(this.gameLogic.currentPlayer)
    this.boardManager.createBoardHTML()
    this.uiManager.updateDisplay()
  }

  redoMove() {
    const move = this.historyManager.redo()
    if (!move) return

    // Apply the move
    this.boardManager.board = window.ChessUtils.cloneBoard(move.boardState)

    if (move.captured) {
      this.gameLogic.capturedPieces[move.captured.color].push(move.captured)
    }

    this.gameLogic.currentPlayer = window.ChessUtils.getOpponentColor(move.color)
    this.timerManager.switchPlayer(this.gameLogic.currentPlayer)
    this.boardManager.createBoardHTML()
    this.uiManager.updateDisplay()
  }

  toggleAI() {
    this.isAIEnabled = !this.isAIEnabled
    this.uiManager.updateAIButton()

    if (this.isAIEnabled && this.gameLogic.currentPlayer === "black" && !this.gameLogic.gameOver) {
      setTimeout(() => this.makeAIMove(), 500)
    }
  }

  newGame() {
    this.timerManager.stop()
    this.gameLogic.resetGame()
    this.historyManager.reset()
    this.selectedSquare = null

    const timerValue = Number.parseInt(document.getElementById("timer-select").value)
    this.timerManager.reset(timerValue)

    this.boardManager.createBoardHTML()
    this.uiManager.updateDisplay()
    this.uiManager.clearStatus()
    this.timerManager.start()
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new AdvancedChessGame()
})
