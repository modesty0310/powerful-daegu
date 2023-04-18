import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios  from 'axios';

@Injectable()
export class MapsService {

    async getDirections(startLat: string, startLan: string, goalLat: string, goalLan: string) {
            const result =  await axios.get(
                //https://map.naver.com/v5/api/dir/findwalk?lo=ko&st=1&o=all&l=128.6153254,35.8415809,placeid=16358945,name=%EC%A4%91%EB%8F%99%EC%96%B4%EB%A6%B0%EC%9D%B4%EA%B3%B5%EC%9B%90;128.4928026,35.8589041,placeid=1309073405,name=%EC%96%8C%EC%83%98%EA%B9%80%EB%B0%A5%20%EB%8C%80%EA%B5%AC%EA%B3%84%EB%AA%85%EB%8C%80%EC%A0%90&lang=ko
                //https://map.naver.com/v5/api/dir/findbicycle?start=128.6153254,35.8415809&destination=128.4928026,35.8589041&call=route3&output=json&result=webmobile&coord_type=lnglat&search=8&lang=ko
                'https://map.naver.com/v5/api/transit/directions/point-to-point?start=128.576747,35.86287963&goal=128.4928316,35.85892304&mode=TIME&lang=ko&includeDetailOperation=true'
            ).then(res => {
                console.log(res.data);
            }).catch(e => {
                console.log(e);
            })
            return result
    }
}
