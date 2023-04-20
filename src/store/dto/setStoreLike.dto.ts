import { PickType } from "@nestjs/swagger";
import { Store } from "../store.entity";

export class SetStoreLikeDto extends PickType(Store, ['id']) {}