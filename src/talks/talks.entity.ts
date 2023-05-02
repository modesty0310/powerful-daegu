import { ApiProperty } from "@nestjs/swagger";
import { CommonEntity } from "src/common/entities/common.entity";
import { Store } from "src/store/store.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TalkFiles } from "./talksFiles.entity";
import { TalkLike } from "./talksLike.entity";

@Entity()
export class Talk extends CommonEntity {
    @ApiProperty({
        description: '현장토크 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({
        type: () => User
    })
    @ManyToOne(() => User, (user) => user.talk, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user: User

    @ApiProperty({
        type: () => Store
    })
    @ManyToOne(() => Store, (store) => store.talk, {nullable: false})
    @JoinColumn({name: 'store_id'})
    store: Store

    @ApiProperty({
        description: '현장토크 제목',
        type: String,
        example: '현장 토크 입니다.'
    })
    @Column()
    title: string

    @ApiProperty({
        description: '현장토크 본문',
        type: String,
        example: '현장토크토크'
    })
    @Column('text')
    contents: string

    @OneToMany(() => TalkLike, (talk_like) => talk_like.talk)
    talk_like: TalkLike

    @OneToMany(() => TalkFiles, (file) => file.talk, {nullable: true, cascade:true})
    file: TalkFiles
}