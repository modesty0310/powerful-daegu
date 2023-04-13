import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios  from 'axios';

@Injectable()
export class MapsService {

    async getDirections(startLat: string, startLan: string, goalLat: string, goalLan: string) {
            const result =  await axios.get(
                `https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving`,
                {
                    headers: {
                        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_ID,
                        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_SECRET 
                    },
                    params: {
                        start: `${startLat},${startLan}`,
                        goal: `${goalLat},${goalLan}`
                    }
                }
            ).then(res => {
                console.log(res.data);
                return res.data
                
            }).catch(e => {
                console.log(e);
            })

    }
}
