import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from '../../schemas/setting.schema';

@Controller('settings')
export class SettingsController {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  @Get()
  async findAll() {
    return this.settingModel.find();
  }

  @Put(':key')
  async update(@Param('key') key: string, @Body() body: { value: any }) {
    const setting = await this.settingModel.findOneAndUpdate(
      { key },
      { value: body.value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return setting;
  }
}