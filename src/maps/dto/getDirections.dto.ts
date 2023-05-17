import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetDirectionsDto {
    @ApiProperty({
        description: '출발지 좌표',
        example: '128.582351,35.8642161',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    start: string 
    
    @ApiProperty({
        description: '도착지 좌표',
        example: '128.582351,35.8642161',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    goal: string

}