import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({
    description: 'ID do usuário proprietário do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagem do documento a ser enviado',
  })
  file: any; // The file will be handled by the FileInterceptor
}