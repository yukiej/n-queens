// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //for the given row
      //iterate over the row and check if the row contains more than one piece
      //if it contains more than one piece, then return true
      //otherwise, return false
      var currentRow = this.get(rowIndex);
      var pieceCount = 0;
      for (var i = 0; i < currentRow.length; i += 1) {
        if (currentRow[i] === 1) {
          pieceCount += 1;
        }
      }

      if (pieceCount > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rowNum = this.get(0).length;

      //for every row on the board, check if hasRowConflictAt returns true
      //if hasRowConflictAt returns true, return true
      for (var i = 0; i < rowNum; i += 1) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }  
      //else return false
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var boardSize = this.get(0).length;
      var pieceCount = 0;

      //for each row, look at the value at row[colIndex]
      //if that value is 1, increment pieceCount
      for (var row = 0; row < boardSize; row += 1) {
        var currentValue = this.get(row)[colIndex];
        if (currentValue === 1) {
          pieceCount += 1;
        }
      }
      //if pieceCount is greater than 1, return true
      //else, return false
      if (pieceCount > 1) {
        return true;
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //Find num of Cols and save as boardSize
      var boardSize = this.get(0).length;
      //for each col, run hasColConflictAt on it 
      for (var col = 0; col < boardSize; col += 1) {
        if (this.hasColConflictAt(col)) {
          return true;
        }
      }
      //if hasColConflictAt is true, return true
      //else return false
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var boardSize = this.get(0).length;
      var maxDiagonalLength = boardSize - majorDiagonalColumnIndexAtFirstRow;
      var pieceCount = 0; 
      //if majorDiagonalColIndex is zero, you will look down the whole first col. 
      //Otherwise, you are only looking at a single diagonal for conflicts
      if (majorDiagonalColumnIndexAtFirstRow > 0) {
        var diagonalLength = maxDiagonalLength;
        for (var row = 0; row < diagonalLength; row += 1) {
          if (this.get(row)[majorDiagonalColumnIndexAtFirstRow + row] === 1) {
            pieceCount += 1;
          }
        }
      }

      if (pieceCount > 1) {
        return true;
      }
      //if majorDiagonalColIndex is 0
      //for every element in the first col
      //look at diagonal that starts at that element and go down along the diagonal
      //for each row, count up the number of 1's and increment pieceCount
      //if pieceCount is greater than 1 for any of the diagonals, return true
      if (majorDiagonalColumnIndexAtFirstRow === 0) {
        for (var startingRow = 0; startingRow < boardSize; startingRow += 1) {
          var diagonalLength = boardSize - startingRow;
          var innerPieceCount = 0; 
          for (var row = startingRow; row < boardSize; row += 1) {
            if (this.get(row)[majorDiagonalColumnIndexAtFirstRow + (row - startingRow)] === 1) {
              pieceCount += 1; 
            }
          }
          if (pieceCount > 1) {
            return true;
          }
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var boardSize = this.get(0).length;

      //look at every element of first row
      //if hasMajorDiagonalConflictAt of any index of the first row returns true, then return true
      //else return false

      //
      for (var firstRowIndex = 0; firstRowIndex < boardSize; firstRowIndex += 1) {
        if (this.hasMajorDiagonalConflictAt(firstRowIndex)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
