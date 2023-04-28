import { ApiProperty } from "@nestjs/swagger";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity()
export class Menu extends CommonEntity {
    @ApiProperty({
        description: '메뉴 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ManyToOne(() => Store, (store) => store.menu, {nullable: false})
    @JoinColumn([
        { name: "store_id", referencedColumnName: "id" },
    ])
    store_id: Store

    @ApiProperty({
        description: '메뉴 이름',
        type: String,
        example: '부대찌개'
    })
    @Column()
    name: string

    @ApiProperty({
        description: '메뉴 가격',
        type: String,
        example: '9000원'
    })
    @Column()
    price: string
}
