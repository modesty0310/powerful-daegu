import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { Category } from './notice.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Controller('notice')
export class NoticeController {
    constructor(
        private readonly noticeService: NoticeService
    ) {}

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async getAllNotice(
        @Query('category') category: Category,
        @Query('page', ParseIntPipe) page: number
    ) {
        return await this.noticeService.getAllNotice(page, category)
    }    

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getNotice (
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.noticeService.getNotice(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    createNotice(
        @Body() dto: CreateNoticeDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        console.log(dto,);
        
        this.noticeService.createNotice(dto, user);
    }

    @Delete()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async deleteNotice(
        @Body('id', ParseArrayPipe) id: number[]
    ) {
        await this.noticeService.deleteNotice(id);
        return {message: '게시물을 삭제 하였습니다.'}
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
