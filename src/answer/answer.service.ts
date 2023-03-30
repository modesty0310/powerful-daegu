import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from 'src/question/question.repository';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { AnswerRepository } from './answer.repository';
import { CreateAnswerDto } from './dto/createAnswer.dto';
import { UpdateAnswerDto } from './dto/updateAnswer.dto';

@Injectable()
export class AnswerService {
    constructor(
        private readonly answerRepository: AnswerRepository,
        private readonly questionRepository: QuestionRepository
    ) {}

    async createAnswer(dto: CreateAnswerDto, user: CurrentUserDto) {
        const question = await this.questionRepository.getQuestion(dto.questionId);
        
        if(!question) {
            throw new NotFoundException("질문이 존재 하지 않습니다.");
        }
        if(question.answer) {
            throw new BadRequestException('이미 답변이 존재 합니다.');
        }
        
        await this.answerRepository.createAnswer(dto, user);
    }

    async deleteAnswer(id: number) {
        const result = await this.answerRepository.deleteAnser(id);
        if(result.affected === 0) {
            throw new NotFoundException("답변이 존재 하지 않습니다.");
        }
    }

    async updateAnswer(dto: UpdateAnswerDto) {
        const result = await this.answerRepository.updateAnswer(dto);
        if(result.affected === 0) {
            throw new NotFoundException("답변이 존재 하지 않습니다.");
        }
    }

}
