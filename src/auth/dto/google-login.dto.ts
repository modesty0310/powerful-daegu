import { PickType } from "@nestjs/swagger";
import { User } from "../../users/users.entity";

export class GoogleLoginDto extends PickType(User, ['email']) {}