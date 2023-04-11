import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor() {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const payload = req.user;
    
    if(payload.role === 'admin') {
        return true;
    }
    throw new UnauthorizedException('권한이 없습니다.');
  }
}
