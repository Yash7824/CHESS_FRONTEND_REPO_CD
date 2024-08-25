import { Injectable } from '@angular/core';
import { GenericRuleService } from './generic-rule.service';

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(private genRule: GenericRuleService) { }

  IsWhiteKingUnderCheck(
    king: string,
    fromRow: number,
    fromCol: number
  ): boolean {
    // The Piece giving check to the King
    const piece = this.genRule.chess_Board[fromRow][fromCol];
    let kingRow!: number;
    let kingCol!: number;

    // King's location:
    for (let i = 0; i < this.genRule.chess_Board.length; i++) {
      for (let j = 0; j < this.genRule.chess_Board[i].length; j++) {
        if (this.genRule.chess_Board[i][j] == king) {
          kingRow = i;
          kingCol = j;
          break;
        }
      }
    }

    if (king == 'K') {
      // If Black pawn is giving Check.
      if (
        piece == 'p' &&
        ((kingRow == fromRow + 1 && kingCol == fromCol - 1) ||
          (kingRow == fromRow + 1 && kingCol == fromCol + 1))
      ) {
        return true;
      }

      // If Black Rook is giving Check
      if (
        piece == 'r' &&
        ((kingRow != fromRow && kingCol == fromCol) ||
          (kingRow == fromRow && kingCol != fromCol)) &&
        !this.genRule.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)
      ) {
        return true;
      }

      // If Black knight is giving Check.
      if (
        piece == 'n' &&
        ((kingRow == fromRow - 2 &&
          (kingCol == fromCol + 1 || kingCol == fromCol - 1)) ||
          (kingRow == fromRow + 2 &&
            (kingCol == fromCol + 1 || kingCol == fromCol - 1)) ||
          (kingCol == fromCol - 2 &&
            (kingRow == fromRow + 1 || kingRow == fromRow - 1)) ||
          (kingCol == fromCol + 2 &&
            (kingRow == fromRow + 1 || kingRow == fromRow - 1)))
      ) {
        return true;
      }

      // If Black bishop is giving Check
      if (piece == 'b') {
        for (let i = 1; i <= 7; i++) {
          if (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
            if (
              (kingRow == fromRow - i && kingCol == fromCol - i) ||
              (kingRow == fromRow - i && kingCol == fromCol + i) ||
              (kingRow == fromRow + i && kingCol == fromCol - i) ||
              (kingRow == fromRow + i && kingCol == fromCol + i)
            ) {
              return true;
            }
          }
        }
      }

      // If Black Queen is giving Check
      if (piece == 'q') {
        for (let i = 1; i <= 7; i++) {
          if (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
            if (
              (kingRow == fromRow - i && kingCol == fromCol - i) ||
              (kingRow == fromRow - i && kingCol == fromCol + i) ||
              (kingRow == fromRow + i && kingCol == fromCol - i) ||
              (kingRow == fromRow + i && kingCol == fromCol + i) ||
              (kingRow != fromRow && kingCol == fromCol) ||
              (kingRow == fromRow && kingCol != fromCol)
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  IsBlackKingUnderCheck(
    king: string,
    fromRow: number,
    fromCol: number
  ): boolean {
    // The Piece giving check to the King
    const piece = this.genRule.chess_Board[fromRow][fromCol];
    let kingRow!: number;
    let kingCol!: number;

    // King's location:
    for (let i = 0; i < this.genRule.chess_Board.length; i++) {
      for (let j = 0; j < this.genRule.chess_Board[i].length; j++) {
        if (this.genRule.chess_Board[i][j] == king) {
          kingRow = i;
          kingCol = j;
          break;
        }
      }
    }

    if (king == 'k') {
      // If White pawn is giving Check.
      if (
        piece == 'P' &&
        ((kingRow == fromRow - 1 && kingCol == fromCol - 1) ||
          (kingRow == fromRow - 1 && kingCol == fromCol + 1))
      ) {
        return true;
      }

      // If White Rook is giving Check
      if (
        piece == 'R' &&
        ((kingRow != fromRow && kingCol == fromCol) ||
          (kingRow == fromRow && kingCol != fromCol)) &&
        !this.genRule.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)
      ) {
        return true;
      }

      // If White knight is giving Check.
      if (
        piece == 'N' &&
        ((kingRow == fromRow - 2 &&
          (kingCol == fromCol + 1 || kingCol == fromCol - 1)) ||
          (kingRow == fromRow + 2 &&
            (kingCol == fromCol + 1 || kingCol == fromCol - 1)) ||
          (kingCol == fromCol - 2 &&
            (kingRow == fromRow + 1 || kingRow == fromRow - 1)) ||
          (kingCol == fromCol + 2 &&
            (kingRow == fromRow + 1 || kingRow == fromRow - 1)))
      ) {
        return true;
      }

      // If White bishop is giving Check
      if (piece == 'B') {
        for (let i = 1; i <= 7; i++) {
          if (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
            if (
              (kingRow == fromRow - i && kingCol == fromCol - i) ||
              (kingRow == fromRow - i && kingCol == fromCol + i) ||
              (kingRow == fromRow + i && kingCol == fromCol - i) ||
              (kingRow == fromRow + i && kingCol == fromCol + i)
            ) {
              return true;
            }
          }
        }
      }

      // If White Queen is giving Check
      if (piece == 'Q') {
        for (let i = 1; i <= 7; i++) {
          if (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
            if (
              (kingRow == fromRow - i && kingCol == fromCol - i) ||
              (kingRow == fromRow - i && kingCol == fromCol + i) ||
              (kingRow == fromRow + i && kingCol == fromCol - i) ||
              (kingRow == fromRow + i && kingCol == fromCol + i) ||
              (kingRow != fromRow && kingCol == fromCol) ||
              (kingRow == fromRow && kingCol != fromCol)
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }
}
