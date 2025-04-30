import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async validateUser(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return "Invalid credentials";
    }
    const isPasswordValid = await this.verifyPassword(user.passwordHash, password);
    if (isPasswordValid) {
      return user.id;
    }
    return "Invalid credentials";
  }

  async registerUser(name: string, email: string, password: string): Promise<string> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });
    return user.id;
  }

  /**
   * Gera o hash de uma senha usando Argon2id.
   * @param password A senha.
   * @returns O hash da senha.
   */
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  /**
   * Verifica se a senha corresponde ao hash.
   * @param hash O hash armazenado no banco de dados.
   * @param password A senha fornecida pelo usuário.
   * @returns true se a senha for válida.
   */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }
}