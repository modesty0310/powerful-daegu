import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { GetSearchDto } from './dto/getSearch.dto';
import { SetStoreLikeDto } from './dto/setStoreLike.dto';
import { DeleteStoreLikeDto } from './dto/deleteStoreLike.dto';
import { StoreService } from './store.service';
import { SetDirectionDto } from './dto/setDirection.dto';
import { DeleteDirectionDto } from './dto/deleteDirection.dto';

@Controller('store')
@ApiTags('Store')
export class StoreController {
    constructor(
        private readonly storeService: StoreService
    ){}

    @Get('/search')
    async getSearchStore(
        @Query() query: GetSearchDto
    ) {
        return await this.storeService.getSearchStore(query);
    }

    @Get('/all')
    async getAllStore() {
        return await this.storeService.getAllStore()
    }

    @Post('/like')
    @UseGuards(JwtAuthGuard)
    async setStoreLike(
        @Body() dto: SetStoreLikeDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {        
        await this.storeService.setStoreLike(dto.id, user.sub)
        return
    }

    @Delete('/like')
    @UseGuards(JwtAuthGuard)
    async deleteStoreLike(
        @Body() dto: DeleteStoreLikeDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {
        await this.storeService.deleteStoreLike(dto.id, user.sub)
        return
    }

    @Get('/like')
    @UseGuards(JwtAuthGuard)
    async getAllStoreLike(
        @CurrentUser() user: CurrentUserDto, 
    ) {
        return await this.storeService.getAllStoreLike(user.sub)
    }

    @Post('/direction')
    @UseGuards(JwtAuthGuard)
    async setDirection(
        @Body() dto: SetDirectionDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {        
        await this.storeService.setDirection(dto.url, user.sub)
        return
    }

    @Delete('/direction')
    @UseGuards(JwtAuthGuard)
    async deleteDirection(
        @Body() dto: DeleteDirectionDto,
        @CurrentUser() user: CurrentUserDto, 
    ) {
        await this.storeService.deleteDirection(dto.id, user.sub)
        return
    }

    @Get('/direction')
    @UseGuards(JwtAuthGuard)
    async getAllDirection(
        @CurrentUser() user: CurrentUserDto, 
    ) {
        return await this.storeService.getAllDirection(user.sub)
    }

    @Get(':id')
    async getStoreDetail(
        @Param('id', ParseIntPipe) id: BigInt,
    ) {
        return await this.storeService.getStoreDetail(id);
    }
}
