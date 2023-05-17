import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { GetDirectionsDto } from './dto/getDirections.dto';
import { MapsService } from './maps.service';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
    constructor(
        private readonly mapsService: MapsService
    ) {}

    @Get()
    @ApiOperation({ summary: '경로 가져오기'})
    async getDirections(
        @Query() query: GetDirectionsDto
    ) {
        const {start, goal} = query;
        const opt = {
            url: `https://map.naver.com/v5/api/transit/directions/point-to-point?start=${start}&goal=${goal}&mode=TIME&lang=ko&includeDetailOperation=true`,
            method: "post",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }

        const result = await axios(opt)
            .then(function a(response) {
                console.log("response =", response)
                return response.data
                // // 맵 목적지 설정
                // dispatch(mapActions.handleDestination({data : e.target.value}))

                // // 맵 데이터 설정
                // dispatch(mapActions.handleSearch({data : response.data.paths.length !== 0 ? response.data.paths : response.data.staticPaths}))
            })
            .catch(function (error) {
                console.log(error);
                return error
            });
            return result
    }

}
