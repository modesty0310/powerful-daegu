import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Answer } from "src/answer/answer.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuestionFile } from "./question-file.entity";

export enum QnaCategory {
    etc = "etc", 
    franchisee = "franchisee",
    map = 'map',
    all='all',
}

@Entity()
export class Question extends CommonEntity {
    @ApiProperty({
        description: '1:1 질문 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({ type: () => User })
    @IsNotEmpty()
    @ManyToOne(() => User, (user) => user.questioner, {nullable: false})
    @JoinColumn([
        { name: "questioner", referencedColumnName: "id" },
    ])
    questioner: User

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

    @OneToMany(() => QuestionFile, (file) => file.question)
    file: QuestionFile

    @OneToOne(() => Answer, (answer) => answer.question, {nullable: true})
    answer: Answer
}