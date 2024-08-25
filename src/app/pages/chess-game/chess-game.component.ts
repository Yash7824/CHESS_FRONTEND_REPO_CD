import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/models/Room';
import { BlackService } from 'src/app/services/black.service';
import { CheckMateService } from 'src/app/services/check-mate.service';
import { CheckService } from 'src/app/services/check.service';
import { GenericRuleService } from 'src/app/services/generic-rule.service';
import { SocketService } from 'src/app/services/socket.service';
import { WhiteService } from 'src/app/services/white.service';
import {whitePawnMovement} from 'is-chess';

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

  constructor(private socket: SocketService, 
    private route: ActivatedRoute, 
    public genRule: GenericRuleService,
    private checkServ: CheckService,
    private checkMateServ: CheckMateService,
    private whiteServ: WhiteService,
  private blackServ: BlackService) {
    this.chessPieces.whitePawn = '../../../assets/images/white_pawn.png';
    this.chessPieces.whiteKnight = '../../../assets/images/white_knight.png';
    this.chessPieces.whiteBishop = '../../../assets/images/white_bishop.png';
    this.chessPieces.whiteRook = '../../../assets/images/white_rook.png';
    this.chessPieces.whiteQueen = '../../../assets/images/white_queen.png';
    this.chessPieces.whiteKing = '../../../assets/images/white_king.png';
    this.chessPieces.blackPawn = '../../../assets/images/black_pawn.png';
    this.chessPieces.blackKnight = '../../../assets/images/black_knight.png';
    this.chessPieces.blackBishop = '../../../assets/images/black_bishop.png';
    this.chessPieces.blackRook = '../../../assets/images/black_rook.png';
    this.chessPieces.blackQueen = '../../../assets/images/black_queen.png';
    this.chessPieces.blackKing = '../../../assets/images/black_king.png';
  }

  chess_Board = this.genRule.chess_Board;
  setColumnTile: any;

  ngOnInit() {   
    this.receiveJoinedPlayers();
    this.getUpdatedChessBoardState();
    this.route.queryParams.subscribe(params => {
      this.roomData = { player: params['playerName'], room: params['roomName'] };
    });
    this.getPlayers();
    this.getPlayer1();
    this.getPlayer2();
    this.receiveMovementsTable();
  }

  getPlayers(){
    this.socket.getPlayers().subscribe({
      next: (response: any) => { this.genRule.players = response; }
    })
  }

  getPlayer1(){
    this.socket.getPlayer1().subscribe({
      next: (response: any) => { this.genRule.player1 = response; }
    })
  }

  getPlayer2(){
    this.socket.getPlayer2().subscribe({
      next: (response: any) => { this.genRule.player2 = response; }
    })
  }

  receiveMovementsTable(){
    this.socket.receiveUpdatedMovementsTable().subscribe({
      next: (response) => { this.genRule.updatedMovementsTable = response;}
      
    })
  }

  setTileStyle(row: number, column: number) {
    if (this.genRule.IsBlackKingChecked == 'Black Under Check' && this.chess_Board[row][column] == 'k') {
      return { 'background-color': 'red'};
    }

    if (this.genRule.IsWhiteKingChecked == 'White Under Check' && this.chess_Board[row][column] == 'K') {
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

  IsPlayerTurn(player: string, row: number, col: number) {
    if (this.genRule.IsWhitePiece(row, col) && player == 'white') {
      return true;
    } else if (this.genRule.IsBlackPiece(row, col) && player == 'black') {
      return true;
    }
    return false;
  }

  movePiece(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): void {

    const piece = this.chess_Board[fromRow][fromCol];
    var pieceMove = this.chess_Board[fromRow][fromCol];
    if(pieceMove === 'P' || pieceMove === 'p') pieceMove = '';

    if((fromRow !== toRow || fromCol !== toCol) &&
  (!this.genRule.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol))){
      switch(toCol){
        case 0: this.coordinates.push([pieceMove + 'a' + (8-toRow)]); break;
        case 1: this.coordinates.push([pieceMove + 'b' + (8-toRow)]); break;
        case 2: this.coordinates.push([pieceMove + 'c' + (8-toRow)]); break;
        case 3: this.coordinates.push([pieceMove + 'd' + (8-toRow)]); break;
        case 4: this.coordinates.push([pieceMove + 'e' + (8-toRow)]); break;
        case 5: this.coordinates.push([pieceMove + 'f' + (8-toRow)]); break;
        case 6: this.coordinates.push([pieceMove + 'g' + (8-toRow)]); break;
        case 7: this.coordinates.push([pieceMove + 'h' + (8-toRow)]); break;
      }
    }

    this.socket.sendUpdatedMovementsTable(this.roomData.room, this.coordinates);
    //Implement logic to move the piece in your chessboard array
    switch (piece) {
      // case 'P': this.whiteServ.whitePawnMovement(fromRow, fromCol, toRow, toCol); break;
      case 'P': this.whiteServ.whitePawnMovement(fromRow, fromCol, toRow, toCol); break;
      case 'R': this.whiteServ.whiteRookMovement(fromRow, fromCol, toRow, toCol); break;
      case 'N': this.whiteServ.whiteKnightMovement(fromRow, fromCol, toRow, toCol); break;
      case 'B': this.whiteServ.whiteBishopMovement(fromRow, fromCol, toRow, toCol); break;
      case 'Q': this.whiteServ.whiteQueenMovement(fromRow, fromCol, toRow, toCol); break;
      case 'K': this.whiteServ.whiteKingMovement(fromRow, fromCol, toRow, toCol); break;
      case 'p': this.blackServ.blackPawnMovement(fromRow, fromCol, toRow, toCol); break;
      case 'r': this.blackServ.blackRookMovement(fromRow, fromCol, toRow, toCol); break;
      case 'n': this.blackServ.blackKnightMovement(fromRow, fromCol, toRow, toCol); break;
      case 'b': this.blackServ.blackBishopMovement(fromRow, fromCol, toRow, toCol); break;
      case 'q': this.blackServ.blackQueenMovement(fromRow, fromCol, toRow, toCol); break;
      case 'k': this.blackServ.blackKingMovement(fromRow, fromCol, toRow, toCol); break;
    }

    // Checking whether the White King is Under Check
    // here toRow and toCol are the co-ordinates of black piece after displacement.
    if (this.checkServ.IsWhiteKingUnderCheck('K', toRow, toCol)) {
      if (!this.checkMateServ.IsCheckMate('K', toRow, toCol)) {
        this.genRule.IsWhiteKingChecked = 'White Under Check';
      } else {
        this.genRule.IsWhiteKingChecked = 'White got check mated'
        alert('Black Wins');
        this.chess_Board = this.genRule.chess_board_OG;
        this.genRule.currentPlayer = 'white';
      }
    } else {
      this.genRule.IsWhiteKingChecked = '';
    }

    // Checking whether the Black King is Under Check
    if (this.checkServ.IsBlackKingUnderCheck('k', toRow, toCol)) {
      if (!this.checkMateServ.IsCheckMate('k', toRow, toCol)) {
        this.genRule.IsBlackKingChecked = 'Black Under Check';
      } else {
        this.genRule.IsBlackKingChecked = 'Black got check mated'
        alert('White Wins');
        this.chess_Board = this.genRule.chess_board_OG;
        this.genRule.currentPlayer = 'white';
      }

    } else {
      this.genRule.IsBlackKingChecked = '';
    }

    let chessBoardAttributes = {
      IsBlackKingChecked: this.genRule.IsBlackKingChecked,
      isWhiteKingChecked: this.genRule.IsWhiteKingChecked,
      currentPlayer: this.genRule.currentPlayer,
      hasBlackKingMoved: this.genRule.hasBlackKingMoved,
      hasWhiteKingMoved: this.genRule.hasWhiteKingMoved
    };
    this.socket.sendUpdatedChessBoardState(this.roomData.room, this.chess_Board, chessBoardAttributes);
  }

  receiveJoinedPlayers() {
    this.socket.receiveJoinedPlayers().subscribe((message: any) => {
      this.joinedPlayerMessage = message;
      this.hasPlayerJoined = true;
    })
  }

  openModal() {
    this.hasPlayerJoined = true;
  }

  closeModal() {
    this.hasPlayerJoined = false;
  }

  getUpdatedChessBoardState() {

    this.socket.getUpdatedChessBoardState().subscribe((message: any) => {
      if (message["updatedChessBoardMatrix"].length > 0) {
        console.log(message["updatedChessBoardMatrix"].length);
        this.chess_Board = message["updatedChessBoardMatrix"];
      }

      if (message["updatedChessBoardAttributes"] !== null) {
        this.genRule.IsBlackKingChecked = message["updatedChessBoardAttributes"]["IsBlackKingChecked"];
        this.genRule.IsWhiteKingChecked = message["updatedChessBoardAttributes"]["IsWhiteKingChecked"];
        this.genRule.currentPlayer = message["updatedChessBoardAttributes"]["currentPlayer"];
        this.genRule.hasBlackKingMoved = message["updatedChessBoardAttributes"]["hasBlackKingMoved"];
        this.genRule.hasWhiteKingMoved = message["updatedChessBoardAttributes"]["hasWhiteKingMoved"];
      }
    })
  }
}
