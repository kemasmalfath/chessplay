// Main Game Logic
class GameLogic {
  constructor(boardManager, moveValidator, soundManager) {
    this.boardManager = boardManager
    this.moveValidator = moveValidator
    this.soundManager = soundManager
    this.currentPlayer = "white"
    this.gameOver = false
    this.capturedPieces = { white: [], black: [] }
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.boardManager.getPiece(fromRow, fromCol)
    const capturedPiece = this.boardManager.getPiece(toRow, toCol)
    const moveNotation = this.getMoveNotation(fromRow, fromCol, toRow, toCol)

    // Handle special moves
    let specialMove = null

    // En passant capture
    if (piece.type === "pawn" && !capturedPiece && fromCol !== toCol) {
      const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1
      const capturedPawn = this.boardManager.getPiece(capturedPawnRow, toCol)
      this.capturedPieces[capturedPawn.color].push(capturedPawn)
      this.boardManager.setPiece(capturedPawnRow, toCol, null)
      specialMove = "enpassant"
    }

    // Castling
    if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
      const isKingside = toCol > fromCol
      const rookFromCol = isKingside ? 7 : 0
      const rookToCol = isKingside ? 5 : 3
      const rook = this.boardManager.getPiece(fromRow, rookFromCol)

      this.boardManager.setPiece(fromRow, rookToCol, rook)
      this.boardManager.setPiece(fromRow, rookFromCol, null)
      rook.hasMoved = true
      specialMove = "castling"
    }

    // Regular capture
    if (capturedPiece) {
      this.capturedPieces[capturedPiece.color].push(capturedPiece)
    }

    // Make the move
    this.boardManager.movePiece(fromRow, fromCol, toRow, toCol)

    // Set en passant target
    this.boardManager.enPassantTarget = null
    if (piece.type === "pawn" && Math.abs(fromRow - toRow) === 2) {
      this.boardManager.enPassantTarget = [fromRow + (toRow - fromRow) / 2, toCol]
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
      boardState: window.ChessUtils.cloneBoard(this.boardManager.board),
    }

    this.boardManager.lastMove = move

    // Play sound
    if (capturedPiece) {
      this.soundManager.playCaptureSound()
    } else {
      this.soundManager.playMoveSound()
    }

    this.boardManager.createBoardHTML()
    this.checkGameEnd()

    return move
  }

  handlePawnPromotion(row, col) {
    const piece = this.boardManager.getPiece(row, col)
    const modal = document.getElementById("promotion-modal")
    const piecesContainer = document.getElementById("promotion-pieces")

    piecesContainer.innerHTML = ""
    const promotionPieces = ["queen", "rook", "bishop", "knight"]

    promotionPieces.forEach((pieceType) => {
      const pieceElement = document.createElement("div")
      pieceElement.className = "promotion-piece"
      pieceElement.textContent = window.ChessUtils.getPieceSymbol({ type: pieceType, color: piece.color })
      pieceElement.addEventListener("click", () => {
        this.boardManager.setPiece(row, col, { type: pieceType, color: piece.color, hasMoved: true })
        modal.style.display = "none"
        this.boardManager.createBoardHTML()
        this.checkGameEnd()
      })
      piecesContainer.appendChild(pieceElement)
    })

    modal.style.display = "block"
  }

  getMoveNotation(fromRow, fromCol, toRow, toCol) {
    const piece = this.boardManager.getPiece(fromRow, fromCol)
    const toSquare = window.ChessUtils.getSquareNotation(toRow, toCol)

    let notation = ""
    if (piece.type !== "pawn") {
      notation += piece.type.charAt(0).toUpperCase()
    }

    if (this.boardManager.getPiece(toRow, toCol)) {
      notation += "x"
    }

    notation += toSquare

    return notation
  }

  checkGameEnd() {
    const opponent = window.ChessUtils.getOpponentColor(this.currentPlayer)

    if (this.moveValidator.isCheckmate(opponent)) {
      this.gameOver = true
      document.getElementById("game-status").textContent =
        `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} wins by checkmate!`
      this.soundManager.playCheckmateSound()
    } else if (this.moveValidator.isStalemate(opponent)) {
      this.gameOver = true
      document.getElementById("game-status").textContent = "Draw by stalemate!"
    } else if (this.moveValidator.isInCheck(opponent)) {
      document.getElementById("check-status").textContent =
        `${opponent.charAt(0).toUpperCase() + opponent.slice(1)} is in check!`
      this.soundManager.playCheckSound()
      this.boardManager.highlightCheck(opponent, this.boardManager.kingPositions)
    } else {
      document.getElementById("check-status").textContent = ""
    }
  }

  switchPlayer() {
    this.currentPlayer = window.ChessUtils.getOpponentColor(this.currentPlayer)
    this.boardManager.rotateBoard(this.currentPlayer === "black")
  }

  resetGame() {
    this.boardManager.resetBoard()
    this.currentPlayer = "white"
    this.gameOver = false
    this.capturedPieces = { white: [], black: [] }

    document.getElementById("game-status").textContent = ""
    document.getElementById("check-status").textContent = ""
  }
}

// Make GameLogic available globally
window.GameLogic = GameLogic
