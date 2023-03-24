import { ApiProperty } from "@nestjs/swagger";
import { CommonSuccess } from "src/common/dto/commonSuccess.dto";
import { Notice } from "../notice.entity";

export class ResponseAllNotice {
    @ApiProperty({
        description: '공지사항',
        example: [
            {
              "createdAt": "2023-03-24T06:10:01.137Z",
              "id": 24,
              "title": "sss",
              "content": "gd",
              "category": "guide",
              "writer": {
                "createdAt": "2023-03-22T04:55:00.396Z",
                "updatedAt": "2023-03-22T04:55:00.396Z",
                "deletedAt": null,
                "id": 1,
                "password": "$2b$10$yRbdEIRfjmKRAitwrxjujebRaboHPNQCwbB/9wkD/QUwOauYYLMju",
                "nickname": "test",
                "term": true,
                "email": "test@test.com",
                "user_type": "origin",
                "profile": null,
                "role": "user"
              }
            }
        ]
    })
    notice: Notice[]

    @ApiProperty({
        description: '모든 공지사항 개수',
        example: 0
    })
    count: number
}