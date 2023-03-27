import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateFaqDto } from './dto/createFaq.dto';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
    constructor(
        private readonly faqService: FaqService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createFaq(
        @Body() dto: CreateFaqDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.faqService.createFaq(dto, user);

        return {message: 'FAQ작성이 완료 되었습니다.'}
    }
}
