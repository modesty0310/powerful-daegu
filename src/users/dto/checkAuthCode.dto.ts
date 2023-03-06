import { PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { User } from "../users.entity";

export class CheckAuthCodeDto extends PickType(User, ['email']) {
    @IsString()
    code: string
}