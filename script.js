class ChessGame {
  constructor() {
    this.board = this.initializeBoard()
    this.currentPlayer = "white"
    this.selectedSquare = null
    this.gameOver = false
    this.capturedPieces = { white: [], black: [] }

    this.createBoard()
    this.updateDisplay()

    document.getElementById("reset-btn").addEventListener("click", () => this.resetGame())
  }

  initializeBoard() {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Place pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: "pawn", color: "black" }
      board[6][i] = { type: "pawn", color: "white" }
    }

    // Place other pieces
    const pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: pieceOrder[i], color: "black" }
      board[7][i] = { type: pieceOrder[i], color: "white" }
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

    const clickedPiece = this.board[row][col]

    if (this.selectedSquare) {
      const [selectedRow, selectedCol] = this.selectedSquare

      if (selectedRow === row && selectedCol === col) {
        // Deselect current square
        this.selectedSquare = null
        this.clearHighlights()
        return
      }

      if (this.isValidMove(selectedRow, selectedCol, row, col)) {
        this.makeMove(selectedRow, selectedCol, row, col)
        this.selectedSquare = null
        this.clearHighlights()
        this.switchPlayer()
        this.updateDisplay()
        this.checkGameEnd()
      } else {
        // Select new piece if it belongs to current player
        if (clickedPiece && clickedPiece.color === this.currentPlayer) {
          this.selectedSquare = [row, col]
          this.highlightValidMoves(row, col)
        } else {
          this.selectedSquare = null
          this.clearHighlights()
        }
      }
    } else {
      // Select piece if it belongs to current player
      if (clickedPiece && clickedPiece.color === this.currentPlayer) {
        this.selectedSquare = [row, col]
        this.highlightValidMoves(row, col)
      }
    }
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    const targetPiece = this.board[toRow][toCol]

    // Can't capture own piece
    if (targetPiece && targetPiece.color === piece.color) {
      return false
    }

    // Check if move is within board bounds
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
      return false
    }

    switch (piece.type) {
      case "pawn":
        return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color)
      case "rook":
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol)
      case "knight":
        return this.isValidKnightMove(fromRow, fromCol, toRow, toCol)
      case "bishop":
        return this.isValidBishopMove(fromRow, fromCol, toRow, toCol)
      case "queen":
        return this.isValidQueenMove(fromRow, fromCol, toRow, toCol)
      case "king":
        return this.isValidKingMove(fromRow, fromCol, toRow, toCol)
      default:
        return false
    }
  }

  isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
    const direction = color === "white" ? -1 : 1
    const startRow = color === "white" ? 6 : 1
    const targetPiece = this.board[toRow][toCol]

    // Forward move
    if (fromCol === toCol) {
      if (toRow === fromRow + direction && !targetPiece) {
        return true
      }
      // Initial two-square move
      if (fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece) {
        return true
      }
    }

    // Diagonal capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && targetPiece) {
      return true
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
    return rowDiff <= 1 && colDiff <= 1
  }

  isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0

    let currentRow = fromRow + rowStep
    let currentCol = fromCol + colStep

    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol]) {
        return false
      }
      currentRow += rowStep
      currentCol += colStep
    }

    return true
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    const capturedPiece = this.board[toRow][toCol]

    if (capturedPiece) {
      this.capturedPieces[capturedPiece.color].push(capturedPiece)
    }

    this.board[toRow][toCol] = piece
    this.board[fromRow][fromCol] = null

    this.createBoard()
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
  }

  checkGameEnd() {
    // Simple check for king capture (basic implementation)
    const whiteKing = this.findKing("white")
    const blackKing = this.findKing("black")

    if (!whiteKing) {
      this.gameOver = true
      document.getElementById("game-status").textContent = "Black Wins!"
    } else if (!blackKing) {
      this.gameOver = true
      document.getElementById("game-status").textContent = "White Wins!"
    }
  }

  findKing(color) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col]
        if (piece && piece.type === "king" && piece.color === color) {
          return [row, col]
        }
      }
    }
    return null
  }

  resetGame() {
    this.board = this.initializeBoard()
    this.currentPlayer = "white"
    this.selectedSquare = null
    this.gameOver = false
    this.capturedPieces = { white: [], black: [] }

    // Reset board rotation
    const chessboard = document.getElementById("chessboard")
    chessboard.classList.remove("rotated")

    this.createBoard()
    this.updateDisplay()
    document.getElementById("game-status").textContent = ""
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new ChessGame()
})
