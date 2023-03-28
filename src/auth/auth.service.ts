import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CheckAuthCodeDto } from 'src/users/dto/checkAuthCode.dto';
import { SocialOauthDto } from 'src/users/dto/socialOauth.dto';
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

    async socialSignUp(user: SocialOauthDto, res: Response): Promise<SocialOauthDto> {
        const existEmail = await this.usersRepository.existsByEmail(user.email);

        if(existEmail) {
            throw new UnauthorizedException("이미 존재하는 이메일 입니다.")
        }
        const payload = {
            result: true
        }
        res.cookie('codeCheck_token', this.jwtService.sign(payload), {httpOnly: true});
        return user
    }

    async socialLogIn(email: string, res: Response) {
        
        const user: User = await this.usersRepository.findUserByEmail(email);
        
        if(!user) {
            throw new UnauthorizedException('회원가입 되지 않은 계정입니다.');
        }

        const payload = {
            email: email, sub: user.id, user_type: user.user_type
        }
        res.cookie('access_token', this.jwtService.sign(payload), {httpOnly: true});
        return;
    }

    async setEmailCheckToken(
        result: boolean,
        res: Response
    ) {             
        const payload = {
            result
        }
        res.cookie('codeCheck_token', this.jwtService.sign(payload), {httpOnly: true});
        return 
    }
}
