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
  //Helper function takes in a board with 0 to n - 1 pieces, and returns an array of Board objects with 1 more piece than the input board with no duplicates
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
    //TO DO: Refactor this into helper function OR find a way to add occupied places and num pieces on a board to the board properties
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
            if (!(row === startingRow && col < startingCol) && col !== lastCol) {
              let currentBoard = boardArray.map(function(arr) {
                return arr.slice();                    
              });
              currentBoard = new Board(currentBoard);
              currentBoard.togglePiece(row, col);
              if (!(currentBoard.hasAnyRowConflicts()) && !(currentBoard.hasAnyColConflicts())) {
                solutions.push(currentBoard);
              }
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
  //if numPieces is n, we're done! Return first board in intermediates
  //if numPieces is less than n: 
  //run findNRooksSolutionHelper(numPieces, n, board) on all the boards in intermediates
  //push each result into a NEW intermediates array
  //increment numPieces and repeat
  for (var pieces = 0; pieces < n; pieces++) {
    if (numPieces === n) {
      return intermediates[0].rows();
    } else {
      var storeBoards = [];
      for (var j = 0; j < intermediates.length; j++) {
        var parentBoard = intermediates[j];
        var childBoards = findNRooksSolutionHelper(numPieces, n, parentBoard);
        storeBoards = storeBoards.concat(childBoards);
      }
      intermediates = storeBoards;
      numPieces += 1;
    }
  }
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
window.findNQueensSolution = function(n, wantArray) {
  if (n === 0) {
    return [];
  }
  var findNQueensSolutionHelper = function(numPieces, n, board) {
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
  var intermediates = findNQueensSolutionHelper(0, n);
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
      var correctSolutions = []; 
      for (var i = 0; i < intermediates.length; i ++) {
        if (!(intermediates[i].hasAnyRowConflicts()) && !(intermediates[i].hasAnyColConflicts()) && !(intermediates[i].hasAnyMajorDiagonalConflicts()) && !(intermediates[i].hasAnyMinorDiagonalConflicts())) {
          if (!wantArray) {
            return intermediates[i].rows();    
          } else if (wantArray) {
            correctSolutions.push(intermediates[i]);
          } 
        } 
      }
      if (wantArray) {
        return correctSolutions.length;
      } 
      var result = new Board({n: n});
      return result.rows();
    } else {
      var storeBoards = [];
      for (var j = 0; j < intermediates.length; j++) {
        var currentBoards = findNQueensSolutionHelper(numPieces, n, intermediates[j]);
        storeBoards = storeBoards.concat(currentBoards);
      }
      intermediates = storeBoards;
      numPieces += 1;
    }
  }
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var numberOfSolutions = findNQueensSolution(n, true);  
  if (Array.isArray(numberOfSolutions)) {
    return 1;
  }
  return numberOfSolutions;
};
