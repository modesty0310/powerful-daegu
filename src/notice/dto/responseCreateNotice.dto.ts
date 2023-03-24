import { ApiProperty } from "@nestjs/swagger";

export class ResponseCreateNoticeDto {
    @ApiProperty({
        description: '성공 메세지',
        type: String,
        example: '게시물을 생성 하였습니다.'
    })
    message: string
}