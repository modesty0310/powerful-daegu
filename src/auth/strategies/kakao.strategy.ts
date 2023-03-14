import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { IOauth } from "src/common/interfaces/oauth.interface";


export class KakaoSignupStrategy extends PassportStrategy(Strategy, "kakao-signup") {
    constructor() {
        super({
           clientID: process.env.KAKAO_ID,
           clientSecret: process.env.KAKAO_SECRET,
           callbackURL: process.env.IP_HOST + process.env.PORT + "/users/kakao/signup",
           scope: ["account_email"]
        })
    }

    async validate(accessToken, refreshToken, profile,) {        
        const result: IOauth = {
            email: profile._json.kakao_account.email,
            password: profile._json.id
        }
        
        return result;
    }
}

export class KakaoLoginStrategy extends PassportStrategy(Strategy, "kakao-login") {
    constructor() {
        super({
           clientID: process.env.KAKAO_ID,
           clientSecret: process.env.KAKAO_SECRET,
           callbackURL: process.env.IP_HOST + process.env.PORT + "/users/kakao/login",
           scope: ["account_email"]
        })
    }

    async validate(accessToken, refreshToken, profile,) {
        const result: IOauth = {
            email: profile._json.kakao_account.email,
            password: profile._json.id
        }

        
        return result;
    }
}