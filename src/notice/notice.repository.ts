import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateNoticeDto } from "./dto/createNotice.dto";
import { Notice } from "./notice.entity";

@Injectable()
export class NoticeRepository {
    constructor(
        @InjectRepository(Notice)
        private readonly noticeRepository: Repository<Notice>
    ) {}

    async createNotice(user: CurrentUserDto) {
        await this.noticeRepository
        .createQueryBuilder()
        .insert()
        .into(Notice)
        .values({

        })
    }
}