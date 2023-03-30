import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Question } from "src/question/question.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Answer extends CommonEntity {
    @ApiProperty({
        description: '1:1 질문 답변 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.answerer, {nullable: true})
    @JoinColumn([
        { name: "answerer", referencedColumnName: "id" },
    ])
    answerer: User

    @ApiProperty({
        description: '1:1 답변',
        example: '답변입니다.',
        type: String
    })
    @IsString()
    @Column('text', {nullable: true})
    answer: string

    @OneToOne(() => Question, (question) => question.answer)
    @JoinColumn()
    question: Question
}