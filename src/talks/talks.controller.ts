import { Body, Controller, Delete, Get, ParseFilePipeBuilder, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { resourceLimits } from 'worker_threads';
import { CreateTalkDto } from './dto/createTalk.dto';
import { DeleteTalkDto } from './dto/deleteTalk.dto';
import { GetTalkDto } from './dto/getTalk.dto';
import { LikeTalkDto } from './dto/likeTalk.dto';
import { UpdateTalkDto } from './dto/updateTalk.dto';
import { TalksService } from './talks.service';

@ApiTags('talks')
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

    @Get()
    async getTalk (
        @Query() dto: GetTalkDto
    ) {
        const result = await this.talksService.getTalk(dto);
        return result;
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    async getMyTalk(
        @CurrentUser() user: CurrentUserDto
    ) {
        const result = await this.talksService.getMyTalk(user);

        return result
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('image'))
    async updateTalk (
        @Body() dto: UpdateTalkDto,
        @CurrentUser() user: CurrentUserDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
            .addFileTypeValidator({fileType:  /(png|jpg|jpeg)$/})
            .build({fileIsRequired: false}),
        ) files?: Array<Express.Multer.File>,
    ) {
        await this.talksService.updateTalk(dto, user, files);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteTalk (
        @Body() dto: DeleteTalkDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.talksService.deleteTalk(dto, user);
    }

    @Post('like')
    @UseGuards(JwtAuthGuard)
    async likeTalk (
        @Body() dto: LikeTalkDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.talksService.likeTalk(dto, user);
    }

    @Delete('like')
    @UseGuards(JwtAuthGuard)
    async deleteLikeTalk (
        @Body() dto: LikeTalkDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.talksService.deleteLikeTalk(dto, user);
    }
}
