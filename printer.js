
var exports = module.exports = {};

exports.printBoard = function( solvedBoard ) {
  let string = '';
  solvedBoard.forEach(( cell, index ) => {
    index += 1
    string += cell === 0 ? ' - ' : ' ' + cell + ' '

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

return module.exports