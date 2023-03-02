import { Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {

    @Post('login')
    async login() {

    }
    @Post('code-create')
    async createAuthCode() {

    }
    @Post('code-check')
    async checkAuthCode() {
        
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
    async createUser() {

    }

    @Post('password')
    async createPasswordCode() {

    }

    @Patch('password')
    async changePassword() {
        
    }
}
