import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentQuestionDto {
    @ApiProperty({
      description: 'ID do usuário',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @ApiProperty({
      description: 'ID do documento',
      example: '987e6543-e21b-34d3-a456-426614174999',
    })
    @IsString()
    @IsNotEmpty()
    documentId: string;

    @ApiProperty({
      description: 'Pergunta relacionada ao documento',
      example: 'Qual é o conteúdo do documento?',
    })
    @IsString()
    @IsNotEmpty()
    question: string;
}