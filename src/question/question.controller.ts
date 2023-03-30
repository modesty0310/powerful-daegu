import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QnaCategory } from './question.entity';
import { QnaService } from './question.service';

@Controller('qna')
export class QnaController {
    constructor(
        private readonly qnaService: QnaService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async createQuestion (
        @Body() dto: CreateQuestionDto,
        @CurrentUser() user: CurrentUserDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
            .build({fileIsRequired: false}),
        ) files?: Express.Multer.File[],     
    ) {
        await this.qnaService.createQuestion(dto, user, files);
        return {message: '1:1 문의 등록이 완료 되었습니다.'}
    }

    @Get()
    async getAllQuestion(
        @Query('category') category: QnaCategory,
        @Query('page') page: number 
    ) {
        return await this.qnaService.getAllQuestion(page, category);
    }

    @Get(':id')
    async getQuestion(
        @Param('id') id: number
    ) {
        return await this.qnaService.getQuestion(id);
    }
}
