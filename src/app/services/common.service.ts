import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { FriendRequest } from '../models/FriendRequest';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLoggedIn: boolean = false;
  homeLoaded: boolean = false;
  socialLoaded: boolean = false;
  friendsList: User[] = [];
  getUser!: User;
  getFriendRequestList: FriendRequest[] = [];

  currentPlayer: string = 'white';
  hasWhiteKingMoved: boolean  = false;
  hasBlackKingMoved: boolean = false;
  IsWhiteKingChecked: string = '';
  IsBlackKingChecked: string = '';
  players: any;
  player1: any;
  player2: any;
  updatedMovementsTable: any;

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

  constructor() { }

  IsUndefinedOrNull(data: any){
    return (data == null || data == undefined || data == '' || data.length == 0);
  }

  IsWhitePiece(row: number, col: number, chess_Board: string[][]): boolean{
    if(chess_Board[row][col] === 'P' || chess_Board[row][col] === 'R' || chess_Board[row][col] === 'N' || 
      chess_Board[row][col] === 'B' || chess_Board[row][col] === 'Q' || chess_Board[row][col] === 'K'
    ){
      return true;
    }
    return false;
  }

  IsBlackPiece(row: number, col: number, chess_Board: string[][]): boolean{
    if(chess_Board[row][col] === 'p' || chess_Board[row][col] === 'r' || chess_Board[row][col] === 'n' || 
      chess_Board[row][col] === 'b' || chess_Board[row][col] === 'q' || chess_Board[row][col] === 'k'
    ){
      return true;
    }
    return false;
  }

}
