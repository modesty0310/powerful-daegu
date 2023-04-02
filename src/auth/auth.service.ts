import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Cache } from 'cache-manager';
import { SocialOauthDto } from 'src/users/dto/socialOauth.dto';
import { User } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    async jwtLogIn(dto: LoginDto, res: Response) {
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
            email: email, sub: user.id, user_type: user.user_type, role: user.role
        }
        res.cookie('access_token',  this.jwtService.sign(payload), {httpOnly: true});
        return 
    }

    async socialSignUp(user: SocialOauthDto): Promise<SocialOauthDto> {
        const existEmail = await this.usersRepository.existsByEmail(user.email);

        if(existEmail) {
            throw new UnauthorizedException("이미 존재하는 이메일 입니다.")
        }
        
        await this.cacheManager.set('checkCode_' + user.email, true, 1000 * 60 * 60 * 24);
        return user
    }

    async socialLogIn(email: string, res: Response) {
        
        const user: User = await this.usersRepository.findUserByEmail(email);
        
        if(!user) {
            throw new UnauthorizedException('회원가입 되지 않은 계정입니다.');
        }

        if(user.user_type === 'origin') {
            throw new UnauthorizedException('SNS 회원 가입 계정이 아닙니다.');
        }

        const payload = {
            email: email, sub: user.id, user_type: user.user_type, role: user.role
        }
        res.cookie('access_token', this.jwtService.sign(payload), {httpOnly: true});
        return;
    }
}
