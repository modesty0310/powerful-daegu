import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateFaqDto } from './dto/createFaq.dto';
import { UpdateFaqDto } from './dto/updateFaq.dto';
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
        return await this.faqRepository.getAllFaq(page, category);
    }

    async getFaq(id: number) {
        return await this.faqRepository.getNotice(id);
    }

    async deleteFaq(id: BigInt[]) {
        await this.faqRepository.deleteFaq(id);
    }

    async updateFaq(dto: UpdateFaqDto) {
        await this.faqRepository.updateFaq(dto);
    }
}
