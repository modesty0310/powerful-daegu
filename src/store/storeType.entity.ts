import { ApiProperty } from "@nestjs/swagger";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_type')
export class StoreType extends CommonEntity {
    @ApiProperty({
        description: '가게 유형 번호',
        type: Number,
        example: 1
    })
    @PrimaryGeneratedColumn()
    food_code: number

    @ApiProperty({
        description: '가게 유형',
        type: String,
        example: '치킨/찜닭'
    })
    @Column()
    category: string
    
}