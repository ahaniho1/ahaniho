import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'media' })
export class Media {
  @Prop({ required: true, trim: true })
  filename: string;

  @Prop({ required: true, trim: true })
  originalName: string;

  @Prop({ trim: true })
  mimeType: string;

  @Prop()
  sizeBytes: number;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ trim: true })
  thumbnailUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  uploadedBy: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const MediaSchema = SchemaFactory.createForClass(Media);