import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/models/Room';
import { CommonService } from 'src/app/services/common.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chess-game',
  templateUrl: './chess-game.component.html',
  styleUrls: ['./chess-game.component.scss']
})
export class ChessGameComponent {
  @ViewChildren('column') columns!: QueryList<ElementRef>;
  @ViewChild('whitePawn') whitePawnRow!: ElementRef;

  hasPlayerJoined: Boolean = false;
  roomData: any = {}
  joinedPlayerMessage: string = 'Player Joined';
  draggedPiece: any = {};
  inputText!: string;
  chessPieces: any = {};
  coordinates: any = [];
  chess_Board = this.cs.chess_Board;
  setColumnTile: any;

  constructor(private socket: SocketService, 
    private route: ActivatedRoute, public cs: CommonService) {
      this.initializeChessPieces();
  }

  private initializeChessPieces(): void {
    const basePath = '../../../assets/images/';
    this.chessPieces = {
      whitePawn: `${basePath}white_pawn.png`,
      whiteKnight: `${basePath}white_knight.png`,
      whiteBishop: `${basePath}white_bishop.png`,
      whiteRook: `${basePath}white_rook.png`,
      whiteQueen: `${basePath}white_queen.png`,
      whiteKing: `${basePath}white_king.png`,
      blackPawn: `${basePath}black_pawn.png`,
      blackKnight: `${basePath}black_knight.png`,
      blackBishop: `${basePath}black_bishop.png`,
      blackRook: `${basePath}black_rook.png`,
      blackQueen: `${basePath}black_queen.png`,
      blackKing: `${basePath}black_king.png`,
    };
  }

  ngOnInit() { 
    this.receiveUpdatedBoardState()  
    this.route.queryParams.subscribe(params => {
      this.roomData = { player: params['playerName'], room: params['roomName'] };
    });

    this.socket.restartGame();
    this.socket.receiveEventOutput('chessBoard').subscribe({
      next: (response: any) => {
        this.cs.chess_Board = response.chessBoard;
        this.chess_Board = response.chessBoard;
        this.cs.currentPlayer = response.currentPlayer;
      }
    })

    this.socket.receiveEventOutput('gameOver').subscribe({
      next: (response: any) => {
        alert(`${response.winner} won the match`)
      }
    })

    this.socket.receiveEventOutput('kingInCheck').subscribe({
      next: (response: any) => {
        alert(`${response.player} is in check`)
      }
    })

    this.socket.receiveEventOutput('currentPlayer').subscribe((response: any) => {
      this.cs.currentPlayer = response;
    })

    this.socket.receiveEventOutput('savedGameData').subscribe((response: any) => {
      console.log(response);
    })

  }

  saveGame(){
    let authtoken = JSON.parse(sessionStorage.getItem('authToken') || '');
    this.socket.saveGame(authtoken.authToken);
  }

  receiveJoinedPlayers() {
    this.socket.receiveEventOutput('userJoined').subscribe((message: any) => {
      this.joinedPlayerMessage = message;
      this.hasPlayerJoined = true;
    })
  }

  receiveUpdatedBoardState(){
    this.socket.receiveEventOutput('updateBoard').subscribe({
      next: (response: any) => { // gets the chess board from server
        this.cs.chess_Board = response;
        this.chess_Board = response;
      }
    })
  }

  setTileStyle(row: number, column: number) {
    if (this.cs.IsBlackKingChecked == 'Black Under Check' && this.chess_Board[row][column] == 'k') {
      return { 'background-color': 'red'};
    }

    if (this.cs.IsWhiteKingChecked == 'White Under Check' && this.chess_Board[row][column] == 'K') {
      return { 'background-color': 'red'};
    }

    let oddTile = { 'background-color': '#5d7744'};
    let evenTile = { 'background-color': '#b3a67a'};
    let evenTileFlag: boolean;

    if ((row + column) % 2 === 0) evenTileFlag = true;
    else evenTileFlag = false;

    return evenTileFlag == true ? evenTile : oddTile;
  }

  getImageSource(piece: string) {
    let pieceToDisplay: any = '';
    switch (piece) {
      case 'r': pieceToDisplay = this.chessPieces.blackRook; break;
      case 'n': pieceToDisplay = this.chessPieces.blackKnight; break;
      case 'b': pieceToDisplay = this.chessPieces.blackBishop; break;
      case 'q': pieceToDisplay = this.chessPieces.blackQueen; break;
      case 'k': pieceToDisplay = this.chessPieces.blackKing; break;
      case 'p': pieceToDisplay = this.chessPieces.blackPawn; break;
      case 'R': pieceToDisplay = this.chessPieces.whiteRook; break;
      case 'N': pieceToDisplay = this.chessPieces.whiteKnight; break;
      case 'B': pieceToDisplay = this.chessPieces.whiteBishop; break;
      case 'Q': pieceToDisplay = this.chessPieces.whiteQueen; break;
      case 'K': pieceToDisplay = this.chessPieces.whiteKing; break;
      case 'P': pieceToDisplay = this.chessPieces.whitePawn; break;
      default: pieceToDisplay = '';
    }

    return pieceToDisplay;
  }

  onTouchStart(event: TouchEvent, row: number, col: number) {
    this.draggedPiece = { row: row, col: col };
  }

  onTouchMove(event: TouchEvent) {
    if (!this.draggedPiece) return;
    event.preventDefault();
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.value == 'ImagePiece') {
      const [row, col] = element.id.split('C').map(Number);
      this.draggedPiece = { row, col };
    }
  }

  onTouchEnd(event: TouchEvent, row: number, col: number) {
    if (this.draggedPiece) {
      this.draggedPiece = null;
    }
  }

  onDragStart(event: DragEvent, row: number, col: number): void {
    event.dataTransfer!.setData('text/plain', JSON.stringify({ row, col }));
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, row: number, col: number): void {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer!.getData('text/plain'));
    let fromRow = data.row,
      fromCol = data.col,
      toRow = row,
      toCol = col;

    if (this.draggedPiece) {
      this.movePiece(fromRow, fromCol, toRow, toCol);
      this.draggedPiece = null;
      return;
    }

    this.movePiece(fromRow, fromCol, toRow, toCol);
  }

  // IsPlayerTurn(player: string, row: number, col: number) {

  //   this.socket.receiveEventOutput('currentPlayer').subscribe({
  //     next: (response: any) => {
  //       this.cs.currentPlayer = response

  //       if (this.cs.IsWhitePiece(row, col, this.chess_Board) && this.cs.currentPlayer == 'white') {
  //         return true;
  //       } else if (this.cs.IsBlackPiece(row, col, this.chess_Board) && this.cs.currentPlayer == 'black') {
  //         return true;
  //       }else{
  //         return false;
  //       }
  //     }
  //   })
    
  //   return false;
  // }

  movePiece(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    this.socket.makeMove(fromRow, fromCol, toRow, toCol);
  }

}
