import { PickType } from "@nestjs/swagger";
import { User } from "../../users/users.entity";

export class LoginDto extends PickType(User, ['email', 'password']) {}