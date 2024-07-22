import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID');
    }
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ username }).exec();
      if (!user) {
        throw new NotFoundException(`User with username "${username}" not found`);
      }
      return user;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: string, user: User): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID');
    }
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID');
    }
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }
}