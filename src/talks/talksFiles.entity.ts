import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Talk } from "./talks.entity";

@Entity()
export class TalkFiles extends CommonEntity {
    @ApiProperty({
        description: '파일 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({
        type: Talk
    })
    @IsNotEmpty()
    @ManyToOne(() => Talk, (talk) => talk.file, {onDelete: 'CASCADE'})
    @JoinColumn([
        { name: "talk", referencedColumnName: "id" },
    ])
    talk: Talk

    @ApiProperty({
        description: '파일 경로',
        example: 'qqq',
        type: String
    })
    @IsString()
    @Column()
    url: string
}