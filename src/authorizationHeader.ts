import * as koa from "koa";

export default (ctx: koa.BaseContext) => {
    if (!ctx.header.authorization) {
        ctx.throw(401, "JWT token not found");
    }

    const authorization = ctx.header.authorization;

    if (authorization.startsWith("Bearer ")) {
        return authorization.substring(7, authorization.length);
    } else {
        ctx.throw(401, "Bad HTTP authentication header format");
    }
};
