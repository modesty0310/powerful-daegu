import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { AnswerRepository } from './answer.repository';
import { QuestionModule } from 'src/question/question.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), QuestionModule],
  providers: [AnswerService, AnswerRepository],
  controllers: [AnswerController]
})
export class AnswerModule {}
