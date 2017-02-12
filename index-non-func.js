#!/usr/bin/env node

const noBoard = [
  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,

  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,

  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0
];

const wrongBoard = [
  0,0,0, 0,2,2, 3,0,0,
  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,

  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,

  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0,
  0,0,0, 0,0,0, 0,0,0
];

const easyBoard = [
  0,0,0, 0,9,0, 0,0,1,
  2,0,1, 5,0,6, 0,0,0,
  9,3,0, 8,0,0, 4,6,0,

  4,0,0, 2,3,0, 9,0,0,
  0,0,2, 9,0,5, 1,0,0,
  0,0,5, 0,8,1, 0,0,7,

  0,6,9, 0,0,4, 0,1,2,
  0,0,0, 1,0,9, 6,0,8,
  1,0,0, 0,7,0, 0,0,0
];

const evilBoard = [
  0,0,0, 1,6,0, 0,4,7,
  0,0,0, 0,0,3, 8,9,1,
  0,0,0, 0,0,0, 0,2,0,

  4,0,5, 0,0,0, 0,3,0,
  0,0,0, 3,0,5, 0,0,0,
  0,2,0, 0,0,0, 4,0,9,

  0,8,0, 0,0,0, 0,0,0,
  1,7,4, 8,0,0, 0,0,0,
  2,9,0, 0,1,7, 0,0,0
];

function gatherRows( board ) {
  const rows     = [];
  let modCounter = -1;

  for ( let i = 0; i < 81; i++ ) {
    if ( i % 9 === 0 ) {
      rows.push( [] );
      modCounter += 1;
    }
    rows[modCounter].push( board[i] )
  }

  return rows;
}

function gatherColumns( board ) {
  const rows = [];

  for ( let i = 0; i < 81; i++ ) {
    const modulus = i % 9;
    if ( !rows[modulus] ) {
      rows.push( [] );
    }
    rows[modulus].push( board[i] )
  }

  return rows;
}

function gatherBoxes( rows ) {
  const boxes = [[ [], [], [] ], [ [], [], [] ], [ [], [], [] ]];
  let currentSectionRow = 0;

  rows.forEach(( row, rowIndex ) => {
    
    if ( rowIndex < 3 ) {
      currentSectionRow = 0;
    } else if ( rowIndex < 6 ) {
      currentSectionRow = 1;
    } else {
      currentSectionRow = 2;
    }
    
    row.forEach(( item, i ) => {
      const modulus = i % 9;
      if ( modulus < 3 ) {
        boxes[currentSectionRow][0].push( item )
      } else if ( modulus < 6 ) {
        boxes[currentSectionRow][1].push( item )
      } else  {
        boxes[currentSectionRow][2].push( item )
      }
    })
  })

  return boxes[0].concat( boxes[1], boxes[2] );
}


function getRowNumber( index ) {
  return Math.floor( index / 9 );
}

function getColumnNumber( index ) {
  return index % 9;
}

function getBoxNumber( index ) {
  const row    = getRowNumber( index );
  const column = getColumnNumber( index );
  
  const currentSectionRow = Math.floor(( row % 9 ) / 3)
  const currentSectionColumn = Math.floor(( column % 9 ) / 3)

  return ( currentSectionRow * 3 ) + currentSectionColumn
}

function mapValuesToCells( board ) {
  return board.map(( value, index ) => {
    return new Cell( value )
  })
}

function solve( board ) {
  for ( let i = 0; i < board.cells.length; i++ ) {
    if ( board.cells[i].value === 0 ) {
      const posibilities = board.cells[i].getPosibilities( board, i )

      if ( !posibilities.length ) {
        return false
      }

      for ( let j = 0; j < posibilities.length; j++ ) {
        board.cells[i].value = posibilities[j]
        const newTestBoard = solve( board )

        if ( !newTestBoard ) {
          board.cells[i].value = 0
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
  }

  return board
}

class Board {
  constructor( cells ) {
    this.cells = cells
  }
}

class Cell {
  constructor( value ) {
    this.value     = value
  }

  filterAndDeduplicateValues( array ) {
    const filteredArray = array.filter((cell) => cell.value !== 0)
    const mappedArray   = filteredArray.map((cell) => cell.value)
    const deDupedArray  = filteredArray.filter((cell, i) => mappedArray.indexOf( cell.value ) === i)
    const valueArray    = deDupedArray.map((cell) => cell.value)

    return valueArray
  }

  getCurrentValue() {
    return this.currentValue
  }

  setCurrentValue( currentValue ) {
    this.currentValue = currentValue
    return this
  }

  getPosibilities( board, index ) {
    if ( this.value !== 0 ) {
      return [this.value]
    }
    
    const rows       = gatherRows( board.cells );
    const columns    = gatherColumns( board.cells );
    const boxes      = gatherBoxes( rows );
    const row        = rows[ getRowNumber( index ) ];
    const column     = columns[ getColumnNumber( index ) ];
    const box        = boxes[ getBoxNumber( index ) ];

    const posibilities  = Array.apply( null, { length: 9 } ).map(( _, i ) => i + 1);
    const siblingValues = [].concat( row, column, box );
    const cantBe        = this.filterAndDeduplicateValues( [].concat(siblingValues) );
    const filtered      = posibilities.filter(( value ) => cantBe.indexOf( value ) === -1 );

    return filtered;
  }
}

function printBoard( solvedBoard ) {
  let string = '';
  solvedBoard.cells.forEach(( cell, index ) => {
    index += 1
    string += cell.value === 0 ? ' - ' : ' ' + cell.value + ' '

    if ( index % 3 === 0 && index % 9 !== 0 ) {
      string += ' | '
    }

    if ( index % 9 === 0 ) {
      string += '\n'
    }

    if ( [27, 54].indexOf( index ) !== -1 ) {
      string += '--------------------------------\n'
    }
  })
  console.log( string )
}


const board = new Board(mapValuesToCells( evilBoard ))

console.log( '----------- UNSOLVED -----------\n' )
printBoard( board );

const solvedBoard = solve( board )
console.log( '------------ SOLVED ------------\n' )
printBoard( solvedBoard );