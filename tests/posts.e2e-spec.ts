import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a post', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(201);

    const userId = userResponse.body._id;

    await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'Test Post', content: 'This is a test post', userId })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe('Test Post');
        expect(response.body.content).toBe('This is a test post');
        expect(response.body.user).toBe(userId);
      });
  });

  it('should retrieve all posts', async () => {
    await request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
