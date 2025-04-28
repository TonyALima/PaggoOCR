import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Document Processing API is running!';
  }

  healthCheck(): { status: string } {
    return { status: 'ok' };
  }

  getVersion(): { version: string } {
    return { version: '1.0.0' };
  }
}
