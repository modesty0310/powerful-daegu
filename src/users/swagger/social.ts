import { ApiProperty } from "@nestjs/swagger"

export class SocialFail {
    @ApiProperty({
        description: 'stats_code',
        type: Number,
        example: 401
    })
    statusCode: number

    @ApiProperty({
        description: '에러 발생 시간',
        type: String,
        example: "2023-03-17T07:09:13.346Z"
    })
    timestamp: string

    @ApiProperty({
        description: 'url',
        type: String,
        example: "/users/login"
    })
    path: string

    @ApiProperty({
        description: '에러 메세지',
        type: String,
        example: "이미 존재하는 이메일 입니다."
    })
    error: string
}