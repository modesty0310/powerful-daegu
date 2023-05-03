import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { StoreRepository } from 'src/store/store.repository';
import { UploadService } from 'src/upload/upload.service';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateTalkDto } from './dto/createTalk.dto';
import { DeleteTalkDto } from './dto/deleteTalk.dto';
import { GetTalkDto } from './dto/getTalk.dto';
import { LikeTalkDto } from './dto/likeTalk.dto';
import { UpdateTalkDto } from './dto/updateTalk.dto';
import { Talk } from './talks.entity';
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
            await this.setTalkFile(files, talk_id);
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

    async updateTalk (dto: UpdateTalkDto, user: CurrentUserDto, files?: Array<Express.Multer.File>) {
        const talk = await this.checkMyTalk(dto.id, user);

        await this.deleteTalkFile(talk.id)

        await this.talksRepository.updateTalk(dto);

        if(files) {
            await this.setTalkFile(files, talk.id);
        }
    }

    async deleteTalk (dto: DeleteTalkDto, user: CurrentUserDto) {
        const talk = await this.checkMyTalk(dto.id, user);

        await this.deleteTalkFile(talk.id);

        await this.talksRepository.deleteTalk(dto);
    }

    async likeTalk (dto: LikeTalkDto, user: CurrentUserDto) {
        const talk_like = await this.talksRepository.checkLikeTalk(dto, user);

        if(talk_like) throw new BadRequestException('이미 등록된 좋아요 입니다.');

        await this.talksRepository.likeTalk(dto, user);
    }

    async checkMyTalk (id: BigInt, user: CurrentUserDto): Promise<Talk> {
        const talk = await this.talksRepository.getTalkDetail(id);
        
        if(!talk) throw new BadRequestException('존재하지 않는 현장 토크 입니다.');
        
        if(talk.user.id !== user.sub) throw new UnauthorizedException('자신이 작성한 현장 토크가 아닙니다.');

        return talk;
    }

    async deleteTalkFile(id: BigInt) {
        const talk_files = await this.talksRepository.getFile(id);
        
        if(talk_files) {
            await Promise.all(talk_files.map( async file => {
                const key = file.url.split(".amazonaws.com/")[1];
                console.log(key);
                
                await this.uploadService.deleteS3Object(key)
            }))

            await this.talksRepository.deleteFile(id);
        }
    }

    async setTalkFile(files: Array<Express.Multer.File>, id: BigInt) {
        await Promise.all(files.map( async file => {
            const {url} = await this.uploadService.uploadFileToS3('talk', file);
            
            await this.talksRepository.saveFile(id, url);
        }))
    }
}
