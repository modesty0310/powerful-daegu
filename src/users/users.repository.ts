import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
        const {email, password, nickname, term} = dto;
        console.log(email, password, nickname, term);
        
        const user = {email, password, nickname, term, user_type: "origin"};
        return await this.userRepository.save(user)
    }

    async findUserByEmail(email: string): Promise<User> | null {
        console.log('user.repository',email);
        
        const user = await this.userRepository.findOne({where: {email}});
        console.log(user);
        
        return user
    }
}