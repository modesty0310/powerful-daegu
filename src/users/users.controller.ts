import { Body, CACHE_MANAGER, Controller, Get, Inject, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { GoogleLoginGuard } from 'src/auth/guards/google-login.guard';
import { GoogleSignupGuard } from 'src/auth/guards/google-signup.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { KakaoLoginGuard } from 'src/auth/guards/kakao-login.guard';
import { KakaoSignupGuard } from 'src/auth/guards/kakao-signup.guard';
import { NaverLoginGuard } from 'src/auth/guards/naver-login.guard';
import { NaverSignupGuard } from 'src/auth/guards/naver-signup.guard';
import { IOauth } from 'src/common/interfaces/oauth.interface';
import { CurrentUser } from './decorators/user.decorator';
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
        private readonly authService: AuthService
    ){}

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({passthrough: true}) response: Response
    ) {
        const {access_token} = await this.authService.jwtLogIn(dto);
        response.cookie('access_token', access_token, {httpOnly: true});
        return "로그인"
    }
    @Post('code-create')
    async createAuthCode(@Body() dto: CreateAuthCodeDto): Promise<string> {        
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

    @UseGuards(GoogleSignupGuard)
    @Get('google/signup')
    async googleSignUp(
        @CurrentUser() user: IOauth
    ) {
        return await this.usersService.socialSignUp(user);
    }
    @UseGuards(GoogleLoginGuard)
    @Get('google/login')
    async googleLogin(
        @CurrentUser() user: IOauth,
        @Res() response: Response
    ) {                
        const {access_token} = await this.authService.socialLogIn(user.email);
        response.cookie('access_token', access_token, {httpOnly: true});
        return "로그인"
    }
    @UseGuards(NaverSignupGuard)
    @Get('naver/signup')
    async naverSignUp(
        @CurrentUser() user: IOauth
    ) {
        return await this.usersService.socialSignUp(user);
    }
    @UseGuards(NaverLoginGuard)
    @Get('naver/login')
    async naverLogin(
        @CurrentUser() user: IOauth,
        @Res() response: Response
    ) {
        const {access_token} = await this.authService.socialLogIn(user.email);
        response.cookie('access_token', access_token, {httpOnly: true});
        return "로그인"
    }
    @UseGuards(KakaoSignupGuard)
    @Get('kakao/signup')
    async kakaoSignUp(
        @CurrentUser() user: IOauth
    ) {
        return await this.usersService.socialSignUp(user);
    }
    @UseGuards(KakaoLoginGuard)
    @Get('kakao/login')
    async kakaoLogin(
        @CurrentUser() user: IOauth,
        @Res() response: Response
    ) {
        const {access_token} = await this.authService.socialLogIn(user.email);
        response.cookie('access_token', access_token, {httpOnly: true});
        return "로그인"
    }

    @Post()
    async createUser(@Body() dto: CreateUserDto):Promise<User> {
        return await this.usersService.createUser(dto);
    }

    @Post('password')
    async createPasswordCode() {

    }

    @Patch('password')
    async changePassword() {
        
    }
}
