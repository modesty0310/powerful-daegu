import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { User } from "../users.entity";

export class ChangePasswordDto extends PickType(User, ['email']) {
    @ApiProperty({
        description: "새 비밀번호",
        type: String,
        example: "password123"
    })
    @IsString()
    password: string

    @ApiProperty({
        description: "새 비밀번호 확인",
        type: String,
        example: "password123"
    })
    @IsString()
    checkPassword: string
}