import { ApiProperty } from "@nestjs/swagger"

export class SocialOauthDto {
    @ApiProperty({
        description: "SNS 회원 가입된 이메일",
        type: String,
        example: "rltpejr@gmail.com"
    })
    email: string

    @ApiProperty({
        description: "Oauth에서 보내주는 고유 id값",
        type: String,
        example: "1234588716"
    })
    password: string
} 