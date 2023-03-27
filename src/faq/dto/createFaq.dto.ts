import { PickType } from "@nestjs/swagger";
import { Faq } from "../faq.entity";

export class CreateFaqDto extends PickType(Faq, ['answer', 'question', 'category']) {}