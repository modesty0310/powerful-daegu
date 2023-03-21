import { ApiProperty } from "@nestjs/swagger"

export class CurrentUserDto {
    @ApiProperty({
        description: "유저 이메일",
        type: String,
        example: "rltpejr@gmail.com"
    })
    email: 'test@test.com'

    @ApiProperty({
        description: "유저 아이디",
        type: Number,
        example: 1
    })
    sub: 1

    @ApiProperty({
        description: "유저 회원가입 경로",
        type: String,
        example: 'origin'
    })
    user_type: string
}