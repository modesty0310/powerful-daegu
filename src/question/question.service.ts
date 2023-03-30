import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QnaCategory } from './question.entity';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QnaService {
    constructor(
        private readonly qnaRepository: QuestionRepository,
        private readonly uploadService: UploadService
    ) {}

    async createQuestion(dto: CreateQuestionDto, user: CurrentUserDto, files?: Express.Multer.File[]) {
        const qna = await this.qnaRepository.createQuestion(dto, user);
        const qnaId = qna.identifiers[0].id;
        
        if(files) {
            const urlArr = [];
            await Promise.all(files.map(async file => {
                const {url} = await this.uploadService.uploadFileToS3('qna', file);
                urlArr.push(url);
            }));

            await this.qnaRepository.saveFile(qnaId, urlArr);
        }
    }

    async getAllQuestion(page: number, category: QnaCategory) {
        return await this.qnaRepository.getAllQuestion(category, page);
    }

    async getQuestion(id: number) {
        const result = await this.qnaRepository.getQuestion(id);
        if(!result) throw new NotFoundException('질문이 존재 하지 않습니다');

        return result
    }

    
}
