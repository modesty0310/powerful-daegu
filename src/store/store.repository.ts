import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./store.entity";

@Injectable()
export class StoreRepository {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>
    ){}

    async getStoreDetail(id: BigInt) {
        const result = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.menu', 'menu')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store.id = :id', {id})
        .getOne();

        return result;
    }
}