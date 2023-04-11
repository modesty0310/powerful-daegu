import { PickType } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";
import { Question } from "../question.entity";

export class UpdateQuestionDto extends PickType(Question, ['id', 'question']) {
    @IsNotEmpty()
    id: BigInt;

    @IsArray()
    urls: string[];
}