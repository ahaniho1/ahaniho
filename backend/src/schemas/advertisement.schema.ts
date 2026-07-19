import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AdvertisementDocument = Advertisement & Document;

@Schema({ timestamps: true, collection: 'advertisements' })
export class Advertisement {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, enum: ['banner', 'sponsored_article', 'external_link', 'pdf', 'image', 'video', 'text', 'quick_info'] })
  type: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ default: '' })
  imageUrl: string;

  @Prop({ default: '' })
  pdfUrl: string;

  @Prop({ default: '' })
  videoUrl: string;

  @Prop({ default: '' })
  externalUrl: string;

  @Prop({ default: '' })
  whatsappNumber: string;

  @Prop({ default: 'home_banner', enum: ['home_banner', 'sidebar', 'between_articles', 'inline', 'popup'] })
  position: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ enum: ['active', 'inactive', 'expired', 'draft'], default: 'draft' })
  status: string;

  @Prop({ default: 0 })
  priority: number;

  @Prop({ default: 0 })
  clickCount: number;

  @Prop({ default: 0 })
  impressionCount: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: string;
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);