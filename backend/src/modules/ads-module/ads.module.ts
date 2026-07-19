import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertisement, AdvertisementSchema } from '../../schemas/advertisement.schema';
import { AdsController } from './ads.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Advertisement.name, schema: AdvertisementSchema }])],
  controllers: [AdsController],
})
export class AdsModule {}