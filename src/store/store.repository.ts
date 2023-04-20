import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { GetSearchDto } from "./dto/getSearch.dto";
import { Store } from "./store.entity";
import { StoreLike } from "./storeLike.entity";

@Injectable()
export class StoreRepository {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,

        @InjectRepository(StoreLike)
        private readonly storeLikeRepository: Repository<StoreLike>
    ){}

    async getStoreDetail(id: BigInt) {
        const result = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.menu', 'menu')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store.id = :id', {id})
        .getOne();

        return result;
    }

    async getSerchStore(query: object, dto: GetSearchDto) {
        const result = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store.name like :name', {name: `%${dto.storename ?? ''}%`})
        .andWhere('store.city_name like :city_name', {city_name: `%${dto.region ?? ''}%`})
        .getMany()

        return result;        
    }

    async getAllStore() {
        const result = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .getMany();

        return result;
    }

    async setStoreLike(store_id: BigInt, user_id: BigInt) {
        const result = await this.storeLikeRepository.createQueryBuilder()
        .insert()
        .into(StoreLike)
        .values({
            user: {id: user_id},
            store: {id: store_id},
        })
        .execute()
        console.log(result);
        
    }
}