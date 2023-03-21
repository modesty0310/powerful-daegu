import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
// import { CreateNoticeDto } from './dto/createNotice.dto';
import { NoticeRepository } from './notice.repository';

@Injectable()
export class NoticeService {
    constructor(
        private readonly noticeRepository: NoticeRepository
    ) {}
    async createNotice(user: CurrentUserDto) {
        await this.noticeRepository.createNotice(user)
    }
}
