import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class QuestionFile extends CommonEntity {
    @ApiProperty({
        description: '파일 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({
        type: Question
    })
    @IsNotEmpty()
    @ManyToOne(() => Question, (question) => question.file, {onDelete: 'CASCADE'})
    @JoinColumn([
        { name: "question", referencedColumnName: "id" },
    ])
    question: Question

    @ApiProperty({
        description: '파일 경로',
        example: 'qqq',
        type: String
    })
    @IsString()
    @Column()
    url: string

    
}