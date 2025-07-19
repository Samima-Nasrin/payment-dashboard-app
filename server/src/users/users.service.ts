import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userModel.find().select('-password');
  }

  async createUser(dto: { username: string; password: string; role?: string }) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      username: dto.username,
      password: hashed,
      role: dto.role || 'viewer',
    });
    const { password, ...rest } = created.toObject();
    return rest;
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }
}
