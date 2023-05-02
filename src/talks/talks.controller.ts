import { Body, Controller, ParseFilePipeBuilder, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateTalkDto } from './dto/createTalk.dto';
import { TalksService } from './talks.service';

@Controller('talks')
export class TalksController {
    constructor(private readonly talksService: TalksService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('image'))
    async createTalk(
        @Body() dto: CreateTalkDto, 
        @CurrentUser() user: CurrentUserDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
            .addFileTypeValidator({fileType:  /(png|jpg|jpeg)$/})
            .build({fileIsRequired: false}),
        ) files?: Array<Express.Multer.File>,
    ) {
        await this.talksService.createTalk(dto, user, files);
    }
}
