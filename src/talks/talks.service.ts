import { Injectable } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateTalkDto } from './dto/createTalk.dto';
import { TalksRepository } from './talks.repository';

@Injectable()
export class TalksService {
    constructor(
        private readonly talksRepository: TalksRepository,
        private readonly uploadService: UploadService
    ) {}

    async createTalk (dto: CreateTalkDto, user: CurrentUserDto, files?: Array<Express.Multer.File>) {
        const talk_id = await this.talksRepository.createTalk(dto, user);
        
        if(files) {
            await Promise.all(files.map( async file => {
                const {url} = await this.uploadService.uploadFileToS3('talk', file);

                await this.talksRepository.saveFile(talk_id, url);
            }))
        }
    }
}
