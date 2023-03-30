import { PickType } from "@nestjs/swagger";
import { Qna } from "../qna.entity";

export class AnswerQnaDto extends PickType(Qna, ['answer', 'id']) {}