import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalksController } from './talks.controller';
import { Talk } from './talks.entity';
import { TalksService } from './talks.service';
import { TalkLike } from './talksLike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talk, TalkLike])],
  controllers: [TalksController],
  providers: [TalksService]
})
export class TalksModule {}
