import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { Category } from './notice.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllNotice } from './swagger/allNotice';
import { NoticeType } from './swagger/notice';
import { ResponseAllNotice } from './dto/responseAllNotice.dto';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';

@ApiTags('notice')
@Controller('notice')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(SuccessResponseInterceptor)
export class NoticeController {
    constructor(
        private readonly noticeService: NoticeService
    ) {}

    @Get('all')
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
    @UseGuards(JwtAuthGuard)
    async getAllNotice(
        @Query('category') category: Category,
        @Query('page', ParseIntPipe) page: number
    ) {
        const result = await this.noticeService.getAllNotice(page, category);
        
        return {notice: result[0], count: result[1]};
    }    

    @Get(':id')
    @ApiParam({
        name: 'id',
        required: true,
        description: '가져올 공지사항 아이디'
    })
    @ApiResponse({status: 200, description:"성공", type: NoticeType})
    @UseGuards(JwtAuthGuard)
    async getNotice (
        @Param('id', ParseIntPipe) id: number
    ) {
        const notice = await this.noticeService.getNotice(id);
        return {notice}
    }

    @Post()
    @ApiResponse({status: 200, description:"성공", type: '게시물을 생성 하였습니다.'})
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
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
    async deleteNotice(
        @Body('id', ParseArrayPipe) id: number[]
    ) {
        await this.noticeService.deleteNotice(id);
        return {message: '게시물을 삭제 하였습니다.'};
    }

    @Patch()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    updateNotice(
        @Body() dto: UpdateNoticeDto
    ) {
        return this.noticeService.updateNotice(dto);
    }
}
