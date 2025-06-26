class AdvancedChessGame {
  constructor() {
    this.board = this.initializeBoard()
    this.currentPlayer = "white"
    this.selectedSquare = null
    this.gameOver = false
    this.capturedPieces = { white: [], black: [] }
    this.moveHistory = []
    this.historyIndex = -1
    this.isAIEnabled = false
    this.aiDifficulty = "medium"
    this.soundEnabled = true
    this.timers = { white: 600, black: 600 } // 10 minutes default
    this.activeTimer = null
    this.gameStartTime = null
    this.lastMove = null
    this.enPassantTarget = null
    this.castlingRights = {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    }
    this.kingPositions = { white: [7, 4], black: [0, 4] }

    this.initializeGame()
    this.setupEventListeners()
    this.createBoard()
    this.updateDisplay()
    this.startTimer()
  }

  initializeGame() {
    // Initialize audio context for sound effects
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.sounds = {
      move: this.createSound(440, 0.1, 0.1),
      capture: this.createSound(220, 0.2, 0.15),
      check: this.createSound(880, 0.3, 0.2),
      checkmate: this.createSound(110, 0.5, 0.3),
    }
  }

  createSound(frequency, duration, volume) {
    return () => {
      if (!this.soundEnabled) return

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

  setupEventListeners() {
    document.getElementById("new-game-btn").addEventListener("click", () => this.newGame())
    document.getElementById("undo-btn").addEventListener("click", () => this.undoMove())
    document.getElementById("redo-btn").addEventListener("click", () => this.redoMove())
    document.getElementById("save-btn").addEventListener("click", () => this.saveGame())
    document.getElementById("load-btn").addEventListener("click", () => this.loadGame())
    document.getElementById("ai-toggle-btn").addEventListener("click", () => this.toggleAI())
    document.getElementById("ai-difficulty").addEventListener("change", (e) => {
      this.aiDifficulty = e.target.value
    })
    document.getElementById("sound-toggle").addEventListener("change", (e) => {
      this.soundEnabled = e.target.checked
    })
    document.getElementById("timer-select").addEventListener("change", (e) => {
      const time = Number.parseInt(e.target.value)
      this.timers = { white: time, black: time }
      this.updateTimerDisplay()
    })
  }

  initializeBoard() {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Place pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: "pawn", color: "black", hasMoved: false }
      board[6][i] = { type: "pawn", color: "white", hasMoved: false }
    }

    // Place other pieces
    const pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: pieceOrder[i], color: "black", hasMoved: false }
      board[7][i] = { type: pieceOrder[i], color: "white", hasMoved: false }
    }

    return board
  }

  createBoard() {
    const chessboard = document.getElementById("chessboard")
    chessboard.innerHTML = ""

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div")
        square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`
        square.dataset.row = row
        square.dataset.col = col

        // Highlight last move
        if (
          this.lastMove &&
          ((this.lastMove.from[0] === row && this.lastMove.from[1] === col) ||
            (this.lastMove.to[0] === row && this.lastMove.to[1] === col))
        ) {
          square.classList.add("last-move")
        }

        // Check if king is in check
        if (this.isInCheck(this.currentPlayer)) {
          const kingPos = this.kingPositions[this.currentPlayer]
          if (kingPos[0] === row && kingPos[1] === col) {
            square.classList.add("in-check")
          }
        }

        const piece = this.board[row][col]
        if (piece) {
          square.textContent = this.getPieceSymbol(piece)
        }

        square.addEventListener("click", () => this.handleSquareClick(row, col))
        chessboard.appendChild(square)
      }
    }
  }

  getPieceSymbol(piece) {
    const symbols = {
      white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
      },
      black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
      },
    }
    return symbols[piece.color][piece.type]
  }

  handleSquareClick(row, col) {
    if (this.gameOver) return
    if (this.isAIEnabled && this.currentPlayer === "black") return

    const clickedPiece = this.board[row][col]

    if (this.selectedSquare) {
      const [selectedRow, selectedCol] = this.selectedSquare

      if (selectedRow === row && selectedCol === col) {
        this.selectedSquare = null
        this.clearHighlights()
        return
      }

      if (this.isValidMove(selectedRow, selectedCol, row, col)) {
        this.makeMove(selectedRow, selectedCol, row, col)
        this.selectedSquare = null
        this.clearHighlights()

        if (!this.gameOver) {
          this.switchPlayer()
          this.updateDisplay()

          if (this.isAIEnabled && this.currentPlayer === "black") {
            setTimeout(() => this.makeAIMove(), 500)
          }
        }
      } else {
        if (clickedPiece && clickedPiece.color === this.currentPlayer) {
          this.selectedSquare = [row, col]
          this.highlightValidMoves(row, col)
        } else {
          this.selectedSquare = null
          this.clearHighlights()
        }
      }
    } else {
      if (clickedPiece && clickedPiece.color === this.currentPlayer) {
        this.selectedSquare = [row, col]
        this.highlightValidMoves(row, col)
      }
    }
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    const targetPiece = this.board[toRow][toCol]

    if (!piece) return false
    if (targetPiece && targetPiece.color === piece.color) return false
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false

    // Check basic piece movement
    let isValidBasicMove = false
    switch (piece.type) {
      case "pawn":
        isValidBasicMove = this.isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color)
        break
      case "rook":
        isValidBasicMove = this.isValidRookMove(fromRow, fromCol, toRow, toCol)
        break
      case "knight":
        isValidBasicMove = this.isValidKnightMove(fromRow, fromCol, toRow, toCol)
        break
      case "bishop":
        isValidBasicMove = this.isValidBishopMove(fromRow, fromCol, toRow, toCol)
        break
      case "queen":
        isValidBasicMove = this.isValidQueenMove(fromRow, fromCol, toRow, toCol)
        break
      case "king":
        isValidBasicMove = this.isValidKingMove(fromRow, fromCol, toRow, toCol)
        break
    }

    if (!isValidBasicMove) return false

    // Check if move would put own king in check
    return !this.wouldBeInCheckAfterMove(fromRow, fromCol, toRow, toCol)
  }

  isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
    const direction = color === "white" ? -1 : 1
    const startRow = color === "white" ? 6 : 1
    const targetPiece = this.board[toRow][toCol]

    // Forward move
    if (fromCol === toCol) {
      if (toRow === fromRow + direction && !targetPiece) return true
      if (fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece) return true
    }

    // Diagonal capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      if (targetPiece) return true

      // En passant
      if (this.enPassantTarget && this.enPassantTarget[0] === toRow && this.enPassantTarget[1] === toCol) {
        return true
      }
    }

    return false
  }

  isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false
    return this.isPathClear(fromRow, fromCol, toRow, toCol)
  }

  isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(fromRow - toRow)
    const colDiff = Math.abs(fromCol - toCol)
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
  }

  isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false
    return this.isPathClear(fromRow, fromCol, toRow, toCol)
  }

  isValidQueenMove(fromRow, fromCol, toRow, toCol) {
    return (
      this.isValidRookMove(fromRow, fromCol, toRow, toCol) || this.isValidBishopMove(fromRow, fromCol, toRow, toCol)
    )
  }

  isValidKingMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(fromRow - toRow)
    const colDiff = Math.abs(fromCol - toCol)

    // Normal king move
    if (rowDiff <= 1 && colDiff <= 1) return true

    // Castling
    if (rowDiff === 0 && colDiff === 2) {
      return this.canCastle(fromRow, fromCol, toRow, toCol)
    }

    return false
  }

  canCastle(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    if (piece.hasMoved) return false
    if (this.isInCheck(piece.color)) return false

    const isKingside = toCol > fromCol
    const rookCol = isKingside ? 7 : 0
    const rook = this.board[fromRow][rookCol]

    if (!rook || rook.type !== "rook" || rook.hasMoved) return false
    if (!this.castlingRights[piece.color][isKingside ? "kingside" : "queenside"]) return false

    // Check path is clear
    const start = Math.min(fromCol, rookCol) + 1
    const end = Math.max(fromCol, rookCol)
    for (let col = start; col < end; col++) {
      if (this.board[fromRow][col]) return false
    }

    // Check king doesn't pass through check
    const step = isKingside ? 1 : -1
    for (let col = fromCol; col !== toCol + step; col += step) {
      if (this.wouldBeInCheckAfterMove(fromRow, fromCol, fromRow, col)) return false
    }

    return true
  }

  isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0

    let currentRow = fromRow + rowStep
    let currentCol = fromCol + colStep

    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol]) return false
      currentRow += rowStep
      currentCol += colStep
    }

    return true
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    const capturedPiece = this.board[toRow][toCol]
    const moveNotation = this.getMoveNotation(fromRow, fromCol, toRow, toCol)

    // Handle special moves
    let specialMove = null

    // En passant capture
    if (piece.type === "pawn" && !capturedPiece && fromCol !== toCol) {
      const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1
      const capturedPawn = this.board[capturedPawnRow][toCol]
      this.capturedPieces[capturedPawn.color].push(capturedPawn)
      this.board[capturedPawnRow][toCol] = null
      specialMove = "enpassant"
    }

    // Castling
    if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
      const isKingside = toCol > fromCol
      const rookFromCol = isKingside ? 7 : 0
      const rookToCol = isKingside ? 5 : 3
      const rook = this.board[fromRow][rookFromCol]

      this.board[fromRow][rookToCol] = rook
      this.board[fromRow][rookFromCol] = null
      rook.hasMoved = true
      specialMove = "castling"
    }

    // Regular capture
    if (capturedPiece) {
      this.capturedPieces[capturedPiece.color].push(capturedPiece)
    }

    // Make the move
    this.board[toRow][toCol] = piece
    this.board[fromRow][fromCol] = null
    piece.hasMoved = true

    // Update king position
    if (piece.type === "king") {
      this.kingPositions[piece.color] = [toRow, toCol]
    }

    // Set en passant target
    this.enPassantTarget = null
    if (piece.type === "pawn" && Math.abs(fromRow - toRow) === 2) {
      this.enPassantTarget = [fromRow + (toRow - fromRow) / 2, toCol]
    }

    // Handle pawn promotion
    if (piece.type === "pawn" && (toRow === 0 || toRow === 7)) {
      this.handlePawnPromotion(toRow, toCol)
      return
    }

    // Record move
    const move = {
      from: [fromRow, fromCol],
      to: [toRow, toCol],
      piece: piece.type,
      color: piece.color,
      captured: capturedPiece,
      notation: moveNotation,
      specialMove: specialMove,
      boardState: this.cloneBoard(),
    }

    this.recordMove(move)
    this.lastMove = move

    // Play sound
    if (capturedPiece) {
      this.sounds.capture()
    } else {
      this.sounds.move()
    }

    this.createBoard()
    this.checkGameEnd()
  }

  handlePawnPromotion(row, col) {
    const piece = this.board[row][col]
    const modal = document.getElementById("promotion-modal")
    const piecesContainer = document.getElementById("promotion-pieces")

    piecesContainer.innerHTML = ""
    const promotionPieces = ["queen", "rook", "bishop", "knight"]

    promotionPieces.forEach((pieceType) => {
      const pieceElement = document.createElement("div")
      pieceElement.className = "promotion-piece"
      pieceElement.textContent = this.getPieceSymbol({ type: pieceType, color: piece.color })
      pieceElement.addEventListener("click", () => {
        this.board[row][col] = { type: pieceType, color: piece.color, hasMoved: true }
        modal.style.display = "none"
        this.createBoard()
        this.checkGameEnd()
      })
      piecesContainer.appendChild(pieceElement)
    })

    modal.style.display = "block"
  }

  getMoveNotation(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    const files = "abcdefgh"
    const ranks = "87654321"

    const fromSquare = files[fromCol] + ranks[fromRow]
    const toSquare = files[toCol] + ranks[toRow]

    let notation = ""
    if (piece.type !== "pawn") {
      notation += piece.type.charAt(0).toUpperCase()
    }

    if (this.board[toRow][toCol]) {
      notation += "x"
    }

    notation += toSquare

    return notation
  }

  recordMove(move) {
    // Remove any moves after current position
    this.moveHistory = this.moveHistory.slice(0, this.historyIndex + 1)
    this.moveHistory.push(move)
    this.historyIndex++
    this.updateMoveHistory()
  }

  updateMoveHistory() {
    const historyList = document.getElementById("history-list")
    historyList.innerHTML = ""

    this.moveHistory.forEach((move, index) => {
      const moveElement = document.createElement("div")
      moveElement.className = "history-move"
      if (index === this.historyIndex) {
        moveElement.classList.add("current")
      }

      const moveNumber = Math.floor(index / 2) + 1
      const isWhite = move.color === "white"
      const prefix = isWhite ? `${moveNumber}.` : `${moveNumber}...`

      moveElement.textContent = `${prefix} ${move.notation}`
      moveElement.addEventListener("click", () => this.goToMove(index))
      historyList.appendChild(moveElement)
    })

    historyList.scrollTop = historyList.scrollHeight
  }

  goToMove(moveIndex) {
    // Implementation for going to specific move in history
    // This would require storing board states for each move
  }

  undoMove() {
    if (this.historyIndex < 0) return

    const move = this.moveHistory[this.historyIndex]

    // Restore board state
    this.board = this.cloneBoard(move.boardState)

    // Restore captured pieces
    if (move.captured) {
      const capturedArray = this.capturedPieces[move.captured.color]
      const index = capturedArray.findIndex((p) => p.type === move.captured.type)
      if (index > -1) {
        capturedArray.splice(index, 1)
      }
    }

    this.historyIndex--
    this.currentPlayer = move.color
    this.createBoard()
    this.updateDisplay()
    this.updateMoveHistory()
  }

  redoMove() {
    if (this.historyIndex >= this.moveHistory.length - 1) return

    this.historyIndex++
    const move = this.moveHistory[this.historyIndex]

    // Apply the move
    this.board = this.cloneBoard(move.boardState)

    if (move.captured) {
      this.capturedPieces[move.captured.color].push(move.captured)
    }

    this.currentPlayer = move.color === "white" ? "black" : "white"
    this.createBoard()
    this.updateDisplay()
    this.updateMoveHistory()
  }

  cloneBoard(board = this.board) {
    return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)))
  }

  isInCheck(color) {
    const kingPos = this.kingPositions[color]
    if (!kingPos) return false

    const opponentColor = color === "white" ? "black" : "white"

    // Check if any opponent piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col]
        if (piece && piece.color === opponentColor) {
          if (this.canPieceAttack(row, col, kingPos[0], kingPos[1])) {
            return true
          }
        }
      }
    }

    return false
  }

  canPieceAttack(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]

    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1
        return Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction
      case "rook":
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol)
      case "knight":
        return this.isValidKnightMove(fromRow, fromCol, toRow, toCol)
      case "bishop":
        return this.isValidBishopMove(fromRow, fromCol, toRow, toCol)
      case "queen":
        return this.isValidQueenMove(fromRow, fromCol, toRow, toCol)
      case "king":
        const rowDiff = Math.abs(fromRow - toRow)
        const colDiff = Math.abs(fromCol - toCol)
        return rowDiff <= 1 && colDiff <= 1
      default:
        return false
    }
  }

  wouldBeInCheckAfterMove(fromRow, fromCol, toRow, toCol) {
    // Make temporary move
    const piece = this.board[fromRow][fromCol]
    const capturedPiece = this.board[toRow][toCol]
    const originalKingPos = [...this.kingPositions[piece.color]]

    this.board[toRow][toCol] = piece
    this.board[fromRow][fromCol] = null

    if (piece.type === "king") {
      this.kingPositions[piece.color] = [toRow, toCol]
    }

    const inCheck = this.isInCheck(piece.color)

    // Restore board
    this.board[fromRow][fromCol] = piece
    this.board[toRow][toCol] = capturedPiece
    this.kingPositions[piece.color] = originalKingPos

    return inCheck
  }

  getAllValidMoves(color) {
    const moves = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col]
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove(row, col, toRow, toCol)) {
                moves.push({ from: [row, col], to: [toRow, toCol] })
              }
            }
          }
        }
      }
    }

    return moves
  }

  isCheckmate(color) {
    if (!this.isInCheck(color)) return false
    return this.getAllValidMoves(color).length === 0
  }

  isStalemate(color) {
    if (this.isInCheck(color)) return false
    return this.getAllValidMoves(color).length === 0
  }

  checkGameEnd() {
    const opponent = this.currentPlayer === "white" ? "black" : "white"

    if (this.isCheckmate(opponent)) {
      this.gameOver = true
      document.getElementById("game-status").textContent =
        `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} wins by checkmate!`
      this.sounds.checkmate()
      this.stopTimer()
    } else if (this.isStalemate(opponent)) {
      this.gameOver = true
      document.getElementById("game-status").textContent = "Draw by stalemate!"
      this.stopTimer()
    } else if (this.isInCheck(opponent)) {
      document.getElementById("check-status").textContent =
        `${opponent.charAt(0).toUpperCase() + opponent.slice(1)} is in check!`
      this.sounds.check()
    } else {
      document.getElementById("check-status").textContent = ""
    }
  }

  highlightValidMoves(row, col) {
    this.clearHighlights()

    const squares = document.querySelectorAll(".square")
    squares[row * 8 + col].classList.add("selected")

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.isValidMove(row, col, r, c)) {
          const square = squares[r * 8 + c]
          if (this.board[r][c]) {
            square.classList.add("capture-move")
          } else {
            square.classList.add("valid-move")
          }
        }
      }
    }
  }

  clearHighlights() {
    const squares = document.querySelectorAll(".square")
    squares.forEach((square) => {
      square.classList.remove("selected", "valid-move", "capture-move")
    })
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white"

    // Rotate board for black player
    const chessboard = document.getElementById("chessboard")
    if (this.currentPlayer === "black") {
      chessboard.classList.add("rotated")
    } else {
      chessboard.classList.remove("rotated")
    }

    this.switchTimer()
  }

  updateDisplay() {
    document.getElementById("current-player").textContent =
      this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)

    // Update captured pieces
    document.getElementById("captured-white").innerHTML = this.capturedPieces.white
      .map((piece) => `<span class="captured-piece">${this.getPieceSymbol(piece)}</span>`)
      .join("")

    document.getElementById("captured-black").innerHTML = this.capturedPieces.black
      .map((piece) => `<span class="captured-piece">${this.getPieceSymbol(piece)}</span>`)
      .join("")

    // Update button states
    document.getElementById("undo-btn").disabled = this.historyIndex < 0
    document.getElementById("redo-btn").disabled = this.historyIndex >= this.moveHistory.length - 1
  }

  // Timer functions
  startTimer() {
    if (this.timers.white === 0) return

    this.activeTimer = setInterval(() => {
      if (this.gameOver) {
        this.stopTimer()
        return
      }

      this.timers[this.currentPlayer]--

      if (this.timers[this.currentPlayer] <= 0) {
        this.gameOver = true
        const winner = this.currentPlayer === "white" ? "Black" : "White"
        document.getElementById("game-status").textContent = `${winner} wins on time!`
        this.stopTimer()
      }

      this.updateTimerDisplay()
    }, 1000)
  }

  stopTimer() {
    if (this.activeTimer) {
      clearInterval(this.activeTimer)
      this.activeTimer = null
    }
  }

  switchTimer() {
    document.getElementById("white-timer").classList.remove("active")
    document.getElementById("black-timer").classList.remove("active")
    document.getElementById(`${this.currentPlayer}-timer`).classList.add("active")
  }

  updateTimerDisplay() {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    document.getElementById("white-timer").textContent = formatTime(this.timers.white)
    document.getElementById("black-timer").textContent = formatTime(this.timers.black)
  }

  // AI functions
  toggleAI() {
    this.isAIEnabled = !this.isAIEnabled
    const button = document.getElementById("ai-toggle-btn")
    button.textContent = this.isAIEnabled ? "vs Human" : "vs AI"
    button.style.background = this.isAIEnabled
      ? "linear-gradient(45deg, #e74c3c, #c0392b)"
      : "linear-gradient(45deg, #667eea, #764ba2)"
  }

  makeAIMove() {
    if (this.gameOver) return

    const validMoves = this.getAllValidMoves("black")
    if (validMoves.length === 0) return

    let selectedMove

    switch (this.aiDifficulty) {
      case "easy":
        selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        break
      case "medium":
        selectedMove = this.getBestMoveSimple(validMoves)
        break
      case "hard":
        selectedMove = this.getBestMoveAdvanced(validMoves)
        break
    }

    if (selectedMove) {
      const [fromRow, fromCol] = selectedMove.from
      const [toRow, toCol] = selectedMove.to
      this.makeMove(fromRow, fromCol, toRow, toCol)
      this.switchPlayer()
      this.updateDisplay()
    }
  }

  getBestMoveSimple(moves) {
    // Simple AI: prioritize captures, then random
    const captureMoves = moves.filter((move) => this.board[move.to[0]][move.to[1]] !== null)

    if (captureMoves.length > 0) {
      return captureMoves[Math.floor(Math.random() * captureMoves.length)]
    }

    return moves[Math.floor(Math.random() * moves.length)]
  }

  getBestMoveAdvanced(moves) {
    // More advanced AI with basic evaluation
    let bestMove = null
    let bestScore = Number.NEGATIVE_INFINITY

    for (const move of moves) {
      const score = this.evaluateMove(move)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove || moves[0]
  }

  evaluateMove(move) {
    const [fromRow, fromCol] = move.from
    const [toRow, toCol] = move.to
    const piece = this.board[fromRow][fromCol]
    const capturedPiece = this.board[toRow][toCol]

    let score = 0

    // Piece values
    const pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0,
    }

    // Capture value
    if (capturedPiece) {
      score += pieceValues[capturedPiece.type] * 10
    }

    // Center control
    const centerSquares = [
      [3, 3],
      [3, 4],
      [4, 3],
      [4, 4],
    ]
    if (centerSquares.some(([r, c]) => r === toRow && c === toCol)) {
      score += 2
    }

    // Random factor
    score += Math.random() * 0.5

    return score
  }

  // Save/Load functions
  saveGame() {
    const gameState = {
      board: this.board,
      currentPlayer: this.currentPlayer,
      moveHistory: this.moveHistory,
      historyIndex: this.historyIndex,
      capturedPieces: this.capturedPieces,
      timers: this.timers,
      castlingRights: this.castlingRights,
      kingPositions: this.kingPositions,
      enPassantTarget: this.enPassantTarget,
    }

    const gameData = JSON.stringify(gameState)
    localStorage.setItem("chessGameSave", gameData)

    // Create download link
    const blob = new Blob([gameData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "chess_game_save.json"
    a.click()
    URL.revokeObjectURL(url)
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
        } catch (error) {
          alert("Invalid save file!")
        }
      }
      reader.readAsText(file)
    }

    input.click()
  }

  restoreGameState(gameState) {
    this.board = gameState.board
    this.currentPlayer = gameState.currentPlayer
    this.moveHistory = gameState.moveHistory || []
    this.historyIndex = gameState.historyIndex || -1
    this.capturedPieces = gameState.capturedPieces || { white: [], black: [] }
    this.timers = gameState.timers || { white: 600, black: 600 }
    this.castlingRights = gameState.castlingRights || {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    }
    this.kingPositions = gameState.kingPositions || { white: [7, 4], black: [0, 4] }
    this.enPassantTarget = gameState.enPassantTarget || null

    this.createBoard()
    this.updateDisplay()
    this.updateMoveHistory()
    this.updateTimerDisplay()
  }

  newGame() {
    this.stopTimer()
    this.board = this.initializeBoard()
    this.currentPlayer = "white"
    this.selectedSquare = null
    this.gameOver = false
    this.capturedPieces = { white: [], black: [] }
    this.moveHistory = []
    this.historyIndex = -1
    this.lastMove = null
    this.enPassantTarget = null
    this.castlingRights = {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    }
    this.kingPositions = { white: [7, 4], black: [0, 4] }

    const timerValue = Number.parseInt(document.getElementById("timer-select").value)
    this.timers = { white: timerValue, black: timerValue }

    // Reset board rotation
    const chessboard = document.getElementById("chessboard")
    chessboard.classList.remove("rotated")

    this.createBoard()
    this.updateDisplay()
    this.updateMoveHistory()
    this.updateTimerDisplay()
    this.startTimer()

    document.getElementById("game-status").textContent = ""
    document.getElementById("check-status").textContent = ""
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new AdvancedChessGame()
})
