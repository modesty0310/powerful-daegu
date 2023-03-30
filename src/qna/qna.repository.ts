import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUserDto } from "src/users/dto/currentUser.dto";
import { Repository } from "typeorm";
import { CreateQnaDto } from "./dto/createQna.dto";
import { QnaFile } from "./qna-file.entity";
import { Qna } from "./qna.entity";

export class QnaRepository {
    constructor(
        @InjectRepository(Qna)
        private readonly qnaRepository: Repository<Qna>,
        @InjectRepository(QnaFile)
        private readonly qnaFileRepository: Repository<QnaFile>
    ){}

    async createQna(dto: CreateQnaDto, user: CurrentUserDto) {
        const {category, question} = dto;
        const result = await this.qnaRepository.createQueryBuilder()
        .insert()
        .into(Qna)
        .values({
            writer: {
                id: user.sub
            },
            category,
            question
        })
        .execute();
        return result;
    }

    async saveFile(qnaId: number, urls: string[]) {
        await Promise.all(urls.map(async url => {
            await this.qnaFileRepository.createQueryBuilder()
            .insert()
            .into(QnaFile)
            .values({
                qna: {
                    id: qnaId
                },
                url
            })
            .execute();
        }))
    }
}