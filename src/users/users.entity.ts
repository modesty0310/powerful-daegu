import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Answer } from "src/answer/answer.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { Faq } from "src/faq/faq.entity";
import { Notice } from "src/notice/notice.entity";
import { Question } from "src/question/question.entity";
import { StoreDirection } from "src/store/storeDirection.entity";
import { StoreLike } from "src/store/storeLike.entity";
import { Talk } from "src/talks/talks.entity";
import { TalkLike } from "src/talks/talksLike.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

enum UserType {
    origin = "origin", 
    naver = "naver", 
    google = "google", 
    kakao = "kakao"
}

enum UserRole {
    admin = "admin",
    user = "user"
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
    @Exclude({ toPlainOnly: true })
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
    @Exclude({ toPlainOnly: true })
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
    @Column({
        type: "enum",
        enum: UserType,
    })
    @Exclude({ toPlainOnly: true })
    user_type: UserType

    @ApiProperty({
        description: '유저 프로필 사진',
        example: 'https://powerful-daegu.s3.ap-northeast-2.amazonaws.com/users/1679381648358_nest.png',
        type: String
    })
    @IsString()
    @Column({nullable: true})
    profile: string

    @ApiProperty({
        description: '유저 권한',
        enum: UserRole,
        default: "user"
    })
    @IsEnum(UserRole)
    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.user
    })
    role: UserRole

    @OneToMany(() => Notice, (notice) => notice.writer)
    notice: Notice

    @OneToMany(() => Faq, (faq) => faq.writer)
    faq: Faq

    @OneToMany(() => Question, (question) => question.questioner)
    questioner: Question

    @OneToMany(() => Answer, (answer) => answer.answerer)
    answerer: Answer

    @OneToMany(() => StoreLike, (store_like) => store_like.user)
    store_like: StoreLike

    @OneToMany(() => StoreDirection, (store_direction) => store_direction.user)
    store_direction: StoreLike

    @OneToMany(() => Talk, (talk) => talk.user)
    talk: Talk

    @OneToMany(() => TalkLike, (talk_like) => talk_like.user)
    talk_like: TalkLike
}