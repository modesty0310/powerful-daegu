import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';


@Controller('notice')
export class NoticeController {
    constructor(
        private readonly noticeService: NoticeService
    ) {}

    @Get()
    getNotice() {

    }

    @Get('all')
    getAllNotice() {

    }

    @Post()
    createNotice(
        @Body() dto: CreateNoticeDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        this.noticeService.createNotice(user)
    }

    @Delete()
    deleteNotice() {

    }

    @Patch()
    updateNotice() {

    }
}
