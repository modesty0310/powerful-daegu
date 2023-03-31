import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ResponseAllFaq } from 'src/faq/dto/responseAllFaq.dto';
import { SuccessReponseMessageDto } from 'src/common/dto/successReponseMessage.dto';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { CreateFaqDto } from './dto/createFaq.dto';
import { UpdateFaqDto } from './dto/updateFaq.dto';
import { FaqCategory } from './faq.entity';
import { FaqService } from './faq.service';
import { ResponseFaqDto } from './dto/responseFaq.dto';

@Controller('faq')
@ApiTags('faq')
export class FaqController {
    constructor(
        private readonly faqService: FaqService
    ){}

    @Post()
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    async createFaq(
        @Body() dto: CreateFaqDto,
        @CurrentUser() user: CurrentUserDto
    ) {
        await this.faqService.createFaq(dto, user);

        return {message: 'FAQ작성이 완료 되었습니다.'}
    }

    @Get()
    @ApiQuery({
        name: 'category',
        required: true,
        description: '가져올때 카테고리 all | etc | franchisee | map'
    })
    @ApiQuery({
        name: 'page',
        required: true,
        description: '가져올 페이지 1부터 시작'
    }) 
    @ApiResponse({status: 200, description:"성공", type: ResponseAllFaq})
    async getAllFaq(
        @Query('category') category: FaqCategory,
        @Query('page', ParseIntPipe) page: number
    ) {
        return await this.faqService.getAllFaq(page, category);
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        required: true,
        description: '가져올 FAQ 아이디'
    })
    @ApiResponse({status: 200, description:"성공", type: ResponseFaqDto})
    async getFaq(
        @Param('id') id: number
    ) {
        return await this.faqService.getFaq(id);
    }

    @Delete()
    @ApiBody({
        description: '삭제할 FAQ 아이디 array',
        schema: {
            type: 'array',
            items: {type: 'number'}
        }
    })
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async deleteFaq(
        @Body('id', new ParseArrayPipe({items: Number})) id: BigInt[]
    ) {
        await this.faqService.deleteFaq(id);
        return {message: 'FAQ를 삭제 하였습니다.'};
    }

    @Patch()
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    async updateFaq(
        @Body() dto: UpdateFaqDto
    ) {
        await this.faqService.updateFaq(dto);
        return {message: 'FAQ를 수정 하였습니다.'}
    }
}
