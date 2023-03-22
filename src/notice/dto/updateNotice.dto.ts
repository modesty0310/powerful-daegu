import { PickType } from "@nestjs/swagger";
import { Notice } from "../notice.entity";

export class UpdateNoticeDto extends PickType(Notice, ['id', 'category', 'content', 'title']) {}