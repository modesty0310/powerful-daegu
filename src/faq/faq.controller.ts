import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateFaqDto } from './dto/createFaq.dto';
import { FaqCategory } from './faq.entity';
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

    @Get() 
    async getAllFaq(
        @Query('category') category: FaqCategory,
        @Query('page', ParseIntPipe) page: number
    ) {
        return await this.faqService.getAllFaq(page, category);
    }

    @Get(':id')
    async getFaq(
        @Param('id') id: number
    ) {
        return await this.faqService.getFaq(id);
    }

    @Delete()
    async deleteFaq(
        @Body('id', new ParseArrayPipe({items: Number})) id: number[]
    ) {
        await this.faqService.deleteFaq(id);
        return {message: 'FAQ를 삭제 하였습니다.'};
    }
}
