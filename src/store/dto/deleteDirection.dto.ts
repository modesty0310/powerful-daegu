import { PickType } from "@nestjs/swagger";
import { StoreDirection } from "../storeDirection.entity";

export class DeleteDirectionDto extends PickType(StoreDirection, ['id']) {}