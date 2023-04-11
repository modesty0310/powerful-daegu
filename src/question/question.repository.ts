import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Connection, Repository } from "typeorm";
import { CreateQuestionDto } from "./dto/createQuestion.dto";
import { UpdateQuestionDto } from "./dto/updateQuestion.dto";
import { QuestionFile } from "./question-file.entity";
import { Question, QnaCategory } from "./question.entity";

@Injectable()
export class QuestionRepository {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(QuestionFile)
        private readonly questionFileRepository: Repository<QuestionFile>,
        private readonly connection: Connection
    ){}

    async createQuestion(dto: CreateQuestionDto, user: CurrentUserDto) {
        const {category, question} = dto;
        const result = await this.questionRepository.createQueryBuilder()
        .insert()
        .into(Question)
        .values({
            questioner: {
                id: user.sub
            },
            category,
            question
        })
        .execute();
        return result;
    }

    async saveFile(questionId: BigInt, urls: string[]) {
        await Promise.all(urls.map(async url => {
            await this.questionFileRepository.createQueryBuilder()
            .insert()
            .into(QuestionFile)
            .values({
                question: {
                    id: questionId
                },
                url
            })
            .execute();
        }))
    }

    async deleteFile(questionId: BigInt) {
        await this.questionFileRepository.createQueryBuilder()
        .delete()
        .from(QuestionFile)
        .where('id = :id', {id: questionId})
        .execute();
    }

    async getAllQuestion(category: QnaCategory, page: number) {
        const result = await this.questionRepository.findAndCount({
            select: ['id', 'category', 'question', 'answer', 'createdAt'],
            relations: {questioner: true, answer: true},
            where: category !== 'all' ? {category} : {},
            order: {createdAt: 'DESC'},
            skip: (page - 1) * 10,
            take: 10,
        });

        return result;
    }

    async getQuestion(id: BigInt) {
        const result = await this.questionRepository.createQueryBuilder('question')
        .leftJoinAndSelect('question.questioner', 'questioner')
        .leftJoinAndSelect('question.answer', 'answer')
        .leftJoinAndSelect('question.file', 'file')
        .where("question.id = :id", {id})
        .getOne();

        return result;
    }

    async updateQuestion(dto: UpdateQuestionDto, user:CurrentUserDto) {
        const result = await this.questionRepository.createQueryBuilder()
        .update(Question)
        .set({
            question: dto.question,
            category: dto.category
        })
        .where('id = :id', {id: dto.id})
        .execute();

        return result;
    }

    async deleteQuestion(idArr: BigInt[], user: CurrentUserDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect(); // 2
        await queryRunner.startTransaction(); // 3
        try {
            await Promise.all(idArr.map(async id => { 
                const question = await this.getQuestion(id);
                if(question.questioner.id !== user.sub) throw new UnauthorizedException('권한이 없습니다.');       
                const result = await queryRunner.manager.delete(Question, {id});
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

    async getMyQuestion(user: CurrentUserDto) {
        const result = await this.questionRepository.createQueryBuilder('question')
        .leftJoinAndSelect('question.questioner', 'questioner')
        .leftJoinAndSelect('question.answer', 'answer')
        .where('question.questioner = :id', {id: user.sub})
        .execute();

        return result;
    }
}