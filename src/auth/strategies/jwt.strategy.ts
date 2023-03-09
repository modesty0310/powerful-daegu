import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                console.log(req.cookies);
                
                return req.cookies['access_token'];
            },
            secretOrKey: process.env.JWT_SECRET,
        })
        
    }

    async validate(payload) {    
        return payload;
    }
}