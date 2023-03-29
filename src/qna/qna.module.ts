import { Module } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';
import { Qna } from './qna.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaFile } from './qna-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qna, QnaFile])],
  providers: [QnaService],
  controllers: [QnaController]
})
export class QnaModule {}
