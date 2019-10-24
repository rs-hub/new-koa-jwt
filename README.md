# new-koa-jwt

**Example**  
```typescript
import Koa from "koa";
import KoaJwt from "new-koa-jwt";
const app = new Koa();

const secret = process.env.secret || "secret";

app.use(KoaJwt({ secret }));
app.use((ctx) => {
    const { data } = ctx.state.jwt;
    ctx.body = data;
});

app.listen(3000);
```
***Router***  
```typescript
router.get('/users', koaJwt({ secret: 'secret' }), (ctx) => {
    const { data: { username } } = ctx.state.jwt;
    ctx.body = username;
});
```
