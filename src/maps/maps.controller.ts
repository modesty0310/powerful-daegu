import { Controller, Get, Query } from '@nestjs/common';
import { GetDirectionsDto } from './dto/getDirections.dto';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
    constructor(
        private readonly mapsService: MapsService
    ) {}

    @Get()
    async getDirections(
        @Query() query: GetDirectionsDto
    ) {
        const {startLat, startLan, goalLat, goalLan} = query
        const result = await this.mapsService.getDirections(startLat, startLan, goalLat, goalLan);
        console.log(result);
        
        return;
    }

}
