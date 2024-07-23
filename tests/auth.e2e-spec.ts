import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a test user', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'test', password: 'test' })
      .expect(201);
  });

  it('should return an access token', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test', password: 'test' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
