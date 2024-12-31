import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return a token when login is successful', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'hilal@gmail.com',
        password: 'hilal123',
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
      });
  });

  it('should return Bad Request for login with incorrect credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'hilal@gmail.com', password: 'wrongpassword' })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty(
          'message',
          'Email or password is incorrect!',
        );
      });
  });

  it('should return Not Found for login with unregistered user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: 'testing123' })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty(
          'message',
          'User not registered, please register first!',
        );
      });
  });

  it('should return Forbidden Exception when fetching profile without token', () => {
    return request(app.getHttpServer())
      .get('/user/profile')
      .then((response) => {
        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty('message', 'Forbidden resource');
      });
  });

  it('should return user profile when fetching profile with valid token', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'hilal@gmail.com', password: 'hilal123' });
    const token = loginRes.body.token;

    return request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('email', 'hilal@gmail.com');
        expect(response.body).toHaveProperty('username', 'hilal222');
        expect(response.body).toHaveProperty('followers', 0);
        expect(response.body).toHaveProperty('following', 0);
      });
  });
});
