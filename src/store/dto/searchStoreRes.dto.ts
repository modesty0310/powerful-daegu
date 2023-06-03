import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Store } from "../store.entity";

export class SearchStoreResDto {
    @ApiProperty({
        description: '좋아요 한 가게 정보',
        type: OmitType(Store, ['menu'])
    })
    like: Omit<Store, 'menu'> | [];

    @ApiProperty({
        description: '검색 결과',
        type: OmitType(Store, ['menu'])
    })
    streos: Omit<Store, 'menu'> | [];
}