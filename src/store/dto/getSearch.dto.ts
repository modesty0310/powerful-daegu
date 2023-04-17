import { IsString } from "class-validator";

export class GetSearchDto {
    @IsString()
    lat: string 
    
    @IsString()
    lan: string
    
    @IsString()
    distance: string
    
    @IsString()
    place: string

    @IsString()
    location: string

    @IsString()
    storename: string
}