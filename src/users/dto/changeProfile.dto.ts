import { PickType } from "@nestjs/swagger";
import { User } from "../users.entity";

export class ChangeProfileDto extends PickType(User, ["nickname"]) {}