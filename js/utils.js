// Utility Functions
class ChessUtils {
  static cloneBoard(board) {
    return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)))
  }

  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  static getSquareNotation(row, col) {
    const files = "abcdefgh"
    const ranks = "87654321"
    return files[col] + ranks[row]
  }

  static isValidSquare(row, col) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7
  }

  static getOpponentColor(color) {
    return color === "white" ? "black" : "white"
  }

  static getPieceSymbol(piece) {
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

  static isCenterSquare(row, col) {
    const centerSquares = [
      [3, 3],
      [3, 4],
      [4, 3],
      [4, 4],
    ]
    return centerSquares.some(([r, c]) => r === row && c === col)
  }

  static getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

// Make ChessUtils available globally
window.ChessUtils = ChessUtils
