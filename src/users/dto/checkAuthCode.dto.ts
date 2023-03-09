import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { User } from "../users.entity";

export class CheckAuthCodeDto extends PickType(User, ['email']) {
    @ApiProperty({
        description: '인증코드',
        type: String,
        example: '000000'
    })
    @IsString()
    code: string
}