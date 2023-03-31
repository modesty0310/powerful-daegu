import { PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Question } from "../question.entity";

export class UpdateQuestionDto extends PickType(Question, ['id', 'question']) {
    @IsNotEmpty()
    id: number;
}