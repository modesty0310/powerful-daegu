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
        type: () => BigInt,
        example: 1
    })
    sub: BigInt

    @ApiProperty({
        description: "유저 회원가입 경로",
        type: () => String,
        example: 'origin'
    })
    user_type: string

    @ApiProperty({
        description: '유저 권한',
        type: String,
        example: 'user'
    })
    role: string
}