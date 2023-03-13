import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { NaverLoginGuard } from './guards/naver-login.guard';
import { NaverSignupGuard } from './guards/naver-signup.guard';
import { GoogleLoginStrategy, GoogleSignupStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { NaverLoginStrategy, NaverSignupStrategy } from './strategies/naver.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      secretOrPrivateKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => UsersModule)
  ],
  providers: [AuthService, JwtStrategy, GoogleSignupStrategy, GoogleLoginStrategy, NaverSignupStrategy, NaverLoginStrategy],
  exports: [AuthService]
})
export class AuthModule {}
