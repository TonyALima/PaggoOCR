import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // Ou outro header de sua escolha

    if (!apiKey || apiKey !== process.env.BACKEND_API_KEY) {
      throw new UnauthorizedException('API Key inválida ou ausente');
    }

    return true;
  }
}