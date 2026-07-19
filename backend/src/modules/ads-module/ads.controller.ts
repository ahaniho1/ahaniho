import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advertisement, AdvertisementDocument } from '../../schemas/advertisement.schema';

@Controller('advertisements')
export class AdsController {
  constructor(@InjectModel(Advertisement.name) private adModel: Model<AdvertisementDocument>) {}

  @Get()
  async findAll() {
    return this.adModel.find().sort({ createdAt: -1 });
  }

  @Get('active')
  async findActive() {
    const now = new Date();
    return this.adModel.find({
      status: 'active',
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }],
    }).sort({ priority: -1 });
  }

  @Get('active/:position')
  async findActiveByPosition(@Param('position') position: string) {
    const now = new Date();
    return this.adModel.findOne({
      status: 'active',
      position,
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }],
    }).sort({ priority: -1 });
  }

  @Post()
  async create(@Body() body: any) {
    // If activating this ad, deactivate all other ads in the same position
    if (body.status === 'active' && body.position) {
      await this.adModel.updateMany(
        { position: body.position, status: 'active', _id: { $ne: body._id } },
        { status: 'inactive' }
      );
    }
    return this.adModel.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    // If activating this ad, deactivate all other ads in the same position
    if (body.status === 'active' && body.position) {
      await this.adModel.updateMany(
        { position: body.position, status: 'active', _id: { $ne: id } },
        { status: 'inactive' }
      );
    }
    return this.adModel.findByIdAndUpdate(id, body, { new: true });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.adModel.findByIdAndDelete(id);
    return { message: 'Advertisement deleted' };
  }
}