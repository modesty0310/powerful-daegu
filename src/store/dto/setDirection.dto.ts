import { PickType } from "@nestjs/swagger";
import { StoreDirection } from "../storeDirection.entity";

export class SetDirectionDto extends PickType(StoreDirection, ['url']) {}