import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Qna } from "./qna.entity";

@Entity()
export class QnaFile extends CommonEntity {
    @ApiProperty({
        description: '파일 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({
        type: Qna
    })
    @IsNotEmpty()
    @ManyToOne(() => Qna, (qna) => qna.file, {nullable: true})
    @JoinColumn([
        { name: "qna", referencedColumnName: "id" },
    ])
    qna: Qna

    @ApiProperty({
        description: '파일 경로',
        example: 'qqq',
        type: String
    })
    @IsString()
    @Column()
    url: string
}