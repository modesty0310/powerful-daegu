import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/createAnswer.dto';
import { UpdateAnswerDto } from './dto/updateAnswer.dto';

@Controller('answer')
@ApiTags('answer')
export class AnswerController {
    constructor(
        private readonly answerService: AnswerService
    ) {}

    @Post()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '1:1 질문 답변하기'})
    async createAnswer(
        @Body() dto: CreateAnswerDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.answerService.createAnswer(dto, user);
        return {message: '답변을 완료 했습니다.'};
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '1:1 질문 삭제하기'})
    @ApiParam({
        name: 'id',
        required: true,
        description: '삭제할 답변 아이디'
    })
    async deleteAnswer(
        @Param('id', ParseIntPipe) id: number
    ) {
        await this.answerService.deleteAnswer(id);
        return {message: '답변을 삭제 하였습니다.'}
    }

    @Patch()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '1:1 질문 수정하기'})
    async updateAnswer(
        @Body() dto: UpdateAnswerDto
    ) {
        await this.answerService.updateAnswer(dto);
    }
}
