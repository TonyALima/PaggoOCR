import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiParam } from '@nestjs/swagger';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { GetDocumentHistoryDto } from './dto/history-document.dto';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadDocumentDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    try {
      console.log('Uploaded:', file);
      console.log('UserId:', uploadDocumentDto.userId);

      const document = await this.documentsService.processDocument(
        file,
        uploadDocumentDto.userId,
      );

      if (!document) {
        return {
          message: 'Error processing the document',
        };
      }

      return {
        message: 'File uploaded and processed successfully',
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        message: 'An error occurred while uploading the file',
        error: error.message,
      };
    }
  }

  @Get('user/:userId')
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário para buscar os documentos',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async getUserDocuments(@Param('userId') userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      select: { id: true, fileName: true },
    });

    return documents.map((doc) => ({
      id: doc.id,
      fileName: doc.fileName,
    }));
  }

  @Post('history')
  @ApiConsumes('application/json')
  @ApiBody({type: GetDocumentHistoryDto})
  async getDocumentHistory(@Body() body: GetDocumentHistoryDto) {
    const { userId, documentId } = body;

    // Check if the document belongs to the user
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new BadRequestException('Document not found or does not belong to the user');
    }

    const chatHistory = await this.prisma.chatHistory.findMany({
      where: { documentId },
      select: { query: true, answer: true, timestamp: true },
    });

    if (!chatHistory || chatHistory.length === 0) {
      return {
        message: 'No chat history found for this document',
      };
    }

    return chatHistory;
  }
}

