import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { GoogleLoginStrategy, GoogleSignupStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KakaoLoginStrategy, KakaoSignupStrategy } from './strategies/kakao.strategy';
import { NaverLoginStrategy, NaverSignupStrategy } from './strategies/naver.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => UsersModule)
  ],
  providers: [AuthService, JwtStrategy, GoogleSignupStrategy, GoogleLoginStrategy, NaverSignupStrategy, NaverLoginStrategy, KakaoSignupStrategy, KakaoLoginStrategy],
  exports: [AuthService]
})
export class AuthModule {}
