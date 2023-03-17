import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"

export class ReturnAuthCodeDto {
    @ApiProperty({
        description: '실행 후 상태',
        type: String,
        example: "작성한 이메일로 인증 코드를 보냈습니다."
    })
    @IsString()
    text: string

    @ApiProperty({
        description: '성공 여부',
        type: Boolean,
        example: true
    })
    @IsBoolean()
    success: boolean

    @ApiProperty({
        description: '이메일 발송 코드',
        type: String,
        example: "000000"
    })
    code: string | null
}