import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChangePasswordDto } from "./dto/changePassword.dto";
import { CreateUserDto } from "./dto/createUser.dto";
import { User } from "./users.entity";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async existsByEmail(email: string): Promise<boolean> {
        const result = await this.userRepository.exist({where: {email}})
        return result;
    }

    async createUser(dto: CreateUserDto):Promise<User> {
        const {email, password, nickname, term, user_type} = dto;
        console.log(email, password, nickname, term);
        
        const user = {email, password, nickname, term, user_type};
        return await this.userRepository.save(user);
    }

    async findUserByEmail(email: string): Promise<User> | null {
        
        const user = await this.userRepository.findOne({where: {email}});
        
        return user
    }

    async changePassword(password: string, email: string) {
        const result = await this.userRepository
        .createQueryBuilder()
        .update()
        .set({password})
        .where({email})
        .execute();
    }

    async changeProfile(profile: string | null, nickname: string, email: string) {
        const result = await this.userRepository
        .createQueryBuilder()
        .update()
        .set({profile, nickname})
        .where({email})
        .execute();
    }

    async getUser(id: number): Promise<User> {
        const result: User = await this.userRepository
        .createQueryBuilder('user')
        .select([
            'user.id', 
            'user.email',
            'user.nickname',
            'user.profile',
            'user.role'
        ])
        .where("user.id = :id", { id })
        .getOne();
        
        if(!result) {
            throw new NotFoundException('로그인을 해주세요.');
        }
        return result;
    }
}