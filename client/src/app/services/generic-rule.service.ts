import { Injectable } from '@angular/core';
import { WhiteService } from './white.service';
import { BlackService } from './black.service';
import { CheckService } from './check.service';

@Injectable({
  providedIn: 'root'
})
export class GenericRuleService {

  constructor() { }

  chess_Board: string[][] = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  chess_board_OG = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  currentPlayer: string = 'white';
  hasWhiteKingMoved: boolean  = false;
  hasBlackKingMoved: boolean = false;
  IsWhiteKingChecked: string = '';
  IsBlackKingChecked: string = '';

  toggleCurrentPlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
  }

  IsEmptyTile(row: number, col: number): boolean {
    if (this.chess_Board[row][col] == '') return true;
    return false;
  }

  findPiece(piece: string) {
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == piece) return { row: i, col: j };
      }
    }
    return null;
  }

  getMajorPieces(piece: string): number[][] {
    const piece_Array = [];
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] === piece) piece_Array.push([i, j]);
      }
    }
    return piece_Array;
  }

  IsPieceProtected(piece: string, row: number, col: number) {

    if (this.IsWhitePiece(row, col)) {
      // Pawn Protection
      if ((col - 1 >= 0 && row + 1 <= 7 && this.chess_Board[row + 1][col - 1] === 'P') ||
        (col + 1 <= 7 && row + 1 <= 7 && this.chess_Board[row + 1][col + 1] === 'P')) {
        return true;
      }

      // Knight Protection
      if ((row + 1 <= 7 && col - 2 >= 0 && this.chess_Board[row + 1][col - 2] === 'N') ||
        (row + 1 <= 7 && col + 2 <= 7 && this.chess_Board[row + 1][col + 2] === 'N') ||
        (row + 2 <= 7 && col - 1 >= 0 && this.chess_Board[row + 2][col - 1] === 'N') ||
        (row + 2 <= 7 && col + 1 <= 7 && this.chess_Board[row + 2][col + 1] === 'N') ||
        (row - 1 >= 0 && col - 2 >= 0 && this.chess_Board[row - 1][col - 2] === 'N') ||
        (row - 1 >= 0 && col + 2 <= 7 && this.chess_Board[row - 1][col + 2] === 'N') ||
        (row - 2 >= 0 && col - 1 >= 0 && this.chess_Board[row - 2][col - 1] === 'N') ||
        (row - 2 >= 0 && col + 1 <= 7 && this.chess_Board[row - 2][col + 1] === 'N')
      ) {
        return true;
      }

      // Rook Protection
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.chess_Board[row][col - i] === 'R') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.chess_Board[row][col + i] === 'R') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.IsEmptyTile(row - i, col)) continue;
        if (row - i >= 0 && this.chess_Board[row - i][col] === 'R') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.chess_Board[row + i][col] === 'R') {
          return true;
        } else break;
      }

      // Bishop Protection
      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.chess_Board[row - i][col - i] === 'B') {
          return true;
        }
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.chess_Board[row - i][col + i] === 'B') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.chess_Board[row + i][col - i] === 'B') {
          return true
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.chess_Board[row + i][col + i] === 'B') {
          return true;
        } else break;
      }

      // Queen Protection
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.chess_Board[row][col - i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.chess_Board[row][col + i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.IsEmptyTile(row - i, col)) break;
        if (row - i >= 0 && this.chess_Board[row - i][col] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.chess_Board[row + i][col] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.chess_Board[row - i][col - i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.chess_Board[row - i][col + i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.chess_Board[row + i][col - i] === 'Q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.chess_Board[row + i][col + i] === 'Q') {
          return true;
        } else break;
      }

      // King Protection
      if ((row - 1 >= 0 && col - 1 >= 0 && this.chess_Board[row - 1][col - 1] === 'K') ||
        (row - 1 >= 0 && this.chess_Board[row - 1][col] === 'K') ||
        (row - 1 >= 0 && col + 1 <= 7 && this.chess_Board[row - 1][col + 1] === 'K') ||
        (col - 1 >= 0 && this.chess_Board[row][col - 1] === 'K') ||
        (col + 1 <= 7 && this.chess_Board[row][col + 1] === 'K') ||
        (row + 1 <= 7 && col - 1 >= 0 && this.chess_Board[row + 1][col - 1] === 'K') ||
        (row + 1 >= 7 && this.chess_Board[row + 1][col] === 'K') ||
        (row + 1 <= 7 && col + 1 <= 7 && this.chess_Board[row + 1][col + 1] === 'K')
      ) {
        return true;
      }

    } else {
      return false;
    }

    if (this.IsBlackPiece(row, col)) {

      // Pawn Protection
      if ((col - 1 >= 0 && row - 1 >= 0 && this.chess_Board[row - 1][col - 1] === 'p') ||
        (col + 1 <= 7 && row - 1 >= 0 && this.chess_Board[row - 1][col + 1] === 'p')) {
        return true;
      }

      // Knight Protection
      if ((row + 1 <= 7 && col - 2 >= 0 && this.chess_Board[row + 1][col - 2] === 'n') ||
        (row + 1 <= 7 && col + 2 <= 7 && this.chess_Board[row + 1][col + 2] === 'n') ||
        (row + 2 <= 7 && col - 1 >= 0 && this.chess_Board[row + 2][col - 1] === 'n') ||
        (row + 2 <= 7 && col + 1 <= 7 && this.chess_Board[row + 2][col + 1] === 'n') ||
        (row - 1 >= 0 && col - 2 >= 0 && this.chess_Board[row - 1][col - 2] === 'n') ||
        (row - 1 >= 0 && col + 2 <= 7 && this.chess_Board[row - 1][col + 2] === 'n') ||
        (row - 2 >= 0 && col - 1 >= 0 && this.chess_Board[row - 2][col - 1] === 'n') ||
        (row - 2 >= 0 && col + 1 <= 7 && this.chess_Board[row - 2][col + 1] === 'n')
      ) {
        return true;
      }

      // Rook Protection
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.chess_Board[row][col - i] === 'r') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.chess_Board[row][col + i] === 'r') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.IsEmptyTile(row - i, col)) continue;
        if (row - i >= 0 && this.chess_Board[row - i][col] === 'r') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.chess_Board[row + i][col] === 'r') {
          return true;
        } else break;
      }

      // Bishop Protection
      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.chess_Board[row - i][col - i] === 'b') {
          return true;
        }
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.chess_Board[row - i][col + i] === 'b') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.chess_Board[row + i][col - i] === 'b') {
          return true
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.chess_Board[row + i][col + i] === 'b') {
          return true;
        } else break;
      }

      // Queen Protection
      for (let i = 1; i <= 7; i++) {
        if (col - i >= 0 && this.IsEmptyTile(row, col - i)) continue;
        if (col - i >= 0 && this.chess_Board[row][col - i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (col + i <= 7 && this.IsEmptyTile(row, col + i)) continue;
        if (col + i <= 7 && this.chess_Board[row][col + i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && this.IsEmptyTile(row - i, col)) break;
        if (row - i >= 0 && this.chess_Board[row - i][col] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i >= 0 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i >= 0 && this.chess_Board[row + i][col] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col - i >= 0 && this.IsEmptyTile(row - i, col - i)) continue;
        if (row - i >= 0 && col - i >= 0 && this.chess_Board[row - i][col - i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row - i >= 0 && col + i <= 7 && this.IsEmptyTile(row - i, col + i)) continue;
        if (row - i >= 0 && col + i <= 7 && this.chess_Board[row - i][col + i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col - i >= 0 && this.IsEmptyTile(row + i, col - i)) continue;
        if (row + i <= 7 && col - i >= 0 && this.chess_Board[row + i][col - i] === 'q') {
          return true;
        } else break;
      }

      for (let i = 1; i <= 7; i++) {
        if (row + i <= 7 && col + i <= 7 && this.IsEmptyTile(row + i, col + i)) continue;
        if (row + i <= 7 && col + i <= 7 && this.chess_Board[row + i][col + i] === 'q') {
          return true;
        } else break;
      }


      // King Protection
      if ((row - 1 >= 0 && col - 1 >= 0 && this.chess_Board[row - 1][col - 1] === 'k') ||
        (row - 1 >= 0 && this.chess_Board[row - 1][col] === 'k') ||
        (row - 1 >= 0 && col + 1 <= 7 && this.chess_Board[row - 1][col + 1] === 'k') ||
        (col - 1 >= 0 && this.chess_Board[row][col - 1] === 'k') ||
        (col + 1 <= 7 && this.chess_Board[row][col + 1] === 'k') ||
        (row + 1 <= 7 && col - 1 >= 0 && this.chess_Board[row + 1][col - 1] === 'k') ||
        (row + 1 >= 7 && this.chess_Board[row + 1][col] === 'k') ||
        (row + 1 <= 7 && col + 1 <= 7 && this.chess_Board[row + 1][col + 1] === 'k')
      ) {
        return true;
      }

    } else {
      return false;
    }

    return false;

  }

  getAllPiecesLocation(chess_Board: string[][]){
    let locations: any = {}
    
    for(let i=0; i<chess_Board.length; i++){
      for(let j=0; j<chess_Board[i].length; j++){
        let piece = chess_Board[i][j];
        if(locations[piece]){
          locations[piece].push([i,j]);
        }else{
          locations[piece] = [[i,j]];
        }
      }
    }
    return locations;
  }

  IsTileSafeForKing(king: string, row: number, col: number): boolean {
    let king_coordinates = this.findPiece(king);

    if (king === 'K' && king_coordinates && !this.IsWhitePiece(row, col)) {

      if ((this.chess_Board[row - 1][col - 1] === 'p' ||
        this.chess_Board[row - 1][col + 1] === 'p') &&
        row - 1 >= 0 && (col - 1 >= 0 && col + 1 <= 7)) {
        return false;
      }

      const blackKnightArray = this.getMajorPieces('n');
      for (let pos of blackKnightArray) {
        if (!this.IsInvalidMove('n', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackRookArray = this.getMajorPieces('r');
      for (let pos of blackRookArray) {
        if (!this.IsInvalidMove('r', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackBishopArray = this.getMajorPieces('b');
      for (let pos of blackBishopArray) {
        if (!this.IsInvalidMove('b', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackQueenArray = this.getMajorPieces('q');
      for (let pos of blackQueenArray) {
        if (!this.IsInvalidMove('q', pos[0], pos[1], row, col)) {
          return false;
        }
      }

    } else if (king === 'k' && king_coordinates && !this.IsBlackPiece(row, col)) {
      if ((this.chess_Board[row + 1][col - 1] === 'P' ||
        this.chess_Board[row + 1][col + 1] === 'P') &&
        row + 1 <= 7 && (col - 1 >= 0 && col + 1 <= 7)) {
        return false;
      }

      const whiteKnightArray = this.getMajorPieces('N');
      for (let pos of whiteKnightArray) {
        if (!this.IsInvalidMove('N', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteRookArray = this.getMajorPieces('R');
      for (let pos of whiteRookArray) {
        if (!this.IsInvalidMove('R', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteBishopArray = this.getMajorPieces('B');
      for (let pos of whiteBishopArray) {
        if (!this.IsInvalidMove('B', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteQueenArray = this.getMajorPieces('Q');
      for (let pos of whiteQueenArray) {
        if (!this.IsInvalidMove('Q', pos[0], pos[1], row, col)) {
          return false;
        }
      }
    } else if ((king == 'k' && this.IsBlackPiece(row, col)) ||
      (king == 'K' && this.IsWhitePiece(row, col))) {
      return false;
    }

    return true;
  }

  IsInvalidMove(
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    if (fromRow == toRow && fromCol == toCol) return true;

    // Finding the locations of White and Black Kings.
    let whiteKingRow, whiteKingCol, blackKingRow, blackKingCol: any;
    let whiteKingCoord = this.findPiece('K');
    whiteKingRow = whiteKingCoord?.row, whiteKingCol = whiteKingCoord?.col;

    let blackKingCoord = this.findPiece('k');
    blackKingRow = blackKingCoord?.row, blackKingCol = blackKingCoord?.col;

    switch (piece) {
      case 'P': {
        if (
          toRow == fromRow - 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        ) {
          return true;
        }
        if (toCol == fromCol && toRow > fromRow) {
          return true;
        }

        if (!this.IsEmptyTile(toRow, toCol)) {
          return true;
        }

        // if(toCol == fromCol && 
        //   (toRow == fromRow - 1 || toRow == fromRow - 2)){

        // }

        break;
      }

      case 'R':
      case 'r': {
        if (toRow != fromRow && toCol == fromCol) {
          if (toRow > fromRow) {
            for (let i = fromRow + 1; i < toRow; i++) {
              if (!this.IsEmptyTile(i, toCol)) return true;
            }
          } else {
            for (let i = fromRow - 1; i > toRow; i--) {
              if (!this.IsEmptyTile(i, toCol)) return true;
            }
          }
        } else if (toRow == fromRow && toCol != fromCol) {
          if (toCol > fromCol) {
            for (let i = fromCol + 1; i < toCol; i++) {
              if (!this.IsEmptyTile(toRow, i)) return true;
            }
          } else {
            for (let i = fromCol - 1; i > toCol; i--) {
              if (!this.IsEmptyTile(toRow, i)) return true;
            }
          }
        } else if (toRow != fromRow && toCol != fromCol) {
          // alert('Invalid rook move as tiles are not empty in between');
          return true;
        }

        break;
      }

      case 'N':
      case 'n': {
        // moving apart from L shape
        if (
          !(
            (toRow == fromRow - 2 &&
              (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
            (toRow == fromRow + 2 &&
              (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
            (toCol == fromCol - 2 &&
              (toRow == fromRow + 1 || toRow == fromRow - 1)) ||
            (toCol == fromCol + 2 &&
              (toRow == fromRow + 1 || toRow == fromRow - 1))
          )
        ) {
          return true;
        }

        if (!this.IsEmptyTile(toRow, toCol)) {
          return true;
        }

        break;
      }

      case 'B':
      case 'b': {
        let correctMovement: boolean = false;
        for (let i = 1; i <= 7; i++) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i)
          ) {
            correctMovement = true;
            break;
          }
        }

        if (correctMovement) {
          // Up and Left
          if (toRow < fromRow && toCol < fromCol) {
            for (
              let i = fromRow - 1, j = fromCol - 1;
              i > toRow && j > toCol;
              i--, j--
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          } else if (toRow < fromRow && toCol > fromCol) {
            for (
              let i = fromRow - 1, j = fromCol + 1;
              i > toRow && j < toCol;
              i--, j++
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          } else if (toRow > fromRow && toCol < fromCol) {
            for (
              let i = fromRow + 1, j = fromCol - 1;
              i < toRow && j > toCol;
              i++, j--
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          } else if (toRow > fromRow && toCol > fromCol) {
            for (
              let i = fromRow + 1, j = fromCol + 1;
              i < toRow && j < toCol;
              i++, j++
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          }
        } else if (correctMovement == false) {
          return true;
        }

        if (toRow != fromRow && toCol == fromCol) return true;
        if (toRow == fromRow && toCol != fromCol) return true;

        return false;
        break;
      }

      case 'Q':
      case 'q': {
        // Bishop Part
        let correctMovement: boolean = false;
        for (let i = 1; i <= 7; i++) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i) ||
            (toRow != fromRow && toCol == fromCol) ||
            (toRow == fromRow && toCol != fromCol)
          ) {
            correctMovement = true;
            break;
          }
        }

        if (correctMovement) {
          if (toRow < fromRow && toCol < fromCol) {
            for (
              let i = fromRow - 1, j = fromCol - 1;
              i > toRow && j > toCol;
              i--, j--
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          } else if (toRow < fromRow && toCol > fromCol) {
            for (
              let i = fromRow - 1, j = fromCol + 1;
              i > toRow && j < toCol;
              i--, j++
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          } else if (toRow > fromRow && toCol < fromCol) {
            for (
              let i = fromRow + 1, j = fromCol - 1;
              i < toRow && j > toCol;
              i++, j--
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          } else if (toRow > fromRow && toCol > fromCol) {
            for (
              let i = fromRow + 1, j = fromCol + 1;
              i < toRow && j < toCol;
              i++, j++
            ) {
              if (!this.IsEmptyTile(i, j)) return true;
            }
          }
          // Rook Part
          else if (toRow != fromRow && toCol == fromCol) {
            if (toRow > fromRow) {
              for (let i = fromRow + 1; i < toRow; i++) {
                if (!this.IsEmptyTile(i, toCol)) return true;
              }
            } else {
              for (let i = fromRow - 1; i > toRow; i--) {
                if (!this.IsEmptyTile(i, toCol)) return true;
              }
            }
          } else if (toRow == fromRow && toCol != fromCol) {
            if (toCol > fromCol) {
              for (let i = fromCol + 1; i < toCol; i++) {
                if (!this.IsEmptyTile(toRow, i)) return true;
              }
            } else {
              for (let i = fromCol - 1; i > toCol; i--) {
                if (!this.IsEmptyTile(toRow, i)) return true;
              }
            }
          }
        } else {
          return true;
        }

        return false;
        break;
      }

      case 'K':
      case 'k': {
        let correctMovement: boolean = false;
        let attackingPiece = this.chess_Board[toRow][toCol];
        if (this.IsPieceProtected(attackingPiece, toRow, toCol)) {
          return true;
        }

        if (
          (toRow == fromRow - 1 && toCol == fromCol - 1) ||
          (toRow == fromRow - 1 && toCol == fromCol) ||
          (toRow == fromRow - 1 && toCol == fromCol + 1) ||
          (toRow == fromRow && toCol == fromCol - 1) ||
          (toRow == fromRow && toCol == fromCol + 1) ||
          (toRow == fromRow + 1 && toCol == fromCol - 1) ||
          (toRow == fromRow + 1 && toCol == fromCol) ||
          (toRow == fromRow + 1 && toCol == fromCol + 1)
        ) {
          correctMovement = true;
          break;
        }


        if (correctMovement) return false;
        else return true;
        break;
      }

      case 'p': {
        //moving diagonally
        if (
          toRow == fromRow + 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        ) {
          return true;
        }

        if (toCol == fromCol && toRow < fromRow) {
          return true;
        }

        if (!this.IsEmptyTile(toRow, toCol)) {
          return true;
        }

        break;
      }
    }
    return false;
  }

  resetToPreviousPosition(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];
    this.chess_Board[toRow][toCol] = '';
    this.chess_Board[fromRow][fromCol] = piece;
  }

  IsWhitePiece(row: number, col: number): boolean {
    let piece = this.chess_Board[row][col];
    if (
      piece == 'R' ||
      piece == 'N' ||
      piece == 'B' ||
      piece == 'Q' ||
      piece == 'K' ||
      piece == 'P'
    )
      return true;
    return false;
  }

  IsBlackPiece(row: number, col: number): boolean {
    let piece = this.chess_Board[row][col];
    if (
      piece == 'r' ||
      piece == 'n' ||
      piece == 'b' ||
      piece == 'q' ||
      piece == 'k' ||
      piece == 'p'
    )
      return true;
    return false;
  }
}
