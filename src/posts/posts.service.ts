import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll(): Promise<Post[]> {
    try {
      return await this.postModel.find().populate('user').exec();
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

  async create(post: Post): Promise<Post> {
    if (!isValidObjectId(post.user)) {
      throw new BadRequestException('Invalid User ID');
    }
    try {
      const createdPost = new this.postModel(post);
      return await createdPost.save();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async update(id: string, post: Post): Promise<Post> {
    if (!isValidObjectId(post.user)) {
      throw new BadRequestException('Invalid User ID');
    }
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Post ID');
    }
    try {
      const updatedPost = await this.postModel.findByIdAndUpdate(id, post, { new: true }).exec();
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