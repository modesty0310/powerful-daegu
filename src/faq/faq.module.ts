import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController } from './faq.controller';
import { Faq } from './faq.entity';
import { FaqRepository } from './faq.repository';
import { FaqService } from './faq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqController],
  providers: [FaqService, FaqRepository]
})
export class FaqModule {}
