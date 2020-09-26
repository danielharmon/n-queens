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

// window.makeEmptyMatrix = function(n) {
//   return _(_.range(n)).map(function() {
//     return _(_.range(n)).map(function() {
//       return 0;
//     });
//   });
// };

window.findNRooksSolution = function(n) {

  var solution = new Board({n: n}); //fixme
  var row = 0;
  var col = 0;
  while (row < n && row >= 0 && col < n && col >= 0) {
    solution.togglePiece(row, col);
    row++;
    col++;
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  var solutionMatrix = [];
  for (var i = 0; i < solution.attributes.n; i++) {
    solutionMatrix.push(solution.attributes[i]);
  }
  return solutionMatrix;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  if (n === 0) {
    return 1;
  }
  var solutionCount = n * window.countNRooksSolutions(n - 1); //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {

  var BoardTree = function(board, depth) {
    this.board = board;
    this.children = [];
    this.depth = depth;
  };
  BoardTree.prototype.addChild = function(board, depth) {
    var child = new BoardTree(board, depth + 1);
    this.children.push(child);
  };
  var solution = [];
  var numSolutions = 0;
  var rootBoard = new Board({n: n});
  var root = new BoardTree(rootBoard, 0);
  var end;
  var recurseQueens = function(parentNode, row, col) {

    if (row === n || col === n) {
      end = window.performance.now();
      return;
    } //base case, reached end of board

    //place a queen
    parentNode.board.togglePiece(row, col);
    //if the queen was a valid placement
    if (!parentNode.board.hasAnyQueensConflicts()) {
      //check if that was the final queen to place
      var thisBoard = new Board({n: n});
      thisBoard.attributes = JSON.parse(JSON.stringify(parentNode.board.attributes));
      if (row === n - 1) {
        //pass a correct solution
        solution = thisBoard.rows();
        numSolutions++;
        end = window.performance.now();
        return true;

      }
      //queen placement was valid, add it to the valid children
      parentNode.addChild(thisBoard, parentNode.depth + 1);
    }//queen wasn't valid, if we're not at the last column
    parentNode.board.togglePiece(row, col);
    if (col < n - 1) {
      //go again on the next column
      if (recurseQueens(parentNode, row, col + 1)) {
        return true;
      }
      //otherwise, start each child on the next row
    } else if (row < n - 1) {
      for (var j = 0; j < parentNode.children.length; j++) {
        if (recurseQueens(parentNode.children[j], row + 1, 0)) {
          return true;
        }
      }
    }

  };

  var start = window.performance.now();

  recurseQueens(root, 0, 0);



  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  if (solution.length === 0) {
    return rootBoard.rows();
  }
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n === 0 || n === 1) { return 1; }

  var numSolutions = 0;
  var BoardTree = function(board) {
    this.board = board;
    this.children = [];
  };
  BoardTree.prototype.addChild = function(board) {
    this.children.push(new BoardTree(board));
  };
  var rootBoard = new Board({n: n});
  var root = new BoardTree(rootBoard);
  var rootTraveller = function(parentNode, row, col) {
    //base case
    if (row === n) { return; }

    // if (col >= n/2 && row === 0) {
    //   for (let i = 0; i < parentNode.children.length; i++) {
    //     rootTraveller(parentNode.children[i], row + 1, 0);
    //   }
    // }

    //place a queen
    parentNode.board.togglePiece(row, col);
    //if the placement is valid
    if (!parentNode.board.hasAnyQueensConflicts()) {
      var thisBoard = new Board({n: n});
      thisBoard.attributes = JSON.parse(JSON.stringify(parentNode.board.attributes));
      if (row === 0 && col < n/2) {
        parentNode.addChild(thisBoard);
      } else if(row !== 0) {
        parentNode.addChild(thisBoard);
      }

      if (row === n - 1) {
        if((n % 2 === 1) && thisBoard.attributes[0][Math.floor(n/2)] === 1){
          numSolutions += 1;
        } else {
          numSolutions += 2; //counting this solution & mirrored solution
        }
      }
    }
    //go to the next spot
    parentNode.board.togglePiece(row, col);
    if (col === n - 1) {
      for (let i = 0; i < parentNode.children.length; i++) {
        rootTraveller(parentNode.children[i], row + 1, 0);
      }
    } else {
      rootTraveller(parentNode, row, col + 1);
    }
  };
  rootTraveller(root, 0, 0);
  console.log('Number of solutions for ' + n + ' queens:', numSolutions);

  return numSolutions;
};
