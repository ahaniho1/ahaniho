import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  @Get()
  async findAll() {
    return this.categoryModel.find({ isActive: true }).sort({ sortOrder: 1 });
  }
}