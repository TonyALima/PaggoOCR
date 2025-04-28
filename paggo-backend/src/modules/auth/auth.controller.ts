import { Controller, Query, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate')
  async validateUser(
    @Query('email') email: string,
    @Query('passwordHash') passwordHash: string,
    ): Promise<{ message: string }> {
    const result = await this.authService.validateUser(email, passwordHash);
    if (result === "Invalid credentials") {
      throw new HttpException(result, HttpStatus.UNAUTHORIZED);
    }
    return { message: result };
  }
}