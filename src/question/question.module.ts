import { Module } from '@nestjs/common';
import { QnaService } from './question.service';
import { QnaController } from './question.controller';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionFile } from './question-file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/upload/upload.module';
import { QuestionRepository } from './question.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionFile]), AuthModule, UploadModule],
  providers: [QnaService, QuestionRepository],
  controllers: [QnaController],
  exports: [QuestionRepository]
})
export class QuestionModule {}
