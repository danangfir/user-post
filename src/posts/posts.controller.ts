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
