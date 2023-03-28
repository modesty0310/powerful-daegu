import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    private logger = new Logger();
    
    async sendAuthCode(email: string, code: string) {
        
        await this.mailerService
            .sendMail({
                to: email, // list of receivers
                subject: '인증 이메일 입니다.', // Subject line
                text: '안녕하세요', // plaintext body
                html: `<span>인증코드는 </span><p>${code}</p><span> 입니다.</span>` , // HTML body content
            })
            .then(() => {
                console.log("성공");
            })
            .catch((err) => {
                this.logger.error(err)
                throw new InternalServerErrorException('메일을 발송하는데 실패 했습니다.')
            });
    }
}
