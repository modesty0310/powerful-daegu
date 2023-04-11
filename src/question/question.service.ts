import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QnaCategory } from './question.entity';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
    constructor(
        private readonly questionRepository: QuestionRepository,
        private readonly uploadService: UploadService,
    ) {}

    async createQuestion(dto: CreateQuestionDto, user: CurrentUserDto) {
        const question = await this.questionRepository.createQuestion(dto, user);
        const questionId = question.identifiers[0].id;
        
        await this.questionRepository.saveFile(questionId, dto.urls);
    }

    async getAllQuestion(page: number, category: QnaCategory) {
        return await this.questionRepository.getAllQuestion(category, page);
    }

    async getQuestion(id: BigInt, user: CurrentUserDto) {
        const result = await this.questionRepository.getQuestion(id);
        if(!result) throw new NotFoundException('질문이 존재 하지 않습니다');
        if(user.role !== 'admin' && result.questioner.id !== user.sub) throw new UnauthorizedException('권한이 없습니다.')
        return result
    }

    async updateQuestion(dto: UpdateQuestionDto, user: CurrentUserDto) {
        const question = await this.questionRepository.getQuestion(dto.id);

        if(!question) throw new NotFoundException('질문이 존재 하지 않습니다.');

        if(question.questioner.id !== user.sub) throw new UnauthorizedException('권한이 없습니다.');

        if(question.answer) throw new BadRequestException('답변이 달린 질문은 수정 할 수 없습니다.');

        await this.questionRepository.deleteFile(question.id);

        await this.questionRepository.saveFile(question.id, dto.urls);

        const result = await this.questionRepository.updateQuestion(dto, user);

        if(result.affected === 0) throw new NotFoundException('질문이 존재 하지 않습니다.');
    }

    async deleteQuestion (idArr: BigInt[], user: CurrentUserDto) {
        await this.questionRepository.deleteQuestion(idArr, user);
        await Promise.all(idArr.map(async id => {
            await this.questionRepository.deleteFile(id);
        }));
    }

    async getMyQuestion(user: CurrentUserDto) {
        return await this.questionRepository.getMyQuestion(user);
    }
}
