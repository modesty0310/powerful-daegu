import { ApiProperty } from "@nestjs/swagger"

export class CurrentUserDto {
    @ApiProperty({
        description: "유저 이메일",
        type: () => String,
        example: "rltpejr@gmail.com"
    })
    email: string

    @ApiProperty({
        description: "유저 아이디",
        type: () => Number,
        example: 1
    })
    sub: number

    @ApiProperty({
        description: "유저 회원가입 경로",
        type: () => String,
        example: 'origin'
    })
    user_type: string
}