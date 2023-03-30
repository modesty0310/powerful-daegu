import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Answer } from "src/answer/answer.entity";

export class CreateAnswerDto extends PickType(Answer, ['answer']) {
    @ApiProperty({
        
    })
    @IsNotEmpty()
    questionId: number
}