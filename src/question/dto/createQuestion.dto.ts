import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Question } from "../question.entity";

export class CreateQuestionDto extends PickType(Question, ['question', 'category']) {
    @ApiProperty({
        description: '질문 파일 주소 url 배열',
        type: Array,
        example: ["qweqweq", "qweqweqweq"]
    })
    @IsArray()
    urls: string[]
}