import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { Category } from './notice.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAllNotice } from './dto/responseAllNotice.dto';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { ResponseNoticeDto } from './dto/responseNotice.dto';
import { SuccessReponseMessageDto } from 'src/common/dto/successReponseMessage.dto';

@ApiTags('notice')
@Controller('notice')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(SuccessResponseInterceptor)
export class NoticeController {
    constructor(
        private readonly noticeService: NoticeService
    ) {}

    @Get()
    @ApiOperation({ summary: '공지사항 가져오기'})
    @ApiQuery({
        name: 'category',
        required: true,
        description: '가져올때 카테고리 all | guide | inspection'
    })
    @ApiQuery({
        name: 'page',
        required: true,
        description: '가져올 페이지 1부터 시작'
    })
    @ApiResponse({status: 200, description:"성공", type: ResponseAllNotice})
    async getAllNotice(
        @Query('category') category: Category,
        @Query('page', ParseIntPipe) page: number
    ) {
        const result = await this.noticeService.getAllNotice(page, category);
        
        return {notice: result[0], count: result[1]};
    }    

    @Get(':id')
    @ApiOperation({ summary: '공지사항 상세보기'})
    @ApiParam({
        name: 'id',
        required: true,
        description: '가져올 공지사항 아이디'
    })
    @ApiResponse({status: 200, description:"성공", type: ResponseNoticeDto})
    async getNotice (
        @Param('id', ParseIntPipe) id: number
    ) {
        const notice = await this.noticeService.getNotice(id);
        return {notice}
    }

    @Post()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '공지사항 생성하기'})
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    async createNotice(
        @Body() dto: CreateNoticeDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        console.log(dto,);
        
        await this.noticeService.createNotice(dto, user);
        return {message: '게시물을 생성 하였습니다.'};
    }

    @Delete()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '공지사항 삭제하기'})
    @ApiBody({
        description: '삭제할 공지사항 아이디 array',
        schema: {
            type: 'array',
            items: {type: 'number'}
        }
    })
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    async deleteNotice(
        @Body('id', new ParseArrayPipe({items: Number})) id: number[]
    ) {
        await this.noticeService.deleteNotice(id);
        return {message: '게시물을 삭제 하였습니다.'};
    }

    @Patch()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '공지사항 수정하기'})
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    async updateNotice(
        @Body() dto: UpdateNoticeDto
    ) {
        await this.noticeService.updateNotice(dto);
        return {message: '게시물을 수정 하였습니다.'};
    }
}
