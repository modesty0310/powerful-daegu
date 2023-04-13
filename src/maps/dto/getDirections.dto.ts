import { IsNotEmpty, IsString } from "class-validator";

export class GetDirectionsDto {
    @IsString()
    @IsNotEmpty()
    startLat: string 
    
    @IsString()
    @IsNotEmpty()
    startLan: string
    
    @IsString()
    @IsNotEmpty()
    goalLat: string
    
    @IsString()
    @IsNotEmpty()
    goalLan: string
}