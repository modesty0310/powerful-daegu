import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateNoticeDto } from "./dto/createNotice.dto";
import { UpdateNoticeDto } from "./dto/updateNotice.dto";
import { Notice } from "./notice.entity";

@Injectable()
export class NoticeRepository {
    constructor(
        @InjectRepository(Notice)
        private readonly noticeRepository: Repository<Notice>
    ) {}

    async createNotice(dto: CreateNoticeDto, user: CurrentUserDto) {
        const { title, content, category } = dto;
        await this.noticeRepository
        .createQueryBuilder()
        .insert()
        .into(Notice)
        .values({
            writer: {
                id: user.sub
            },
            title,
            content,
            category
        })
        .execute();
    }

    async getAllNotice() {
        
    }

    async getNotice(id: number) {
        const result = await this.noticeRepository
        .createQueryBuilder()
        .select()
        .where("notice.id = :id", {id})
        .getOne()

        return result;
    }

    async deleteNotice(id: number) {
        await this.noticeRepository
        .createQueryBuilder()
        .delete()
        .from(Notice)
        .where('id = :id', {id})
        .execute();
    }

    async updateNotice(dto: UpdateNoticeDto) {
        const {id, content, title, category} = dto;

        const result = await this.noticeRepository
        .createQueryBuilder()
        .update(Notice)
        .set({content, title, category})
        .where('id = :id', {id})
        .execute();

        return result;
    }
}