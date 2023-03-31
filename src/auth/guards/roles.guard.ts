import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly userRepository: UsersRepository
    ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const payload = req.user;
    console.log(payload);
    
    const user = await this.userRepository.findUserByEmail(payload.email);
    if(!user) throw new UnauthorizedException('존재 하지 않는 회원입니다.');
    
    if(user.role === 'admin') {
        return true;
    }
    throw new UnauthorizedException('권한이 없습니다.');
  }
}
