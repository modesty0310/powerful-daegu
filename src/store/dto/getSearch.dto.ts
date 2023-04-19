import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export enum Region {
    중구 = '중구',
    동구 = '동구',
    북구 = '북구',
    남구 = '남구',
    서구 = '서구',
    수성구 = '수성구',
    달서구 = '달서구',
    달성군 = '달성군'
} 

export enum Place {
    음식점 = '음식점',
    편의점 = '편의점',
    푸드코트 = '푸드코트',
    지역아동센터 = '지역아동센터',
    주민센터 = '주민센터',
    사회복지관 = '사회복지관'
}

export class GetSearchDto {
    @ApiProperty({
        description: '위도',
        type: String,
        example: '34.123123'
    })
    @IsString()
    @IsOptional()
    lat: string 
    
    @ApiProperty({
        description: '경도',
        type: String,
        example: '128.123123'
    })
    @IsString()
    @IsOptional()
    lan: string
    
    @ApiProperty({
        description: '거리 범위',
        type: String,
        example: '2'
    })
    @IsString()
    @IsOptional()
    distance: string
    
    @ApiProperty({
        description: '지역 정보',
        example: '수성구'
    })
    @IsEnum(Region)
    @IsOptional()
    region: Region

    @ApiProperty({
        description: '장소 정보',
        example: '음식점'
    })
    @IsEnum(Place)
    @IsOptional()
    place: Place

    @ApiProperty({
        description: '가게 이름',
        type: String,
        example: '세븐'
    })
    @IsString()
    @IsOptional()
    storename: string
}