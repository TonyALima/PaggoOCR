import { Controller, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get('explain/:documentId')
  async explain(@Param('documentId') documentId: string): Promise<any> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.ocrText) {
      throw new NotFoundException('Document not found or OCR text is missing');
    }

    const explanation = await this.llmService.explainText(document.ocrText);

    await prisma.chatHistory.create({
        data: {
          documentId,
          query: "Resumo",
          answer: explanation,
        },
      });

    return { resumo: explanation };
  }

  @Get('question/:documentId')
  async question(
    @Param('documentId') documentId: string,
    @Query('query') query: string,
  ): Promise<any> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.ocrText) {
      throw new NotFoundException('Document not found or OCR text is missing');
    }

    const answer = await this.llmService.askQuestion(document.ocrText, query);

    await prisma.chatHistory.create({
        data: {
          documentId,
          query,
          answer,
        },
      });

    return { answer };
  }
}
