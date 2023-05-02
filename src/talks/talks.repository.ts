import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateTalkDto } from "./dto/createTalk.dto";
import { Talk } from "./talks.entity";
import { TalkFiles } from "./talksFiles.entity";

@Injectable()
export class TalksRepository {
    constructor(
        @InjectRepository(Talk)
        private readonly talksRepository: Repository<Talk>,
        @InjectRepository(TalkFiles)
        private readonly talksFileRepository: Repository<TalkFiles>
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
        .into(TalkFiles)
        .values({
            talk: {
                id: talk_id
            },
            url
        })
        console.log(result);
        
    }
}