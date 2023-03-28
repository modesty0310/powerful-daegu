
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CodeCheckGuard extends AuthGuard('code-check') {}