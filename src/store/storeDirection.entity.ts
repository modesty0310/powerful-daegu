import { IsString } from "class-validator";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StoreDirection {
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ManyToOne(() => User, (user) => user.store_direction, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user: User

    @Column()
    @IsString()
    url: string
}