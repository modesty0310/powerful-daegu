import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { AnswerRepository } from './answer.repository';
import { CreateAnswerDto } from './dto/createAnswer.dto';

@Injectable()
export class AnswerService {
    constructor(
        private readonly answerRepository: AnswerRepository
    ) {}

    async answerQna(dto: CreateAnswerDto, user: CurrentUserDto) {
        await this.answerRepository.answerQna(dto, user);
    }

    async deleteAnser(id: number) {
        const result = await this.answerRepository.deleteAnser(id);
        if(result.affected === 0) {
            throw new NotFoundException("질문이 존재 하지 않습니다.")
        }
    }

}
