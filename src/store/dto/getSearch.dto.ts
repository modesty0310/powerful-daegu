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
        description: '지역 정보',
        example: '수성구',
        nullable: true,
        required: false
    })
    @IsOptional()
    region?: string

    @ApiProperty({
        description: '가게 이름',
        type: String,
        example: '세븐',
        nullable: true,
        required: false
    })
    @IsString()
    @IsOptional()
    storename?: string

    @ApiProperty({
        description: '가게 카테고리',
        example: `'치킨/찜닭', '중식', '한식', '찜/탕', '피자', '족발/보쌈', '패스트푸드', '돈까스/일식', '도시락/죽', '카페/디저트', '아시안/양식', '반찬/신선', '편의점'`,
        nullable: true,
        required: false
    })
    @IsOptional()
    place?: string
}