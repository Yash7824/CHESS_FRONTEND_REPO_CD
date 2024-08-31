import { Injectable } from '@angular/core';
import * as ort from 'onnxruntime-web';

@Injectable({
  providedIn: 'root'
})
export class ChessPredictorService {

  private model: ort.InferenceSession | null = null;

  constructor() {
    this.loadModel();
  }

  // Load the ONNX model from the assets folder
  private async loadModel() {
    try {
      this.model = await ort.InferenceSession.create('/assets/neural_network_model/chess_move_predictor.onnx');
      console.log('ONNX Model loaded successfully.');
    } catch (error) {
      console.error('Error loading ONNX model:', error);
    }
  }

  // Method to preprocess input data and make predictions
  public async predict(boardState: Float32Array): Promise<number | null> {
    if (!this.model) {
      console.error('Model is not loaded yet.');
      return null;
    }

    // Convert input to ONNX Tensor format
    const inputTensor = new ort.Tensor('float32', boardState, [1, 12, 8, 8]);

    try {
      const feeds: ort.InferenceSession.OnnxValueMapType = { input: inputTensor };
      const results = await this.model.run(feeds);
      const output = results['output'].data;

      // Assert the type explicitly to number
      const predictedMoveIndex = output[0] as number; // Treat output[0] as a number
      return predictedMoveIndex;
    } catch (error) {
      console.error('Error during model inference:', error);
      return null;
    }
  }
}
