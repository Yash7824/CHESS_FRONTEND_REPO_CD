import { Injectable } from '@angular/core';
import { GenericRuleService } from './generic-rule.service';
import { BlackService } from './black.service';

@Injectable({
  providedIn: 'root'
})
export class WhiteService {

  constructor(private genRule: GenericRuleService) { }

  whitePawnMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    //
    const piece = this.genRule.chess_Board[fromRow][fromCol];

    // Attacking Black Pieces
    if (
      toRow == fromRow - 1 &&
      (toCol == fromCol - 1 || toCol == fromCol + 1) &&
      this.genRule.IsBlackPiece(toRow, toCol)
    ) {
      this.genRule.chess_Board[toRow][toCol] = piece;
      this.genRule.chess_Board[fromRow][fromCol] = '';
      this.genRule.toggleCurrentPlayer();
    }

    // If the tile is empty
    if (this.genRule.IsEmptyTile(toRow, toCol)) {
      if (this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        this.genRule.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
        return;
      }

      // If Valid Move is played
      if (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        if (fromRow == 6 && toRow >= fromRow - 2 && toRow < fromRow) {
          this.genRule.chess_Board[toRow][toCol] = piece;
          this.genRule.chess_Board[fromRow][fromCol] = '';
          this.genRule.toggleCurrentPlayer();
        } else if (fromRow != 6 && toRow >= fromRow - 1 && toRow < fromRow) {
          this.genRule.chess_Board[toRow][toCol] = piece;
          this.genRule.chess_Board[fromRow][fromCol] = '';
          this.genRule.toggleCurrentPlayer();
        }
      }
    }
  }

  whiteRookMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.genRule.chess_Board[fromRow][fromCol];
    //Attacking Black Pieces
    if (
      this.genRule.IsBlackPiece(toRow, toCol) &&
      !this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.genRule.chess_Board[toRow][toCol] = piece;
      this.genRule.chess_Board[fromRow][fromCol] = '';
      this.genRule.toggleCurrentPlayer();
    }
    // If the tile is empty
    if (this.genRule.IsEmptyTile(toRow, toCol)) {
      //Invalid Move
      if (this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        alert('Invalid Rook Move');
        this.genRule.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
        return;
      }

      // legal Move
      if (
        (toRow != fromRow && toCol == fromCol) ||
        (toRow == fromRow && toCol != fromCol)
      ) {
        this.genRule.chess_Board[toRow][toCol] = piece;
        this.genRule.chess_Board[fromRow][fromCol] = '';
        this.genRule.toggleCurrentPlayer();
      }
    }
  }

  whiteKnightMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.genRule.chess_Board[fromRow][fromCol];

    // Attacking Black Pieces
    if (
      ((toRow == fromRow - 2 &&
        (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
        (toRow == fromRow + 2 &&
          (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
        (toCol == fromCol - 2 &&
          (toRow == fromRow + 1 || toRow == fromRow - 1)) ||
        (toCol == fromCol + 2 &&
          (toRow == fromRow + 1 || toRow == fromRow - 1))) &&
      this.genRule.IsBlackPiece(toRow, toCol)
    ) {
      this.genRule.chess_Board[toRow][toCol] = piece;
      this.genRule.chess_Board[fromRow][fromCol] = '';
      this.genRule.toggleCurrentPlayer();
    }

    // If the tile is empty
    if (this.genRule.IsEmptyTile(toRow, toCol)) {
      // Invalid Move
      if (this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        this.genRule.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
        return;
      }

      // legal Moves
      if (
        (toRow == fromRow - 2 &&
          (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
        (toRow == fromRow + 2 &&
          (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
        (toCol == fromCol - 2 &&
          (toRow == fromRow + 1 || toRow == fromRow - 1)) ||
        (toCol == fromCol + 2 && (toRow == fromRow + 1 || toRow == fromRow - 1))
      ) {
        this.genRule.chess_Board[toRow][toCol] = piece;
        this.genRule.chess_Board[fromRow][fromCol] = '';
        this.genRule.toggleCurrentPlayer();
      }
    }
  }

  whiteBishopMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.genRule.chess_Board[fromRow][fromCol];
    // Attack Black Pieces
    if (
      this.genRule.IsBlackPiece(toRow, toCol) &&
      !this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.genRule.chess_Board[toRow][toCol] = piece;
      this.genRule.chess_Board[fromRow][fromCol] = '';
      this.genRule.toggleCurrentPlayer();
    }

    // If the tile is Empty
    if (this.genRule.IsEmptyTile(toRow, toCol)) {
      /*
      legal Moves
      1. Towards Up and Left
      2. Towards Up and Right
      3, Towards Down and left
      4. Towards Down and Right
      */

      for (let i = 1; i <= 7; i++) {
        if (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i)
          ) {
            this.genRule.chess_Board[toRow][toCol] = piece;
            this.genRule.chess_Board[fromRow][fromCol] = '';
            this.genRule.toggleCurrentPlayer();
          }
        }
      }
    }
  }

  whiteQueenMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.genRule.chess_Board[fromRow][fromCol];
    // Attack Black Pieces
    if (
      this.genRule.IsBlackPiece(toRow, toCol) &&
      !this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.genRule.chess_Board[toRow][toCol] = piece;
      this.genRule.chess_Board[fromRow][fromCol] = '';
      this.genRule.toggleCurrentPlayer();
    }

    // If Tile is Empty
    if (this.genRule.IsEmptyTile(toRow, toCol)) {
      for (let i = 1; i <= 7; i++) {
        if (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i) ||
            (toRow != fromRow && toCol == fromCol) ||
            (toRow == fromRow && toCol != fromCol)
          ) {
            this.genRule.chess_Board[toRow][toCol] = piece;
            this.genRule.chess_Board[fromRow][fromCol] = '';
            this.genRule.toggleCurrentPlayer();
          }
        }
      }
    }
  }

  whiteKingMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.genRule.chess_Board[fromRow][fromCol];

    // Attack Black Pieces
    if (
      this.genRule.IsBlackPiece(toRow, toCol) &&
      !this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.genRule.chess_Board[toRow][toCol] = piece;
      this.genRule.chess_Board[fromRow][fromCol] = '';
      this.genRule.hasWhiteKingMoved = true;
      this.genRule.toggleCurrentPlayer();
    }

    if (this.genRule.IsEmptyTile(toRow, toCol)) {
      // legal Moves
      if (
        ((toRow == fromRow - 1 && toCol == fromCol - 1) ||
          (toRow == fromRow - 1 && toCol == fromCol) ||
          (toRow == fromRow - 1 && toCol == fromCol + 1) ||
          (toRow == fromRow && toCol == fromCol - 1) ||
          (toRow == fromRow && toCol == fromCol + 1) ||
          (toRow == fromRow + 1 && toCol == fromCol - 1) ||
          (toRow == fromRow + 1 && toCol == fromCol) ||
          (toRow == fromRow + 1 && toCol == fromCol + 1)) &&
        !this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol) &&
        this.genRule.IsTileSafeForKing('K', toRow, toCol)
      ) {
        this.genRule.chess_Board[toRow][toCol] = piece;
        this.genRule.chess_Board[fromRow][fromCol] = '';
        this.genRule.hasWhiteKingMoved = true;
        this.genRule.toggleCurrentPlayer();
        return;
      }
    }

    // Castling
    if (
      this.genRule.chess_Board[7][4] == 'K' &&
      this.genRule.chess_Board[7][0] == 'R' &&
      this.genRule.IsEmptyTile(7, 1) &&
      this.genRule.IsEmptyTile(7, 2) &&
      this.genRule.IsEmptyTile(7, 3) &&
      !this.genRule.hasWhiteKingMoved
    ) {
      if (toRow == fromRow && toCol == fromCol - 2) {
        this.genRule.chess_Board[toRow][toCol] = 'K';
        this.genRule.chess_Board[toRow][toCol + 1] = 'R';
        this.genRule.chess_Board[fromRow][fromCol] = '';
        this.genRule.chess_Board[7][0] = '';
        this.genRule.hasWhiteKingMoved = true;
        this.genRule.toggleCurrentPlayer();
        return;
      }
    } else if (
      this.genRule.chess_Board[7][4] == 'K' &&
      this.genRule.chess_Board[7][7] == 'R' &&
      this.genRule.IsEmptyTile(7, 5) &&
      this.genRule.IsEmptyTile(7, 6) &&
      !this.genRule.hasWhiteKingMoved
    ) {
      if (toRow == fromRow && toCol == fromCol + 2) {
        this.genRule.chess_Board[toRow][toCol] = 'K';
        this.genRule.chess_Board[toRow][toCol - 1] = 'R';
        this.genRule.chess_Board[fromRow][fromCol] = '';
        this.genRule.chess_Board[7][7] = '';
        this.genRule.hasWhiteKingMoved = true;
        this.genRule.toggleCurrentPlayer();
        return;
      }
    }
  }
}
