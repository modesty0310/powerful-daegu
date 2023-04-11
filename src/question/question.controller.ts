import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QnaCategory } from './question.entity';
import { QuestionService } from './question.service';

@Controller('question')
@ApiTags('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '1:1 질문 등록하기'})
    async createQuestion (
        @Body() dto: CreateQuestionDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {
        await this.questionService.createQuestion(dto, user);

        return {message: '1:1 문의 등록이 완료 되었습니다.'};
    }

    @Get()
    @ApiOperation({ summary: '1:1 질문 가져오기'})
    @ApiQuery({
        name: 'category',
        required: true,
        description: '가져올때 카테고리 etc | franchisee | map | all'
    })
    @ApiQuery({
        name: 'page',
        required: true,
        description: '가져올 페이지 1부터 시작'
    })
    async getAllQuestion(
        @Query('category') category: QnaCategory,
        @Query('page') page: number 
    ) {
        return await this.questionService.getAllQuestion(page, category);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '내가한 1:1 질문 가져오기'})
    async getMyQuestion(
        @CurrentUser() user: CurrentUserDto
    ) {
        return await this.questionService.getMyQuestion(user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '1:1 질문 상세보기'})
    @ApiParam({
        name: 'id',
        required: true,
        description: '가져올 1:1 질문 아이디'
    })
    async getQuestion(
        @Param('id', ParseIntPipe) id: BigInt,
        @CurrentUser() user: CurrentUserDto
    ) {
        return await this.questionService.getQuestion(id, user);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '1:1 질문 수정'})
    async updateQuestion(
        @Body() dto: UpdateQuestionDto,
        @CurrentUser() user: CurrentUserDto,
    ) {
        await this.questionService.updateQuestion(dto, user);

        return {message: '질문을 수정 하였습니다.'};
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '1:1 질문 삭제'})
    @ApiBody({
        description: '삭제할 질문 아이디 배열',
        schema: {
            type: 'array',
            items: {type: 'number'}
        },
    })
    async deleteQuestion(
        @Body('id', new ParseArrayPipe({items: Number})) id: BigInt[],
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.questionService.deleteQuestion(id, user);
        return {message: '질문을 삭제 하였습니다.'}
    }

}
