import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateFaqDto } from "./dto/createFaq.dto";
import { Faq } from "./faq.entity";

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
}