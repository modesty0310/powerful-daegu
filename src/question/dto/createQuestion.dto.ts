import { PickType } from "@nestjs/swagger";
import { Question } from "../question.entity";

export class CreateQuestionDto extends PickType(Question, ['question', 'category']) {}