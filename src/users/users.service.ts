import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CreateAuthCodeDto } from './dto/createAuthCode.dto';
import { CreateUserDto } from './dto/createUser.dto';
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

    async createAuthCode(dto: CreateAuthCodeDto) {
        const existEmail = await this.usersRepository.existsByEmail(dto.email);
        console.log(existEmail);
        
        if(existEmail) {
            return '이미 존재 하는 이메일 입니다.'
        }else {
            this.emailService.sendAuthCode(dto.email);
            return '작성한 이메일로 인증 코드를 보냈습니다.'
        }
    }
}
