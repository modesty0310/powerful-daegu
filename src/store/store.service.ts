import { Injectable } from '@nestjs/common';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
    constructor(
        private readonly storeRepository: StoreRepository
    ){}

    async getStoreDetail(id: BigInt) {
        return this.storeRepository.getStoreDetail(id);
    }

    async getAllStore() {
        return await this.storeRepository.getAllStore();
    }
}
