import Koa from "koa";
import Router from 'new-koa-router';
import request from 'supertest';
import koaJwt from "../src/index";
import jwt from "../src/jwt";

describe('Errors tests', () => {
    it('should throw 401 if token not found', async () => {
        const app = new Koa();

        app.use(koaJwt({ secret: 'secret' }));
        const server = app.listen();
        await request(server)
            .get('/')
            .expect(401)
            .expect('JWT token not found');

        server.close();
    });

    it('should throw Bad HTTP authentication header format', async () => {
        const app = new Koa();

        app.use(koaJwt({ secret: 'secret' }));
        const server = app.listen();
        await request(server)
            .get('/')
            .set('Authorization', 'wrong')
            .expect(401)
            .expect('Bad HTTP authentication header format');

        server.close();
    });

    it('should throw jwt malformed', async () => {
        const app = new Koa();

        app.use(koaJwt({ secret: 'secret' }));
        const server = app.listen();
        await request(server)
            .get('/')
            .set('Authorization', 'Bearer hello')
            .expect(401)
            .expect('jwt malformed');

        server.close();
    });

    it('should throw invalid signature', async () => {
        const app = new Koa();
        const token = await jwt.sign({ id: 1 }, '123456');

        app.use(koaJwt({ secret: 'secret' }));
        const server = app.listen();
        await request(server)
            .get('/')
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .expect('invalid signature');

        server.close();
    });

    it('should throw token is expired', async () => {
        const app = new Koa();
        const token = await jwt.sign({ id: 1, exp: 1571951906 }, 'secret');

        app.use(koaJwt({ secret: 'secret' }));
        const server = app.listen();
        await request(server)
            .get('/')
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .expect('jwt expired');

        server.close();
    });

    it('should throw invalid token', async () => {
        const app = new Koa();
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cC1I6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTcxOTUyNjA5fQ.CYt-SZ9JzI6L7NlLtJkFrNAkCOo6-3_YazAl0I0anYc';

        app.use(koaJwt({ secret: 'secret' }));
        const server = app.listen();
        await request(server)
            .get('/')
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .expect('invalid token');

        server.close();
    });

    it('should throw if is invalid signature token at private router', async () => {
        const app = new Koa();
        const router = new Router();
        const token = await jwt.sign({ username: 'rs-hub' }, '123456');

        router.get('/users', koaJwt({ secret: 'secret' }), (ctx) => {
            const { data: { username } } = ctx.state.jwt;
            ctx.body = username;
        });

        app.use(router.routes());
        const server = app.listen();
        await request(server)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .expect('invalid signature');

        server.close();
    });
});

describe('Success tests', () => {
    it('should work if is valid token and valid data', async () => {
        const app = new Koa();
        const token = await jwt.sign({ username: 'rs-hub' }, 'secret');

        app.use(koaJwt({ secret: 'secret' }));
        app.use((ctx) => {
            const { data: { username } } = ctx.state.jwt;
            ctx.body = username;
        });

        const server = app.listen();
        await request(server)
            .get('/')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('rs-hub');

        server.close();
    });
    it('should work if is valid token at private router', async () => {
        const app = new Koa();
        const router = new Router();
        const token = await jwt.sign({ username: 'rs-hub' }, 'secret');

        router.get('/users', koaJwt({ secret: 'secret' }), (ctx) => {
            const { data: { username } } = ctx.state.jwt;
            ctx.body = username;
        });

        app.use(router.routes());
        const server = app.listen();
        await request(server)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('rs-hub');

        server.close();
    });
});
