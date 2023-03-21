import { PickType } from "@nestjs/swagger";
import { Notice } from "../notice.entity";

export class CreateNoticeDto extends PickType(Notice, ['category', 'content', 'title']) {}