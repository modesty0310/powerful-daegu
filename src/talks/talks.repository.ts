import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateTalkDto } from "./dto/createTalk.dto";
import { DeleteTalkDto } from "./dto/deleteTalk.dto";
import { GetTalkDto } from "./dto/getTalk.dto";
import { LikeTalkDto } from "./dto/likeTalk.dto";
import { UpdateTalkDto } from "./dto/updateTalk.dto";
import { Talk } from "./talks.entity";
import { TalkFile } from "./talksFile.entity";
import { TalkLike } from "./talksLike.entity";

@Injectable()
export class TalksRepository {
    constructor(
        @InjectRepository(Talk)
        private readonly talksRepository: Repository<Talk>,
        @InjectRepository(TalkFile)
        private readonly talksFileRepository: Repository<TalkFile>,
        @InjectRepository(TalkLike)
        private readonly talksLikeRepository: Repository<TalkLike>
    ) {}

    async createTalk(dto: CreateTalkDto, user: CurrentUserDto): Promise<BigInt> {
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

    async saveFile (talk_id: BigInt, url: string): Promise<void> {
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

    async deleteFile (talk_id: BigInt): Promise<void> {
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

    async getTalk (dto: GetTalkDto): Promise<Talk[]> {
        const { store_id } = dto;
        
        const result = await this.talksRepository.createQueryBuilder('talk')
        .where('talk.store_id = :store_id', {store_id})
        .leftJoinAndSelect('talk.file', 'file')
        .leftJoin('talk.talk_like', 'talk_like')
        .loadRelationCountAndMap('talk.talkLikeCount', 'talk.talk_like')
        .getMany();

        return result;
    }

    async getMyTalk (user: CurrentUserDto): Promise<Talk[]> {
        const result = await this.talksRepository.createQueryBuilder('talk')
        .where('talk.user_id = :user_id', {user_id: user.sub})
        .leftJoinAndSelect('talk.file', 'file')
        .leftJoin('talk.talk_like', 'talk_like')
        .loadRelationCountAndMap('talk.talkLikeCount', 'talk.talk_like')
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

    async updateTalk (dto: UpdateTalkDto): Promise<void> {
        const result = await this.talksRepository.createQueryBuilder('talk')
        .update(Talk)
        .set({ contents: dto.contents })
        .where('id = :id', {id: dto.id})
        .execute();
    }

    async deleteTalk (dto: DeleteTalkDto): Promise<void> {
        await this.talksRepository.createQueryBuilder('talk')
        .delete()
        .from(Talk)
        .where('id = :id', {id: dto.id})
        .execute();
    }

    async likeTalk (dto: LikeTalkDto, user: CurrentUserDto): Promise<void> {
        await this.talksLikeRepository.createQueryBuilder('talk_like')
        .insert()
        .into(TalkLike)
        .values({
            talk: {
                id: dto.id
            },
            user: {
                id: user.sub
            }
        })
        .execute()
    }

    async deleteLikeTalk (talk_id: BigInt, user_id?: BigInt): Promise<void> {
        if(user_id) {
            await this.talksLikeRepository.createQueryBuilder('talk_like')
            .delete()
            .from(TalkLike)
            .where('talk_like.talk_id = :talk_id', {talk_id})
            .andWhere('talk_like.user_id = :user_id', {user_id})
            .execute();
        }else {
            await this.talksLikeRepository.createQueryBuilder('talk_like')
            .delete()
            .from(TalkLike)
            .where('talk_like.talk_id = :talk_id', {talk_id})
            .execute();
        }
        
    }

    async checkLikeTalk (dto: LikeTalkDto, user: CurrentUserDto): Promise<TalkLike> {
        const result = await this.talksLikeRepository.createQueryBuilder('talk_like')
        .select()
        .where('talk_like.user_id = :user_id', {user_id: user.sub})
        .andWhere('talk_like.talk_id = :talk_id', {talk_id: dto.id})
        .getOne();

        return result;
    }
}