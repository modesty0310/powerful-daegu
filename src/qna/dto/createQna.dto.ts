import { PickType } from "@nestjs/swagger";
import { Qna } from "../qna.entity";

export class CreateQnaDto extends PickType(Qna, ['question', 'category']) {}