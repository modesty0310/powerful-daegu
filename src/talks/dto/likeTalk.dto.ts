import { PickType } from "@nestjs/swagger";
import { Talk } from "../talks.entity";

export class LikeTalkDto extends PickType(Talk, ['id']) {}