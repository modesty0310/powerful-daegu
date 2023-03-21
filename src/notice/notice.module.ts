import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { NoticeController } from './notice.controller';
import { Notice } from './notice.entity';
import { NoticeRepository } from './notice.repository';
import { NoticeService } from './notice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), AuthModule],
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository]
})
export class NoticeModule {}

