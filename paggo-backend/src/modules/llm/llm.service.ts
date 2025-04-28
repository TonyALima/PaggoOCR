import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as fs from 'fs';

@Injectable()
export class LlmService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.LLM_API_KEY!,
      baseURL: process.env.LLM_API_URL!,});
  }

  async processFile(filePath: string): Promise<any> {
  try {
    const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });
    const fileExtension = filePath.split('.').pop()?.toLowerCase();

    if (!fileExtension || !['jpeg', 'jpg', 'png'].includes(fileExtension)) {
      throw new Error('Unsupported file format. Only JPEG and PNG are allowed.');
    }

    const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';

    const response = await this.client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extraia o texto da imagem.' },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to process file with LLM');
  }
}

  async explainText(text: string): Promise<any> {
    try {
      const response = await this.client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: `Explique e resuma em português o texto seguido: ${text}` },
        ],
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to explain text with LLM');
    }
  }

  async askQuestion(context: string, question: string): Promise<any> {
    try {
      const response = await this.client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: `Contexto: ${context}\nPergunta: ${question}` },
        ],
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to ask question with LLM');
    }
  }
}