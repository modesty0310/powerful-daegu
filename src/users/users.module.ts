import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule, forwardRef(() => AuthModule)],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersRepository]
})
export class UsersModule {}
