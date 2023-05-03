import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateTalkDto } from "./dto/createTalk.dto";
import { DeleteTalkDto } from "./dto/deleteTalk.dto";
import { GetTalkDto } from "./dto/getTalk.dto";
import { UpdateTalkDto } from "./dto/updateTalk.dto";
import { Talk } from "./talks.entity";
import { TalkFile } from "./talksFile.entity";

@Injectable()
export class TalksRepository {
    constructor(
        @InjectRepository(Talk)
        private readonly talksRepository: Repository<Talk>,
        @InjectRepository(TalkFile)
        private readonly talksFileRepository: Repository<TalkFile>
    ) {}

    async createTalk(dto: CreateTalkDto, user: CurrentUserDto) {
        const { contents, store_id } = dto;
        const result = await this.talksRepository.createQueryBuilder()
        .insert()
        .into(Talk)
        .values({
            user: {
                id: user.sub
            },
            store: {
                id: store_id
            },
            contents
        })
        .execute();

        return result.identifiers[0].id;
    }

    async saveFile (talk_id: BigInt, url: string) {
        const result = await this.talksFileRepository.createQueryBuilder()
        .insert()
        .into(TalkFile)
        .values({
            talk: {
                id: talk_id
            },
            url
        })
        .execute();
    }

    async deleteFile (talk_id: BigInt) {
        await this.talksFileRepository.createQueryBuilder('file')
        .delete()
        .from(TalkFile)
        .where('talk_id = :talk_id', {talk_id})
        .execute()
    }

    async getFile (talk_id: BigInt) {
        const result = await this.talksFileRepository.createQueryBuilder('file')
        .select()
        .where('file.talk_id = :talk_id', {talk_id})
        .getMany();

        return result
    }

    async getTalk (dto: GetTalkDto) {
        const { store_id } = dto;
        
        const result = await this.talksRepository.createQueryBuilder('talk')
        .leftJoinAndSelect('talk.file', 'file')
        .leftJoinAndSelect('talk.talk_like', 'talk_like')
        .where('talk.store_id = :store_id', {store_id})
        .getMany();

        return result;
    }

    async getMyTalk (user: CurrentUserDto) {
        const result = await this.talksRepository.createQueryBuilder('talk')
        .leftJoinAndSelect('talk.file', 'file')
        .leftJoinAndSelect('talk.talk_like', 'talk_like')
        .where('talk.user_id = :user_id', {user_id: user.sub})
        .getMany();

        return result;
    }

    async getTalkDetail (talk_id: BigInt) {
        const result = await this.talksRepository.createQueryBuilder('talk')
        .leftJoinAndSelect('talk.user', 'user')
        .leftJoinAndSelect('talk.file', 'file')
        .where('talk.id = :id', {id: talk_id})
        .getOne()

        return result;
    }

    async updateTalk (dto: UpdateTalkDto) {
        const result = await this.talksRepository.createQueryBuilder('talk')
        .update(Talk)
        .set({ contents: dto.contents })
        .where('id = :id', {id: dto.id})
        .execute();
    }

    async deleteTalk (dto: DeleteTalkDto) {
        await this.talksRepository.createQueryBuilder('talk')
        .delete()
        .from(Talk)
        .where('id = :id', {id: dto.id})
        .execute();
    }
}