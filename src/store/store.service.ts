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
        let query = {}
        if(dto.region) {
            query = {
                city_name: Like(`%${dto.region}%`)
            }
        }else if(dto.storename) {
            query = {
                ...query,
                name: Like(`%${dto.storename}%`) 
            }
        }
        return await this.storeRepository.getSerchStore(query, dto);
    }

    async getAllStore() {
        return await this.storeRepository.getAllStore();
    }

    async setStoreLike(store_id: BigInt, user_id: BigInt) {
        await this.storeRepository.setStoreLike(store_id, user_id);
    }

    async getAllStoreLike(user_id: BigInt) {
        return this.storeRepository.getAllStoreLike(user_id)
    }
}
