#!/usr/bin/env node

const boards  = require('./samples.js')
const printer = require('./printer.js')
const solver  = require('./solver.js')

const board = boards.evilBoard

console.log( '----------- UNSOLVED -----------\n' )
printer.printBoard( board );

if (solver.isBoardSolvable(board)) {
  const solvedBoard = solver.solve( board )
  console.log( '------------ SOLVED ------------\n' )
  printer.printBoard( solvedBoard );
} else {
  console.log( '------- UNSOLVABLE BOARD -------\n' )
}