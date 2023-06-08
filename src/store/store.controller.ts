import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { GetSearchDto } from './dto/getSearch.dto';
import { SetStoreLikeDto } from './dto/setStoreLike.dto';
import { DeleteStoreLikeDto } from './dto/deleteStoreLike.dto';
import { StoreService } from './store.service';
import { SetDirectionDto } from './dto/setDirection.dto';
import { DeleteDirectionDto } from './dto/deleteDirection.dto';
import { Store } from './store.entity';
import { StoreDirection } from './storeDirection.entity';
import { Request } from 'express';
import { SearchStoreResDto } from './dto/searchStoreRes.dto';

@Controller('store')
@ApiTags('Store')
export class StoreController {
    constructor(
        private readonly storeService: StoreService
    ){}

    @Get('/search')
    @ApiOperation({ summary: '가게 검색하기'})
    @ApiResponse({status: 200, description: '성공', type: SearchStoreResDto})
    async getSearchStore(
        @Query() query: GetSearchDto,
        @Req() req: Request
    ) {
        console.log(query);
        
        return await this.storeService.getSearchStore(query, req);
    }

    @Get('/all')
    @ApiOperation({ summary: '모든 가게 가져오기'})
    @ApiResponse({status: 200, description: '성공', type: SearchStoreResDto})
    async getAllStore(
        @Req() req: Request
    ) {
        return await this.storeService.getAllStore(req)
    }

    @Post('/like')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '가게 좋아요 등록'})
    @ApiResponse({status: 200, description: '성공', type: null})
    async setStoreLike(
        @Body() dto: SetStoreLikeDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {        
        await this.storeService.setStoreLike(dto.id, user.sub)
        return
    }

    @Delete('/like')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '가게 좋아요 삭제'})
    @ApiResponse({status: 200, description: '성공', type: null})
    async deleteStoreLike(
        @Body() dto: DeleteStoreLikeDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {
        await this.storeService.deleteStoreLike(dto.id, user.sub);
        return
    }

    @Get('/like')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '가게 좋아요 조회'})
    @ApiResponse({status: 200, description: '성공', type: OmitType(Store, ['store_type', 'menu'])})
    async getAllStoreLike(
        @CurrentUser() user: CurrentUserDto, 
    ) {
        return await this.storeService.getAllStoreLike(user.sub);
    }

    @Post('/direction')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '경로 좋아요 등록'})
    @ApiResponse({status: 200, description: '성공', type: null})
    async setDirection(
        @Body() dto: SetDirectionDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {        
        await this.storeService.setDirection(dto.url, user.sub)
        return
    }

    @Delete('/direction')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '경로 좋아요 삭제'})
    @ApiResponse({status: 200, description: '성공', type: null})
    async deleteDirection(
        @Body() dto: DeleteDirectionDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {
        await this.storeService.deleteDirection(dto.id, user.sub)
        return
    }

    @Get('/direction')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '경로 좋아요 조회'})
    @ApiResponse({status: 200, description: '성공', type: StoreDirection})
    async getAllDirection(
        @CurrentUser() user: CurrentUserDto, 
    ) {
        return await this.storeService.getAllDirection(user.sub)
    }

    @Get('')
    @ApiOperation({ summary: '가게 상세보기'})
    @ApiQuery({description: '아이디', example: 1})
    @ApiResponse({status: 200, description: '성공', type: Store})
    async getStoreDetail(
        @Query('id', ParseIntPipe) id: BigInt,
    ) {
        return await this.storeService.getStoreDetail(id);
    }
}
