import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";


export class GoogleSignupStrategy extends PassportStrategy(Strategy, "google-signup") {
    constructor() {
        super({
           clientID: process.env.GOOGLE_ID,
           clientSecret: process.env.GOOGLE_SECRET,
           callbackURL: "http://localhost:3000/users/google/signup",
           scope: ["profile", 'email'],
        })
    }

    async validate(accessToken, refreshToken, profile,) {
        console.log(accessToken, refreshToken, profile);
        
        return profile._json;
    }
}

export class GoogleLoginStrategy extends PassportStrategy(Strategy, "google-login") {
    constructor() {
        super({
           clientID: process.env.GOOGLE_ID,
           clientSecret: process.env.GOOGLE_SECRET,
           callbackURL: "http://localhost:3000/users/google/login",
           scope: ["profile", 'email'],
        })
    }

    async validate(accessToken, refreshToken, profile,) {
        console.log(accessToken, refreshToken, profile);
        
        return profile._json;
    }
}