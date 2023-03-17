import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IOauth } from 'src/common/interfaces/oauth.interface';
import { EmailService } from 'src/email/email.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateAuthCodeDto } from './dto/createAuthCode.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ReturnAuthCodeDto } from './dto/returnAuthCode.dto';
import { SocialOauthDto } from './dto/socialOauth.dto';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly emailService: EmailService,
    ){}

    async createUser(dto: CreateUserDto): Promise<User> {
        const {email, nickname, password, term, user_type} = dto;
        const existEmail = await this.usersRepository.existsByEmail(dto.email);
        
        if (existEmail) {
            throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
        }
        const hasedPassword = await bcrypt.hash(password, 10);

        return await this.usersRepository.createUser({email, nickname, password: hasedPassword, term, user_type});
    }

    async createAuthCode(dto: CreateAuthCodeDto): Promise<ReturnAuthCodeDto> {        
        const existEmail = await this.usersRepository.existsByEmail(dto.email);
        
        if(existEmail) {
            return {text: '이미 존재 하는 이메일 입니다.', success: false, code: null};
        }else {
            const code = this.setRandomNum();
            this.emailService.sendAuthCode(dto.email, code);
            return {text: '작성한 이메일로 인증 코드를 보냈습니다.', success: true, code};
        }
    }

    async socialSignUp(user: SocialOauthDto): Promise<SocialOauthDto> {
        const existEmail = await this.usersRepository.existsByEmail(user.email);

        if(existEmail) {
            throw new UnauthorizedException("이미 존재하는 이메일 입니다.")
        }

        return user
    }

    async changePassword(dto: ChangePasswordDto) {
        const {password, checkPassword, email} = dto;

        if(password !== checkPassword) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.');
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        await this.usersRepository.changePassword(hasedPassword, email);
    }

    setRandomNum(): string {
        let str = '';
        for (let i = 0; i < 6; i++) {
            str += Math.floor(Math.random() * 10);
        }
        return str;
    }
}
