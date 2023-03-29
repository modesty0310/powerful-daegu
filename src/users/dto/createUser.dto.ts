import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../users.entity";

export class CreateUserDto extends PickType(User, ['email', 'password', 'nickname', 'term', 'user_type']) {}