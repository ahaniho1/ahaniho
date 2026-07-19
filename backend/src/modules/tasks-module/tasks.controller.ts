import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../../schemas/task.schema';

@Controller('tasks')
export class TasksController {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  @Get()
  async findAll() {
    return this.taskModel.find().populate('assignedTo', 'firstName lastName').populate('assignedBy', 'firstName lastName').sort({ createdAt: -1 });
  }

  @Post()
  async create(@Body() body: any) {
    return this.taskModel.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.taskModel.findByIdAndUpdate(id, body, { new: true });
  }
}