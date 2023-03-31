import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QnaCategory } from './question.entity';
import { QuestionService } from './question.service';

@Controller('qna')
export class QnaController {
    constructor(
        private readonly questionService: QuestionService
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
        await this.questionService.createQuestion(dto, user, files);

        return {message: '1:1 문의 등록이 완료 되었습니다.'};
    }

    @Get()
    async getAllQuestion(
        @Query('category') category: QnaCategory,
        @Query('page') page: number 
    ) {
        return await this.questionService.getAllQuestion(page, category);
    }

    @Get(':id')
    async getQuestion(
        @Param('id') id: number
    ) {
        return await this.questionService.getQuestion(id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateQuestion(
        @Body() dto: UpdateQuestionDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.questionService.updateQuestion(dto, user);

        return {message: '질문을 수정 하였습니다.'};
    }
}
