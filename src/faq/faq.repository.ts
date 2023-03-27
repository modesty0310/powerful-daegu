import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateFaqDto } from "./dto/createFaq.dto";
import { Faq, FaqCategory } from "./faq.entity";

export class FaqRepository {
    constructor(
        @InjectRepository(Faq)
        private readonly faqRepository: Repository<Faq>
    ){}

    async createFaq(dto: CreateFaqDto, user: CurrentUserDto) {
        const {answer, question, category} = dto;
        await this.faqRepository.createQueryBuilder()
        .insert()
        .into(Faq)
        .values({
            writer: {
                id: user.sub
            },
            answer,
            question,
            category
        })
        .execute();
    }

    async getAllNotice(page: number, category: FaqCategory) {
        const result = await this.faqRepository.findAndCount({
            select: ['id', 'category', 'question', 'answer', 'createdAt', 'writer'],
            relations: {writer: true},
            where: category !== 'all' ? {category} : {},
            order: {createdAt: 'DESC'},
            skip: (page - 1) * 10,
            take: 10,
        })
        
        return result;
    }
}