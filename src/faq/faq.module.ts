import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FaqController } from './faq.controller';
import { Faq } from './faq.entity';
import { FaqRepository } from './faq.repository';
import { FaqService } from './faq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faq]), AuthModule],
  controllers: [FaqController],
  providers: [FaqService, FaqRepository]
})
export class FaqModule {}
