import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"

export class ReturnAuthCodeDto {
    @IsString()
    text: string

    @IsBoolean()
    success: boolean

    code: string | null
}