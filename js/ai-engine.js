// AI Engine
class AIEngine {
  constructor(boardManager, moveValidator) {
    this.boardManager = boardManager
    this.moveValidator = moveValidator
    this.difficulty = "medium"
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty
  }

  getBestMove(color) {
    const validMoves = this.moveValidator.getAllValidMoves(color)
    if (validMoves.length === 0) return null

    switch (this.difficulty) {
      case "easy":
        return this.getRandomMove(validMoves)
      case "medium":
        return this.getBestMoveSimple(validMoves)
      case "hard":
        return this.getBestMoveAdvanced(validMoves)
      default:
        return this.getRandomMove(validMoves)
    }
  }

  getRandomMove(moves) {
    return window.ChessUtils.getRandomElement(moves)
  }

  getBestMoveSimple(moves) {
    // Simple AI: prioritize captures, then random
    const captureMoves = moves.filter((move) => this.boardManager.getPiece(move.to[0], move.to[1]) !== null)

    if (captureMoves.length > 0) {
      return window.ChessUtils.getRandomElement(captureMoves)
    }

    return window.ChessUtils.getRandomElement(moves)
  }

  getBestMoveAdvanced(moves) {
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
    const piece = this.boardManager.getPiece(fromRow, fromCol)
    const capturedPiece = this.boardManager.getPiece(toRow, toCol)

    const pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0,
    }

    let score = 0

    // Capture value
    if (capturedPiece) {
      score += pieceValues[capturedPiece.type] * 10
    }

    // Center control
    if (window.ChessUtils.isCenterSquare(toRow, toCol)) {
      score += 2
    }

    // Piece development (move pieces from starting positions)
    if (!piece.hasMoved) {
      score += 1
    }

    // Random factor for variety
    score += Math.random() * 0.5

    return score
  }
}

// Make AIEngine available globally
window.AIEngine = AIEngine
