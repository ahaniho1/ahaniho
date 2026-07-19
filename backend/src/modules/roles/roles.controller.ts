import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../../schemas/role.schema';

@Controller('roles')
export class RolesController {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  @Get()
  async findAll() {
    return this.roleModel.find();
  }
}