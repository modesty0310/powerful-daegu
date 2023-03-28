import { PickType } from "@nestjs/swagger";
import { Faq } from "../faq.entity";

export class UpdateFaqDto extends PickType(Faq, ['id', 'answer', 'category', 'question']) {}