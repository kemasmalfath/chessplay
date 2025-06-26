// Move Validation Logic
class MoveValidator {
  constructor(boardManager) {
    this.boardManager = boardManager
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.boardManager.getPiece(fromRow, fromCol)
    const targetPiece = this.boardManager.getPiece(toRow, toCol)

    if (!piece) return false
    if (targetPiece && targetPiece.color === piece.color) return false
    if (!this.isValidSquare(toRow, toCol)) return false

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
    const targetPiece = this.boardManager.getPiece(toRow, toCol)

    // Forward move
    if (fromCol === toCol) {
      if (toRow === fromRow + direction && !targetPiece) return true
      if (fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece) return true
    }

    // Diagonal capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      if (targetPiece) return true

      // En passant
      if (
        this.boardManager.enPassantTarget &&
        this.boardManager.enPassantTarget[0] === toRow &&
        this.boardManager.enPassantTarget[1] === toCol
      ) {
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
    const piece = this.boardManager.getPiece(fromRow, fromCol)
    if (piece.hasMoved) return false

    const isKingside = toCol > fromCol
    const rookCol = isKingside ? 7 : 0
    const rook = this.boardManager.getPiece(fromRow, rookCol)

    if (!rook || rook.type !== "rook" || rook.hasMoved) return false
    if (!this.boardManager.castlingRights[piece.color][isKingside ? "kingside" : "queenside"]) return false

    // Check path is clear
    const start = Math.min(fromCol, rookCol) + 1
    const end = Math.max(fromCol, rookCol)
    for (let col = start; col < end; col++) {
      if (this.boardManager.getPiece(fromRow, col)) return false
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
      if (this.boardManager.getPiece(currentRow, currentCol)) return false
      currentRow += rowStep
      currentCol += colStep
    }

    return true
  }

  isInCheck(color) {
    const kingPos = this.boardManager.kingPositions[color]
    if (!kingPos) return false

    const opponentColor = this.getOpponentColor(color)

    // Check if any opponent piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.boardManager.getPiece(row, col)
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
    const piece = this.boardManager.getPiece(fromRow, fromCol)

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
    const piece = this.boardManager.getPiece(fromRow, fromCol)
    const capturedPiece = this.boardManager.getPiece(toRow, toCol)
    const originalKingPos = [...this.boardManager.kingPositions[piece.color]]

    this.boardManager.setPiece(toRow, toCol, piece)
    this.boardManager.setPiece(fromRow, fromCol, null)

    if (piece.type === "king") {
      this.boardManager.kingPositions[piece.color] = [toRow, toCol]
    }

    const inCheck = this.isInCheck(piece.color)

    // Restore board
    this.boardManager.setPiece(fromRow, fromCol, piece)
    this.boardManager.setPiece(toRow, toCol, capturedPiece)
    this.boardManager.kingPositions[piece.color] = originalKingPos

    return inCheck
  }

  getAllValidMoves(color) {
    const moves = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.boardManager.getPiece(row, col)
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

  isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  getOpponentColor(color) {
    return color === "white" ? "black" : "white"
  }
}

// Make MoveValidator available globally
window.MoveValidator = MoveValidator
