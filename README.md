Kenapa saya memekai pattern ini karena ini praktik terbaik yang dianjurkan dalam pengembangan aplikasi menggunakan NestJS. 

Menurut Blog ini:

https://medium.com/deno-the-complete-reference/5-best-practices-for-nestjs-applications-831d0566a534

https://dev.to/drbenzene/best-nestjs-practices-and-advanced-techniques-9m0

https://github.com/weiwensangsang/nestjs-best-practices?tab=readme-ov-file

Berikut adalah penjelasan mengapa pattern ini digunakan dan manfaatnya.

## Modularisasi 

Modularisasi adalah pemisahan aplikasi menjadi modul-modul kecil yang independen namun saling berinteraksi. Setiap modul memiliki tanggung jawab spesifik dan tidak tergantung pada modul lain untuk fungsionalitas dasarnya

Modularisasi memungkinkan kita untuk memisahkan logika aplikasi berdasarkan domain atau fitur, sehingga memudahkan pengembangan, pemeliharaan, dan pengujian

Dengan modularisasi, tim yang berbeda dapat bekerja secara paralel pada modul yang berbeda tanpa saling mengganggu

Selain itu, modul yang telah ada dapat dengan mudah digunakan kembali dalam proyek lain atau di bagian lain dari proyek yang sama.

Contoh kodenya:
```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```
Modul ini memisahkan logika terkait pengguna, termasuk skema MongoDB dan layanan pengguna.

## Dependency Injection (DI)

Dependency Injection adalah teknik di mana objek atau fungsi menerima dependensi yang mereka butuhkan dari luar, bukan menciptakan sendiri

Dependency Injection memudahkan pemeliharaan kode karena kita bisa dengan mudah mengganti atau meningkatkan dependensi tanpa mengubah kode yang menggunakan dependensi tersebut

Teknik ini juga meningkatkan testability karena memungkinkan penggunaan mock atau stub untuk dependensi selama pengujian

Dependency Injection juga mengurangi keterikatan antara komponen, sehingga setiap komponen dapat berkembang secara mandiri.

Contoh Kodenya:
```typescript
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```
Di sini, `AuthService` menerima `UsersService` sebagai dependensi melalui DI, memungkinkan `AuthService` menggunakan metode yang disediakan oleh `UsersService`.

## MVC (Model-View-Controller)

MVC adalah arsitektur yang memisahkan aplikasi menjadi tiga komponen utama: Model, View, dan Controller

Arsitektur MVC memisahkan tanggung jawab antara penyimpanan data (Model), tampilan (View), dan logika aplikasi (Controller)

Hal ini memudahkan pemeliharaan kode karena setiap komponen memiliki tanggung jawab spesifik

MVC juga memudahkan pengembangan dan peningkatan fitur baru tanpa mempengaruhi komponen lain.

Contoh kodenya:
```typescript
// posts.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostModel } from './post.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(): Promise<PostModel[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostModel> {
    if (!id || id.length !== 24) {
      throw new BadRequestException('Invalid Post ID');
    }
    return this.postsService.findOne(id);
  }

  @Post()
  async create(@Body() post: { title: string; content: string; userId: string }): Promise<PostModel> {
    if (!post.userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.postsService.create(post);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() post: { title: string; content: string; userId: string }): Promise<PostModel> {
    if (!post.userId) {
      throw new BadRequestException('User ID is required');
    }
    if (!id || id.length !== 24) {
      throw new BadRequestException('Invalid Post ID');
    }
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    if (!id || id.length !== 24) {
      throw new BadRequestException('Invalid Post ID');
    }
    await this.postsService.remove(id);
  }
}
```
Di sini, `PostsController` mengelola permintaan HTTP dan berinteraksi dengan `PostsService` yang mengelola logika bisnis dan berinteraksi dengan `Post` model.

## E2E Testing (End-to-End Testing)

E2E Testing adalah metode pengujian di mana seluruh alur kerja aplikasi diuji dari awal hingga akhir untuk memastikan bahwa semua bagian sistem berfungsi bersama-sama seperti yang diharapkan

E2E Testing memastikan bahwa semua komponen aplikasi berfungsi bersama dengan baik dan memungkinkan kita mendeteksi masalah yang mungkin tidak terlihat dalam pengujian unit atau pengujian integrasi

Pengujian ini sangat penting untuk memastikan bahwa aplikasi berfungsi dengan baik dari perspektif pengguna akhir.

Contoh kodenya:
```typescript
// tests/posts.e2e-spec.ts
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

```
Pengujian ini memastikan bahwa endpoint `POST /posts` dapat membuat posting baru dan endpoint `GET /posts` dapat mengambil semua posting yang ada. Ini memverifikasi bahwa berbagai komponen aplikasi berfungsi bersama-sama dengan benar.
