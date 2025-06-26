// Board Management
class BoardManager {
  constructor() {
    this.board = this.initializeBoard()
    this.selectedSquare = null
    this.lastMove = null
    this.enPassantTarget = null
    this.kingPositions = { white: [7, 4], black: [0, 4] }
    this.castlingRights = {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    }
  }

  initializeBoard() {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    const initialPieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

    // Place pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: "pawn", color: "black", hasMoved: false }
      board[6][i] = { type: "pawn", color: "white", hasMoved: false }
    }

    // Place other pieces
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: initialPieceOrder[i], color: "black", hasMoved: false }
      board[7][i] = { type: initialPieceOrder[i], color: "white", hasMoved: false }
    }

    return board
  }

  createBoardHTML() {
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

        const piece = this.board[row][col]
        if (piece) {
          square.textContent = window.ChessUtils.getPieceSymbol(piece)
        }

        chessboard.appendChild(square)
      }
    }
  }

  highlightValidMoves(row, col, validMoves) {
    this.clearHighlights()

    const squares = document.querySelectorAll(".square")
    squares[row * 8 + col].classList.add("selected")

    validMoves.forEach((move) => {
      const [toRow, toCol] = move.to
      const square = squares[toRow * 8 + toCol]

      if (this.board[toRow][toCol]) {
        square.classList.add("capture-move")
      } else {
        square.classList.add("valid-move")
      }
    })
  }

  clearHighlights() {
    const squares = document.querySelectorAll(".square")
    squares.forEach((square) => {
      square.classList.remove("selected", "valid-move", "capture-move")
    })
  }

  highlightCheck(color, kingPositions) {
    const squares = document.querySelectorAll(".square")
    const kingPos = kingPositions[color]

    if (kingPos) {
      const kingSquare = squares[kingPos[0] * 8 + kingPos[1]]
      kingSquare.classList.add("in-check")
    }
  }

  rotateBoard(isBlackTurn) {
    const chessboard = document.getElementById("chessboard")
    if (isBlackTurn) {
      chessboard.classList.add("rotated")
    } else {
      chessboard.classList.remove("rotated")
    }
  }

  getPiece(row, col) {
    return this.board[row][col]
  }

  setPiece(row, col, piece) {
    this.board[row][col] = piece
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    this.board[toRow][toCol] = piece
    this.board[fromRow][fromCol] = null

    if (piece) {
      piece.hasMoved = true

      // Update king position
      if (piece.type === "king") {
        this.kingPositions[piece.color] = [toRow, toCol]
      }
    }

    return piece
  }

  resetBoard() {
    this.board = this.initializeBoard()
    this.selectedSquare = null
    this.lastMove = null
    this.enPassantTarget = null
    this.kingPositions = { white: [7, 4], black: [0, 4] }
    this.castlingRights = {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    }
  }
}

// Make BoardManager available globally
window.BoardManager = BoardManager
