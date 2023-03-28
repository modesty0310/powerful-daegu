import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CheckAuthCodeDto } from 'src/users/dto/checkAuthCode.dto';
import { User } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly usersRepository: UsersRepository
    ){}

    async jwtLogIn(dto: LoginDto) {
        const {email, password} = dto;

        const user: User = await this.usersRepository.findUserByEmail(email);
        
        if(!user) {
            throw new UnauthorizedException('회원가입 되지 않은 계정입니다.');
        }

        if(user && user.user_type !== 'origin') {
            throw new UnauthorizedException('SNS 회원 가입 계정 입니다.');
        }

        const isPasswordValidated: boolean = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValidated) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }
        const payload = {
            email: email, sub: user.id, user_type: user.user_type
        }
        return {access_token: this.jwtService.sign(payload)}
    }

    async socialLogIn(email: string) {
        
        const user: User = await this.usersRepository.findUserByEmail(email);
        
        if(!user) {
            throw new UnauthorizedException('회원가입 되지 않은 계정입니다.');
        }

        const payload = {
            email: email, sub: user.id, user_type: user.user_type
        }
        return {access_token: this.jwtService.sign(payload)}
    }

    async setEmailCheckToken(
        result: boolean
    ) { 
        console.log(result);
               
        const payload = {
            result
        }
        return {codeCheck_token: this.jwtService.sign(payload)};
    }
}
