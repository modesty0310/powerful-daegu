import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('login')
    async login() {

    }
    @Post('code-create')
    async createAuthCode() {
        const result = await this.usersService.createAuthCode({email: 'rlatprua4@gmail.com'});
        console.log(result);
        
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
    async createUser(@Body() dto: CreateUserDto) {

    }

    @Post('password')
    async createPasswordCode() {

    }

    @Patch('password')
    async changePassword() {
        
    }
}
