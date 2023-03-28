import { ApiProperty } from "@nestjs/swagger";
import { Faq } from "../faq.entity";

export class ResponseFaqDto {
    @ApiProperty({
        description: '공지사항',
        example: 
        {
            "createdAt": "2023-03-27T10:14:03.408Z",
            "id": 3,
            "question": "안녕하세요.",
            "answer": "답변입니다.",
            "category": "etc",
            "writer": {
              "createdAt": "2023-03-27T10:12:13.352Z",
              "updatedAt": "2023-03-27T10:12:13.352Z",
              "deletedAt": null,
              "id": 1,
              "password": "$2b$10$CDy22eYbKsm./L2/ve04LOv/kxZ2WC4lJV.Hip.j249LEOkuJHTiq",
              "nickname": "test",
              "term": true,
              "email": "test@test.com",
              "user_type": "origin",
              "profile": null,
              "role": "user"
            }
        }
    })
    notice: Faq
}