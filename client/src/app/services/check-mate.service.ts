import { Injectable } from '@angular/core';
import { GenericRuleService } from './generic-rule.service';

@Injectable({
  providedIn: 'root'
})
export class CheckMateService {

  constructor(private genRule: GenericRuleService) { }

  IsTileSafeForKing(king: string, row: number, col: number): boolean {
    let king_coordinates = this.genRule.findPiece(king);

    if (king === 'K' && king_coordinates && !this.genRule.IsWhitePiece(row, col)) {

      if ((this.genRule.chess_Board[row - 1][col - 1] === 'p' ||
        this.genRule.chess_Board[row - 1][col + 1] === 'p') &&
        row - 1 >= 0 && (col - 1 >= 0 && col + 1 <= 7)) {
        return false;
      }

      const blackKnightArray = this.genRule.getMajorPieces('n');
      for (let pos of blackKnightArray) {
        if (!this.genRule.IsInvalidMove('n', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackRookArray = this.genRule.getMajorPieces('r');
      for (let pos of blackRookArray) {
        if (!this.genRule.IsInvalidMove('r', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackBishopArray = this.genRule.getMajorPieces('b');
      for (let pos of blackBishopArray) {
        if (!this.genRule.IsInvalidMove('b', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackQueenArray = this.genRule.getMajorPieces('q');
      for (let pos of blackQueenArray) {
        if (!this.genRule.IsInvalidMove('q', pos[0], pos[1], row, col)) {
          return false;
        }
      }

    } else if (king === 'k' && king_coordinates && !this.genRule.IsBlackPiece(row, col)) {
      if ((this.genRule.chess_Board[row + 1][col - 1] === 'P' ||
        this.genRule.chess_Board[row + 1][col + 1] === 'P') &&
        row + 1 <= 7 && (col - 1 >= 0 && col + 1 <= 7)) {
        return false;
      }

      const whiteKnightArray = this.genRule.getMajorPieces('N');
      for (let pos of whiteKnightArray) {
        if (!this.genRule.IsInvalidMove('N', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteRookArray = this.genRule.getMajorPieces('R');
      for (let pos of whiteRookArray) {
        if (!this.genRule.IsInvalidMove('R', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteBishopArray = this.genRule.getMajorPieces('B');
      for (let pos of whiteBishopArray) {
        if (!this.genRule.IsInvalidMove('B', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteQueenArray = this.genRule.getMajorPieces('Q');
      for (let pos of whiteQueenArray) {
        if (!this.genRule.IsInvalidMove('Q', pos[0], pos[1], row, col)) {
          return false;
        }
      }
    } else if ((king == 'k' && this.genRule.IsBlackPiece(row, col)) ||
      (king == 'K' && this.genRule.IsWhitePiece(row, col))) {
      return false;
    }

    return true;
  }

  canCaptureAttackingPiece(attackingPiece: string, row: number, col: number) {
    if (this.genRule.IsWhitePiece(row, col)) {
      // Pawn can Capture
      if ((col - 1 >= 0 && row - 1 >= 0 && this.genRule.chess_Board[row + 1][col - 1] === 'p') ||
        (col + 1 <= 7 && row - 1 >= 0 && this.genRule.chess_Board[row + 1][col + 1] === 'p')) {
        return true;
      }

      // Knight can Capture
      if ((row + 1 <= 7 && col - 2 >= 0 && this.genRule.chess_Board[row + 1][col - 2] === 'n') ||
        (row + 1 <= 7 && col + 2 <= 7 && this.genRule.chess_Board[row + 1][col + 2] === 'n') ||
        (row + 2 <= 7 && col - 1 >= 0 && this.genRule.chess_Board[row + 2][col - 1] === 'n') ||
        (row + 2 <= 7 && col + 1 <= 7 && this.genRule.chess_Board[row + 2][col + 1] === 'n') ||
        (row - 1 >= 0 && col - 2 >= 0 && this.genRule.chess_Board[row - 1][col - 2] === 'n') ||
        (row - 1 >= 0 && col + 2 <= 7 && this.genRule.chess_Board[row - 1][col + 2] === 'n') ||
        (row - 2 >= 0 && col - 1 >= 0 && this.genRule.chess_Board[row - 2][col - 1] === 'n') ||
        (row - 2 >= 0 && col + 1 <= 7 && this.genRule.chess_Board[row - 2][col + 1] === 'n')
      ) {
        return true;
      }

      // Rook can capture
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.genRule.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.genRule.chess_Board[row][col - i] === 'r') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.genRule.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.genRule.chess_Board[row][col + i] === 'r') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.genRule.IsEmptyTile(row - i, col)) continue;
        if (row - i >= 0 && this.genRule.chess_Board[row - i][col] === 'r') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.genRule.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.genRule.chess_Board[row + i][col] === 'r') {
          return true;
        } else break;
      }

      // Bishop can capture
      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.genRule.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.genRule.chess_Board[row - i][col - i] === 'b') {
          return true;
        }
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.genRule.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.genRule.chess_Board[row - i][col + i] === 'b') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.genRule.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.genRule.chess_Board[row + i][col - i] === 'b') {
          return true
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.genRule.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.genRule.chess_Board[row + i][col + i] === 'b') {
          return true;
        } else break;
      }

      // Queen can capture
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.genRule.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.genRule.chess_Board[row][col - i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.genRule.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.genRule.chess_Board[row][col + i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.genRule.IsEmptyTile(row - i, col)) break;
        if (row - i >= 0 && this.genRule.chess_Board[row - i][col] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.genRule.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.genRule.chess_Board[row + i][col] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.genRule.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.genRule.chess_Board[row - i][col - i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.genRule.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.genRule.chess_Board[row - i][col + i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.genRule.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.genRule.chess_Board[row + i][col - i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.genRule.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.genRule.chess_Board[row + i][col + i] === 'q') {
          return true;
        } else break;
      }

    } else {
      return false;
    }

    if (this.genRule.IsBlackPiece(row, col)) {
      // Pawn can capture
      if ((col - 1 >= 0 && row + 1 <= 7 && this.genRule.chess_Board[row + 1][col - 1] === 'P') ||
        (col + 1 <= 7 && row + 1 <= 7 && this.genRule.chess_Board[row + 1][col + 1] === 'P')) {
        return true;
      }

      // Knight can Capture
      if ((row + 1 <= 7 && col - 2 >= 0 && this.genRule.chess_Board[row + 1][col - 2] === 'N') ||
        (row + 1 <= 7 && col + 2 <= 7 && this.genRule.chess_Board[row + 1][col + 2] === 'N') ||
        (row + 2 <= 7 && col - 1 >= 0 && this.genRule.chess_Board[row + 2][col - 1] === 'N') ||
        (row + 2 <= 7 && col + 1 <= 7 && this.genRule.chess_Board[row + 2][col + 1] === 'N') ||
        (row - 1 >= 0 && col - 2 >= 0 && this.genRule.chess_Board[row - 1][col - 2] === 'N') ||
        (row - 1 >= 0 && col + 2 <= 7 && this.genRule.chess_Board[row - 1][col + 2] === 'N') ||
        (row - 2 >= 0 && col - 1 >= 0 && this.genRule.chess_Board[row - 2][col - 1] === 'N') ||
        (row - 2 >= 0 && col + 1 <= 7 && this.genRule.chess_Board[row - 2][col + 1] === 'N')
      ) {
        return true;
      }

      // Rook can Capture
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.genRule.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.genRule.chess_Board[row][col - i] === 'R') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.genRule.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.genRule.chess_Board[row][col + i] === 'R') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.genRule.IsEmptyTile(row - i, col)) continue;
        if (row - i >= 0 && this.genRule.chess_Board[row - i][col] === 'R') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.genRule.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.genRule.chess_Board[row + i][col] === 'R') {
          return true;
        } else break;
      }

      // Bishop can Capture
      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.genRule.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.genRule.chess_Board[row - i][col - i] === 'B') {
          return true;
        }
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.genRule.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.genRule.chess_Board[row - i][col + i] === 'B') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.genRule.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.genRule.chess_Board[row + i][col - i] === 'B') {
          return true
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.genRule.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.genRule.chess_Board[row + i][col + i] === 'B') {
          return true;
        } else break;
      }

      // Queen can Capture
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.genRule.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.genRule.chess_Board[row][col - i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.genRule.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.genRule.chess_Board[row][col + i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.genRule.IsEmptyTile(row - i, col)) break;
        if (row - i >= 0 && this.genRule.chess_Board[row - i][col] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.genRule.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.genRule.chess_Board[row + i][col] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.genRule.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.genRule.chess_Board[row - i][col - i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.genRule.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.genRule.chess_Board[row - i][col + i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.genRule.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.genRule.chess_Board[row + i][col - i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.genRule.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.genRule.chess_Board[row + i][col + i] === 'Q') {
          return true;
        } else break;
      }

    } else {
      return false;
    }

    return false;
  }

  //FIXME: after check
  IsCheckMate(king: string, fromRow: number, fromCol: number) {
    const attackingPiece = this.genRule.chess_Board[fromRow][fromCol];
    const king_coordinates = this.genRule.findPiece(king);
    if (king_coordinates) {
      let king_row = king_coordinates.row, king_col = king_coordinates.col
      if (king_row >= 1 && king_col >= 1 && this.IsTileSafeForKing(king, king_row - 1, king_col - 1)) {
        return false;
      }

      if (king_row >= 1 && this.IsTileSafeForKing(king, king_row - 1, king_col)) {
        return false;
      }

      if (king_row >= 1 && king_col <= 6 && this.IsTileSafeForKing(king, king_row - 1, king_col + 1)) {
        return false;
      }

      if (king_col >= 1 && this.IsTileSafeForKing(king, king_row, king_col - 1)) {
        return false;
      }

      if (king_col <= 6 && this.IsTileSafeForKing(king, king_row, king_col + 1)) {
        return false;
      }

      if (king_row <= 6 && king_col >= 1 && this.IsTileSafeForKing(king, king_row + 1, king_col - 1)) {
        return false;
      }

      if (king_row <= 6 && this.IsTileSafeForKing(king, king_row + 1, king_col)) {
        return false;
      }

      if (king_row <= 6 && king_col <= 6 && this.IsTileSafeForKing(king, king_row + 1, king_col + 1)) {
        return false;
      }

      if (!this.genRule.IsPieceProtected(attackingPiece, fromRow, fromCol)) {
        return false;
      } else {
        if (this.canCaptureAttackingPiece(attackingPiece, fromRow, fromCol)) {
          return false;
        }
      }

      return true;
    }
    return true;
  }
}
