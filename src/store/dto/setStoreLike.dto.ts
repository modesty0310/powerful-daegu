import { PickType } from "@nestjs/swagger";
import { StoreLike } from "../storeLike.entity";

export class SetStoreLikeDto extends PickType(StoreLike, ['id']) {}