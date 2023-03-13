import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoSignupGuard extends AuthGuard('kakao-signup') {}