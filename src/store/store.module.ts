import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Menu } from './menu.entity';
import { StoreController } from './store.controller';
import { Store } from './store.entity';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';
import { StoreDirection } from './storeDirection.entity';
import { StoreLike } from './storeLike.entity';
import { StoreType } from './storeType.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Menu, StoreType, StoreLike, StoreDirection]), 
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1y' },
    }),
    UsersModule
  ],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
  exports: [StoreRepository]
})
export class StoreModule {}
