import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { GetSearchDto } from "./dto/getSearch.dto";
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

    async getSerchStore(query: object, dto: GetSearchDto) {
        const result = await this.storeRepository.find({
            where: {
                ...query
            }
        })

        const result2 = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store.name like :name', {name: `%${dto.storename ?? ''}%`})
        .andWhere('store.city_name like :city_name', {city_name: `%${dto.region ?? ''}%`})
        .getMany()

        console.log(result2);
        

        // console.log(result);
        
    }

    async getAllStore() {
        const result = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .getMany();

        return result;
    }
}