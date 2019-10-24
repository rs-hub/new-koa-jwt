import { Secret } from "jsonwebtoken";
import authorizationHeader from "./authorizationHeader";
import jwt from "./jwt";

class KoaJwt {
    private readonly jwtSecret: Secret;

    constructor(secret: Secret) {
        this.jwtSecret = secret;
    }

    public verifyToken(token, ctx): Promise<string> {
        return jwt.verify(token, this.jwtSecret).catch((e) => {
            ctx.throw(401, e.message);
        });
    }
}

export default ({ secret }: { secret: Secret }) => {
    const koaJwt = new KoaJwt(secret);

    return async (ctx, next) => {
        const token = authorizationHeader(ctx);
        ctx.state.jwt = {
            token,
            data: await koaJwt.verifyToken(token, ctx),
        };
        return next();
    };
};
