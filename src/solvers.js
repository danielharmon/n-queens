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

  //debugger;
  var solution = new Board({n: n}); //fixme
  var row = 0;
  var col = 0;
  while(row < n && row >= 0 && col < n && col >= 0) {
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
  var solutionCount = n * window.countNRooksSolutions(n-1); //fixme

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

  //debugger;
  var rootBoard = new Board({n: n});
  var root = new BoardTree(rootBoard, 0);

  var recurseQueens = function(parentNode, row, col) {
    //debugger;
    if (row === n || col === n) { return; } //base case, reached end of board

    var thisBoard = new Board({n: n});
    //console.log(thisBoard.hasAnyQueensConflicts());
    Object.assign(thisBoard.attributes, parentNode.board.attributes);
    thisBoard.togglePiece(row, col);
    if (!thisBoard.hasAnyQueensConflicts()) {
      if (row === n - 1) { return thisBoard; } //returns first working board
      parentNode.addChild(thisBoard, parentNode.depth + 1);
    }
    if (col < n - 1) {
      recurseQueens(parentNode, row, col + 1);
    } else if (row < n - 1) {
      for(var j = 0; j < parentNode.children.length; j++) {
        recurseQueens(parentNode.children[j], row + 1, 0);
      }
    }
  };

  var solutionBoard = recurseQueens(root, 0, 0);
  var solution = [];
  if (solutionBoard) {
    for (var i = 0; i < solutionBoard.attributes.n; i++) {
      solution.push(solutionBoard.attributes[i]);
    }
  }
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
