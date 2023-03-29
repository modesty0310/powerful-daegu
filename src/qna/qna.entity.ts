import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QnaFile } from "./qna-file.entity";

export enum QnaCategory {
    etc = "etc", 
    franchisee = "franchisee",
    map = 'map',
    all='all',
}

@Entity()
export class Qna extends CommonEntity {
    @ApiProperty({
        description: '1:1 질문 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({ type: () => User })
    @IsNotEmpty()
    @ManyToOne(() => User, (user) => user.qna_writer, {nullable: false})
    @JoinColumn([
        { name: "writer", referencedColumnName: "id" },
    ])
    writer: User

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.qna_answerer, {nullable: true})
    @JoinColumn([
        { name: "answerer", referencedColumnName: "id" },
    ])
    answerer: User

    @ApiProperty({
        description: '1:1 질문',
        example: '질문입니다.',
        type: String
    })
    @IsNotEmpty()
    @IsString()
    @Column('text')
    question: string

    @ApiProperty({
        description: '1:1 답변',
        example: '답변입니다.',
        type: String
    })
    @IsString()
    @Column('text')
    answer: string

    @ApiProperty({
        description: '공지사항 카테고리',
        example: "inspection"
    })
    @Column({
        type: "enum",
        enum: QnaCategory,
    })
    @IsNotEmpty()
    @IsEnum(QnaCategory)
    category: QnaCategory

    @OneToMany(() => QnaFile, (file) => file.qna)
    file: QnaFile
}