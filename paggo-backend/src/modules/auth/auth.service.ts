import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, passwordHash: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return "Invalid credentials";
    }
    if (passwordHash === user.passwordHash) {
        return user.id;
    }
    return "Invalid credentials";
  }
}