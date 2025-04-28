import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Document Processing API is running!"', () => {
      expect(appController.getHello()).toBe('Document Processing API is running!');
    });
  });

  describe('health check', () => {
    it('should return health status', () => {
      expect(appController.healthCheck()).toEqual({ status: 'ok' });
    });
  });
});
