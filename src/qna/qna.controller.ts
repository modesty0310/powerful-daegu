import { Body, Controller, Get, Param, ParseFilePipeBuilder, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateQnaDto } from './dto/createQna.dto';
import { QnaCategory } from './qna.entity';
import { QnaService } from './qna.service';

@Controller('qna')
export class QnaController {
    constructor(
        private readonly qnaService: QnaService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async createQna (
        @Body() dto: CreateQnaDto,
        @CurrentUser() user: CurrentUserDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
            .build({fileIsRequired: false}),
        ) files?: Express.Multer.File[],     
    ) {
        await this.qnaService.createQna(dto, user, files);
        return {message: '1:1 문의 등록이 완료 되었습니다.'}
    }

    @Get()
    async getAllQna(
        @Query('category') category: QnaCategory,
        @Query('page') page: number 
    ) {
        return await this.qnaService.getAllQna(page, category);
    }

    @Get(':id')
    async getQna(
        @Param('id') id: number
    ) {
        return await this.qnaService.getQna(id);
    }
}
