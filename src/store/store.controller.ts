import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CurrentUserDto } from 'src/users/dto/currentUser.dto';
import { GetSearchDto } from './dto/getSearch.dto';
import { SetStoreLikeDto } from './dto/setStoreLike.dto';
import { StoreService } from './store.service';

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
        console.log(dto.id, user.sub);
        
        await this.storeService.setStoreLike(dto.id, user.sub)
        return
    }

    @Get('/like')
    @UseGuards(JwtAuthGuard)
    async getAllStoreLike(
        @CurrentUser() user: CurrentUserDto, 
    ) {
        return await this.storeService.getAllStoreLike(user.sub)
    }

    @Get(':id')
    async getStoreDetail(
        @Param('id', ParseIntPipe) id: BigInt,
    ) {
        return await this.storeService.getStoreDetail(id);
    }
}
