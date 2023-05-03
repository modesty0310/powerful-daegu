import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetTalkDto {
    @ApiProperty({
        description: '가게 아이디',
        type: BigInt,
        example: 1
    })
    @IsNotEmpty()
    store_id: BigInt
}