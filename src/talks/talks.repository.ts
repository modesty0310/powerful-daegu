import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateTalkDto } from "./dto/createTalk.dto";
import { GetTalkDto } from "./dto/getTalk.dto";
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

    async getTalk (dto: GetTalkDto) {
        const { store_id } = dto;
        console.log(store_id);
        
        const result = await this.talksRepository.createQueryBuilder('talk')
        .leftJoinAndSelect('talk.file', 'file')
        .leftJoinAndSelect('talk.talk_like', 'talk_like')
        .where('talk.store_id = :store_id', {store_id})
        .getMany();

        return result;
    }
}