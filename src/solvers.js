/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var findNRooksSolutionHelper = function(numPieces, n, board) {
    //if we are starting an empty board, generate all boards with one piece
    var solutions = [];
    if (numPieces === 0) {
      for (let row = 0; row < n; row ++) {
        for (let col = 0; col < n; col ++) {
          let currentBoard = new Board({n: n});
          currentBoard.togglePiece(row, col);
          solutions.push(currentBoard);
        }  
      }
    } else {
    //if we are starting with a non-empty board, find the last occupied spot
      var count = 0;
      var boardArray = board.rows();
      while (count < numPieces) {
        var lastRow = 0;
        var lastCol = 0;
        for (let row = 0; row < n; row ++) {
          for (let col = 0; col < n; col ++) {
            if (boardArray[row][col] === 1) {
              count += 1;
              lastRow = row;
              lastCol = col;
            }
          }
        }
      }
      var startingRow = 0;
      var startingCol = 0;
      if (lastCol === (n - 1)) {
        startingRow = lastRow + 1;
        startingCol = 0;
      } else {
        startingRow = lastRow;
        startingCol = lastCol + 1;
      }
      
      if (numPieces > 0 && startingRow < n && startingCol < n) {
        for (let row = startingRow; row < n; row ++) {
          for (let col = 0; col < n; col ++) {
            let currentBoard = boardArray.map(function(arr) {
              return arr.slice();                    
            });
            currentBoard = new Board(currentBoard);
            
            currentBoard.togglePiece(row, col);
            if (!(row === startingRow && col < startingCol)) {
              solutions.push(currentBoard);
            }
          }  
        }
      }
    }
    //Starting at last occupied spot, generate all children that have one more and push to solutions
    return solutions;
  };  
  var intermediates = findNRooksSolutionHelper(0, n);
  var numPieces = 1;
  //loop over numPieces from 1 to n
  //if numPieces is n, we're done! Check validity of contents of intermediates and return first one
  //if numPieces is less than n: 
  //run findNRooksSolutionHelper(numPieces, n, board) on all the boards in intermediates
  //push each result into a NEW intermediates array
  //increment numPieces and repeat
  for (var pieces = 0; pieces < n; pieces++) {
    //console.log(intermediates);
    if (numPieces === n) {
      for (var i = 0; i < intermediates.length; i ++) {
        if (!(intermediates[i].hasAnyRowConflicts()) && !(intermediates[i].hasAnyColConflicts())) {
          return intermediates[i].rows();
        }
        //Check validity of contents of intermediates and return first one
      }
    } else {
      var storeBoards = [];
      for (var j = 0; j < intermediates.length; j++) {
        var currentBoards = findNRooksSolutionHelper(numPieces, n, intermediates[j]);
        storeBoards = storeBoards.concat(currentBoards);
      }
      intermediates = storeBoards;
      numPieces += 1;
    }
  }

  //console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solutions));
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  if (n === 1) {
    return 1;
  } else if (n === 2) {
    return 2;
  } else {
    return (n * countNRooksSolutions(n - 1));
  }
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
