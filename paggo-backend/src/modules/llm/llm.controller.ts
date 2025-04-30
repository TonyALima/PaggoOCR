import { Controller, NotFoundException, Post, Body} from '@nestjs/common';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserDocumentDto } from '../documents/dto/user-document.dto';
import { BadRequestException } from '@nestjs/common';
import { DocumentQuestionDto } from './dto/document-question.dto';
import { LlmService } from './llm.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('explain')
  @ApiConsumes('application/json')
  @ApiBody({type: UserDocumentDto})
  async explain(@Body() body: UserDocumentDto): Promise<any> {
    const { documentId, userId } = body;
    // Check if the document belongs to the user
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });
    if (!document) {  
      throw new BadRequestException('Document not found or does not belong to the user');
    }

    if (!document.ocrText) {
      throw new NotFoundException('OCR text is missing');
    }

    //  Check if the document has already been processed
    const existingChatHistory = await this.prisma.chatHistory.findFirst({
      where: { documentId, query: "Resumo" },
    });
    if (existingChatHistory) {
      return { resumo: existingChatHistory.answer };
    }

    const explanation = await this.llmService.explainText(document.ocrText);

    await this.prisma.chatHistory.create({
        data: {
          documentId,
          query: "Resumo",
          answer: explanation,
        },
      });

    return { resumo: explanation };
  }

  @Post('question')
  @ApiConsumes('application/json')
  @ApiBody({type: DocumentQuestionDto})
  async question(@Body() userDocumentDto: DocumentQuestionDto): Promise<any> {
    const { documentId, userId, question } = userDocumentDto;

    // Check if the document belongs to the user
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new BadRequestException('Document not found or does not belong to the user');
    }

    if (!document.ocrText) {
      throw new NotFoundException('OCR text is missing');
    }

    const answer = await this.llmService.askQuestion(document.ocrText, question);

    await this.prisma.chatHistory.create({
        data: {
          documentId,
          query: question,
          answer,
        },
      });

    return { answer };
  }
}
