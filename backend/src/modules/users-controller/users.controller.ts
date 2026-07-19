import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Get()
  async findAll() {
    return this.userModel.find().populate('roleId').select('-passwordHash -refreshTokenHash');
  }

  @Post()
  async create(@Body() body: any) {
    const passwordHash = await bcrypt.hash(body.password || 'password123', 10);
    const user = await this.userModel.create({
      ...body,
      passwordHash,
    });
    return this.userModel.findById(user._id).populate('roleId').select('-passwordHash -refreshTokenHash');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    if (body.password) {
      body.passwordHash = await bcrypt.hash(body.password, 10);
      delete body.password;
    }
    await this.userModel.findByIdAndUpdate(id, body);
    return this.userModel.findById(id).populate('roleId').select('-passwordHash -refreshTokenHash');
  }
}