import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { AnswerQnaDto } from "./dto/answerQna.dto";
import { CreateQnaDto } from "./dto/createQna.dto";
import { QnaFile } from "./qna-file.entity";
import { Qna, QnaCategory } from "./qna.entity";

export class QnaRepository {
    constructor(
        @InjectRepository(Qna)
        private readonly qnaRepository: Repository<Qna>,
        @InjectRepository(QnaFile)
        private readonly qnaFileRepository: Repository<QnaFile>
    ){}

    async createQna(dto: CreateQnaDto, user: CurrentUserDto) {
        const {category, question} = dto;
        const result = await this.qnaRepository.createQueryBuilder()
        .insert()
        .into(Qna)
        .values({
            writer: {
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
            .into(QnaFile)
            .values({
                qna: {
                    id: qnaId
                },
                url
            })
            .execute();
        }))
    }

    async getAllQna(category: QnaCategory, page: number) {
        const result = await this.qnaRepository.findAndCount({
            select: ['id', 'category', 'question', 'answer', 'createdAt', 'writer'],
            relations: {writer: true},
            where: category !== 'all' ? {category} : {},
            order: {createdAt: 'DESC'},
            skip: (page - 1) * 10,
            take: 10,
        });

        return result;
    }

    async getQna(id: number) {
        const result = await this.qnaRepository.createQueryBuilder('qna')
        .leftJoinAndSelect('qna.writer', 'writer')
        .leftJoinAndSelect('qna.answerer', 'answerer')
        .leftJoinAndSelect('qna.file', 'file')
        .where("qna.id = :id", {id})
        .getOne();

        return result
    }

    async answerQna(dto: AnswerQnaDto, user: CurrentUserDto) {
        const result = await this.qnaRepository.createQueryBuilder()
        .update(Qna)
        .set({
            answer: dto.answer,
            answerer: {
                id: user.sub
            }
        })
        .where('id = :id', {id: dto.id})
        .execute();

        return result;
    }
}