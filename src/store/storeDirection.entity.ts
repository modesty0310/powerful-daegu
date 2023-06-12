import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StoreDirection {
    @ApiProperty({
        description: '저장 경로 아이디',
        example: '1',
        type: BigInt
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ManyToOne(() => User, (user) => user.store_direction, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user: User

    @ApiProperty({
        description: '저장 경로 주소',
        example: 'http://localhost:3000/api#/',
        type: String
    })
    @Column()
    @IsString()
    @IsNotEmpty()
    url: string

    @ApiProperty({
        description: '시작점 이름',
        example: '수성구',
        type: String
    })
    @Column()
    @IsString()
    @IsNotEmpty()
    start: string

    @ApiProperty({
        description: '도착점 이름',
        example: '동구',
        type: String
    })
    @Column()
    @IsString()
    @IsNotEmpty()
    goal: string
}