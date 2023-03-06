import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CreateAuthCodeDto } from './dto/createAuthCode.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ReturnAuthCodeDto } from './dto/returnAuthCode.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly emailService: EmailService,
    ){}

    async createUser(createUserDto: CreateUserDto) {
        const existEmail = this.usersRepository.existsByEmail(createUserDto.email);


    }

    async createAuthCode(dto: CreateAuthCodeDto): Promise<ReturnAuthCodeDto> {
        console.log(dto);
        
        const existEmail = await this.usersRepository.existsByEmail(dto.email);
        
        if(existEmail) {
            return {text: '이미 존재 하는 이메일 입니다.', success: false, code: null};
        }else {
            const code = this.setRandomNum();
            this.emailService.sendAuthCode(dto.email, code);
            return {text: '작성한 이메일로 인증 코드를 보냈습니다.', success: true, code};
        }
    }

    setRandomNum(): string {
        let str = '';
        for (let i = 0; i < 6; i++) {
            str += Math.floor(Math.random() * 10);
        }
        return str;
    }
}
