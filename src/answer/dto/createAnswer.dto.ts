import { PickType } from "@nestjs/swagger";
import { Answer } from "src/answer/answer.entity";

export class CreateAnswerDto extends PickType(Answer, ['answer', 'id']) {}