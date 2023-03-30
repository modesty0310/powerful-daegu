import { PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Answer } from "../answer.entity";

export class UpdateAnswerDto extends PickType(Answer, ['id', 'answer']){
    @IsNotEmpty()
    id: BigInt;
}