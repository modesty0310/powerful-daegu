import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionFile } from './question-file.entity';
import { UploadModule } from 'src/upload/upload.module';
import { QuestionRepository } from './question.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionFile]), UploadModule],
  providers: [QuestionService, QuestionRepository],
  controllers: [QuestionController],
  exports: [QuestionRepository]
})
export class QuestionModule {}
