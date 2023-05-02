import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from 'src/upload/upload.module';
import { TalksController } from './talks.controller';
import { Talk } from './talks.entity';
import { TalksRepository } from './talks.repository';
import { TalksService } from './talks.service';
import { TalkFiles } from './talksFiles.entity';
import { TalkLike } from './talksLike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talk, TalkLike, TalkFiles]), UploadModule],
  controllers: [TalksController],
  providers: [TalksService, TalksRepository]
})
export class TalksModule {}
