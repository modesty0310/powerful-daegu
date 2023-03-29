import { Body, Controller, ParseFilePipeBuilder, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateQnaDto } from './dto/createQna.dto';

@Controller('qna')
export class QnaController {

    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async createQna (
        @Body() dto: CreateQnaDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
            .addFileTypeValidator({fileType:  /(png|jpg|jpeg)$/})
            .build({fileIsRequired: false}),
        ) files?: Express.Multer.File[],
    ) {
        console.log(files, dto);
    }
}
