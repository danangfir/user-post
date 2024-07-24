import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/user.schema'; 

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Post[]> {
    try {
      console.log('Finding all posts');
      const posts = await this.postModel.find().populate('user').exec();
      console.log('Posts found:', posts);
      return posts;
    } catch (error) {
      console.error('Error finding posts:', error);
      throw error;
    }
  }  

  async findOne(id: string): Promise<Post> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Post ID');
    }
    try {
      console.log(`Finding post with ID: ${id}`);
      const post = await this.postModel.findById(id).populate('user').exec();
      if (!post) {
        throw new NotFoundException(`Post with ID "${id}" not found`);
      }
      return post;
    } catch (error) {
      console.error('Error finding post:', error);
      throw error;
    }
  }

  async create(postDto: { title: string; content: string; userId: string }): Promise<Post> {
    const { title, content, userId } = postDto;
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid User ID');
    }
    const user: UserDocument = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const post = new this.postModel({ title, content, user: user._id });
    try {
      console.log('Creating new post');
      return await post.save();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async update(id: string, postDto: { title: string; content: string; userId: string }): Promise<Post> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Post ID');
    }
    const { title, content, userId } = postDto;
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid User ID');
    }
    const user: UserDocument = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    try {
      console.log(`Updating post with ID: ${id}`);
      const updatedPost = await this.postModel.findByIdAndUpdate(id, { title, content, user: user._id }, { new: true }).exec();
      if (!updatedPost) {
        throw new NotFoundException(`Post with ID "${id}" not found`);
      }
      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Post ID');
    }
    try {
      console.log(`Removing post with ID: ${id}`);
      const result = await this.postModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Post with ID "${id}" not found`);
      }
    } catch (error) {
      console.error('Error removing post:', error);
      throw error;
    }
  }
}
