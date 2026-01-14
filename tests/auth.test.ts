import request from 'supertest';
import app from '../src/index.js';
import { User } from '../src/models/user.model.js';

describe('Auth Endpoints', () => {
    const user = {
        email: 'test@example.com',
        password: 'password123',
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(user);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(user.email);
    });

    it('should fail with invalid email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ email: 'invalid', password: 'password123' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should login an existing user', async () => {
        await User.create(user);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send(user);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should fail login with wrong password', async () => {
        await User.create(user);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: user.email, password: 'wrongpassword' });

        expect(res.status).toBe(401);
    });
});
