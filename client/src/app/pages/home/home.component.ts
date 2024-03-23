import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { from, isEmpty } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChildren('column') columns!: QueryList<ElementRef>;
  @ViewChild('whitePawn') whitePawnRow!: ElementRef;

  currentPlayer: string = 'white';

  chessPieces: any = {};
  constructor() {
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

  setColumnTile: any;

  ngOnInit() {
    // console.log(this.gpElementRef?.nativeElement);
  }

  ngAfterViewInit() {
    // this.columns.forEach(column => {
    //   console.log(column.nativeElement.id);
    // });
    // console.log('col', this.whitePawnRow.nativeElement.id)
  }

  setTileStyle(row: number, column: number) {
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
      case 'r':
        pieceToDisplay = this.chessPieces.blackRook;
        break;
      case 'n':
        pieceToDisplay = this.chessPieces.blackKnight;
        break;
      case 'b':
        pieceToDisplay = this.chessPieces.blackBishop;
        break;
      case 'q':
        pieceToDisplay = this.chessPieces.blackQueen;
        break;
      case 'k':
        pieceToDisplay = this.chessPieces.blackKing;
        break;
      case 'p':
        pieceToDisplay = this.chessPieces.blackPawn;
        break;
      case 'R':
        pieceToDisplay = this.chessPieces.whiteRook;
        break;
      case 'N':
        pieceToDisplay = this.chessPieces.whiteKnight;
        break;
      case 'B':
        pieceToDisplay = this.chessPieces.whiteBishop;
        break;
      case 'Q':
        pieceToDisplay = this.chessPieces.whiteQueen;
        break;
      case 'K':
        pieceToDisplay = this.chessPieces.whiteKing;
        break;
      case 'P':
        pieceToDisplay = this.chessPieces.whitePawn;
        break;
      default:
        pieceToDisplay = '';
    }

    return pieceToDisplay;
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
    // 
    // Prevent default drop behavior
    event.preventDefault();

    // Retrieve the data transferred during drag
    const data = JSON.parse(event.dataTransfer!.getData('text/plain'));
    const piece = this.chess_Board[data.row][data.col];

    //Toggle Player
    // if(this.IsBlackPiece(data.row, data.col) && !this.IsInvalidMove(piece, data.row, data.col, row, col)){
    //   if(this.currentPlayer == 'black'){
    //     // Move the piece to the new position
    //     this.movePiece(data.row, data.col, row, col);
    //     this.currentPlayer = 'white';

    //   }else if(this.currentPlayer == 'white'){
    //     alert('Its white turn');
    //     this.currentPlayer = 'white';
    //   }

    // }else if(this.IsWhitePiece(data.row, data.col) && !this.IsInvalidMove(piece, data.row, data.col, row, col)){
    //   if(this.currentPlayer == 'white'){
    //     // Move the piece to the new position
    //     this.movePiece(data.row, data.col, row, col);
    //     this.currentPlayer = 'black';

    //   }else if(this.currentPlayer == 'black'){
    //     alert('Its Black turn');
    //     this.currentPlayer = 'black';
    //   }
    // }else if(this.IsInvalidMove(piece, data.row, data.col, row, col)){
    //   if(this.IsWhitePiece(data.row, data.col) && this.currentPlayer == 'white') this.currentPlayer = 'white';
    //   else if(this.IsBlackPiece(data.row, data.col) && this.currentPlayer == 'black') this.currentPlayer = 'black';
    //   this.movePiece(data.row, data.col, row, col);
    // }
    // console.log(this.currentPlayer)

    this.movePiece(data.row, data.col, row, col);
  }

  isPlayerTurn(player: string) {
    return this.currentPlayer == player;
  }

  movePiece(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): void {
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
  }

  IsEmptyTile(row: number, col: number): boolean {
    if (this.chess_Board[row][col] == '') return true;
    return false;
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

  IsInvalidMove(
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    if (fromRow == toRow && fromCol == toCol) return true;

    switch (piece) {
      case 'P': {
        //moving diagonally
        if (
          toRow == fromRow - 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        )
          return true;
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
        )
          return true;
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

        if(correctMovement) return false;
        else return true; 
        break;
      }

      case 'p': {
        //moving diagonally
        if (
          toRow == fromRow + 1 &&
          (toCol == fromCol - 1 || toCol == fromCol + 1)
        )
          return true;
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
        } else if (fromRow != 6 && toRow >= fromRow - 1 && toRow < fromRow) {
          this.chess_Board[toRow][toCol] = piece;
          this.chess_Board[fromRow][fromCol] = '';
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
    }

    // If Tile is Empty
    if (this.IsEmptyTile(toRow, toCol)) {
      // Bishop Part
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
        } else if (fromRow != 1 && toRow <= fromRow + 1 && toRow > fromRow) {
          this.chess_Board[toRow][toCol] = piece;
          this.chess_Board[fromRow][fromCol] = '';
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
    }

    // If Tile is Empty
    if (this.IsEmptyTile(toRow, toCol)) {
      // Bishop Part
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
      this.IsBlackPiece(toRow, toCol) &&
      !this.IsInvalidMove(piece, fromRow, fromCol, toRow, toCol)
    ) {
      this.chess_Board[toRow][toCol] = piece;
      this.chess_Board[fromRow][fromCol] = '';
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
      }
    }
  }
}
