import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";
import { Question } from "../question.entity";

export class UpdateQuestionDto extends PickType(Question, ['id', 'question', 'category']) {
    @IsNotEmpty()
    id: BigInt;

    @ApiProperty({
        description: '질문 파일 주소 url 배열',
        type: Array,
        example: ["qweqweq", "qweqweqweq"]
    })
    @IsArray()
    urls: string[];
}