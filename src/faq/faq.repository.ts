import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Connection, Repository } from "typeorm";
import { CreateFaqDto } from "./dto/createFaq.dto";
import { UpdateFaqDto } from "./dto/updateFaq.dto";
import { Faq, FaqCategory } from "./faq.entity";

@Injectable()
export class FaqRepository {
    constructor(
        @InjectRepository(Faq)
        private readonly faqRepository: Repository<Faq>,
        private readonly connection: Connection
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

    async deleteFaq(idArr: BigInt[]) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect(); // 2
        await queryRunner.startTransaction(); // 3
        try {
            await Promise.all(idArr.map(async id => {        
                const result = await queryRunner.manager.delete(Faq, {id});
    
                if( result.affected === 0 ) {
                    throw new BadRequestException('존재하지 않는 게시글 입니다.');
                };
            }))
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new BadRequestException('존재하지 않는 게시글 입니다.');
        }
        await queryRunner.commitTransaction();
        await queryRunner.release();
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