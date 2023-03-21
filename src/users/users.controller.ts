import { Body, CACHE_MANAGER, Controller, Get, Inject, ParseFilePipeBuilder, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { UploadService } from 'src/upload/upload.service';
import { CurrentUser } from './decorators/user.decorator';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ChangeProfileDto } from './dto/changeProfile.dto';
import { CheckAuthCodeDto } from './dto/checkAuthCode.dto';
import { CreateAuthCodeDto } from './dto/createAuthCode.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ReturnAuthCodeDto } from './dto/returnAuthCode.dto';
import { SocialOauthDto } from './dto/socialOauth.dto';
import { CodeCheckFail, CodeCheckSuccess } from './swagger/code-check';
import { LoginFail, LoginSuccess } from './swagger/login';
import { SocialFail } from './swagger/social';
import { User } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly authService: AuthService,
        private readonly uploadService: UploadService,
    ){}

    @ApiOperation({ summary: '홈페이지 로그인 API'})
    @ApiResponse({status: 201, description:"로그인", type: LoginSuccess})
    @ApiResponse({status: 401, description:"로그인 실패", type: LoginFail})
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({passthrough: true}) response: Response
    ) {
        const {access_token} = await this.authService.jwtLogIn(dto);
        response.cookie('access_token', access_token, {httpOnly: true});
        return {message: "로그인"}
    }

    @ApiOperation({ summary: '이메일 확인 코드 발급'})
    @ApiResponse({status: 201, description:"성공", type: ReturnAuthCodeDto})
    @ApiResponse({status: 401, description:"실패", type: ReturnAuthCodeDto})
    @Post('code-create')
    async createAuthCode(@Body() dto: CreateAuthCodeDto): Promise<ReturnAuthCodeDto> {        
        const {text, success, code} = await this.usersService.createAuthCode(dto);
        if(success) {
            await this.cacheManager.set(dto.email, code, 1000 * 60 * 10);
        }
        return {text, success, code};
    }

    @ApiOperation({ summary: '이메일 확인 코드 체크'})
    @ApiResponse({status: 201, description:"성공", type: CodeCheckSuccess})
    @ApiResponse({status: 401, description:"실패", type: CodeCheckFail})
    @Post('code-check')
    async checkAuthCode(@Body() dto: CheckAuthCodeDto): Promise<CodeCheckSuccess> {
        const {email, code} = dto;
        const getCode = await this.cacheManager.get(email);
        
        return {result: getCode === code}
    }

    @ApiOperation({ summary: '구글 회원가입'})
    @ApiResponse({status: 201, description:"성공", type: SocialOauthDto})
    @ApiResponse({status: 401, description:"구글 회원가입 실패", type: SocialFail})
    @UseGuards(GoogleSignupGuard)
    @Get('google/signup')
    async googleSignUp(
        @CurrentUser() user: SocialOauthDto
    ) {
        return await this.usersService.socialSignUp(user);
    }
    @ApiOperation({ summary: '구글 로그인'})
    @ApiResponse({status: 201, description:"성공", type: LoginSuccess})
    @ApiResponse({status: 401, description:"구글 로그인 실패", type: LoginFail})
    @UseGuards(GoogleLoginGuard)
    @Get('google/login')
    async googleLogin(
        @CurrentUser() user: SocialOauthDto,
        @Res() response: Response
    ) {                
        const {access_token} = await this.authService.socialLogIn(user.email);
        response.cookie('access_token', access_token, {httpOnly: true});
        return {message: "로그인"}
    }
    @UseGuards(NaverSignupGuard)
    @Get('naver/signup')
    async naverSignUp(
        @CurrentUser() user: SocialOauthDto
    ) {
        return await this.usersService.socialSignUp(user);
    }
    @UseGuards(NaverLoginGuard)
    @Get('naver/login')
    async naverLogin(
        @CurrentUser() user: SocialOauthDto,
        @Res() response: Response
    ) {
        const {access_token} = await this.authService.socialLogIn(user.email);
        response.cookie('access_token', access_token, {httpOnly: true});
        return {message: "로그인"}
    }
    @UseGuards(KakaoSignupGuard)
    @Get('kakao/signup')
    async kakaoSignUp(
        @CurrentUser() user: SocialOauthDto
    ) {
        return await this.usersService.socialSignUp(user);
    }
    @UseGuards(KakaoLoginGuard)
    @Get('kakao/login')
    async kakaoLogin(
        @CurrentUser() user: SocialOauthDto,
        @Res() response: Response
    ) {
        const {access_token} = await this.authService.socialLogIn(user.email);
        response.cookie('access_token', access_token, {httpOnly: true});
        return {message: "로그인"}
    }

    @ApiOperation({ summary: '회원가입'})
    @ApiResponse({status: 201, description:"성공", type: User})
    @ApiResponse({status: 401, description:"실패", type: LoginFail})  
    @Post()
    async createUser(@Body() dto: CreateUserDto):Promise<User> {
        return await this.usersService.createUser(dto);
    }

    @ApiOperation({ summary: '비밀번호 변경'})
    @ApiResponse({status: 201, description:"성공", type: LoginSuccess})
    @ApiResponse({status: 401, description:"실패", type: LoginFail})
    @Patch('password')
    async changePassword(
        @Body() dto: ChangePasswordDto
    ) {
        await this.usersService.changePassword(dto);
        
        return {message: "비밀번호 변경 완료 되었습니다."}
    }
    
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Post('profile')
    async changeProfile(
        @Body() dto: ChangeProfileDto,
        @CurrentUser() user,
        @UploadedFile(
            new ParseFilePipeBuilder()
            .addFileTypeValidator({fileType:  /(png|jpg|jpeg)$/})
            .build({fileIsRequired: false}),
        ) file?: Express.Multer.File,
    ) {
        await this.usersService.changeProfile(dto, user, file);
        return {message: "프로필 변경 완료 되었습니다."}
    }
}

