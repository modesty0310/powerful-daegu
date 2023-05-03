import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { StoreController } from './store.controller';
import { Store } from './store.entity';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';
import { StoreDirection } from './storeDirection.entity';
import { StoreLike } from './storeLike.entity';
import { StoreType } from './storeType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Menu, StoreType, StoreLike, StoreDirection])],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
  exports: [StoreRepository]
})
export class StoreModule {}
