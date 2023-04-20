import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity()
export class StoreLike {
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ManyToOne(() => User, (user) => user.store_like, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user: User

    @ManyToOne(() => Store, (store) => store.store_like, {nullable: false})
    @JoinColumn({name: 'store_id'})
    store: Store
}