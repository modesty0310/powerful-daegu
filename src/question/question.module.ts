import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionFile } from './question-file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/upload/upload.module';
import { QuestionRepository } from './question.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionFile]), AuthModule, UploadModule],
  providers: [QuestionService, QuestionRepository],
  controllers: [QuestionController],
  exports: [QuestionRepository]
})
export class QuestionModule {}
