import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

@Injectable()
export class CodeCheckStrategy extends PassportStrategy(Strategy, 'code-check') {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {                
                return req.cookies['codeCheck_token'];
            },
            secretOrKey: process.env.JWT_SECRET,
        })
        
    }

    async validate(payload) {    
        return payload.result;
    }
}