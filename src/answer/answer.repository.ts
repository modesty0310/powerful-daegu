import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { Answer } from "./answer.entity";
import { CreateAnswerDto } from "./dto/createAnswer.dto";
import { UpdateAnswerDto } from "./dto/updateAnswer.dto";

@Injectable()
export class AnswerRepository {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>
    ){}

    async createAnswer(dto: CreateAnswerDto, user: CurrentUserDto) {
        await this.answerRepository.createQueryBuilder()
        .insert()
        .into(Answer)
        .values({
            answer: dto.answer,
            answerer: {
                id: user.sub
            },
            question: {
                id: dto.questionId
            }
        })
        .execute();
    }

    async deleteAnser(id: number) {
        const result = await this.answerRepository.createQueryBuilder()
        .delete()
        .where('id = :id', {id})
        .execute();

        return result;
    }

    async updateAnswer(dto: UpdateAnswerDto) {
        const result = await this.answerRepository.createQueryBuilder()
        .update(Answer)
        .set({
            answer: dto.answer
        })
        .where('id = :id', {id: dto.id})
        .execute();

        return result;
    }
}