import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KingCheckService {
  constructor() {}

  chess_Board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  findPiece(piece: string) {
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == 'K') return { row: i, col: j };
      }
    }
    return null;
  }

  isKingUnderCheck(color: string): boolean {
    // Find the position of the king
    const kingPosition = this.findPiece(color === 'white' ? 'K' : 'k');

    // Iterate over the entire board
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        const piece = this.chess_Board[i][j];

        // Check if the piece belongs to the opponent and can attack the king
        if (
          this.isOpponentPiece(color, piece) &&
          kingPosition &&
          this.canPieceAttackKing(piece, kingPosition, this.chess_Board)
        ) {
          return true; // King is under check
        }
      }
    }

    return false; // King is not under check
  }

  isOpponentPiece(color: string, piece: string): boolean {
    if (color === 'white') {
      return (
        piece === 'r' ||
        piece === 'n' ||
        piece === 'b' ||
        piece === 'q' ||
        piece === 'k' ||
        piece === 'p'
      );
    } else {
      return (
        piece === 'R' ||
        piece === 'N' ||
        piece === 'B' ||
        piece === 'Q' ||
        piece === 'K' ||
        piece === 'P'
      );
    }
  }

  canPieceAttackKing(
    piece: string,
    kingPosition: { row: number; col: number },
    chessBoard: string[][]
  ): boolean {
    const row = kingPosition.row;
    const col = kingPosition.col;

    // Check if the piece can move to the king's position
    switch (piece.toUpperCase()) {
      case 'P':
        // Pawn can attack king if it's one square diagonally in front
        return (
          row === kingPosition.row + 1 && Math.abs(col - kingPosition.col) === 1 // Diagonal
        );
      case 'N':
        // Knight can attack king if it's in one of the eight possible knight moves from the king's position
        return (
          (Math.abs(row - kingPosition.row) === 1 &&
            Math.abs(col - kingPosition.col) === 2) ||
          (Math.abs(row - kingPosition.row) === 2 &&
            Math.abs(col - kingPosition.col) === 1)
        );
      case 'B':
        // Bishop can attack king if it's on the same diagonal as the king and no pieces obstruct the path
        return this.checkDiagonalAttack(
          row,
          col,
          kingPosition.row,
          kingPosition.col,
          chessBoard
        );
      case 'R':
        // Rook can attack king if it's on the same row or column as the king and no pieces obstruct the path
        return this.checkRowColumnAttack(
          row,
          col,
          kingPosition.row,
          kingPosition.col,
          chessBoard
        );
      case 'Q':
        // Queen can attack king if it's on the same row, column, or diagonal as the king and no pieces obstruct the path
        return (
          col === kingPosition.col || // Same column
          Math.abs(row - kingPosition.row) ===
            Math.abs(col - kingPosition.col) || // Diagonal
          this.checkRowColumnAttack(
            row,
            col,
            kingPosition.row,
            kingPosition.col,
            chessBoard
          ) || // Row or column
          this.checkDiagonalAttack(
            row,
            col,
            kingPosition.row,
            kingPosition.col,
            chessBoard
          ) // Diagonal
        );
      case 'K':
        // King cannot attack king
        return false;
      default:
        return false; // Unknown piece type
    }
  }

  // Function to check if there are any pieces obstructing the path in a row or column
  checkRowColumnAttack(
    pieceRow: number,
    pieceCol: number,
    kingRow: number,
    kingCol: number,
    chessBoard: string[][]
  ): boolean {
    if (pieceRow === kingRow) {
      const minCol = Math.min(pieceCol, kingCol);
      const maxCol = Math.max(pieceCol, kingCol);
      for (let col = minCol + 1; col < maxCol; col++) {
        if (chessBoard[pieceRow][col] !== '.') {
          return false; // Obstruction found
        }
      }
      return true; // No obstruction
    } else if (pieceCol === kingCol) {
      const minRow = Math.min(pieceRow, kingRow);
      const maxRow = Math.max(pieceRow, kingRow);
      for (let row = minRow + 1; row < maxRow; row++) {
        if (chessBoard[row][pieceCol] !== '.') {
          return false; // Obstruction found
        }
      }
      return true; // No obstruction
    }
    return false; // Not in the same row or column
  }

  // Function to check if there are any pieces obstructing the path in a diagonal
  checkDiagonalAttack(
    pieceRow: number,
    pieceCol: number,
    kingRow: number,
    kingCol: number,
    chessBoard: string[][]
  ): boolean {
    if (Math.abs(pieceRow - kingRow) === Math.abs(pieceCol - kingCol)) {
      const rowIncrement = pieceRow < kingRow ? 1 : -1;
      const colIncrement = pieceCol < kingCol ? 1 : -1;
      let row = pieceRow + rowIncrement;
      let col = pieceCol + colIncrement;
      while (row !== kingRow && col !== kingCol) {
        if (chessBoard[row][col] !== '.') {
          return false; // Obstruction found
        }
        row += rowIncrement;
        col += colIncrement;
      }
      return true; // No obstruction
    }
    return false; // Not in the same diagonal
  }


  // IsKingUnderCheck(king: string) {
  //   let kingRow: any;
  //   let kingCol: any;

  //   // King's location:
  //   let coordinates = this.findPiece('K');
  //   kingRow = coordinates?.row;
  //   kingCol = coordinates?.col;

  //   switch (king) {
  //     case 'K': {
  //       // If pawn is giving check
  //       if (
  //         this.chess_Board[kingRow - 1][kingCol - 1] == 'p' ||
  //         this.chess_Board[kingRow - 1][kingCol + 1] == 'p'
  //       ) {
  //         return true;
  //       }

  //       // If rook is giving check
  //       for (let i = 1; i < 8; i++) {
  //         if (
  //           !this.IsInvalidMove('r', kingRow, kingCol - i, kingRow, kingCol) &&
  //           kingCol - i >= 0
  //         ) {
  //           if (this.chess_Board[kingRow][kingCol - i] == 'r') {
  //             return true;
  //           }
  //         } else {
  //           continue;
  //         }
  //       }
        
  //       for (let i = 1; i < 8; i++) {
  //         if (
  //           !this.IsInvalidMove('r', kingRow, kingCol + i, kingRow, kingCol) &&
  //           kingCol + i <= 7
  //         ) {
  //           if (this.chess_Board[kingRow][kingCol + i] == 'r') {
  //             return true;
  //           }
  //         } else {
  //           continue;
  //         }
  //       }

  //       for (let i = 1; i < 8; i++) {
  //         if (
  //           !this.IsInvalidMove('r', kingRow - i, kingCol, kingRow, kingCol) &&
  //           kingRow - i >= 0
  //         ) {
  //           if (this.chess_Board[kingRow - i][kingCol] == 'r') {
  //             return true;
  //           }
  //         } else {
  //           continue;
  //         }
  //       }

  //       for (let i = 1; i < 8; i++) {
  //         if (
  //           !this.IsInvalidMove('r', kingRow + i, kingCol, kingRow, kingCol) &&
  //           kingRow + i <= 7
  //         ) {
  //           if (this.chess_Board[kingRow + i][kingCol] == 'r') {
  //             return true;
  //           }
  //         } else {
  //           continue;
  //         }
  //       }
  //       // Rook Implementaion ends

  //       // If knight is giving check
  //       if (
  //         this.chess_Board[kingRow + 2][kingCol - 1] == 'n' ||
  //         this.chess_Board[kingRow + 2][kingCol + 1] == 'n' ||
  //         this.chess_Board[kingRow - 2][kingCol - 1] == 'n' ||
  //         this.chess_Board[kingRow - 2][kingCol + 1] == 'n' ||
  //         this.chess_Board[kingRow + 1][kingCol - 2] == 'n' ||
  //         this.chess_Board[kingRow + 1][kingCol + 2] == 'n' ||
  //         this.chess_Board[kingRow - 1][kingCol - 2] == 'n' ||
  //         this.chess_Board[kingRow - 1][kingCol + 2] == 'n'
  //       ) {
  //         return true;
  //       }

  //       // If Bishop is giving check
  //       for (let i = 1; i < 8; i++) {
  //         if (
  //           !this.IsInvalidMove('b', kingRow - i, kingCol - i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow - i][kingCol - i] == 'b') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('b', kingRow - i, kingCol + i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow - i][kingCol + i] == 'b') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('b', kingRow + i, kingCol - i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow + i][kingCol - i] == 'b') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('b', kingRow + i, kingCol + i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow + i][kingCol + i] == 'b') return true;
  //         }
  //       }

  //       // If Queen is giving check
  //       for (let i = 1; i < 8; i++) {
  //         if (
  //           !this.IsInvalidMove('q', kingRow - i, kingCol - i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow - i][kingCol - i] == 'q') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('q', kingRow - i, kingCol + i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow - i][kingCol + i] == 'q') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('q', kingRow + i, kingCol - i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow + i][kingCol - i] == 'q') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('q', kingRow + i, kingCol + i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow + i][kingCol + i] == 'q') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('q', kingRow, kingCol - i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow][kingCol - i] == 'q') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('q', kingRow, kingCol + i, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow][kingCol + i] == 'q') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('q', kingRow - i, kingCol, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow - i][kingCol] == 'q') return true;
  //         }

  //         if (
  //           !this.IsInvalidMove('q', kingRow + i, kingCol, kingRow, kingCol)
  //         ) {
  //           if (this.chess_Board[kingRow + i][kingCol] == 'q') return true;
  //         }
  //       }
  //     }
  //   }

  //   return false;
  // }
}



