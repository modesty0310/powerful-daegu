import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Connection, Like, Repository } from "typeorm";
import { CreateNoticeDto } from "./dto/createNotice.dto";
import { UpdateNoticeDto } from "./dto/updateNotice.dto";
import { Category, Notice } from "./notice.entity";

@Injectable()
export class NoticeRepository {
    constructor(
        @InjectRepository(Notice)
        private readonly noticeRepository: Repository<Notice>,
        private readonly connection: Connection
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

    async getNotice(id: number) {
        const result = await this.noticeRepository
        .createQueryBuilder('notice')
        .leftJoinAndSelect('notice.writer', 'writer')
        .where("notice.id = :id", {id})
        .getOne();

        if(!result) {
            throw new NotFoundException('공지사항을 찾을 수 없습니다.')
        }

        return result;
    }

    async deleteNotice(idArr: number[]) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect(); // 2
        await queryRunner.startTransaction(); // 3
        try {
            await Promise.all(idArr.map(async id => {        
                const result = await queryRunner.manager.delete(Notice, {id});
    
                if( result.affected === 0 ) {
                    throw new BadRequestException('존재하지 않는 게시글 입니다.');
                };
            }))
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new BadRequestException('존재하지 않는 게시글 입니다.');
        }
        await queryRunner.commitTransaction();
        await queryRunner.release();
    }

    async updateNotice(dto: UpdateNoticeDto) {
        const {id, content, title, category} = dto;

        const result = await this.noticeRepository
        .createQueryBuilder()
        .update(Notice)
        .set({content, title, category})
        .where('id = :id', {id})
        .andWhere('deletedAt IS NULL')
        .execute();

        if(result.affected === 0) throw new BadRequestException("공지사항이 존재 하지 않습니다.");
        
        return result;
    }

    async getAllNotice(page: number, category: Category) {
        const result = await this.noticeRepository.findAndCount({
            select: ['id', 'category', 'content', 'createdAt', 'title', 'writer'],
            relations: {writer: true},
            where: category !== 'all' ? {category} : {},
            order: {createdAt: 'DESC'},
            skip: (page - 1) * 10,
            take: 10,
        });
        
        return result;
    }
}