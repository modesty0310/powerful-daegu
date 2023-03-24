import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { Category } from './notice.entity';
// import { CreateNoticeDto } from './dto/createNotice.dto';
import { NoticeRepository } from './notice.repository';

@Injectable()
export class NoticeService {
    constructor(
        private readonly noticeRepository: NoticeRepository
    ) {}

    async createNotice(dto: CreateNoticeDto,user: CurrentUserDto) {
        await this.noticeRepository.createNotice(dto, user);
    }

    async getNotice(id: number) {
        const notice = await this.noticeRepository.getNotice(id);
        console.log(!notice);

        if(!notice) {
           throw new BadRequestException('존재하지 않는 게시글 입니다.');
        }
        
        return notice;
    }

    async deleteNotice(id: number[]) {
       await this.noticeRepository.deleteNotice(id);
    }

    async updateNotice(dto: UpdateNoticeDto) {
        return await this.noticeRepository.updateNotice(dto);
    }

    async getAllNotice(page: number, category: Category) {
        return await this.noticeRepository.getAllNotice(page, category);
    }
}
