import { Module } from '@nestjs/common';
import { QnaService } from './qna.service';
import { QnaController } from './qna.controller';
import { Qna } from './qna.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QnaFile } from './qna-file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/upload/upload.module';
import { QnaRepository } from './qna.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Qna, QnaFile]), AuthModule, UploadModule],
  providers: [QnaService, QnaRepository],
  controllers: [QnaController]
})
export class QnaModule {}
