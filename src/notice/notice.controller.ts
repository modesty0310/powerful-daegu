import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { Category } from './notice.entity';


@Controller('notice')
export class NoticeController {
    constructor(
        private readonly noticeService: NoticeService
    ) {}

    @Get('all')
    async getAllNotice(
        @Query('category') category: Category,
        @Query('page', ParseIntPipe) page: number
    ) {
        return await this.noticeService.getAllNotice(page, category)
    }    

    @Get(':id')
    async getNotice (
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.noticeService.getNotice(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    createNotice(
        @Body() dto: CreateNoticeDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        console.log(dto,);
        
        this.noticeService.createNotice(dto, user);
    }

    @Delete(':id')
    async deleteNotice(
        @Param('id', ParseIntPipe) id: number
    ) {
        await this.noticeService.deleteNotice(id);
        return {message: '게시물을 삭제 하였습니다.'}
    }

    @Patch()
    updateNotice(
        @Body() dto: UpdateNoticeDto
    ) {
        return this.noticeService.updateNotice(dto);
    }
}
