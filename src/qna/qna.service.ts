import { Injectable } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
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
        console.log(files);

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
}
