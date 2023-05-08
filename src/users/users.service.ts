import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { UploadService } from 'src/upload/upload.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ChangeProfileDto } from './dto/changeProfile.dto';
import { CreateAuthCodeDto } from './dto/createAuthCode.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { CurrentUserDto } from './dto/currentUser.dto';
import { ReturnAuthCodeDto } from './dto/returnAuthCode.dto';
import { SocialOauthDto } from './dto/socialOauth.dto';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly emailService: EmailService,
        private readonly uploadService: UploadService
    ){}

    async createUser(dto: CreateUserDto): Promise<User> {
        const {email, nickname, password, term, user_type} = dto;
        const existEmail = await this.usersRepository.existsByEmail(dto.email); // 이메일이 이미 존재하는지 확인
        
        if (existEmail) { // 이미 존재하는 경우 예외 처리
            throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
        }
        const hasedPassword = await bcrypt.hash(password, 10); // 비밀번호 암호화

        return await this.usersRepository.createUser({email, nickname, password: hasedPassword, term, user_type}); // 새로운 유저 생성
    }

    async createAuthCode(dto: CreateAuthCodeDto): Promise<ReturnAuthCodeDto> {        
        const existEmail = await this.usersRepository.existsByEmail(dto.email);
        
        if(existEmail) {
            return {text: '이미 존재 하는 이메일 입니다.', success: false, code: null};
        }else {
            const code = this.setRandomNum();
            await this.emailService.sendAuthCode(dto.email, code);
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

    async socialSignUp(user: SocialOauthDto, res: Response): Promise<SocialOauthDto> {
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

    async changeProfile(dto: ChangeProfileDto, user: CurrentUserDto, file: Express.Multer.File) {
        const existEmail = await this.usersRepository.existsByEmail(user.email);
        console.log(file);
        
        if(!existEmail) {
            throw new UnauthorizedException("권한이 없습니다.")
        }
        const currentUser = await this.usersRepository.findUserByEmail(user.email);

        if(currentUser.profile && file) {
            const key = currentUser.profile.split(".amazonaws.com/")[1];
            console.log(key);
            
            await this.uploadService.deleteS3Object(key);
        }
        console.log(currentUser);
        let url = null;
        if(file) {
            const result = await this.uploadService.uploadFileToS3('users', file);
            url = result.url;
        }

        await this.usersRepository.changeProfile(url, dto.nickname, user.email);
        return;
    }

    async getUser(user: CurrentUserDto): Promise<User> {
        const result: User = await this.usersRepository.getUser(user.sub);
        return result;
    }
}
