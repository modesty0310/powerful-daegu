import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { AnswerRepository } from './answer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswerService, AnswerRepository],
  controllers: [AnswerController]
})
export class AnswerModule {}
