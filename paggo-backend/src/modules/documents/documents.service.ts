import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private llmService: LlmService,
  ) {}

  async processDocument(file: Express.Multer.File, userId: string) {
    const uploadDir = path.join(__dirname, '../../../uploads');
    const filePath = path.join(uploadDir, file.originalname);

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save the file to the upload directory
    fs.writeFileSync(filePath, file.buffer);

    // Extract text from the file using LLM
    const extractedText = await this.llmService.processFile(filePath);

    // Save document details in the database
    const document = await this.prisma.document.create({
      data: {
        fileName: file.originalname,
        fileSize: file.size,
        filePath: filePath,
        mimeType: file.mimetype,
        ocrText: extractedText,
        userId: userId,
      },
    });

    return document;
  }
}