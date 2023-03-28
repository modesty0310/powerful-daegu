import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateFaqDto } from "./dto/createFaq.dto";
import { UpdateFaqDto } from "./dto/updateFaq.dto";
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

    async getAllFaq(page: number, category: FaqCategory) {
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


    async getNotice(id: number) {
        const result = await this.faqRepository
        .createQueryBuilder('faq')
        .leftJoinAndSelect('faq.writer', 'writer')
        .where("faq.id = :id", {id})
        .getOne();
        
        if(!result) {
            throw new NotFoundException('FAQ를 찾을 수 없습니다.')
        }

        return result;
    }

    async deleteFaq(idArr: number[]) {
        for(const id of idArr) {
            if(typeof id !== 'number') throw new BadRequestException('공지사항의 아이디를 정확히 보내주세요.');
            
            const result = await this.faqRepository
            .createQueryBuilder()
            .update(Faq)
            .set({deletedAt: new Date()})
            .where('id = :id', {id})
            .execute();

            if( result.affected === 0 ) {
                throw new BadRequestException('존재하지 않는 게시글 입니다.');
            }
        }
    }

    async updateFaq(dto: UpdateFaqDto) {
        const {id, answer, question, category} = dto;

        const result = await this.faqRepository
        .createQueryBuilder()
        .update(Faq)
        .set({answer, question, category})
        .where('id = :id', {id})
        .andWhere('deletedAt IS NULL')
        .execute();

        if(result.affected === 0) throw new BadRequestException("공지사항이 존재 하지 않습니다.");
        
        return result;
    }
}