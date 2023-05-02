import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Menu } from "./menu.entity";
import { StoreType } from "./storeType.entity";
import { Point } from 'wkx';
import { StoreLike } from "./storeLike.entity";
import { Talk } from "src/talks/talks.entity";

@Entity()
export class Store extends CommonEntity {
    @ApiProperty({
        description: '가게 아이디',
        type: BigInt,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: BigInt

    @ApiProperty({ type: StoreType })
    @IsNotEmpty()
    @ManyToOne(() => StoreType, (store_type) => store_type.food_code, {nullable: false})
    @JoinColumn([
        { name: "food_code", referencedColumnName: "food_code" },
    ])
    store_type: StoreType

    @Column()
    @ApiProperty({
        description: '가게 이름',
        type: String,
        example: '행컵 수성구점'
    })
    @IsString()
    name: string

    @Column()
    @ApiProperty({
        description: '가게 구이름',
        type: String,
        example: '대구 중구'
    })
    @IsString()
    city_name: string

    @Column()
    @ApiProperty({
        description: '가게 구 코드',
        type: Number,
        example: '27110'
    })
    @IsNumber()
    city_code: number


    @Column()
    @ApiProperty({
        description: '가게 도로명 주소',
        type: String,
        example: '달구벌대로 1950'
    })
    @IsString()
    street_address: string

    @Column()
    @ApiProperty({
        description: '가게 상세 주소',
        type: String,
        example: '남산동 2937-1'
    })
    @IsString()
    detail_address: string

    @Column()
    @ApiProperty({
        description: '가게 전화 번호',
        type: String,
        example: '053-424-8249'
    })
    @IsString()
    phone_number: string

    @Column()
    @ApiProperty({
        description: '가게 평일 시작시간',
        type: String,
        example: '800'
    })
    @IsString()
    week_start: string

    @Column()
    @ApiProperty({
        description: '가게 평일 종료시간',
        type: String,
        example: '2000'
    })
    @IsString()
    week_end: string

    @Column()
    @ApiProperty({
        description: '가게 연휴 시작시간',
        type: String,
        example: '800'
    })
    @IsString()
    holiday_start: string

    @Column()
    @ApiProperty({
        description: '가게 연휴 종료시간',
        type: String,
        example: '2000'
    })
    @IsString()
    holiday_end: string

    @Column()
    @ApiProperty({
        description: '가게 토요일 시작시간',
        type: String,
        example: '800'
    })
    @IsString()
    sat_start: string

    @Column()
    @ApiProperty({
        description: '가게 토요일 종료시간',
        type: String,
        example: '2000'
    })
    @IsString()
    sat_end: string

    @Column()
    @ApiProperty({
        description: '가게 배달 유무',
        type: Boolean,
        example: true
    })
    @IsString()
    delivery: boolean

    @Column('point')
    @ApiProperty({
        description: '가게 위치 좌표',
        type: Point,
        example: "POINT(35.231321,128.233221)"
    })
    @IsString()
    point: Point

    @ApiProperty({ type: Menu })
    @OneToMany(() => Menu, (menu) => menu.store_id)
    menu: Menu

    @OneToMany(() => StoreLike, (store_like) => store_like.store)
    store_like: StoreLike

    @OneToMany(() => Talk, (talk) => talk.store)
    talk: Talk
}