import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

enum UserType {
    origin = "origin", 
    naver = "naver", 
    google = "google", 
    kakao = "kakao"
}

@Entity()
export class User extends CommonEntity{
    @ApiProperty({
        description: '사용자 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({
        description: '비밀번호',
        type: String,
        example: 'qwerqwer-qwer'
    })
    @IsString()
    @Column()
    password: string

    @ApiProperty({
        description: '사용자 닉네임',
        type: String,
        example: '덕덕'
    })
    @IsString()
    @IsNotEmpty()
    @Column()
    nickname: string

    @ApiProperty({
        description: '약관 동의 여부',
        type: Boolean,
        example: '0'
    })
    @IsBoolean()
    @IsNotEmpty()
    @Column()
    term: boolean

    @ApiProperty({
        description: '사용자 이메일',
        type: String,
        example: 'rltpejr@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    @Column({unique: true})
    email: string

    @ApiProperty({
        description: '회원가입 경로',
        enum: UserType
    })
    @IsEnum(UserType)
    @IsNotEmpty()
    @Column()
    user_type: UserType
}
