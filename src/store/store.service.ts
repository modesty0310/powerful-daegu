import { Injectable } from '@nestjs/common';
import { last } from 'rxjs';
import { Like } from 'typeorm';
import { GetSearchDto } from './dto/getSearch.dto';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
    constructor(
        private readonly storeRepository: StoreRepository
    ){}

    async getStoreDetail(id: BigInt) {
        return this.storeRepository.getStoreDetail(id);
    }

    async getSearchStore(dto: GetSearchDto) {
        return await this.storeRepository.getSerchStore(dto);
    }

    async getAllStore() {
        return await this.storeRepository.getAllStore();
    }

    async setStoreLike(store_id: BigInt, user_id: BigInt) {
        await this.storeRepository.setStoreLike(store_id, user_id);
    }

    async deleteStoreLike(store_like_id: BigInt, user_id: BigInt) {
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
