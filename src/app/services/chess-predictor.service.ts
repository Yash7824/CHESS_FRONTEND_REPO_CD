import { Injectable } from '@angular/core';
import * as ort from 'onnxruntime-web';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChessPredictorService {

  private model: ort.InferenceSession | null = null;

  constructor() {
    this.initializeBackend();
    this.loadModel();
  }

  private async initializeBackend() {
    try {
      // Set the correct paths to the WASM files
      ort.env.wasm.wasmPaths = '/assets/onnxruntime/';
      console.log('WASM paths set to:', ort.env.wasm.wasmPaths);
    } catch (err) {
      console.error('Failed to set WASM paths:', err);
    }
  }

  // Load the ONNX model from the assets folder
  private async loadModel() {
    try {
      const response = await fetch(`${environment.base_url}/nn_model/getNNModel`);
      const arrayBuffer = await response.arrayBuffer();
      const modelTensor = new Uint8Array(arrayBuffer);
  
      this.model = await ort.InferenceSession.create(modelTensor);
      console.log('ONNX Model loaded successfully.');
    } catch (error) {
      console.error('Error loading ONNX model:', error);
    }
  }

  // Method to preprocess input data and make predictions
  public async predict(boardState: string[][]): Promise<string | null> {
    if (!this.model) {
      console.error('Model is not loaded yet.');
      return null;
    }

    // Convert boardState to a tensor
    const tensor = this.convertBoardToTensor(boardState);

    try {
      const feeds = { input: tensor };
      const results = await this.model.run(feeds);
      const output = results['output'];
      return this.processPrediction(output, boardState);
    } catch (error) {
      console.error('Error during prediction:', error);
      return null;
    }

  }

  private convertBoardToTensor(boardState: string[][]): ort.Tensor {
    const flattenedBoard = boardState.flat();
    const boardArray = flattenedBoard.map(value => this.encodePiece(value));
    const tensor = new ort.Tensor('float32', new Float32Array(boardArray), [1, 8, 8, 1]);
    return tensor;
  }

  private encodePiece(piece: string): number {
    // Implement encoding logic for your model
    // Example: encode pieces as numbers or one-hot vectors
    const pieceMap: { [key: string]: number } = {
      '': 0, 'p': 1, 'r': 2, 'n': 3, 'b': 4, 'q': 5, 'k': 6,
      'P': 7, 'R': 8, 'N': 9, 'B': 10, 'Q': 11, 'K': 12
    };
    return pieceMap[piece] || 0;
  }

  private processPrediction(output: ort.Tensor, boardState: string[][]) {
    const outputData = output.data as Float32Array;
    
    // Example: If output represents moves as indices or a similar format
    // Convert outputData to move format (e.g., fromRow, fromCol, toRow, toCol)
    const move = this.decodeOutput(outputData);
    
    // Validate the move
    const [fromRow, fromCol, toRow, toCol] = move;
    return `${fromRow}${fromCol}-${toRow}${toCol}`
    // if (!this.genRule.IsInvalidMove(fromRow, fromCol, toRow, toCol, boardState)) {
    //   return `${fromRow}${fromCol}-${toRow}${toCol}`;  // Return move in a readable format
    // } else {
    //   return 'Invalid Move';
    // }
  }

  private decodeOutput(outputData: Float32Array): [number, number, number, number] {
    // Decode the output tensor to a move format
    // This should match your model's output format
    // Example decoding logic; adjust as needed
    const fromRow = Math.floor(outputData[0]);
    const fromCol = Math.floor(outputData[1]);
    const toRow = Math.floor(outputData[2]);
    const toCol = Math.floor(outputData[3]);
    return [fromRow, fromCol, toRow, toCol];
  }

}
