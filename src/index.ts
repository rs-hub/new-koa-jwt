import { Secret } from "jsonwebtoken";
import authorizationHeader from "./authorizationHeader";
import jwt from "./jwt";

class KoaJwt {
    private static instance: KoaJwt;
    private readonly jwtSecret: Secret;

    constructor(secret: Secret) {
        this.jwtSecret = secret;
    }

    public verifyToken(token, ctx): Promise<string> {
        return jwt.verify(token, this.jwtSecret).catch((e) => {
            ctx.throw(401, e.message);
        });
    }

    public static getInstance(secret): KoaJwt {
        if (!KoaJwt.instance) {
            KoaJwt.instance = new KoaJwt(secret);
        }
        return KoaJwt.instance;
    }
}

export default ({ secret }: { secret: Secret }) => {
    const koaJwt = KoaJwt.getInstance(secret);

    return async (ctx, next) => {
        const token = authorizationHeader(ctx);
        ctx.state.jwt = {
            token,
            data: await koaJwt.verifyToken(token, ctx),
        };
        return next();
    };
};
