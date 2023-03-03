import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    sendAuthCode(email: string): void {
        console.log(email);
        
        this.mailerService
            .sendMail({
                to: email, // list of receivers
                subject: '인증 이메일 입니다.', // Subject line
                text: '안녕하세요', // plaintext body
                html: '<b>welcome</b>', // HTML body content
            })
            .then(() => {
                console.log("성공");
                
            })
            .catch((err) => {
                console.log(err);
                
            });
    }
}
