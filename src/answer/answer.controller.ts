import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/createAnswer.dto';
import { UpdateAnswerDto } from './dto/updateAnswer.dto';

@Controller('answer')
export class AnswerController {
    constructor(
        private readonly answerService: AnswerService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createAnswer(
        @Body() dto: CreateAnswerDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.answerService.createAnswer(dto, user);
        return {message: '답변을 완료 했습니다.'};
    }

    @Delete(':id')
    async deleteAnswer(
        @Param('id', ParseIntPipe) id: number
    ) {
        await this.answerService.deleteAnswer(id);
        return {message: '답변을 삭제 하였습니다.'}
    }

    @Patch()
    async updateAnswer(
        @Body() dto: UpdateAnswerDto
    ) {
        console.log(dto);
        await this.answerService.updateAnswer(dto);
    }
}
