import { PickType } from "@nestjs/swagger";
import { Talk } from "../talks.entity";

export class UpdateTalkDto extends PickType(Talk, ['contents', 'id']) {}