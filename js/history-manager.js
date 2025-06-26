// Move History Management
class HistoryManager {
  constructor() {
    this.moveHistory = []
    this.historyIndex = -1
  }

  addMove(move) {
    // Remove any moves after current position
    this.moveHistory = this.moveHistory.slice(0, this.historyIndex + 1)
    this.moveHistory.push(move)
    this.historyIndex++
    this.updateDisplay()
  }

  canUndo() {
    return this.historyIndex >= 0
  }

  canRedo() {
    return this.historyIndex < this.moveHistory.length - 1
  }

  undo() {
    if (!this.canUndo()) return null

    const move = this.moveHistory[this.historyIndex]
    this.historyIndex--
    this.updateDisplay()
    return move
  }

  redo() {
    if (!this.canRedo()) return null

    this.historyIndex++
    const move = this.moveHistory[this.historyIndex]
    this.updateDisplay()
    return move
  }

  updateDisplay() {
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
      historyList.appendChild(moveElement)
    })

    historyList.scrollTop = historyList.scrollHeight
  }

  reset() {
    this.moveHistory = []
    this.historyIndex = -1
    this.updateDisplay()
  }

  getHistory() {
    return {
      moves: this.moveHistory,
      index: this.historyIndex,
    }
  }

  setHistory(moves, index) {
    this.moveHistory = moves || []
    this.historyIndex = index || -1
    this.updateDisplay()
  }
}

// Make HistoryManager available globally
window.HistoryManager = HistoryManager
