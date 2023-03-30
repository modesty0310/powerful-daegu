import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { AnswerQnaDto } from './dto/answerQna.dto';
import { CreateQnaDto } from './dto/createQna.dto';
import { QnaCategory } from './qna.entity';
import { QnaRepository } from './qna.repository';

@Injectable()
export class QnaService {
    constructor(
        private readonly qnaRepository: QnaRepository,
        private readonly uploadService: UploadService
    ) {}

    async createQna(dto: CreateQnaDto, user: CurrentUserDto, files?: Express.Multer.File[]) {
        const qna = await this.qnaRepository.createQna(dto, user);
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

    async getAllQna(page: number, category: QnaCategory) {
        return await this.qnaRepository.getAllQna(category, page);
    }

    async getQna(id: number) {
        const result = await this.qnaRepository.getQna(id);
        if(!result) throw new NotFoundException('질문이 없습니다.');
        return result
    }

    async answerQna(dto: AnswerQnaDto, user: CurrentUserDto) {
        const result = await this.qnaRepository.answerQna(dto, user);
        if(result.affected === 0) {
            throw new NotFoundException("답변할 질문이 없습니다.")
        }
    }
}
