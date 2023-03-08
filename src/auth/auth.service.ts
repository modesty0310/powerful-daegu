import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { GoogleLoginDto } from './dto/google-login.dto';
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
        console.log(user);
        
        if(!user) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }

        const isPasswordValidated: boolean = await bcrypt.compare(password, user.password);
        console.log(isPasswordValidated);
        
        if(!isPasswordValidated) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }
        const payload = {
            email: email, sub: user.id, user_type: user.user_type
        }
        return {access_token: this.jwtService.sign(payload)}
    }

    async googleLogIn(email: string) {
        console.log("auth.service", email);
        
        const user: User = await this.usersRepository.findUserByEmail(email);
        
        if(!user) {
            throw new UnauthorizedException('회원가입 되지 않은 계정입니다.');
        }

        const payload = {
            email: email, sub: user.id, user_type: user.user_type
        }
        return {access_token: this.jwtService.sign(payload)}
    }
}
