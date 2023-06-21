import { ApiProperty } from "@nestjs/swagger";
import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity()
export class StoreLike extends CommonEntity {
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({
        type: User
    })
    @ManyToOne(() => User, (user) => user.store_like, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user: User

    @ApiProperty({
        type: () => Store
    })
    @ManyToOne(() => Store, (store) => store.store_like, {nullable: false})
    @JoinColumn({name: 'store_id'})
    store: Store
}