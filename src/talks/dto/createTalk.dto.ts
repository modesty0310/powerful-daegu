import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Talk } from "../talks.entity";

export class CreateTalkDto extends PickType(Talk, ['contents']) {
    @ApiProperty({
        description: '가게 아이디',
        type: BigInt,
        example: 1
    })
    @IsNotEmpty()
    store_id: BigInt
}