import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { MapsService } from './maps.service';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
    constructor(
        private readonly mapsService: MapsService
    ) {}

    @Get()
    async getDirections() {
        const opt = {
            url: "https://map.naver.com/v5/api/transit/directions/point-to-point?start=128.582351,35.8642161&goal=128.560192,35.9303298&mode=TIME&lang=ko&includeDetailOperation=true",
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
