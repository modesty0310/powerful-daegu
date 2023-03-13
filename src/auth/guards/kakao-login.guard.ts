import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoLoginGuard extends AuthGuard('kakao-login') {}