import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class NaverSignupGuard extends AuthGuard('naver-signup') {}