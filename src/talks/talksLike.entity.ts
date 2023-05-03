import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Talk } from "./talks.entity";

@Entity()
export class TalkLike {
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({
        type: User
    })
    @ManyToOne(() => User, (user) => user.talk_like, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user: User

    @ApiProperty({
        type: () => Talk
    })
    @ManyToOne(() => Talk, (talk) => talk.talk_like, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'talk_id'})
    talk: Talk
}