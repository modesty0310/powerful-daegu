import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateQuestionDto } from "./dto/createQuestion.dto";
import { QuestionFile } from "./question-file.entity";
import { Question, QnaCategory } from "./question.entity";

@Injectable()
export class QuestionRepository {
    constructor(
        @InjectRepository(Question)
        private readonly qnaRepository: Repository<Question>,
        @InjectRepository(QuestionFile)
        private readonly qnaFileRepository: Repository<QuestionFile>
    ){}

    async createQna(dto: CreateQuestionDto, user: CurrentUserDto) {
        const {category, question} = dto;
        const result = await this.qnaRepository.createQueryBuilder()
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
            await this.qnaFileRepository.createQueryBuilder()
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

    async getAllQna(category: QnaCategory, page: number) {
        const result = await this.qnaRepository.findAndCount({
            select: ['id', 'category', 'question', 'answer', 'createdAt'],
            relations: {questioner: true, answer: true},
            where: category !== 'all' ? {category} : {},
            order: {createdAt: 'DESC'},
            skip: (page - 1) * 10,
            take: 10,
        });

        return result;
    }

    async getQna(id: number) {
        const result = await this.qnaRepository.createQueryBuilder('question')
        .leftJoinAndSelect('question.questioner', 'questioner')
        .leftJoinAndSelect('question.answer', 'answer')
        .leftJoinAndSelect('question.file', 'file')
        .where("question.id = :id", {id})
        .getOne();

        return result
    }


}