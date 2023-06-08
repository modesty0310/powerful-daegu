import { PickType } from "@nestjs/swagger";
import { Store } from "../store.entity";

export class DeleteStoreLikeDto extends PickType(Store, ['id']) {}