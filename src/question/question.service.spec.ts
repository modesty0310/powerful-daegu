import { Test, TestingModule } from '@nestjs/testing';
import { QnaService } from './question.service';

describe('QnaService', () => {
  let service: QnaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QnaService],
    }).compile();

    service = module.get<QnaService>(QnaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
