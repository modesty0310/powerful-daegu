import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum FaqCategory {
    etc = "etc", 
    franchisee = "franchisee",
    map = 'map',
    all='all',
}

@Entity()
export class Faq extends CommonEntity {
    @ApiProperty({
        description: '자주묻는 질문 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({ type: () => User })
    @IsNotEmpty()
    @ManyToOne(() => User, (user) => user.faq, {nullable: false})
    @JoinColumn([
        { name: "writer", referencedColumnName: "id" },
    ])
    writer: User

    @ApiProperty({
        description: '자주묻는 질문 제목',
        type: () => String,
        example: "자주묻는 질문 입니다."
    })
    @Column()
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiProperty({
        description: '질문 본문',
        type: () => String,
        example: "질문 입니다."
    })
    @Column('text')
    @IsNotEmpty()
    @IsString()
    question: string

    @ApiProperty({
        description: '답변 본문',
        type: () => String,
        example: "답변 입니다."
    })
    @Column('text')
    @IsNotEmpty()
    @IsString()
    answer: string

    @ApiProperty({
        description: '자주묻는 질문 카테고리',
        example: "franchisee"
    })
    @Column({
        type: "enum",
        enum: FaqCategory,
    })
    @IsNotEmpty()
    @IsEnum(FaqCategory)
    category: FaqCategory
}