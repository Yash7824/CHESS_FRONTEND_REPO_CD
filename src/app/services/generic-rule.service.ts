import { Injectable } from '@angular/core';
import { WhiteService } from './white.service';
import { BlackService } from './black.service';
import { CheckService } from './check.service';
import { from } from 'rxjs';

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
  players: any;
  player1: any;
  player2: any;
  updatedMovementsTable: any;
  
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
        if (row + i <= 7 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i <= 7 && this.chess_Board[row + i][col] === 'R') {
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
        if (row + i <= 7 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i <= 7 && this.chess_Board[row + i][col] === 'Q') {
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
        if (row + i <= 7 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i <= 7 && this.chess_Board[row + i][col] === 'r') {
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
        if (row + i <= 7 && this.IsEmptyTile(row + i, col)) continue;
        if (row + i <= 7 && this.chess_Board[row + i][col] === 'q') {
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

  IsEmptyTile1(row: number, col: number, chessBoard: string[][]){
    if (chessBoard[row][col] == '') return true;
    return false;
  }

  IsKingUnderCheckAfterPieceMovement(king: string, fromRow: number, fromCol: number, toRow: number, toCol: number, chessBoard: string[][]){
    let chessBoardTemp = chessBoard.map(row => [...row]);
    let piecesLoc = this.getAllPiecesLocation(chessBoardTemp);
    let piece = chessBoardTemp[fromRow][fromCol];
    chessBoardTemp[fromRow][fromCol] = '';
    chessBoardTemp[toRow][toCol] = piece;

    
    let whiteRooks = piecesLoc['R'];
    let whiteBishops = piecesLoc['B'];
    let whiteQueens = piecesLoc['Q'];
    let whiteKing = piecesLoc['K']
    let blackRooks = piecesLoc['r'];
    let blackBishops = piecesLoc['b'];
    let blackQueens = piecesLoc['q'];
    let blackKing = piecesLoc['k'];

    if(king === 'K'){
      if(blackRooks !== undefined){
        for(let blackRook of blackRooks){
          if(whiteKing[0][0] == blackRook[0]){ // rows same
            if(whiteKing[0][1] > blackRook[1]){
              for(let i = blackRook[1] + 1; i <= whiteKing[0][1]; i++){
                if(this.IsEmptyTile1(blackRook[0], i, chessBoardTemp)) continue;
                if(chessBoardTemp[blackRook[0]][i] == 'K') {chessBoardTemp[fromRow][fromCol] = piece; return true; }
                if(!this.IsEmptyTile1(blackRook[0], i, chessBoardTemp))  break; 
              }
            } else if(whiteKing[0][1] < blackRook[1]){
              for(let i = whiteKing[0][1]+1; i <= blackRook[1]; i++){
                if(this.IsEmptyTile1(blackRook[0], i, chessBoardTemp)) continue;
                if(chessBoard[blackRook[0]][i] == 'r') {chessBoardTemp[fromRow][fromCol] = piece; return true;}
                if(!this.IsEmptyTile1(blackRook[0], i, chessBoardTemp))  break; 
              }
            }
          } else if(whiteKing[0][1] == blackRook[1]){ // columns same
            if(whiteKing[0][0] > blackRook[0]){
              for(let i = blackRook[0] + 1; i <= whiteKing[0][0]; i++){
                if(this.IsEmptyTile1(i, blackRook[1], chessBoardTemp)) continue;
                if(chessBoardTemp[i][blackRook[1]] == 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
                if(!this.IsEmptyTile1(i, blackRook[1], chessBoardTemp))  break;
              }
            }else if(whiteKing[0][0] < blackRook[0]){
              for(let i = whiteKing[0][0] + 1; i <= blackRook[0]; i++){
                if(this.IsEmptyTile1(i, blackRook[1], chessBoardTemp)) continue;
                if(chessBoardTemp[i][blackRook[1]] == 'R') {chessBoardTemp[fromRow][fromCol] = piece; return true;}
                if(!this.IsEmptyTile1(i, blackRook[1], chessBoardTemp)) break; 
              }
            }
          }
        }
      }

      if(blackBishops !== undefined){
        for(let blackBishop of blackBishops){
          let bishopRow = blackBishop[0], bishopCol = blackBishop[1];
          for(let i=1; i<=7; i++){
            // up-left
            if(bishopRow-i >= 0 && bishopCol-i >= 0){
              if(this.IsEmptyTile1(bishopRow-i, bishopCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow-i][bishopCol-i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow-i, bishopCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // up-right
            if(bishopRow-i >= 0 && bishopCol+i <= 7){
              if(this.IsEmptyTile1(bishopRow-i, bishopCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow-i][bishopCol+i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow-i, bishopCol+i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-left
            if(bishopRow+i <= 7 && bishopCol-i >= 0){
              if(this.IsEmptyTile1(bishopRow+i, bishopCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow+i][bishopCol-i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow+i, bishopCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-right
            if(bishopRow+i <= 7 && bishopCol+i <= 7){
              if(this.IsEmptyTile1(bishopRow+i, bishopCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow+i][bishopCol+i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow+i, bishopCol+i, chessBoardTemp)) break;
            } 
          }
        }
      }
      
  
      if(blackQueens !== undefined){
        for(let blackQueen of blackQueens){
          let queenRow = blackQueen[0], queenCol = blackQueen[1];
          for(let i=1; i<=7; i++){
            // up-left
            if(queenRow-i >= 0 && queenCol-i >= 0){
              if(this.IsEmptyTile1(queenRow-i, queenCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow-i][queenCol-i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow-i, queenCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // up-right
            if(queenRow-i >= 0 && queenCol+i <= 7){
              if(this.IsEmptyTile1(queenRow-i, queenCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow-i][queenCol+i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow-i, queenCol+i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-left
            if(queenRow+i <= 7 && queenCol-i >= 0){
              if(this.IsEmptyTile1(queenRow+i, queenCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow+i][queenCol-i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow+i, queenCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-right
            if(queenRow+i <= 7 && queenCol+i <= 7){
              if(this.IsEmptyTile1(queenRow+i, queenCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow+i][queenCol+i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow+i, queenCol+i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // row same
            if(queenCol-i >= 0){
              if(this.IsEmptyTile1(queenRow, queenCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow][queenCol-i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow, queenCol-i, chessBoardTemp)) break;
            }
          }
     
          for(let i=1; i<=7; i++){
            if(queenCol+i <= 7){
              if(this.IsEmptyTile1(queenRow, queenCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow][queenCol+i] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow, queenCol+i, chessBoardTemp)) break;
            }
          }
            
          for(let i=1; i<=7; i++){
            // column same
            if(queenRow-i >= 0){
              if(this.IsEmptyTile1(queenRow-i, queenCol, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow-i][queenCol] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow-i, queenCol, chessBoardTemp)) break;
            }
          }
    
          for(let i=1; i<=7; i++){
            if(queenRow+i <= 7){
              if(this.IsEmptyTile1(queenRow+i, queenCol, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow+i][queenCol] === 'K') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow+i, queenCol, chessBoardTemp)) break;
            }
          }
    
        }
      }

    }else if(king === 'k'){
      if(whiteRooks !== undefined){
        for(let whiteRook of whiteRooks){
          let row = whiteRook[0], col = whiteRook[1];
          for(let i=1; i<=7; i++){
            // row same
            if(col-i >= 0){
              if(this.IsEmptyTile1(row, col-i, chessBoardTemp)) continue;
              if(chessBoardTemp[row][col-i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(row, col-i, chessBoardTemp)) break;
            }
          }
    
          for(let i=1; i<=7; i++){
    
            if(col+i <= 7){
              if(this.IsEmptyTile1(row, col+i, chessBoardTemp)) continue;
              if(chessBoardTemp[row][col+i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(row, col+i, chessBoardTemp)) break;
            }
            
          }
    
          for(let i=1; i<=7; i++){
            // column same
            if(row-i >= 0){
              if(this.IsEmptyTile1(row-i, col, chessBoardTemp)) continue;
              if(chessBoardTemp[row-i][col] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(row-i, col, chessBoardTemp)) break;
            }
          }
    
          for(let i=1; i<=7; i++){
            if(row+i <= 7){
              if(this.IsEmptyTile1(row+i, col, chessBoardTemp)) continue;
              if(chessBoardTemp[row+i][col] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(row+i, col, chessBoardTemp)) break;
            }
            
          }
        }
      }
      
  
      if(whiteBishops !== undefined){
        for(let whiteBishop of whiteBishops){
          let bishopRow = whiteBishop[0], bishopCol = whiteBishop[1];
          for(let i=1; i<=7; i++){
            // up-left
            if(bishopRow-i >= 0 && bishopCol-i >= 0){
              if(this.IsEmptyTile1(bishopRow-i, bishopCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow-i][bishopCol-i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow-i, bishopCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // up-right
            if(bishopRow-i >= 0 && bishopCol+i <= 7){
              if(this.IsEmptyTile1(bishopRow-i, bishopCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow-i][bishopCol+i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow-i, bishopCol+i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-left
            if(bishopRow+i <= 7 && bishopCol-i >= 0){
              if(this.IsEmptyTile1(bishopRow+i, bishopCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow+i][bishopCol-i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow+i, bishopCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-right
            if(bishopRow+i <= 7 && bishopCol+i <= 7){
              if(this.IsEmptyTile1(bishopRow+i, bishopCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[bishopRow+i][bishopCol+i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(bishopRow+i, bishopCol+i, chessBoardTemp)) break;
            } 
          }
        }
      }
      
  
      if(whiteQueens !== undefined){
        for(let whiteQueen of whiteQueens){
          let queenRow = whiteQueen[0], queenCol = whiteQueen[1];
          for(let i=1; i<=7; i++){
            // up-left
            if(queenRow-i >= 0 && queenCol-i >= 0){
              if(this.IsEmptyTile1(queenRow-i, queenCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow-i][queenCol-i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow-i, queenCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // up-right
            if(queenRow-i >= 0 && queenCol+i <= 7){
              if(this.IsEmptyTile1(queenRow-i, queenCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow-i][queenCol+i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow-i, queenCol+i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-left
            if(queenRow+i <= 7 && queenCol-i >= 0){
              if(this.IsEmptyTile1(queenRow+i, queenCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow+i][queenCol-i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow+i, queenCol-i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // down-right
            if(queenRow+i <= 7 && queenCol+i <= 7){
              if(this.IsEmptyTile1(queenRow+i, queenCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow+i][queenCol+i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow+i, queenCol+i, chessBoardTemp)) break;
            } 
          }
    
          for(let i=1; i<=7; i++){
            // row same
            if(queenCol-i >= 0){
              if(this.IsEmptyTile1(queenRow, queenCol-i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow][queenCol-i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow, queenCol-i, chessBoardTemp)) break;
            }
          }
    
          for(let i=1; i<=7; i++){
            if(queenCol+i <= 7){
              if(this.IsEmptyTile1(queenRow, queenCol+i, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow][queenCol+i] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow, queenCol+i, chessBoardTemp)) break;
            }
            
          }
    
          for(let i=1; i<=7; i++){
            // column same
            if(queenRow-i >= 0){
              if(this.IsEmptyTile1(queenRow-i, queenCol, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow-i][queenCol] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow-i, queenCol, chessBoardTemp)) break;
            }
          }
    
          for(let i=1; i<=7; i++){
            if(queenRow+i <= 7){
              if(this.IsEmptyTile1(queenRow+i, queenCol, chessBoardTemp)) continue;
              if(chessBoardTemp[queenRow+i][queenCol] === 'k') {chessBoardTemp[fromRow][fromCol] = piece;return true;}
              if(!this.IsEmptyTile1(queenRow+i, queenCol, chessBoardTemp)) break;
            }
            
          }
        }
      }
    }
    
 
    chessBoardTemp[fromRow][fromCol] = piece;
    return false;
  }

  IsTileSafeForKing(king: string, row: number, col: number): boolean {
    let king_coordinates = this.findPiece(king);

    if (king === 'K' && king_coordinates && !this.IsWhitePiece(row, col)) {

      if (this.chess_Board[row - 1][col - 1] === 'p' && row-1 >= 0 && col-1 >= 0){
        return false;
      }

      if(this.chess_Board[row-1][col+1] === 'p' && row-1 >= 0 && col+1 <= 7){
        return false;
      }

      const blackKnightArray = this.getMajorPieces('n');
      for (let pos of blackKnightArray) {
        if (!this.IsInvalidMoveDup('n', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackRookArray = this.getMajorPieces('r');
      for (let pos of blackRookArray) {
        if (!this.IsInvalidMoveDup('r', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackBishopArray = this.getMajorPieces('b');
      for (let pos of blackBishopArray) {
        if (!this.IsInvalidMoveDup('b', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const blackQueenArray = this.getMajorPieces('q');
      for (let pos of blackQueenArray) {
        if (!this.IsInvalidMoveDup('q', pos[0], pos[1], row, col)) {
          return false;
        }
      }

    } else if (king === 'k' && king_coordinates && !this.IsBlackPiece(row, col)) {
      if (this.chess_Board[row + 1][col - 1] === 'P' && row + 1 <= 7 && col - 1 >= 0 ) {
        return false;
      }

      if(this.chess_Board[row + 1][col + 1] === 'P' && row+1 <= 7 && col+1 <= 7){
        return false;
      }

      const whiteKnightArray = this.getMajorPieces('N');
      for (let pos of whiteKnightArray) {
        if (!this.IsInvalidMoveDup('N', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteRookArray = this.getMajorPieces('R');
      for (let pos of whiteRookArray) {
        if (!this.IsInvalidMoveDup('R', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteBishopArray = this.getMajorPieces('B');
      for (let pos of whiteBishopArray) {
        if (!this.IsInvalidMoveDup('B', pos[0], pos[1], row, col)) {
          return false;
        }
      }

      const whiteQueenArray = this.getMajorPieces('Q');
      for (let pos of whiteQueenArray) {
        if (!this.IsInvalidMoveDup('Q', pos[0], pos[1], row, col)) {
          return false;
        }
      }
    } else if ((king == 'k' && this.IsBlackPiece(row, col)) ||
      (king == 'K' && this.IsWhitePiece(row, col))) {
      return false;
    }

    return true;
  }

  IsInvalidMoveDup(
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

        // Attacking Black Piece
        if((toRow == fromRow - 1 && toCol == fromCol - 1 && this.IsBlackPiece(toRow, toCol)) ||
           (toRow == fromRow - 1 && toCol == fromCol + 1 && this.IsBlackPiece(toRow, toCol))){
          return false;
        }

        if (
          toRow == fromRow - 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        ) {
          return true;
        }

        if(toRow != fromRow && toCol != fromCol ){
          return true;
        }

        if (toCol == fromCol && toRow > fromRow) {
          return true;
        }

        if (!this.IsEmptyTile(toRow, toCol)) {
          return true;
        }

        return false;

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
            (toRow == fromRow - 2 && (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
            (toRow == fromRow + 2 && (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
            (toCol == fromCol - 2 && (toRow == fromRow + 1 || toRow == fromRow - 1)) ||
            (toCol == fromCol + 2 && (toRow == fromRow + 1 || toRow == fromRow - 1))
          )
        ) {
          return true;
        }


        if (piece === 'N' && this.IsWhitePiece(toRow, toCol)) {
          return true;
        }

        if (piece === 'n' && this.IsBlackPiece(toRow, toCol)) {
          return true;
        }

        return false;
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

        // Attacking White Pieces
        if((toRow == fromRow + 1 && toCol == fromCol - 1 && this.IsWhitePiece(toRow, toCol)) ||
           (toRow == fromRow + 1 && toCol == fromCol + 1 && this.IsWhitePiece(toRow, toCol))){
          return false;
        }
        //moving diagonally
        if (
          toRow == fromRow + 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        ) {
          return true;
        }

        if(toRow == fromRow + 2 && toCol != fromCol ){
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

  IsInvalidMove(
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    if (fromRow == toRow && fromCol == toCol) return true;

    if(this.IsKingUnderCheckAfterPieceMovement('K', fromRow, fromCol, toRow, toCol, this.chess_Board)){
      if(this.IsWhitePiece(fromRow, fromCol)){
        
      }
    }

    if(this.IsWhitePiece(fromRow, fromCol) && this.chess_Board[fromRow][fromCol] !== 'K'){
      if(this.IsKingUnderCheckAfterPieceMovement('k', fromRow, fromCol, toRow, toCol, this.chess_Board)){
        return false;
      }
    }else if(this.IsBlackPiece(fromRow, fromCol) && this.chess_Board[fromRow][fromCol] !== 'k'){
      if(this.IsKingUnderCheckAfterPieceMovement('K', fromRow, fromCol, toRow, toCol, this.chess_Board)){
        return false;
      }
    }
    
    // Finding the locations of White and Black Kings.
    let whiteKingRow, whiteKingCol, blackKingRow, blackKingCol: any;
    let whiteKingCoord = this.findPiece('K');
    whiteKingRow = whiteKingCoord?.row, whiteKingCol = whiteKingCoord?.col;

    let blackKingCoord = this.findPiece('k');
    blackKingRow = blackKingCoord?.row, blackKingCol = blackKingCoord?.col;

    switch (piece) {
      case 'P': {

        // Attacking Black Piece
        if((toRow == fromRow - 1 && toCol == fromCol - 1 && this.IsBlackPiece(toRow, toCol)) ||
           (toRow == fromRow - 1 && toCol == fromCol + 1 && this.IsBlackPiece(toRow, toCol))){
          return false;
        }

        if (
          toRow == fromRow - 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        ) {
          return true;
        }

        if(toRow != fromRow && toCol != fromCol ){
          return true;
        }

        if (toCol == fromCol && toRow > fromRow) {
          return true;
        }

        if (!this.IsEmptyTile(toRow, toCol)) {
          return true;
        }

        return false;

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
            (toRow == fromRow - 2 && (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
            (toRow == fromRow + 2 && (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
            (toCol == fromCol - 2 && (toRow == fromRow + 1 || toRow == fromRow - 1)) ||
            (toCol == fromCol + 2 && (toRow == fromRow + 1 || toRow == fromRow - 1))
          )
        ) {
          return true;
        }


        if (piece === 'N' && this.IsWhitePiece(toRow, toCol)) {
          return true;
        }

        if (piece === 'n' && this.IsBlackPiece(toRow, toCol)) {
          return true;
        }

        return false;
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

        if(!this.IsTileSafeForKing(piece, toRow, toCol)){
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

        // Attacking White Pieces
        if((toRow == fromRow + 1 && toCol == fromCol - 1 && this.IsWhitePiece(toRow, toCol)) ||
           (toRow == fromRow + 1 && toCol == fromCol + 1 && this.IsWhitePiece(toRow, toCol))){
          return false;
        }
        //moving diagonally
        if (
          toRow == fromRow + 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        ) {
          return true;
        }

        if(toRow == fromRow + 2 && toCol != fromCol ){
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
