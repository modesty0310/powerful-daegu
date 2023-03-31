import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
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
        private readonly questionFileRepository: Repository<QuestionFile>
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

    async saveFile(qnaId: number, urls: string[]) {
        await Promise.all(urls.map(async url => {
            await this.questionFileRepository.createQueryBuilder()
            .insert()
            .into(QuestionFile)
            .values({
                question: {
                    id: qnaId
                },
                url
            })
            .execute();
        }))
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

        return result
    }

    async updateQuestion(dto: UpdateQuestionDto, user:CurrentUserDto) {
        const result = await this.questionRepository.createQueryBuilder()
        .update(Question)
        .set({
            question: dto.question
        })
        .where('id = :id', {id: dto.id})
        .execute();

        return result
    }

    async deleteQuestion(id: BigInt) {
        const result = await this.questionRepository.createQueryBuilder()
        .delete()
        .from(Question)
        .where('id = :id', {id})
        .execute()

        return result
    }
}