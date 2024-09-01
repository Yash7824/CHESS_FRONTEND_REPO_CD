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
  public async predict(boardState: Float32Array): Promise<number | null> {
    debugger;
    if (!this.model) {
      console.error('Model is not loaded yet.');
      return null;
    }

    // Convert input to ONNX Tensor format
    const inputTensor = new ort.Tensor('float32', boardState, [1, 12, 8, 8]);

    try {
      const feeds: ort.InferenceSession.OnnxValueMapType = { input: inputTensor };
      const results = await this.model.run(feeds);
      const outputTensor = results['output'];  // Make sure this matches your ONNX model output name
      const outputArray = Array.from(outputTensor.data as Float32Array);
        
      // Find the index with the maximum value
      const predictedMoveIndex = outputArray.indexOf(Math.max(...outputArray));
      
      return predictedMoveIndex;
    } catch (error) {
      console.error('Error during model inference:', error);
      return null;
    }
  }
}
