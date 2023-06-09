import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Like, Repository } from "typeorm";
import { GetSearchDto } from "./dto/getSearch.dto";
import { Store } from "./store.entity";
import { StoreDirection } from "./storeDirection.entity";
import { StoreLike } from "./storeLike.entity";

@Injectable()
export class StoreRepository {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,

        @InjectRepository(StoreLike)
        private readonly storeLikeRepository: Repository<StoreLike>,

        @InjectRepository(StoreDirection)
        private readonly directionRepository: Repository<StoreDirection>
    ){}

    async getStoreDetail(id: BigInt) {
        const result = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.menu', 'menu')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store.id = :id', {id})
        .getOne();

        return result;
    }

    async getSerchStore(dto: GetSearchDto, user: User | undefined) {
        const storeRegion = dto.region;
        let regionNames = ['대구 중구', '대구 달성군', '대구 북구', '대구 수성구', '대구 달서구', '대구 동구', '대구 남구', '대구 서구'];
        if(storeRegion) {
            regionNames = storeRegion.split(',');
            regionNames.forEach((name, idx) => {
                regionNames[idx] = '대구 ' + name
            })
        }

        const storeCategory = dto.place;
        let storeCategorys = ['치킨/찜닭', '중식', '한식', '찜/탕', '피자', '족발/보쌈', '패스트푸드', '돈까스/일식', '도시락/죽', '카페/디저트', '아시안/양식', '반찬/신선', '편의점'];
        if(storeCategory) {
            storeCategorys = storeCategory.split(',');
        }

        let like: Store[] | [];

        if(user) {
            like = await this.storeRepository.createQueryBuilder('store')
            .leftJoinAndSelect('store.store_type', 'store_type')
            .leftJoinAndSelect('store.store_like', 'store_like')
            .leftJoinAndSelect('store_like.user', 'user')
            .where('store.name like :name', {name: `%${dto.storename ?? ''}%`})
            .andWhere('user.id = :id', {id: user.id})
            .andWhere('store.city_name IN (:city_name)', {city_name: regionNames})
            .andWhere('store_type.category IN (:category)', {category: storeCategorys})
            .select(['store', 'store_type'])
            .getMany();      
        }else {
            like = [];
        }
        


        const stores = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store.name like :name', {name: `%${dto.storename ?? ''}%`})
        .andWhere('store.city_name IN (:city_name)', {city_name: regionNames})
        .andWhere('store_type.category IN (:category)', {category: storeCategorys})
        .getMany()

        return {like, stores};        
    }

    async getAllStore(user: User | undefined) {
        let like: Store[];
        let stores: Store[];
        console.log(user);
        
        if(user) {
            like = await this.storeRepository.createQueryBuilder('store')
            .leftJoinAndSelect('store.store_type', 'store_type')
            .leftJoinAndSelect('store.store_like', 'store_like')
            .leftJoinAndSelect('store_like.user', 'user')
            .where('user.id = :id', {id: user.id})
            .select(['store', 'store_type'])
            .getMany();

            const ids = [];
            for(const el of like) {
                ids.push(el.id);
            }

            if(ids.length) {
                stores = await this.storeRepository.createQueryBuilder('store')
                .leftJoinAndSelect('store.store_type', 'store_type')
                .leftJoinAndSelect('store.store_like', 'store_like')
                .leftJoinAndSelect('store_like.user', 'user')
                .where('store.id NOT IN (:id)', {id: ids})
                .select(['store', 'store_type',])
                .getMany();
            }else {
                stores = await this.storeRepository.createQueryBuilder('store')
                .leftJoinAndSelect('store.store_type', 'store_type')
                .leftJoinAndSelect('store.store_like', 'store_like')
                .leftJoinAndSelect('store_like.user', 'user')
                .select(['store', 'store_type',])
                .getMany();
            }

            
        }else {
            like = [];

            stores = await this.storeRepository.createQueryBuilder('store')
            .leftJoinAndSelect('store.store_type', 'store_type')
            .leftJoinAndSelect('store.store_like', 'store_like')
            .leftJoinAndSelect('store_like.user', 'user')
            .select(['store', 'store_type'])
            .getMany();
        }

        return {like, stores};
    }

    async setStoreLike(store_id: BigInt, user_id: BigInt) {
        const like = await this.storeLikeRepository.createQueryBuilder('store_like')
        .select()
        .where('store_like.store = :store_id', {store_id})
        .andWhere('store_like.user = :user_id', {user_id})
        .getOne();

        if(like) throw new BadRequestException('이미 등록된 가게입니다.');

        const result = await this.storeLikeRepository.createQueryBuilder()
        .insert()
        .into(StoreLike)
        .values({
            user: {id: user_id},
            store: {id: store_id},
        })
        .execute()        
    }

    async deleteStoreLike(store_id: BigInt[], user_id: BigInt) {
        const store_like = await this.storeLikeRepository.createQueryBuilder('store_like')
        .leftJoinAndSelect('store_like.user', 'user')
        .leftJoinAndSelect('store_like.store', 'store')
        .where('store.id IN (:store_id)', {store_id})
        .andWhere('user.id = :user_id', {user_id})
        .getMany();

        if(store_like.length === 0) throw new BadRequestException('좋아요가 존재하지 않습니다.')
        
        const ids:BigInt[] = [];

        for(const like of store_like) {
            ids.push(like.id);
        }

        const result = await this.storeLikeRepository.createQueryBuilder()
        .delete()
        .from(StoreLike)
        .where('id IN (:id)', {id: ids})
        .execute()
        console.log(result);
        
    }

    async getAllStoreLike(user_id: BigInt) {
        const result = await this.storeLikeRepository.createQueryBuilder('store_like')
        .leftJoinAndSelect('store_like.store', 'store')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store_like.user = :user_id', {user_id})
        .getMany()

        console.log(result);
        return result
        
    }

    async setDirection(url: string, user_id: BigInt) {
        const like = await this.directionRepository.createQueryBuilder('direction')
        .select()
        .where('direction.url = :url', {url})
        .andWhere('direction.user = :user_id', {user_id})
        .getOne();

        if(like) throw new BadRequestException('이미 등록된 경로입니다.');

        const result = await this.directionRepository.createQueryBuilder()
        .insert()
        .into(StoreDirection)
        .values({
            user: {id: user_id},
            url
        })
        .execute()        
    }

    async deleteDirection(direction_id: BigInt[], user_id: BigInt) {
        const directions = await this.directionRepository.createQueryBuilder('direction')
        .leftJoinAndSelect('direction.user', 'user')
        .where('direction.id IN (:direction_id)', {direction_id})
        .andWhere('user.id = :user_id', {user_id})
        .getMany()

        if(directions.length === 0) throw new BadRequestException('좋아요가 존재하지 않습니다.')

        const ids:BigInt[] = [];

        for(const direction of directions) {
            ids.push(direction.id);
        }

        const result = await this.directionRepository.createQueryBuilder()
        .delete()
        .from(StoreDirection)
        .where('id IN (:id)', {id: direction_id})
        .execute()
        console.log(result);
        
    }

    async getAllDirection(user_id: BigInt) {
        const result = await this.directionRepository.createQueryBuilder('direction')
        .select()
        .where('direction.user = :user_id', {user_id})
        .getMany()

        console.log(result);
        return result
        
    }
}