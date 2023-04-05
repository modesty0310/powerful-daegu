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

    async createQuestion(dto: CreateQuestionDto, user: CurrentUserDto, files?: Express.Multer.File[]) {
        const question = await this.questionRepository.createQuestion(dto, user);
        const questionId = question.identifiers[0].id;
        
        if(files) {
            const urlArr = [];
            await Promise.all(files.map(async file => {
                const {url} = await this.uploadService.uploadFileToS3('qna', file);
                urlArr.push(url);
            }));

            await this.questionRepository.saveFile(questionId, urlArr);
        }
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

    async updateQuestion(dto: UpdateQuestionDto, user: CurrentUserDto, files: Express.Multer.File[]) {
        const question = await this.questionRepository.getQuestion(dto.id);

        if(!question) throw new NotFoundException('질문이 존재 하지 않습니다.');

        if(question.questioner.id !== user.sub) throw new UnauthorizedException('권한이 없습니다.');

        if(question.answer) throw new BadRequestException('답변이 달린 질문은 수정 할 수 없습니다.');

        const result = await this.questionRepository.updateQuestion(dto, user);

        if(result.affected === 0) throw new NotFoundException('질문이 존재 하지 않습니다.');
    }

    async deleteQuestion (idArr: BigInt[], user: CurrentUserDto) {
        const fileArr = await this.questionRepository.deleteQuestion(idArr, user);
        await Promise.all(fileArr.map(async file => {
            await Promise.all(file.map(async f => {
                console.log(f.url);
                
                const key = f.url.split(".amazonaws.com/")[1];
                await this.uploadService.deleteS3Object(key);
            }))
        }));
    }

    async getMyQuestion(user: CurrentUserDto) {
        return await this.questionRepository.getMyQuestion(user);
    }
}
