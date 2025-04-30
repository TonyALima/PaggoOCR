import { Controller, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @ApiConsumes('application/json')
  @ApiBody({type: ValidateUserDto})
  async validateUser(
    @Body() validateUserDto: ValidateUserDto
  ) {
    const { email, passwordHash } = validateUserDto;
    const result = await this.authService.validateUser(email, passwordHash);

    if (result === 'Invalid credentials') {
      throw new HttpException(result, HttpStatus.UNAUTHORIZED);
    }

    return { message: result };
  }

  @Post('signup')
  @ApiConsumes('application/json')
  @ApiBody({type: RegisterUserDto})
  async registerUser(
    @Body() registerUserDto: RegisterUserDto
  ) {
    const { name , email, password } = registerUserDto;

    const validDomain = process.env.VALID_EMAIL_DOMAIN;
    if (!validDomain) {
      throw new HttpException("Valid email domain not set.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!email.endsWith(`@${validDomain}`)) {
      throw new HttpException("Email invalid.", HttpStatus.BAD_REQUEST);
    }

    const userId = await this.authService.registerUser(name, email, password);

    console.log("ok");

    if (!userId) {
      throw new HttpException('Registration db failed', HttpStatus.BAD_REQUEST);
    }
    console.log(`User ${userId} registered successfully.`);
    const message = `User ${name} registered successfully.`;
    return { message };
  }
}
