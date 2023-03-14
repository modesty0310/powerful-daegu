import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver";
import { IOauth } from "src/common/interfaces/oauth.interface";


export class NaverSignupStrategy extends PassportStrategy(Strategy, "naver-signup") {
    constructor() {
        super({
           clientID: process.env.NAVER_ID,
           clientSecret: process.env.NAVER_SECRET,
           callbackURL: process.env.IP_HOST + process.env.PORT + "/users/naver/signup",
        })
    }

    async validate(accessToken, refreshToken, profile,) {
        const result: IOauth = {
            email: profile._json.email,
            password: profile._json.id
        }
        
        return result;
    }
}

export class NaverLoginStrategy extends PassportStrategy(Strategy, "naver-login") {
    constructor() {
        super({
           clientID: process.env.NAVER_ID,
           clientSecret: process.env.NAVER_SECRET,
           callbackURL: process.env.IP_HOST + process.env.PORT + "/users/naver/login",
        })
    }

    async validate(accessToken, refreshToken, profile,) {
        const result: IOauth = {
            email: profile._json.email,
            password: profile._json.id
        }
        
        return result;
    }
}