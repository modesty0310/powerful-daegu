import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from 'src/store/store.module';
import { UploadModule } from 'src/upload/upload.module';
import { TalksController } from './talks.controller';
import { Talk } from './talks.entity';
import { TalksRepository } from './talks.repository';
import { TalksService } from './talks.service';
import { TalkFile } from './talksFile.entity';
import { TalkLike } from './talksLike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talk, TalkLike, TalkFile]), UploadModule, StoreModule],
  controllers: [TalksController],
  providers: [TalksService, TalksRepository]
})
export class TalksModule {}
