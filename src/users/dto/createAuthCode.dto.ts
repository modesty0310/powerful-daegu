import { PickType } from "@nestjs/swagger";
import { User } from "../users.entity";

export class CreateAuthCodeDto extends PickType(User, ['email']) {
    
}