import { BadRequestException, Injectable } from '@nestjs/common';
import { StoreRepository } from 'src/store/store.repository';
import { UploadService } from 'src/upload/upload.service';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateTalkDto } from './dto/createTalk.dto';
import { GetTalkDto } from './dto/getTalk.dto';
import { TalksRepository } from './talks.repository';

@Injectable()
export class TalksService {
    constructor(
        private readonly talksRepository: TalksRepository,
        private readonly uploadService: UploadService,
        private readonly storeRepository: StoreRepository
    ) {}

    async createTalk (dto: CreateTalkDto, user: CurrentUserDto, files?: Array<Express.Multer.File>) {
        const { store_id } = dto;
        const store = await this.storeRepository.getStoreDetail(store_id);
        console.log(store);
        
        if(!store) throw new BadRequestException('존재하지 않는 가게 아이디 입니다.');
        const talk_id = await this.talksRepository.createTalk(dto, user);
        
        if(files) {
            await Promise.all(files.map( async file => {
                const {url} = await this.uploadService.uploadFileToS3('talk', file);

                await this.talksRepository.saveFile(talk_id, url);
            }))
        }
    }

    async getTalk (dto: GetTalkDto) {
        const result = await this.talksRepository.getTalk(dto);

        return result;
    }


    async getMyTalk (user: CurrentUserDto) {
        const result = await this.talksRepository.getMyTalk(user);

        return result;
    }
}
