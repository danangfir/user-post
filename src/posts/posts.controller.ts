import { Controller, Get, Post as PostMethod, Delete, Put, Param, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as BlogPost } from './post.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): Promise<BlogPost[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogPost> {
    return this.postsService.findOne(id);
  }

  @PostMethod()
  create(@Body() post: BlogPost): Promise<BlogPost> {
    return this.postsService.create(post);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() post: BlogPost): Promise<BlogPost> {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.postsService.remove(id);
  }
}