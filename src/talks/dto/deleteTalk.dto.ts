import { PickType } from "@nestjs/swagger";
import { Talk } from "../talks.entity";

export class DeleteTalkDto extends PickType(Talk, ['id']) {}