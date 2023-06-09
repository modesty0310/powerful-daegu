import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { GetSearchDto } from './dto/getSearch.dto';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
    constructor(
        private readonly storeRepository: StoreRepository,
        private readonly jwtService: JwtService,
        private readonly userRepository: UsersRepository,
    ){}

    async getStoreDetail(id: BigInt) {
        return this.storeRepository.getStoreDetail(id);
    }

    async getSearchStore(dto: GetSearchDto, req: Request) {
        let payload: any;
        if(req.cookies['access_token']) payload = await this.jwtService.verifyAsync(req.cookies['access_token'])
        let user: User | undefined;
        if(payload) {
            user = await this.userRepository.getUser(payload.sub);
        }
        
        return await this.storeRepository.getSerchStore(dto, user);
    }

    async getAllStore(req: Request) {
        let payload: any;
        if(req.cookies['access_token']) payload = await this.jwtService.verifyAsync(req.cookies['access_token'])
        let user: User | undefined;
        if(payload) {
            user = await this.userRepository.getUser(payload.sub);
        }

        return await this.storeRepository.getAllStore(user);
    }

    async setStoreLike(store_id: BigInt, user_id: BigInt) {
        await this.storeRepository.setStoreLike(store_id, user_id);
    }

    async deleteStoreLike(store_like_id: BigInt[], user_id: BigInt) {
        await this.storeRepository.deleteStoreLike(store_like_id, user_id);
    }

    async getAllStoreLike(user_id: BigInt) {
        return this.storeRepository.getAllStoreLike(user_id)
    }

    async setDirection(url: string, user_id: BigInt) {
        await this.storeRepository.setDirection(url, user_id);
    }

    async deleteDirection(direction_id: BigInt, user_id: BigInt) {
        await this.storeRepository.deleteDirection(direction_id, user_id);
    }

    async getAllDirection(user_id: BigInt) {
        return this.storeRepository.getAllDirection(user_id)
    }
}
