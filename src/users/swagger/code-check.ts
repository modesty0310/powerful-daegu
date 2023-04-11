import { ApiProperty } from "@nestjs/swagger";

export class CodeCheckSuccess {
    @ApiProperty({
        description: "일치 여부",
        type: Boolean,
        example: true
    })
    result: boolean
}

export class CodeCheckFail {
    @ApiProperty({
        description: "일치 여부",
        type: Boolean,
        example: false
    })
    result: boolean
}