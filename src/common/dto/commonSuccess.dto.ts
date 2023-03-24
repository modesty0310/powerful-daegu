import { ApiProperty } from "@nestjs/swagger";
import { Timestamp } from "typeorm";

export class CommonSuccess {
    @ApiProperty({
        description: "Status Code",
        type: Number,
        example: 200,
        default: 200
    })
    statusCode: Number = 200

    @ApiProperty({
        description: "실행 시간",
        type: Timestamp,
        example: "2023-03-24T06:28:12.876Z",
        default: new Date().toISOString(),
    })
    timestamp: string = new Date().toISOString()
}