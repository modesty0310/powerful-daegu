import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetSearchDto } from './dto/getSearch.dto';
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

    @Get(':id')
    async getStoreDetail(
        @Param('id', ParseIntPipe) id: BigInt
    ) {
        return await this.storeService.getStoreDetail(id);
    }
}
