import { ApiProperty } from "@nestjs/swagger";

export class DeleteStoreLikeDto {
    @ApiProperty({
        description: '좋아요 삭제할 가게 아이디',
        type: BigInt,
        isArray: true,
        example: [1, 2, 3]
    })
    id: BigInt[]
}