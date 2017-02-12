
var exports = module.exports = {
  solve           : solve,
  isBoardSolvable : isBoardSolvable
};

function getRowNumber(index) {
  return Math.floor(index / 9)
}

function getColumnNumber(index) {
  return index % 9
}

function getBoxNumber(index) {
  const row    = getRowNumber(index)
  const column = getColumnNumber(index)
  
  const currentSectionRow    = Math.floor((row % 9) / 3)
  const currentSectionColumn = Math.floor((column % 9) / 3)

  return (currentSectionRow * 3) + currentSectionColumn
}

function getRowUsingCell(board, cellIndex) {
  const startCell = getRowNumber(cellIndex) * 9
  return board.slice(startCell, startCell + 9)
}

function getColumnUsingCell(board, cellIndex) {
  const columnNumber = getColumnNumber(cellIndex)
  return board.filter((_, i) => i % 9 === columnNumber)
}

function getBoxUsingCell(board, cellIndex) {
  const boxNumber = getBoxNumber(cellIndex)
  return board.filter((_, i) => getBoxNumber(i) === boxNumber)
}

function getPosibilities(value, board, index) {
  if (value !== 0) {
    return [value]
  }

  const existingValues = getRowUsingCell( board, index )
    .concat(getColumnUsingCell(board, index), getBoxUsingCell(board, index))
    .reduce((a, b) => a.concat(b), [])
    .filter((cell) => cell !== 0)
    .filter((cell, i, filtered) => filtered.indexOf(cell) === i)

  return getNewArrayOfNValues(9)
    .map((_, i) => i + 1)
    .filter((value) => existingValues.indexOf(value) === -1)
}

function BoardException(message) {
   this.message = message
   this.name    = 'BoardException'
}

function getNewArrayOfNValues(n) {
  return Array.apply(null, {length: n})
}

function isArrayUnique(array) {
  return array.length === new Set(array).size
}

function areValuesValid(array) {
  return array
    .map((row)  => row.filter((value) => value !== 0))
    .map((row)  => !row.length ? true : isArrayUnique(row))
    .reduce((a, b) => a && b, true)
}

function isBoardSolvable( board ) {
  const rowsAreValid = areValuesValid(
    getNewArrayOfNValues(9).map((_, i) => getRowUsingCell(board, i * 9))
  )

  const columnsAreValid = areValuesValid(
    getNewArrayOfNValues(9).map((_, i) => getColumnUsingCell(board, i))
  )

  return rowsAreValid && columnsAreValid
}

function solve(board) {
  for ( let i = 0; i < board.length; i++ ) {
    if ( board[i] !== 0 ) {
      continue
    }
    const posibilities = getPosibilities( board[i], board, i )

    if ( !posibilities.length ) {
      return false
    }

    for ( let j = 0; j < posibilities.length; j++ ) {
      board[i] = posibilities[j]
      const newTestBoard = solve( board )

      if ( !newTestBoard ) {
        board[i] = 0
        if ( j == posibilities.length -1  ) {
          return false
        } else {
          continue
        }
      } else {
        return newTestBoard
      }
    }
  }

  return board
}

return module.exports