import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { from, isEmpty } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/services/SocketService';


@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})


export class GameRoomComponent {
  @ViewChildren('column') columns!: QueryList<ElementRef>;
  @ViewChild('whitePawn') whitePawnRow!: ElementRef;
  roomData: any = {}
  currentPlayer: string = 'white';
  IsWhiteKingChecked: string = '';
  IsBlackKingChecked: string = '';
  draggedPiece: any = {};
  hasWhiteKingMoved!: boolean
  hasBlackKingMoved!: boolean
  inputText!: string

  chessPieces: any = {};
  constructor(private socket: SocketService, private route: ActivatedRoute) {
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

  chess_Board = this.socket.chess_Board;

  setColumnTile: any;

  ngOnInit() {
    this.hasWhiteKingMoved = false;
    this.hasBlackKingMoved = false;
    this.receiveJoinedPlayers();
    this.getUpdatedChessBoardState();
    this.route.queryParams.subscribe(params => {
      this.roomData =  { player: params['playerName'], room: params['roomName']};
    });
    // console.log(this.gpElementRef?.nativeElement);
  }

  ngDoCheck(){
    this.socket.chessPieceListen().subscribe({
      next: (res: any) => {
        for(let i=0; i<res.length; i++){
          for(let j=0; j<res[i].length; j++){
            this.chess_Board[i][j] = res[i][j];
          }
        }
      }
    })
  }

  setTileStyle(row: number, column: number) {
    if (
      this.IsBlackKingChecked == 'Black Under Check' &&
      this.chess_Board[row][column] == 'k'
    ) {
      return {
        'background-color': 'red',
      };
    }

    if (
      this.IsWhiteKingChecked == 'White Under Check' &&
      this.chess_Board[row][column] == 'K'
    ) {
      return {
        'background-color': 'red',
      };
    }

    let oddTile = {
      'background-color': '#5d7744',
    };

    let evenTile = {
      'background-color': '#b3a67a',
    };

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
      // Implement your logic here to move the piece to the destination cell
      // console.log(`Piece dropped at row: ${this.draggedPiece.row}, col: ${this.draggedPiece.col}`);
      this.draggedPiece = null;
    }
  }

  onDragStart(event: DragEvent, row: number, col: number): void {
    // Set data to be transferred during drag
    event.dataTransfer!.setData('text/plain', JSON.stringify({ row, col }));
  }

  allowDrop(event: DragEvent): void {
    // Allow drop behavior
    event.preventDefault();
  }

  onDrop(event: DragEvent, row: number, col: number): void {
    // Prevent default drop behavior
    event.preventDefault();

    // Retrieve the data transferred during drag
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

  toggleCurrentPlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    this.socket.sendUpdatedChessBoardState(this.roomData?.room, this?.roomData?.player,this.chess_Board);
  }

  isPlayerTurn(player: string, row: number, col: number) {
    if(this.IsWhitePiece(row, col) && player == 'white'){
      return true;
    } else if(this.IsBlackPiece(row, col) && player == 'black'){
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

    
    // console.log(this.socket.chess_Board);
    const piece = this.chess_Board[fromRow][fromCol];
    //Implement logic to move the piece in your chessboard array
    switch (piece) {
      case 'P':
        this.whitePawnMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'R':
        this.whiteRookMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'N':
        this.whiteKnightMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'B':
        this.whiteBishopMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'Q':
        this.whiteQueenMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'K':
        this.whiteKingMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'p':
        this.blackPawnMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'r':
        this.blackRookMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'n':
        this.blackKnightMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'b':
        this.blackBishopMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'q':
        this.blackQueenMovement(fromRow, fromCol, toRow, toCol);
        break;
      case 'k':
        this.blackKingMovement(fromRow, fromCol, toRow, toCol);
        break;
    }

    // Checking whether the White King is Under Check
    // here toRow and toCol are the co-ordinates of black piece after displacement.
    if (this.IsWhiteKingUnderCheck('K', toRow, toCol)) {
      this.IsWhiteKingChecked = 'White Under Check';

      // Find the location of White King
      let kingRow, kingCol: any;
      for (let i = 0; i < this.chess_Board.length; i++) {
        for (let j = 0; j < this.chess_Board[i].length; j++) {
          if (this.chess_Board[i][j] == 'K') {
            (kingRow = i), (kingCol = j);
            break;
          }
        }
       
      }

      /* Remove the King from Check
       1. If a White piece comes in between the King and the black (attacking) piece
       2. If King Moves away from the attacking piece
       3. If White captures the attacking piece
       */
      let attackingPiece = this.chess_Board[toRow][toCol];
      switch (attackingPiece) {
        case 'p': {
          if (
            (kingRow == toRow + 1 && kingCol == toCol - 1) ||
            (kingRow == toRow + 1 && kingCol == toCol + 1)
          ) {
          }
        }
      }
      this.socket.sendUpdatedChessBoardState(this.roomData?.room, this?.roomData?.player,this.chess_Board);
    } else {
      this.IsWhiteKingChecked = '';
    }

    // Checking whether the Black King is Under Check
    if (this.IsBlackKingUnderCheck('k', toRow, toCol)) {
      this.IsBlackKingChecked = 'Black Under Check';
      // Remove the King from Check
    } else {
      this.IsBlackKingChecked = '';
    }

    // White Wins
    let blackKingAbsent = true;
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == 'k') {
          blackKingAbsent = false;
          break;
        }
      }
    }

    if (blackKingAbsent) {
      alert('White Wins');
      this.chess_Board = this.chess_board_OG;
    }

    // Black Wins
    let whiteKingAbsent = true;
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == 'K') {
          whiteKingAbsent = false;
          break;
        }
      }
    }

    if (whiteKingAbsent) {
      alert('Black Won');
      this.chess_Board = this.chess_board_OG;
    }

    console.log(this.chess_Board);
    this.socket.chessPieceEmit(this.chess_Board);
  }

  IsEmptyTile(row: number, col: number): boolean {
    if (this.chess_Board[row][col] == '') return true;
    return false;
  }

  findPiece(piece: string) {
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == 'K') return { row: i, col: j };
      }
    }
    return null;
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

  IsWhiteKingUnderCheck(
    king: string,
    fromRow: number,
    fromCol: number
  ): boolean {
    // The Piece giving check to the King
    const piece = this.chess_Board[fromRow][fromCol];
    let kingRow!: number;
    let kingCol!: number;

    // King's location:
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == king) {
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
        !this.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)
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
          if (!this.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
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
          if (!this.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
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
    const piece = this.chess_Board[fromRow][fromCol];
    let kingRow!: number;
    let kingCol!: number;

    // King's location:
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == king) {
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
        !this.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)
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
          if (!this.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
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
          if (!this.IsInvalidMove(piece, fromRow, fromCol, kingRow, kingCol)) {
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
    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == 'K') {
          (whiteKingRow = i), (whiteKingCol = j);
          break;
        }
      }
    }

    for (let i = 0; i < this.chess_Board.length; i++) {
      for (let j = 0; j < this.chess_Board[i].length; j++) {
        if (this.chess_Board[i][j] == 'k') {
          (blackKingRow = i), (blackKingCol = j);
          break;
        }
      }
    }

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
          alert('Invalid rook move as tiles are not empty in between');
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

  whitePawnMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    //
    const piece = this.chess_Board[fromRow][fromCol];

    // Attacking Black Pieces
    if (
      toRow == fromRow - 1 &&
      (toCol == fromCol - 1 || toCol == fromCol + 1) &&
      this.IsBlackPiece(toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If the tile is empty
    if (this.IsEmptyTile(toRow, toCol)) {
      if (this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        alert('Invalid Move');
        this.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
        return;
      }

      // If Valid Move is played
      if (!this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        if (fromRow == 6 && toRow >= fromRow - 2 && toRow < fromRow) {
          this.chess_Board[toRow][toCol] = piece;
          this.chess_Board[fromRow][fromCol] = '';
          this.toggleCurrentPlayer();
        } else if (fromRow != 6 && toRow >= fromRow - 1 && toRow < fromRow) {
          this.chess_Board[toRow][toCol] = piece;
          this.chess_Board[fromRow][fromCol] = '';
          this.toggleCurrentPlayer();
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
    const piece = this.chess_Board[fromRow][fromCol];
    //Attacking Black Pieces
    if (
      this.IsBlackPiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }
    // If the tile is empty
    if (this.IsEmptyTile(toRow, toCol)) {
      //Invalid Move
      if (this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        alert('Invalid Rook Move');
        this.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
        return;
      }

      // legal Move
      if (
        (toRow != fromRow && toCol == fromCol) ||
        (toRow == fromRow && toCol != fromCol)
      ) {
        this.chess_Board[toRow][toCol] = piece;
        this.chess_Board[fromRow][fromCol] = '';
        this.toggleCurrentPlayer();
      }
    }
  }

  whiteKnightMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];

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
      this.IsBlackPiece(toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If the tile is empty
    if (this.IsEmptyTile(toRow, toCol)) {
      // Invalid Move
      if (this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        alert('Invalid Move');
        this.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
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
        this.chess_Board[toRow][toCol] = piece;
        this.chess_Board[fromRow][fromCol] = '';
        this.toggleCurrentPlayer();
      }
    }
  }

  whiteBishopMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];
    // Attack Black Pieces
    if (
      this.IsBlackPiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If the tile is Empty
    if (this.IsEmptyTile(toRow, toCol)) {
      /*
      legal Moves
      1. Towards Up and Left
      2. Towards Up and Right
      3, Towards Down and left
      4. Towards Down and Right
      */

      for (let i = 1; i <= 7; i++) {
        if (!this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i)
          ) {
            this.chess_Board[toRow][toCol] = piece;
            this.chess_Board[fromRow][fromCol] = '';
            this.toggleCurrentPlayer();
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
    const piece = this.chess_Board[fromRow][fromCol];
    // Attack Black Pieces
    if (
      this.IsBlackPiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If Tile is Empty
    if (this.IsEmptyTile(toRow, toCol)) {
      for (let i = 1; i <= 7; i++) {
        if (!this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i) ||
            (toRow != fromRow && toCol == fromCol) ||
            (toRow == fromRow && toCol != fromCol)
          ) {
            this.chess_Board[toRow][toCol] = piece;
            this.chess_Board[fromRow][fromCol] = '';
            this.toggleCurrentPlayer();
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
    const piece = this.chess_Board[fromRow][fromCol];

    // Attack Black Pieces
    if (
      this.IsBlackPiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.hasWhiteKingMoved = true;
      this.toggleCurrentPlayer();
    }

    if (this.IsEmptyTile(toRow, toCol)) {
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
        !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
      ) {
        this.chess_Board[toRow][toCol] = piece;
        this.chess_Board[fromRow][fromCol] = '';
        this.hasWhiteKingMoved = true;
        this.toggleCurrentPlayer();
        return;
      }
    }

    // Castling
    if (
      this.chess_Board[7][4] == 'K' &&
      this.chess_Board[7][0] == 'R' &&
      this.IsEmptyTile(7, 1) &&
      this.IsEmptyTile(7, 2) &&
      this.IsEmptyTile(7, 3) &&
      !this.hasWhiteKingMoved
    ) {
      if (toRow == fromRow && toCol == fromCol - 2) {
        this.chess_Board[toRow][toCol] = 'K';
        this.chess_Board[toRow][toCol + 1] = 'R';
        this.chess_Board[fromRow][fromCol] = '';
        this.chess_Board[7][0] = '';
        this.hasWhiteKingMoved = true;
        this.toggleCurrentPlayer();
        return;
      }
    } else if (
      this.chess_Board[7][4] == 'K' &&
      this.chess_Board[7][7] == 'R' &&
      this.IsEmptyTile(7, 5) &&
      this.IsEmptyTile(7, 6) &&
      !this.hasWhiteKingMoved
    ) {
      if (toRow == fromRow && toCol == fromCol + 2) {
        this.chess_Board[toRow][toCol] = 'K';
        this.chess_Board[toRow][toCol - 1] = 'R';
        this.chess_Board[fromRow][fromCol] = '';
        this.chess_Board[7][7] = '';
        this.hasWhiteKingMoved = true;
        this.toggleCurrentPlayer();
        return;
      }
    }
  }

  // Black Pieces
  blackPawnMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];

    //Attacking White Pieces
    if (
      toRow == fromRow + 1 &&
      (toCol == fromCol - 1 || toCol == fromCol + 1) &&
      this.IsWhitePiece(toRow, toCol)
    ) {
      let piece = this.chess_Board[fromRow][fromCol]; //black_pawn
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If the tile is empty
    if (this.IsEmptyTile(toRow, toCol)) {
      if (this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        alert('Invalid Move');
        this.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
      }

      // If Valid Move is played
      if (!this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        if (fromRow == 1 && toRow <= fromRow + 2 && toRow > fromRow) {
          this.chess_Board[toRow][toCol] = piece;
          this.chess_Board[fromRow][fromCol] = '';
          this.toggleCurrentPlayer();
        } else if (fromRow != 1 && toRow <= fromRow + 1 && toRow > fromRow) {
          this.chess_Board[toRow][toCol] = piece;
          this.chess_Board[fromRow][fromCol] = '';
          this.toggleCurrentPlayer();
        }
      }
    }
  }

  blackRookMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];
    //Attacking White Pieces
    if (
      this.IsWhitePiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }
    // If the tile is empty
    if (this.IsEmptyTile(toRow, toCol)) {
      //Invalid Move
      if (this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        alert('Invalid Rook Move');
        this.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
        return;
      }

      // legal Move
      if (
        (toRow != fromRow && toCol == fromCol) ||
        (toRow == fromRow && toCol != fromCol)
      ) {
        this.chess_Board[toRow][toCol] = piece;
        this.chess_Board[fromRow][fromCol] = '';
        this.toggleCurrentPlayer();
      }
    }
  }

  blackKnightMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];

    // Attacking White Pieces
    if (
      ((toRow == fromRow - 2 &&
        (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
        (toRow == fromRow + 2 &&
          (toCol == fromCol + 1 || toCol == fromCol - 1)) ||
        (toCol == fromCol - 2 &&
          (toRow == fromRow + 1 || toRow == fromRow - 1)) ||
        (toCol == fromCol + 2 &&
          (toRow == fromRow + 1 || toRow == fromRow - 1))) &&
      this.IsWhitePiece(toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If the tile is empty
    if (this.IsEmptyTile(toRow, toCol)) {
      // Invalid Move
      if (this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
        alert('Invalid Move');
        this.resetToPreviousPosition(fromRow, fromCol, toRow, toCol);
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
        this.chess_Board[toRow][toCol] = piece;
        this.chess_Board[fromRow][fromCol] = '';
        this.toggleCurrentPlayer();
      }
    }
  }

  blackBishopMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];
    // Attack White Pieces
    if (
      this.IsWhitePiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If the tile is Empty
    if (this.IsEmptyTile(toRow, toCol)) {
      /*
      legal Moves
      1. Towards Up and Left
      2. Towards Up and Right
      3, Towards Down and left
      4. Towards Down and Right
      */

      for (let i = 1; i <= 7; i++) {
        if (!this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i)
          ) {
            this.chess_Board[toRow][toCol] = piece;
            this.chess_Board[fromRow][fromCol] = '';
            this.toggleCurrentPlayer();
          }
        }
      }
    }
  }

  blackQueenMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];
    // Attack White Pieces
    if (
      this.IsWhitePiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.toggleCurrentPlayer();
    }

    // If Tile is Empty
    if (this.IsEmptyTile(toRow, toCol)) {
      for (let i = 1; i <= 7; i++) {
        if (!this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)) {
          if (
            (toRow == fromRow - i && toCol == fromCol - i) ||
            (toRow == fromRow - i && toCol == fromCol + i) ||
            (toRow == fromRow + i && toCol == fromCol - i) ||
            (toRow == fromRow + i && toCol == fromCol + i) ||
            (toRow != fromRow && toCol == fromCol) ||
            (toRow == fromRow && toCol != fromCol)
          ) {
            this.chess_Board[toRow][toCol] = piece;
            this.chess_Board[fromRow][fromCol] = '';
            this.toggleCurrentPlayer();
          }
        }
      }
    }
  }

  blackKingMovement(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) {
    const piece = this.chess_Board[fromRow][fromCol];

    // Attack White Pieces
    if (
      this.IsWhitePiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
      this.hasBlackKingMoved = true;
      this.toggleCurrentPlayer();
    }

    if (this.IsEmptyTile(toRow, toCol)) {
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
        !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
      ) {
        this.chess_Board[toRow][toCol] = piece;
        this.chess_Board[fromRow][fromCol] = '';
        this.hasBlackKingMoved = true;
        this.toggleCurrentPlayer();
        return;
      }
    }

    // Castling
  if (
    this.chess_Board[0][4] == 'k' &&
    this.chess_Board[0][0] == 'r' &&
    this.IsEmptyTile(0, 1) &&
    this.IsEmptyTile(0, 2) &&
    this.IsEmptyTile(0, 3) &&
    !this.hasBlackKingMoved
  ) {
    if (toRow == fromRow && toCol == fromCol - 2) {
      this.chess_Board[toRow][toCol] = 'k';
      this.chess_Board[toRow][toCol + 1] = 'r';
      this.chess_Board[fromRow][fromCol] = '';
      this.chess_Board[0][0] = '';
      this.hasBlackKingMoved = true;
      this.toggleCurrentPlayer();
      return;
    }
  } else if (
    this.chess_Board[0][4] == 'k' &&
    this.chess_Board[0][7] == 'r' &&
    this.IsEmptyTile(0, 5) &&
    this.IsEmptyTile(0, 6) &&
    !this.hasBlackKingMoved
  ) {
    if (toRow == fromRow && toCol == fromCol + 2) {
      this.chess_Board[toRow][toCol] = 'k';
      this.chess_Board[toRow][toCol - 1] = 'r';
      this.chess_Board[fromRow][fromCol] = '';
      this.chess_Board[0][7] = '';
      this.hasBlackKingMoved = true;
      this.toggleCurrentPlayer();
      return;
    }
  }
  }
  receiveJoinedPlayers() {
    this.socket.receiveJoinedPlayers().subscribe((message) => {
      alert(message);
    })
  }


  getUpdatedChessBoardState() {
    this.socket.getUpdatedChessBoardState().subscribe((message: any) => {
      if(message["chessBoardStateMatrix"].length > 0) {
        console.log(message["chessBoardStateMatrix"].length);
        this.chess_Board = message["chessBoardStateMatrix"];
      }
    })
  }
}

