import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateFaqDto } from './dto/createFaq.dto';
import { FaqCategory } from './faq.entity';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqService {
    constructor(
        private readonly faqRepository: FaqRepository
    ){}

    async createFaq(dto: CreateFaqDto, user: CurrentUserDto) {
        await this.faqRepository.createFaq(dto, user);
    }

    async getAllFaq(page: number, category: FaqCategory) {
        return await this.faqRepository.getAllNotice(page, category);
    }
}
