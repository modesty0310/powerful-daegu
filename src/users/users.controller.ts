import { Body, CACHE_MANAGER, Controller, Get, Inject, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { CheckAuthCodeDto } from './dto/checkAuthCode.dto';
import { CreateAuthCodeDto } from './dto/createAuthCode.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ){}

    @Post('login')
    async login() {

    }
    @Post('code-create')
    async createAuthCode(@Body() dto: CreateAuthCodeDto): Promise<string> {
        console.log(dto);
        
        const {text, success, code} = await this.usersService.createAuthCode(dto);
        if(success) {
            await this.cacheManager.set(dto.email, code, 1000 * 60 * 5);
        }
        return text;
    }
    @Post('code-check')
    async checkAuthCode(@Body() dto: CheckAuthCodeDto): Promise<boolean> {
        const {email, code} = dto;
        const getCode = await this.cacheManager.get(email);
        
        return getCode === code;
    }

    @Get('google')
    async googleLogin() {

    }
    @Get('naver')
    async naverLogin() {
        
    }
    @Get('kakao')
    async kakaoLogin() {
        
    }

    @Post()
    async createUser(@Body() dto: CreateUserDto):Promise<User> {
        return this.usersService.createUser(dto);
    }

    @Post('password')
    async createPasswordCode() {

    }

    @Patch('password')
    async changePassword() {
        
    }
}
