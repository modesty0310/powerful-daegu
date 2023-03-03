import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [EmailModule,TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController]
})
export class UsersModule {}
