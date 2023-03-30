import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/createAnswer.dto';

@Controller('answer')
export class AnswerController {
    constructor(
        private readonly answerService: AnswerService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async answerQna(
        @Body() dto: CreateAnswerDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.answerService.answerQna(dto, user);
        return {message: '답변을 완료 했습니다.'};
    }

    @Delete(':id')
    async deleteAnswer(
        @Param('id') id: number
    ) {
        await this.answerService.deleteAnser(id);
        return {message: '답변을 삭제 하였습니다.'}
    }
}
