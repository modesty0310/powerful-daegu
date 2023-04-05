import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QnaCategory } from './question.entity';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
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

    @Get('my')
    @UseGuards(JwtAuthGuard)
    async getMyQuestion(
        @CurrentUser() user: CurrentUserDto
    ) {
        return await this.questionService.getMyQuestion(user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getQuestion(
        @Param('id', ParseIntPipe) id: BigInt,
        @CurrentUser() user: CurrentUserDto
    ) {
        return await this.questionService.getQuestion(id, user);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async updateQuestion(
        @Body() dto: UpdateQuestionDto,
        @CurrentUser() user: CurrentUserDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
            .build({fileIsRequired: false}),
        ) files?: Express.Multer.File[],
    ) {
        await this.questionService.updateQuestion(dto, user, files);

        return {message: '질문을 수정 하였습니다.'};
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteQuestion(
        @Body('id', new ParseArrayPipe({items: Number})) id: BigInt[],
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.questionService.deleteQuestion(id, user);
        return {message: '질문을 삭제 하였습니다.'}
    }

}
