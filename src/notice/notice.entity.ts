import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

enum Category {
    guide = "guide", 
    inspection = "inspection", 
}

@Entity()
export class Notice extends CommonEntity {
    @ApiProperty({
        description: '공지사항 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({ type: () => User })
    @IsNotEmpty()
    @ManyToOne(() => User, (user) => user.notice, {nullable: false})
    @JoinColumn([
        { name: "writer", referencedColumnName: "id" },
    ])
    writer: User

    @ApiProperty({
        description: '공지사항 제목',
        type: () => String,
        example: "공지사항 입니다."
    })
    @Column()
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiProperty({
        description: '공지사항 본문',
        type: () => String,
        example: "공지사항 입니다."
    })
    @Column('text')
    @IsNotEmpty()
    @IsString()
    content: string

    @ApiProperty({
        description: '공지사항 카테고리',
        example: "inspection"
    })
    @Column({
        type: "enum",
        enum: Category,
    })
    @IsNotEmpty()
    @IsEnum(Category)
    category: Category
}