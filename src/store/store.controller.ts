import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service';

@Controller('store')
@ApiTags('Store')
export class StoreController {
    constructor(
        private readonly storeService: StoreService
    ){}

    @Get(':id')
    async getStoreDetail(
        @Param('id', ParseIntPipe) id: BigInt
    ) {
        return await this.storeService.getStoreDetail(id);
    }

}
