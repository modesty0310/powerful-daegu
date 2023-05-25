import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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

    async getSerchStore(dto: GetSearchDto) {
        const storeRegion = dto.region;
        let regionNames = ['대구 중구', '대구 달성군', '대구 북구', '대구 수성구', '대구 달서구', '대구 동구', '대구 남구', '대구 서구'];
        if(storeRegion) {
            regionNames = storeRegion.split(',');
            regionNames.forEach((name, idx) => {
                regionNames[idx] = '대구 ' + name
            })
        }

        const result = await this.storeRepository.createQueryBuilder('store')
        .leftJoinAndSelect('store.store_type', 'store_type')
        .where('store.name like :name', {name: `%${dto.storename ?? ''}%`})
        .andWhere('store.city_name IN (:city_name)', {city_name: regionNames})
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

    async deleteStoreLike(store_like_id: BigInt, user_id: BigInt) {
        const store_like = await this.storeLikeRepository.createQueryBuilder('store_like')
        .leftJoinAndSelect('store_like.user', 'user')
        .where('store_like.id = :store_like_id', {store_like_id})
        .getOne()

        if(!store_like) throw new BadRequestException('좋아요가 존재하지 않습니다.')

        if(store_like && store_like.user.id !== user_id) throw new UnauthorizedException('권한이 없습니다.')

        const result = await this.storeLikeRepository.createQueryBuilder()
        .delete()
        .from(StoreLike)
        .where('id = :id', {id: store_like_id})
        .execute()
        console.log(result);
        
    }

    async getAllStoreLike(user_id: BigInt) {
        const result = await this.storeLikeRepository.createQueryBuilder('store_like')
        .leftJoinAndSelect('store_like.store', 'store')
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

    async deleteDirection(direction_id: BigInt, user_id: BigInt) {
        const direction = await this.directionRepository.createQueryBuilder('direction')
        .leftJoinAndSelect('direction.user', 'user')
        .where('direction.id = :direction_id', {direction_id})
        .getOne()

        if(!direction) throw new BadRequestException('좋아요가 존재하지 않습니다.')

        if(direction && direction.user.id !== user_id) throw new UnauthorizedException('권한이 없습니다.')

        const result = await this.directionRepository.createQueryBuilder()
        .delete()
        .from(StoreDirection)
        .where('id = :id', {id: direction_id})
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