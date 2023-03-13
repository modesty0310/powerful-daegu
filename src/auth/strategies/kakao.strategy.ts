import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { IOauth } from "src/common/interfaces/oauth.interface";


export class KakaoSignupStrategy extends PassportStrategy(Strategy, "kakao-signup") {
    constructor() {
        super({
           clientID: process.env.KAKAO_ID,
           clientSecret: process.env.KAKAO_SECRET,
           callbackURL: "http://localhost:3000/users/kakao/signup",
           scope: ["account_email"]
        })
    }

    async validate(accessToken, refreshToken, profile,) {
        console.log(111111111111111111111);
        
        console.log(profile, accessToken, refreshToken)
        
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
           callbackURL: "http://localhost:3000/users/kakao/login",
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