import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


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
    @UseGuards(JwtAuthGuard)
    createNotice(
        @Body() dto: CreateNoticeDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        console.log(dto,);
        
        this.noticeService.createNotice(dto, user);
    }

    @Delete()
    deleteNotice() {

    }

    @Patch()
    updateNotice() {

    }
}
