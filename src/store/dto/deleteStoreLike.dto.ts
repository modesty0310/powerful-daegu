import { PickType } from "@nestjs/swagger";
import { StoreLike } from "../storeLike.entity";

export class DeleteStoreLikeDto extends PickType(StoreLike, ['id']) {}