// Game Constants
const PIECE_SYMBOLS = {
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

const PIECE_VALUES = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0,
}

const CENTER_SQUARES = [
  [3, 3],
  [3, 4],
  [4, 3],
  [4, 4],
]

const INITIAL_PIECE_ORDER = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

const FILES = "abcdefgh"
const RANKS = "87654321"

const TIMER_OPTIONS = {
  600: "10 min",
  900: "15 min",
  1800: "30 min",
  0: "No Timer",
}

const AI_DIFFICULTIES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
}
