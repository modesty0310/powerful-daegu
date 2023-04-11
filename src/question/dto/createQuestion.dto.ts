import { PickType } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Question } from "../question.entity";

export class CreateQuestionDto extends PickType(Question, ['question', 'category']) {
    @IsArray({})
    urls: string[]
}