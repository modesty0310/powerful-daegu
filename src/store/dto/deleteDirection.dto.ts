import { ApiProperty } from "@nestjs/swagger";

export class DeleteDirectionDto {
    @ApiProperty({
        description: '삭제할 저장 경로 아이디',
        type: BigInt,
        isArray: true,
        example: [1, 2, 3]
    })
    id: BigInt[]
}