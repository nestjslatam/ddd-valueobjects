import { Test, TestingModule } from '@nestjs/testing';
import { ExampleAppController } from './example-app.controller';
import { ExampleAppService } from './example-app.service';

describe('ExampleAppController', () => {
  let exampleAppController: ExampleAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExampleAppController],
      providers: [ExampleAppService],
    }).compile();

    exampleAppController = app.get<ExampleAppController>(ExampleAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(exampleAppController.getHello()).toBe('Hello World!');
    });
  });
});
