import { Controller, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUserDto } from './dto/validate-user.dto'; // ajuste o caminho conforme necessário

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  async validateUser(
    @Body() validateUserDto: ValidateUserDto
  ): Promise<{ message: string }> {
    const { email, passwordHash } = validateUserDto;
    const result = await this.authService.validateUser(email, passwordHash);

    if (result === 'Invalid credentials') {
      throw new HttpException(result, HttpStatus.UNAUTHORIZED);
    }

    return { message: result };
  }
}
