import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  constructor() {}

  async processImage(imagePath: string): Promise<string> {
    try {
      const { data } = await Tesseract.recognize(
        imagePath,
        process.env.OCR_LANGUAGE || 'por',
        {
          logger: m => console.log(m),
        },
      );
      return data.text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to process image with OCR');
    }
  }
}